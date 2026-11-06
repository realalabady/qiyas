/**
 * Call the SSR renderer directly and check what it emits per locale.
 *
 * api/ runs on Vercel, not through Vite, so `npm run dev` never executes it —
 * which is how the renderer spent so long serving `<html lang="ar">` to every
 * crawler without anyone noticing. This drives the real handler with a mock
 * req/res and asserts what a search engine actually reads: the lang
 * attribute, the direction, og:locale, the canonical, and whether the two
 * language trees point at each other.
 *
 * The shell is fetched from the live origin, exactly as in production.
 *
 *   node --experimental-strip-types --import ./scripts/_register-hooks.mjs \
 *     scripts/check-ssr-locales.ts
 */
import fs from "node:fs";
import path from "node:path";

// The renderer reads Firestore with the same VITE_FIREBASE_* vars the site
// uses; on Vercel they come from project settings, here from .env.local.
const envFile = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  for (const raw of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(raw);
    if (m && !process.env[m[1]])
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const { default: handler } = await import("../api/render.ts");
const { fetchPublished } = await import("../api/_shared.ts");

const HOST = process.env.SSR_HOST || "www.al-maarefah.com";
// Point at a local `vite preview` to test a shell that has not shipped yet.
const PROTO = process.env.SSR_PROTO || "https";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Captured {
  status: number;
  headers: Record<string, string>;
  body: string;
}

function mockRes(): { res: any; done: Promise<Captured> } {
  let resolve!: (c: Captured) => void;
  const done = new Promise<Captured>((r) => (resolve = r));
  const captured: Captured = { status: 0, headers: {}, body: "" };
  const res: any = {
    status(code: number) {
      captured.status = code;
      return res;
    },
    setHeader(k: string, v: string) {
      captured.headers[k.toLowerCase()] = v;
      return res;
    },
    send(body: string) {
      captured.body = body;
      resolve(captured);
      return res;
    },
    end() {
      resolve(captured);
      return res;
    },
    redirect(code: number, loc: string) {
      captured.status = code;
      captured.headers.location = loc;
      resolve(captured);
      return res;
    },
  };
  return { res, done };
}

async function render(query: Record<string, string>): Promise<Captured> {
  const { res, done } = mockRes();
  const req: any = {
    headers: { host: HOST, "x-forwarded-proto": PROTO },
    query,
  };
  await handler(req, res);
  return done;
}

const pick = (html: string, re: RegExp): string =>
  (re.exec(html)?.[1] ?? "").trim();

let failures = 0;
function expect(
  label: string,
  actual: string | boolean,
  wanted: string | boolean,
) {
  const ok = actual === wanted;
  if (!ok) failures++;
  const detail = ok
    ? ""
    : `got ${JSON.stringify(actual)}, want ${JSON.stringify(wanted)}`;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${label.padEnd(40)} ${detail}`);
}

async function main() {
  const base = `${PROTO}://${HOST}`;

  const cases: Array<
    [string, Record<string, string>, Record<string, string>]
  > = [
    ["home /", { type: "home" }, { lang: "ar", dir: "rtl", og: "ar_AR", canonical: `${base}/` }],
    ["home /en", { type: "home", lang: "en" }, { lang: "en", dir: "ltr", og: "en_US", canonical: `${base}/en` }],
    ["explore /", { type: "explore" }, { lang: "ar", dir: "rtl", og: "ar_AR", canonical: `${base}/explore` }],
    ["explore /en", { type: "explore", lang: "en" }, { lang: "en", dir: "ltr", og: "en_US", canonical: `${base}/en/explore` }],
    ["about /en", { type: "page", name: "about", lang: "en" }, { lang: "en", dir: "ltr", og: "en_US", canonical: `${base}/en/about` }],
  ];

  for (const [label, query, want] of cases) {
    const { body: html, status } = await render(query);
    console.log(`\n${label}  (HTTP ${status})`);
    expect("html lang", pick(html, /<html[^>]*\blang="([^"]+)"/), want.lang);
    expect("html dir", pick(html, /<html[^>]*\bdir="([^"]+)"/), want.dir);
    expect("og:locale", pick(html, /property="og:locale" content="([^"]+)"/), want.og);
    expect("canonical", pick(html, /rel="canonical" href="([^"]+)"/), want.canonical);
    expect("hreflang ar", html.includes('hreflang="ar"'), true);
    expect("hreflang en", html.includes('hreflang="en"'), true);
    expect("hreflang x-default", html.includes('hreflang="x-default"'), true);
  }

  // Article pages: a translated one must genuinely come out in English, and
  // an untranslated one must not claim to be a translation.
  const articles = await fetchPublished("articles");
  const translated = articles.find((a: any) =>
    String(a.i18n?.en?.content ?? "").trim(),
  );
  const untranslated = articles.find(
    (a: any) => !String(a.i18n?.en?.content ?? "").trim(),
  );

  if (translated) {
    const slug = String(translated.slug);
    const { body: html } = await render({ type: "article", slug, lang: "en" });
    const inMain = /<main>([\s\S]*?)<\/main>/.exec(html)?.[1] ?? "";
    const arabic = (inMain.match(/[؀-ۿ]/g) ?? []).length;
    const latin = (inMain.match(/[A-Za-z]/g) ?? []).length;
    console.log(`\ntranslated article /en  (${latin} latin vs ${arabic} arabic chars)`);
    expect("html lang", pick(html, /<html[^>]*\blang="([^"]+)"/), "en");
    expect(
      "canonical is the /en URL",
      pick(html, /rel="canonical" href="([^"]+)"/).includes("/en/articles/"),
      true,
    );
    expect("declares a translation", html.includes('hreflang="en"'), true);
    expect("body reads as English", latin > arabic, true);
    expect("indexable", /content="noindex/.test(html), false);
  }

  if (untranslated) {
    const slug = String(untranslated.slug);
    const { body: html } = await render({ type: "article", slug, lang: "en" });
    console.log(`\nuntranslated article /en  ${slug.slice(0, 24)}`);
    expect("noindex", /content="noindex/.test(html), true);
    expect(
      "canonical points at Arabic",
      pick(html, /rel="canonical" href="([^"]+)"/).includes("/en/"),
      false,
    );
    expect("claims no translation", html.includes('hreflang="en"'), false);
  } else {
    console.log("\n(every article has English — no untranslated case to check)");
  }

  console.log(
    failures ? `\n${failures} check(s) failed.` : "\nAll locale checks passed.",
  );
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error("\nFailed:", e?.stack || e);
  process.exit(1);
});
