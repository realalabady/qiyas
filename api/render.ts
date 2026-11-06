/**
 * SSR-lite / dynamic rendering — Vercel serverless function.
 *
 * Routed (via vercel.json) for EVERY indexable public route. It serves the
 * normal SPA shell but with REAL, unique <title> + meta tags + visible content
 * injected, so search-engine crawlers see the actual page content in the first
 * HTML response instead of an empty JavaScript shell. Real users still get the
 * full React app (it mounts on #root and replaces the injected content).
 *
 * Previously only /quiz/:slug and /articles/:slug were routed here; the
 * homepage, hub pages and all the static/legal pages fell through to the bare
 * index.html shell and served zero words to crawlers. That is what AdSense
 * rejected the site for ("Low value content").
 *
 * Content is read from Firestore (published docs are world-readable per
 * firestore.rules); static page copy is read from src/lib/translations.ts, the
 * same strings the React app renders.
 */

import { getQuizIntro } from "../src/data/quiz-intros.js";
import { migratedSlug } from "../src/data/slug-migrations.js";
import { IMAGE_CREDITS } from "../src/data/image-credits.js";
import {
  DEFAULT_LOCALE,
  hasEnglishArticle,
  hasEnglishQuiz,
  isLocale,
  localeDir,
  ogLocale,
  pathForLocale,
  type Locale,
} from "../src/lib/locale-routing.js";
import { translations } from "../src/lib/translations.js";
import {
  CANONICAL_HOST,
  escapeHtml,
  fetchPublished,
  isIndexableArticle,
  markdownToHtml,
  paragraphs,
} from "./_shared.js";

/**
 * Arabic remains canonical, but English now has its own URLs under /en, so
 * every string has to be resolved against the locale being rendered rather
 * than hardcoded. Falls back through Arabic so a missing English key shows
 * real text instead of a blank.
 */
const t = (key: string, locale: Locale = DEFAULT_LOCALE): string =>
  translations[locale]?.[key] || translations.ar[key] || translations.en[key] || "";

/**
 * Contact address. The site is al-maarefah.com; the copy previously pointed at
 * @al-maarefah.app, a domain the site does not serve — dead contact routes are
 * a "false content claim" under the AdSense webmaster guidelines.
 */
const CONTACT_EMAIL = "info@al-maarefah.com";

const SITE_NAME = "المعرفة";
const SITE_TAGLINE =
  "منصة عربية مجانية للاختبارات النفسية واختبارات الذكاء والمقالات في علم النفس وتطوير الذات.";

const siteName = (locale: Locale): string =>
  locale === "ar" ? SITE_NAME : "Al-Maarefah";

const siteTagline = (locale: Locale): string =>
  locale === "ar"
    ? SITE_TAGLINE
    : "A free Arabic platform for personality and IQ tests, with articles on psychology and self-development.";

// The built shell (with hashed asset tags) is cached per warm instance.
let shellCache: string | null = null;

/**
 * Does this look like our built SPA shell, rather than something that merely
 * answered with 200?
 *
 * This check exists because of a real incident. The shell is fetched over HTTP
 * from the function back to its own public domain, and Vercel's bot protection
 * answered that internal request with its own challenge page — a Next.js
 * document carrying the Kasada SDK and a "Log in to Vercel" form. That reply
 * is a 200, so `res.ok` was true, the page was cached in `shellCache` for the
 * life of the warm instance, and `render()` dutifully injected our title and
 * `<html lang="ar">` into Vercel's login page and served it to visitors.
 *
 * So a 200 is not evidence of anything. The body has to carry our own
 * fingerprints: the React mount point and a hashed asset from our build, and
 * none of Next.js's.
 */
function looksLikeShell(html: string): boolean {
  return (
    html.includes('id="root"') &&
    html.includes("/assets/") &&
    !html.includes("/_next/")
  );
}

/**
 * Fetch the built SPA shell.
 *
 * The build emits it as `app.html`, not `index.html`, so that no file sits at
 * `/` — Vercel checks the filesystem before rewrites, and an `index.html`
 * would shadow the homepage rewrite. See the plugin in vite.config.ts.
 *
 * Fails closed. If what comes back is not our shell, this throws rather than
 * returning it, which lands in the caller's catch and produces a 503 with
 * `no-store`. That matters: a successful render is sent with `s-maxage=60`, so
 * serving a bad shell even once would put it in the CDN for every visitor.
 * A 503 is retried; a cached login page is not.
 */
async function getShell(origin: string): Promise<string> {
  if (shellCache) return shellCache;

  let last = "";
  // Two attempts: the challenge is not served to every request, so a single
  // bad reply should not take the instance down.
  for (let attempt = 0; attempt < 2; attempt++) {
    const url = `${origin}/app.html${attempt ? `?r=${attempt}` : ""}`;
    const res = await fetch(url, {
      headers: { "x-ssr-shell": "1", "cache-control": "no-cache" },
    });
    if (!res.ok) {
      last = `status ${res.status}`;
      continue;
    }
    const html = await res.text();
    if (looksLikeShell(html)) {
      shellCache = html;
      return shellCache;
    }
    last = html.includes("/_next/")
      ? "got an interstitial (Vercel challenge or login page), not the app shell"
      : "response did not contain the app shell markers";
  }

  throw new Error(`shell fetch failed for ${origin}/app.html: ${last}`);
}

const absoluteImage = (
  origin: string,
  image: unknown,
  type: string,
  slug: string,
): string | undefined => {
  if (typeof image !== "string" || !image) return undefined;
  // Admin-uploaded thumbnails are base64 data: URLs — crawlers can't use those
  // as og:image, so route them through the image endpoint that decodes them.
  if (image.startsWith("data:"))
    return `${origin}/api/og-image?type=${type}&slug=${encodeURIComponent(slug)}`;
  return image.startsWith("http") ? image : `${origin}${image}`;
};

interface Meta {
  /** Language this page is being rendered in. Drives lang/dir/og:locale. */
  locale: Locale;
  /**
   * Unprefixed path of this page, set when the OTHER locale has a real
   * version of it. Emits the reciprocal hreflang pair; omitted when there is
   * no translation, because pointing hreflang at a page that just re-serves
   * Arabic is worse than saying nothing.
   */
  altPath?: string;
  /** Overrides the canonical — used to point an untranslated /en page home. */
  canonicalUrl?: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  contentHtml: string;
  jsonLd?: Record<string, unknown>[];
  /** Serve `noindex,follow` — used for pages too thin to be worth indexing. */
  noindex?: boolean;
  /**
   * Published content injected as `window.__SSR_DATA__` so the client stores
   * start from real data. See the note in src/lib/ssr-data.ts: Google indexes
   * the RENDERED DOM, and React was replacing this page's server-rendered
   * content with the stale seed data before the async Firestore load finished.
   */
  ssrData?: { articles?: unknown[]; quizzes?: unknown[] };
}

/**
 * Reciprocal hreflang for the two language trees, plus x-default on Arabic.
 *
 * Only emitted when the page genuinely exists in both languages — see the
 * note on Meta.altPath. Google drops an hreflang pair that does not point
 * back, so both sides must agree.
 */
function alternatesHtml(meta: Meta): string {
  if (!meta.altPath) return "";
  const origin = new URL(meta.url).origin;
  const link = (hreflang: string, path: string) =>
    `<link rel="alternate" hreflang="${hreflang}" href="${escapeHtml(origin + path)}" />`;
  const ar = pathForLocale(meta.altPath, "ar");
  const en = pathForLocale(meta.altPath, "en");
  return link("ar", ar) + link("en", en) + link("x-default", ar);
}

function render(shell: string, meta: Meta): string {
  const head =
    `<title>${escapeHtml(meta.title)}</title>` +
    `<meta name="description" content="${escapeHtml(meta.description)}" />` +
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />` +
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />` +
    `<meta property="og:url" content="${escapeHtml(meta.url)}" />` +
    `<meta property="og:locale" content="${ogLocale(meta.locale)}" />` +
    (meta.image
      ? `<meta property="og:image" content="${escapeHtml(meta.image)}" />`
      : "") +
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />` +
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />` +
    `<link rel="canonical" href="${escapeHtml(meta.canonicalUrl ?? meta.url)}" />` +
    alternatesHtml(meta) +
    (meta.noindex
      ? `<meta name="robots" content="noindex,follow" />`
      : "") +
    (meta.jsonLd ?? [])
      .map(
        (block) =>
          `<script type="application/ld+json">${JSON.stringify(block).replace(
            /</g,
            "\\u003c",
          )}</script>`,
      )
      .join("");

  // `</script>` inside JSON would close the tag early; escaping `<` is enough
  // and keeps the payload valid JSON.
  const ssrScript = meta.ssrData
    ? `<script>window.__SSR_DATA__=${JSON.stringify(meta.ssrData).replace(
        /</g,
        "\u003c",
      )}</script>`
    : "";

  let html = shell;
  html = html.replace(
    /<html[^>]*>/i,
    `<html lang="${meta.locale}" dir="${localeDir(meta.locale)}" class="dark">`,
  );
  // Drop the shell's existing <title> so ours wins.
  html = html.replace(/<title>[\s\S]*?<\/title>/i, "");
  // Drop the shell's static SEO tags too — crawlers take the FIRST og:* tag,
  // and the static ones (generic icon/title) appear before our injected head.
  html = html.replace(
    /<meta[^>]*(?:property="og:(?:title|description|image|url|locale)"|name="(?:description|twitter:title|twitter:description|twitter:image)")[^>]*>/gi,
    "",
  );
  html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, "");
  html = html.replace(/<link[^>]*hreflang="[^"]*"[^>]*>/gi, "");
  html = html.replace(/<meta[^>]*name="robots"[^>]*>/gi, "");
  // Inject our head tags right before </head>. The data payload goes last so
  // it is defined before the app bundle executes.
  html = html.replace(/<\/head>/i, `${head}${ssrScript}</head>`);
  // Put crawler-visible content inside #root (React replaces it on mount).
  html = html.replace(
    /<div id="root">\s*<\/div>/i,
    `<div id="root">${meta.contentHtml}</div>`,
  );
  return html;
}

/** Site-wide chrome so every rendered page has real navigation for crawlers. */
const siteNav = (origin: string, locale: Locale = DEFAULT_LOCALE): string =>
  `<nav><ul>` +
  (
    [
      ["/", t("nav.home", locale)],
      ["/explore", t("nav.explore", locale)],
      ["/categories", t("nav.categories", locale)],
      ["/articles", t("nav.articles", locale)],
      ["/about", t("nav.about", locale)],
      ["/contact", t("nav.contact", locale)],
      ["/faq", t("faq.title", locale)],
      ["/privacy-policy", t("privacy.title", locale)],
      ["/terms", t("terms.title", locale)],
      ["/editorial-policy", t("editorial.title", locale)],
      ["/image-credits", t("credits.title", locale)],
    ] as Array<[string, string]>
  )
    .map(
      ([path, label]) =>
        `<li><a href="${origin}${pathForLocale(path, locale)}">${escapeHtml(label)}</a></li>`,
    )
    .join("") +
  `</ul></nav>`;

/**
 * These quizzes are entertainment, and psychology-adjacent content needs the
 * disclaimer visible on the page itself — not buried in Terms §4.
 */
const DISCLAIMER_BY: Record<Locale, string> = {
  ar:
    "<p><small>تنبيه: اختبارات ومقالات المعرفة مخصّصة للترفيه والتأمل الذاتي، " +
    "وهي ليست تشخيصًا نفسيًا أو طبيًا ولا تُغني عن استشارة مختص.</small></p>",
  en:
    "<p><small>Note: Al-Maarefah's quizzes and articles are for entertainment " +
    "and self-reflection. They are not a psychological or medical diagnosis " +
    "and are no substitute for a qualified professional.</small></p>",
};

const disclaimer = (locale: Locale): string => DISCLAIMER_BY[locale];

/**
 * The stored doc as it reads in `locale`.
 *
 * localizedArticle/localizedQuiz in src/ do this for the UI, but they pull in
 * the translation runtime, which has no business in a render function. This
 * covers only the fields that reach the crawled HTML.
 */
function inLocale(
  doc: Record<string, unknown>,
  locale: Locale,
): Record<string, unknown> {
  if (locale === DEFAULT_LOCALE) return doc;
  const en = (doc as { i18n?: Record<string, Record<string, unknown>> }).i18n?.en;
  if (!en) return doc;
  const take = (k: string) => {
    const v = en[k];
    return typeof v === "string" && v.trim() ? v : doc[k];
  };
  const results = Array.isArray(doc.results)
    ? (doc.results as Record<string, unknown>[]).map((r) => {
        const lr = (en.results as Record<string, Record<string, unknown>>)?.[
          String(r.id)
        ];
        return lr ? { ...r, title: lr.title ?? r.title, description: lr.description ?? r.description } : r;
      })
    : doc.results;
  return {
    ...doc,
    title: take("title"),
    description: take("description"),
    excerpt: take("excerpt"),
    content: take("content"),
    longDescription: take("longDescription"),
    seoTitle: take("seoTitle"),
    seoDescription: take("seoDescription"),
    results,
  };
}

/** Fields may be a plain string or an { ar, en } pair depending on the doc. */
const localized = (doc: Record<string, unknown>, field: string): string => {
  const value = doc[field];
  // Several Firestore titles carry stray leading/trailing whitespace, which
  // leaks into <title>, og:title and link text — always trim.
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const pick = obj.ar ?? obj.en;
    if (typeof pick === "string") return pick.trim();
  }
  return "";
};

/** Trim a raw Firestore field for use in a title or heading. */
const clean = (value: unknown): string => String(value ?? "").trim();

const cardList = (
  origin: string,
  base: string,
  docs: Record<string, unknown>[],
  descField: string,
  locale: Locale = DEFAULT_LOCALE,
): string =>
  `<ul>` +
  docs
    .filter((d) => typeof d.slug === "string" && (d.slug as string).trim())
    .map((d) => {
      const slug = encodeURIComponent(String(d.slug).trim());
      // Cards on an /en page link into the English tree and use the English
      // title where one exists, so the listing is not half-translated.
      const en = (d as { i18n?: Record<string, Record<string, unknown>> }).i18n?.en;
      const useEn = locale === "en" && en;
      const title = (useEn && String(en.title ?? "").trim()) || localized(d, "title");
      const desc =
        (useEn && String(en[descField] ?? en.description ?? "").trim()) ||
        localized(d, descField) ||
        localized(d, "description");
      const href = `${origin}${pathForLocale(`${base}/${slug}`, locale)}`;
      return (
        `<li><h3><a href="${href}">${escapeHtml(title)}</a></h3>` +
        (desc ? `<p>${escapeHtml(desc)}</p>` : "") +
        `</li>`
      );
    })
    .join("") +
  `</ul>`;

// --- Static page assembly -------------------------------------------------
// Each entry lists the translation keys that make up the page, so the SSR copy
// can never drift from what src/pages/*.tsx renders.

interface StaticPageSpec {
  path: string;
  titleKey: string;
  subtitleKey?: string;
  /** [headingKey | null, ...bodyKeys] */
  blocks: Array<[string | null, ...string[]]>;
  /** A finished block, or one that depends on the locale. */
  extraHtml?: string | ((locale: Locale) => string);
}

const mailtoHtml = `<p><a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>`;

/**
 * Unsplash's terms want the photographer credited with a link back, so the
 * credit has to survive in the crawled HTML too, not only in the React page.
 */
const imageCreditsHtml = (locale: Locale): string =>
  "<ul>" +
  IMAGE_CREDITS.map(
    (c) =>
      `<li>${escapeHtml(c.title)} — ${escapeHtml(t("credits.photo_by", locale))} ` +
      `<a href="${escapeHtml(c.photographerUrl)}" rel="nofollow noopener">${escapeHtml(c.photographer)}</a> ` +
      `(<a href="${escapeHtml(c.source)}" rel="nofollow noopener">${escapeHtml(t("credits.on_unsplash", locale))}</a>)</li>`,
  ).join("") +
  "</ul>";

const STATIC_PAGES: Record<string, StaticPageSpec> = {
  about: {
    path: "/about",
    titleKey: "about.title",
    subtitleKey: "about.subtitle",
    blocks: [
      ["about.value.speed.title", "about.value.speed.body"],
      ["about.value.accuracy.title", "about.value.accuracy.body"],
      ["about.value.free.title", "about.value.free.body"],
      ["about.mission.title", "about.mission.p1", "about.mission.p2"],
    ],
  },
  contact: {
    path: "/contact",
    titleKey: "contact.title",
    subtitleKey: "contact.subtitle",
    blocks: [
      [null, "contact.body.p1", "contact.body.p2"],
      ["contact.email_title"],
    ],
    extraHtml: mailtoHtml,
  },
  faq: {
    path: "/faq",
    titleKey: "faq.title",
    subtitleKey: "faq.subtitle",
    blocks: [1, 2, 3, 4, 5, 6, 7].map(
      (n) => [`faq.q${n}`, `faq.a${n}`] as [string, string],
    ),
  },
  "privacy-policy": {
    path: "/privacy-policy",
    titleKey: "privacy.title",
    subtitleKey: "privacy.updated",
    blocks: [
      ["privacy.s1.title", "privacy.s1.p1", "privacy.s1.p2"],
      ["privacy.s2.title", "privacy.s2.p1", "privacy.s2.p2"],
      ["privacy.s3.title", "privacy.s3.p1"],
      ["privacy.s4.title", "privacy.s4.p1", "privacy.s4.p2", "privacy.s4.p3"],
      ["privacy.s5.title", "privacy.s5.p1"],
      ["privacy.s6.title", "privacy.s6.p1"],
      ["privacy.s7.title", "privacy.s7.p1"],
      ["privacy.s8.title", "privacy.s8.p1"],
    ],
    extraHtml: mailtoHtml,
  },
  "image-credits": {
    path: "/image-credits",
    titleKey: "credits.title",
    subtitleKey: "credits.subtitle",
    blocks: [[null, "credits.intro"]],
    extraHtml: imageCreditsHtml,
  },
  "editorial-policy": {
    path: "/editorial-policy",
    titleKey: "editorial.title",
    subtitleKey: "editorial.subtitle",
    blocks: [
      ["editorial.s1.title", "editorial.s1.p1", "editorial.s1.p2"],
      ["editorial.editor.title", "editorial.editor.p1", "editorial.editor.p2"],
      ["editorial.ai.title", "editorial.ai.p1", "editorial.ai.p2"],
      ["editorial.s2.title", "editorial.s2.p1", "editorial.s2.p2"],
      ["editorial.s3.title", "editorial.s3.p1"],
      ["editorial.s4.title", "editorial.s4.p1"],
      ["editorial.s5.title", "editorial.s5.p1"],
      ["editorial.s6.title", "editorial.s6.p1"],
    ],
    extraHtml: mailtoHtml,
  },
  terms: {
    path: "/terms",
    titleKey: "terms.title",
    subtitleKey: "terms.updated",
    blocks: [
      ["terms.s1.title", "terms.s1.p1"],
      ["terms.s2.title", "terms.s2.p1", "terms.s2.p2"],
      ["terms.s3.title", "terms.s3.p1", "terms.s3.p2"],
      ["terms.s4.title", "terms.s4.p1", "terms.s4.p2"],
      ["terms.s5.title", "terms.s5.p1"],
      ["terms.s6.title", "terms.s6.p1"],
      ["terms.s7.title", "terms.s7.p1"],
    ],
    extraHtml: mailtoHtml,
  },
};

function renderStaticPage(
  origin: string,
  spec: StaticPageSpec,
  locale: Locale = DEFAULT_LOCALE,
): Meta {
  const title = t(spec.titleKey, locale);
  const subtitle = spec.subtitleKey ? t(spec.subtitleKey, locale) : "";
  const body = spec.blocks
    .map(([headingKey, ...bodyKeys]) => {
      const heading = headingKey ? t(headingKey, locale) : "";
      return (
        `<section>` +
        (heading ? `<h2>${escapeHtml(heading)}</h2>` : "") +
        bodyKeys.map((k) => `<p>${escapeHtml(t(k, locale))}</p>`).join("") +
        `</section>`
      );
    })
    .join("");

  const contentHtml =
    `<main>${siteNav(origin, locale)}<article>` +
    `<h1>${escapeHtml(title)}</h1>` +
    (subtitle ? `<p>${escapeHtml(subtitle)}</p>` : "") +
    body +
    (typeof spec.extraHtml === "function" ? spec.extraHtml(locale) : (spec.extraHtml ?? "")) +
    `</article></main>`;

  return {
    locale,
    altPath: spec.path,
    title: `${title} · ${siteName(locale)}`,
    description: subtitle || siteTagline(locale),
    url: `${origin}${pathForLocale(spec.path, locale)}`,
    contentHtml,
  };
}


/**
 * Permanently redirect a renamed slug to its new URL.
 *
 * Only fires when the requested slug is genuinely absent from Firestore AND
 * the migration target exists, so this is safe to deploy before or after
 * `scripts/migrate-slugs.mjs` runs — no working URL is ever redirected away.
 */
function redirectIfMigrated(
  res: any,
  origin: string,
  base: "quiz" | "articles",
  type: "quiz" | "article",
  slug: string,
  docs: Record<string, unknown>[],
): boolean {
  const target = migratedSlug(type, slug);
  if (!target) return false;
  if (!docs.some((d) => String(d.slug ?? "").trim() === target)) return false;
  res
    .status(301)
    .setHeader("Location", `${origin}/${base}/${encodeURIComponent(target)}`)
    .setHeader("Cache-Control", "public, max-age=0, s-maxage=86400");
  res.send("");
  return true;
}


// --- Client payload -------------------------------------------------------
// Shapes the published content for `window.__SSR_DATA__`. Bodies and question
// banks are the bulk of the bytes, so only the item actually being viewed
// carries them; the stores fill in the rest from Firestore afterwards.

const articleForClient = (
  a: Record<string, unknown>,
  full: boolean,
): Record<string, unknown> => ({
  id: a.id ?? a.slug,
  slug: clean(a.slug),
  title: clean(a.title),
  excerpt: clean(a.excerpt),
  content: full ? String(a.content ?? "") : "",
  category: clean(a.category),
  author: clean(a.author),
  tags: Array.isArray(a.tags) ? a.tags : [],
  image: a.image ?? null,
  published: true,
  views: typeof a.views === "number" ? a.views : 0,
  createdAt: a.createdAt ?? null,
  updatedAt: a.updatedAt ?? null,
  ...(full && Array.isArray(a.faq) ? { faq: a.faq } : {}),
  ...i18nForClient(a, full),
});

const quizForClient = (
  q: Record<string, unknown>,
  full: boolean,
): Record<string, unknown> => ({
  id: q.id ?? q.slug,
  slug: clean(q.slug),
  title: clean(q.title),
  description: clean(q.description),
  longDescription: full ? getQuizIntro(q.slug, q.longDescription) : "",
  category: clean(q.category),
  thumbnail: q.thumbnail ?? "",
  seoTitle: clean(q.seoTitle),
  seoDescription: clean(q.seoDescription),
  quizType: q.quizType ?? "weighted_personality",
  questions: full && Array.isArray(q.questions) ? q.questions : [],
  results: full && Array.isArray(q.results) ? q.results : [],
  published: true,
  createdAt: q.createdAt ?? null,
  updatedAt: q.updatedAt ?? null,
  ...i18nForClient(q, full),
});

/**
 * Carry the translation into the hydration payload.
 *
 * The client localizes from `i18n` at render time, and this payload used to
 * drop it — so an /en page would paint English from the server and then swap
 * itself back to Arabic the moment React mounted. The page subject gets the
 * whole map; list items get only the few fields a card shows, which keeps the
 * payload from ballooning with every translated question.
 */
const i18nForClient = (
  doc: Record<string, unknown>,
  full: boolean,
): Record<string, unknown> => {
  const i18n = doc.i18n as Record<string, Record<string, unknown>> | undefined;
  if (!i18n) return {};
  if (full) return { i18n };
  const light: Record<string, Record<string, unknown>> = {};
  for (const [lang, v] of Object.entries(i18n)) {
    if (!v) continue;
    light[lang] = {
      ...(v.title ? { title: v.title } : {}),
      ...(v.description ? { description: v.description } : {}),
      ...(v.excerpt ? { excerpt: v.excerpt } : {}),
    };
  }
  return { i18n: light };
};

/** Build the payload, marking one item as "full" when it is the page subject. */
const buildSsrData = (
  articles: Record<string, unknown>[],
  quizzes: Record<string, unknown>[],
  fullSlug?: string,
) => ({
  ...(articles.length
    ? {
        articles: articles.map((a) =>
          articleForClient(a, clean(a.slug) === fullSlug),
        ),
      }
    : {}),
  ...(quizzes.length
    ? {
        quizzes: quizzes.map((q) =>
          quizForClient(q, clean(q.slug) === fullSlug),
        ),
      }
    : {}),
});

// --- Handler --------------------------------------------------------------

export default async function handler(req: any, res: any) {
  const host = (req?.headers?.host as string) || CANONICAL_HOST;
  const proto = (req?.headers?.["x-forwarded-proto"] as string) || "https";
  const origin = `${proto}://${host}`;

  const type = (req?.query?.type as string) || "";
  const slug = (req?.query?.slug as string) || "";
  const name = (req?.query?.name as string) || "";
  // vercel.json rewrites /en/<path> here with lang=en; everything else is ar.
  const langParam = req?.query?.lang as string | undefined;
  const locale: Locale = isLocale(langParam) ? langParam : DEFAULT_LOCALE;

  const send = (meta: Meta, shell: string, sMaxAge = 300) => {
    res
      .status(200)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .setHeader(
        "Cache-Control",
        `public, max-age=0, s-maxage=${sMaxAge}, stale-while-revalidate=3600`,
      );
    return res.send(render(shell, meta));
  };

  try {
    const shell = await getShell(origin);

    // ---- Static / legal pages ------------------------------------------
    if (type === "page") {
      const spec = STATIC_PAGES[name];
      if (spec) {
        // The layout's header and footer list articles and quizzes on every
        // page, so even a static page needs the payload — otherwise the client
        // falls back to the retired seed data for those rails.
        const [articles, quizzes] = await Promise.all([
          fetchPublished("articles"),
          fetchPublished("quizzes"),
        ]);
        return send(
          {
            ...renderStaticPage(origin, spec, locale),
            ssrData: buildSsrData(articles, quizzes),
          },
          shell,
          3600,
        );
      }
    }

    // ---- Homepage and hub pages ----------------------------------------
    if (
      type === "home" ||
      type === "explore" ||
      type === "categories" ||
      type === "articles-index"
    ) {
      const needsQuizzes = type !== "articles-index";
      const needsArticles = type === "home" || type === "articles-index";
      const [quizzes, articles] = await Promise.all([
        needsQuizzes
          ? fetchPublished("quizzes")
          : Promise.resolve([] as Record<string, unknown>[]),
        needsArticles
          ? fetchPublished("articles")
          : Promise.resolve([] as Record<string, unknown>[]),
      ]);

      let contentHtml: string;
      let meta: Omit<Meta, "contentHtml">;

      if (type === "articles-index") {
        contentHtml =
          `<main>${siteNav(origin, locale)}<h1>${escapeHtml(t("articles.title", locale))}</h1>` +
          `<p>${escapeHtml(t("articles.subtitle", locale) || siteTagline(locale))}</p>` +
          cardList(origin, "/articles", articles, "excerpt", locale) +
          disclaimer(locale) +
          `</main>`;
        meta = {
          locale,
          altPath: "/articles",
          title: `${t("articles.title", locale)} · ${siteName(locale)}`,
          description: t("articles.subtitle", locale) || siteTagline(locale),
          url: `${origin}${pathForLocale("/articles", locale)}`,
        };
      } else if (type === "categories") {
        const byCategory = new Map<string, Record<string, unknown>[]>();
        for (const q of quizzes) {
          const cat = localized(q, "category") || "أخرى";
          if (!byCategory.has(cat)) byCategory.set(cat, []);
          byCategory.get(cat)!.push(q);
        }
        contentHtml =
          `<main>${siteNav(origin, locale)}<h1>${escapeHtml(t("categories.title", locale))}</h1>` +
          [...byCategory.entries()]
            .map(
              ([cat, items]) =>
                `<section><h2>${escapeHtml(cat)}</h2>` +
                cardList(origin, "/quiz", items, "description", locale) +
                `</section>`,
            )
            .join("") +
          disclaimer(locale) +
          `</main>`;
        meta = {
          locale,
          altPath: "/categories",
          title: `${t("categories.title", locale)} · ${siteName(locale)}`,
          description:
            t("categories.subtitle", locale) || siteTagline(locale),
          url: `${origin}${pathForLocale("/categories", locale)}`,
        };
      } else if (type === "explore") {
        contentHtml =
          `<main>${siteNav(origin, locale)}<h1>${escapeHtml(t("explore.title", locale))}</h1>` +
          `<p>${escapeHtml(siteTagline(locale))}</p>` +
          cardList(origin, "/quiz", quizzes, "description", locale) +
          disclaimer(locale) +
          `</main>`;
        meta = {
          locale,
          altPath: "/explore",
          title: `${t("explore.title", locale)} · ${siteName(locale)}`,
          description:
            locale === "ar"
              ? `تصفح جميع اختبارات المعرفة (${quizzes.length} اختبارًا).`
              : `Browse all ${quizzes.length} Al-Maarefah quizzes.`,
          url: `${origin}${pathForLocale("/explore", locale)}`,
        };
      } else {
        contentHtml =
          `<main>${siteNav(origin, locale)}` +
          `<h1>${escapeHtml(
            locale === "ar"
              ? `${SITE_NAME} — اختبارات شخصية وذكاء ومقالات نفسية`
              : "Al-Maarefah — personality and IQ tests, and psychology articles",
          )}</h1>` +
          `<p>${escapeHtml(siteTagline(locale))}</p>` +
          `<section><h2>${escapeHtml(t("home.trending", locale))}</h2>` +
          cardList(origin, "/quiz", quizzes, "description", locale) +
          `</section>` +
          `<section><h2>${escapeHtml(t("articles.title", locale))}</h2>` +
          cardList(origin, "/articles", articles, "excerpt", locale) +
          `</section>` +
          disclaimer(locale) +
          `</main>`;
        meta = {
          locale,
          altPath: "/",
          title:
            locale === "ar"
              ? `${siteName(locale)} — اختبارات شخصية وذكاء ومقالات نفسية مجانًا`
              : `${siteName(locale)} — free personality and IQ tests, and psychology articles`,
          description: siteTagline(locale),
          url: `${origin}${pathForLocale("/", locale)}`,
        };
      }

      return send(
        {
          ...meta,
          contentHtml,
          ssrData: buildSsrData(articles, quizzes),
          jsonLd: [
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteName(locale),
              url: `${origin}/`,
              inLanguage: locale,
            },
          ],
        },
        shell,
      );
    }

    // ---- Quiz detail ----------------------------------------------------
    if (type === "quiz" && slug) {
      const [quizzes, articles] = await Promise.all([
        fetchPublished("quizzes"),
        fetchPublished("articles"),
      ]);
      const quiz = quizzes.find((q) => String(q.slug ?? "").trim() === slug);
      if (!quiz && redirectIfMigrated(res, origin, "quiz", "quiz", slug, quizzes))
        return;
      if (quiz) {
        // An /en page for a quiz with no English translation would just be
        // the Arabic one on a second URL, so it is served noindex with its
        // canonical pointing home rather than claiming to be a translation.
        const translated = hasEnglishQuiz(quiz);
        const usable = locale === "ar" || translated;
        const view = usable ? inLocale(quiz, locale) : quiz;
        const arUrl = `${origin}/quiz/${encodeURIComponent(slug)}`;
        const title = `${clean(view.title)} · ${siteName(locale)}`;
        const description =
          clean(view.seoDescription) || clean(view.description);
        const results = Array.isArray(view.results) ? view.results : [];
        const resultsHtml = results
          .map(
            (r: any) =>
              `<h3>${escapeHtml(r?.title ?? "")}</h3>${markdownToHtml(r?.description)}`,
          )
          .join("");
        const contentHtml =
          `<main>${siteNav(origin, locale)}<article>` +
          `<h1>${escapeHtml(clean(view.title))}</h1>` +
          paragraphs(view.description) +
          // The long-form intro: whatever an editor wrote, else the
          // repo-side fallback. Every quiz in Firestore currently has an
          // empty longDescription, leaving these pages at ~40 words of prose.
          markdownToHtml(
            locale === "en" && typeof view.longDescription === "string" && view.longDescription.trim()
              ? (view.longDescription as string)
              : getQuizIntro(quiz.slug, view.longDescription),
          ) +
          `<p>${escapeHtml(clean(view.category))}</p>` +
          (resultsHtml
            ? `<h2>${escapeHtml(locale === "ar" ? "النتائج المحتملة" : "Possible results")}</h2>${resultsHtml}`
            : "") +
          `<p><a href="${origin}${pathForLocale(`/quiz/${encodeURIComponent(slug)}/take`, locale)}">${escapeHtml(
            locale === "ar" ? "ابدأ الاختبار" : "Start the quiz",
          )}</a></p>` +
          disclaimer(locale) +
          `</article></main>`;
        return send(
          {
            locale,
            ...(translated ? { altPath: `/quiz/${encodeURIComponent(slug)}` } : {}),
            ...(usable ? {} : { canonicalUrl: arUrl, noindex: true }),
            title,
            description,
            url: `${origin}${pathForLocale(`/quiz/${encodeURIComponent(slug)}`, locale)}`,
            image: absoluteImage(origin, quiz.thumbnail, "quiz", slug),
            contentHtml,
            ssrData: buildSsrData(articles, quizzes, slug),
          },
          shell,
        );
      }
    }

    // ---- Article detail -------------------------------------------------
    if (type === "article" && slug) {
      const [articles, quizzes] = await Promise.all([
        fetchPublished("articles"),
        fetchPublished("quizzes"),
      ]);
      const article = articles.find((a) => String(a.slug ?? "").trim() === slug);
      if (
        !article &&
        redirectIfMigrated(res, origin, "articles", "article", slug, articles)
      )
        return;
      if (article) {
        // Five of the twenty articles have no English yet. Those /en URLs
        // render the Arabic but say so with noindex + a canonical home, so
        // Google never sees two URLs claiming the same text.
        const translated = hasEnglishArticle(article);
        const usable = locale === "ar" || translated;
        const view = usable ? inLocale(article, locale) : article;
        const path = `/articles/${encodeURIComponent(slug)}`;
        const arUrl = `${origin}${path}`;
        const title = `${clean(view.title)} · ${siteName(locale)}`;
        const description = clean(view.excerpt);
        const published = String(article.createdAt ?? "");
        const modified = String(article.updatedAt ?? published);
        const url = `${origin}${pathForLocale(path, locale)}`;
        const image = absoluteImage(origin, article.image, "article", slug);

        const contentHtml =
          `<main>${siteNav(origin, locale)}<article>` +
          `<h1>${escapeHtml(clean(view.title))}</h1>` +
          `<p>${escapeHtml(clean(view.category))}</p>` +
          paragraphs(view.excerpt) +
          markdownToHtml(view.content) +
          disclaimer(locale) +
          `</article></main>`;

        return send(
          {
            locale,
            ...(translated ? { altPath: path } : {}),
            ...(usable ? {} : { canonicalUrl: arUrl }),
            title,
            description,
            url,
            image,
            contentHtml,
            noindex: !usable || !isIndexableArticle(article),
            ssrData: buildSsrData(articles, quizzes, slug),
            jsonLd: [
              {
                "@context": "https://schema.org",
                "@type": "Article",
                headline: clean(article.title),
                description,
                inLanguage: locale,
                mainEntityOfPage: { "@type": "WebPage", "@id": url },
                author: {
                  "@type": "Organization",
                  name: siteName(locale),
                  url: `${origin}/editorial-policy`,
                },
                publisher: {
                  "@type": "Organization",
                  name: siteName(locale),
                  logo: {
                    "@type": "ImageObject",
                    url: `${origin}/al-maarefah-icon.png`,
                  },
                },
                ...(published ? { datePublished: published } : {}),
                ...(modified ? { dateModified: modified } : {}),
                ...(image ? { image } : {}),
              },
            ],
          },
          shell,
        );
      }
    }

    // Unknown slug / type — serve the plain shell so the SPA handles it.
    res
      .status(200)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .setHeader("Cache-Control", "public, max-age=0, s-maxage=60");
    return res.send(shell);
  } catch (error) {
    // Never silently serve an empty shell on a render failure — a 200 with no
    // content is what AdSense read as "low value content". Fail loudly in the
    // logs, and return 503 so crawlers retry instead of indexing a blank page.
    console.error(
      `SSR render failed (type=${type} slug=${slug} name=${name})`,
      error,
    );
    res
      .status(503)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .setHeader("Cache-Control", "no-store")
      .setHeader("Retry-After", "120");
    return res.send(
      `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">` +
        `<title>${siteName(locale)}</title></head><body><h1>${siteName(locale)}</h1>` +
        `<p>تعذّر تحميل الصفحة مؤقتًا. يرجى المحاولة بعد قليل.</p></body></html>`,
    );
  }
}
