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
import { displayAuthor, isTeamByline } from "../src/lib/authors.js";
import { translations } from "../src/lib/translations.js";
import {
  CANONICAL_HOST,
  escapeHtml,
  fetchPublished,
  isIndexableArticle,
  markdownToHtml,
  paragraphs,
} from "./_shared.js";

/** Arabic is the canonical, indexed language — see api/_shared.ts. */
const t = (key: string): string =>
  translations.ar[key] || translations.en[key] || "";

/**
 * Contact address. The site is al-maarefah.com; the copy previously pointed at
 * @al-maarefah.app, a domain the site does not serve — dead contact routes are
 * a "false content claim" under the AdSense webmaster guidelines.
 */
const CONTACT_EMAIL = "info@al-maarefah.com";

const SITE_NAME = "المعرفة";
const SITE_TAGLINE =
  "منصة عربية مجانية للاختبارات النفسية واختبارات الذكاء والمقالات في علم النفس وتطوير الذات.";

// The built shell (with hashed asset tags) is cached per warm instance.
let shellCache: string | null = null;

/**
 * Fetch the built SPA shell.
 *
 * The build emits it as `app.html`, not `index.html`, so that no file sits at
 * `/` — Vercel checks the filesystem before rewrites, and an `index.html`
 * would shadow the homepage rewrite. See the plugin in vite.config.ts.
 */
async function getShell(origin: string): Promise<string> {
  if (shellCache) return shellCache;
  const res = await fetch(`${origin}/app.html`, {
    headers: { "x-ssr-shell": "1" },
  });
  if (!res.ok) throw new Error(`shell fetch failed: ${res.status} ${origin}/app.html`);
  shellCache = await res.text();
  return shellCache;
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

function render(shell: string, meta: Meta): string {
  const head =
    `<title>${escapeHtml(meta.title)}</title>` +
    `<meta name="description" content="${escapeHtml(meta.description)}" />` +
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />` +
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />` +
    `<meta property="og:url" content="${escapeHtml(meta.url)}" />` +
    `<meta property="og:locale" content="ar_AR" />` +
    (meta.image
      ? `<meta property="og:image" content="${escapeHtml(meta.image)}" />`
      : "") +
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />` +
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />` +
    `<link rel="canonical" href="${escapeHtml(meta.url)}" />` +
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
  // Every server-rendered page is the canonical Arabic version.
  html = html.replace(/<html[^>]*>/i, `<html lang="ar" dir="rtl" class="dark">`);
  // Drop the shell's existing <title> so ours wins.
  html = html.replace(/<title>[\s\S]*?<\/title>/i, "");
  // Drop the shell's static SEO tags too — crawlers take the FIRST og:* tag,
  // and the static ones (generic icon/title) appear before our injected head.
  html = html.replace(
    /<meta[^>]*(?:property="og:(?:title|description|image|url|locale)"|name="(?:description|twitter:title|twitter:description|twitter:image)")[^>]*>/gi,
    "",
  );
  html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, "");
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
const siteNav = (origin: string): string =>
  `<nav><ul>` +
  (
    [
      ["/", t("nav.home")],
      ["/explore", t("nav.explore")],
      ["/categories", t("nav.categories")],
      ["/articles", t("nav.articles")],
      ["/about", t("nav.about")],
      ["/contact", t("nav.contact")],
      ["/faq", t("faq.title")],
      ["/privacy-policy", t("privacy.title")],
      ["/terms", t("terms.title")],
      ["/editorial-policy", t("editorial.title")],
    ] as Array<[string, string]>
  )
    .map(
      ([path, label]) =>
        `<li><a href="${origin}${path}">${escapeHtml(label)}</a></li>`,
    )
    .join("") +
  `</ul></nav>`;

/**
 * These quizzes are entertainment, and psychology-adjacent content needs the
 * disclaimer visible on the page itself — not buried in Terms §4.
 */
const DISCLAIMER =
  "<p><small>تنبيه: اختبارات ومقالات المعرفة مخصّصة للترفيه والتأمل الذاتي، " +
  "وهي ليست تشخيصًا نفسيًا أو طبيًا ولا تُغني عن استشارة مختص.</small></p>";

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
): string =>
  `<ul>` +
  docs
    .filter((d) => typeof d.slug === "string" && (d.slug as string).trim())
    .map((d) => {
      const slug = encodeURIComponent(String(d.slug).trim());
      const title = localized(d, "title");
      const desc = localized(d, descField) || localized(d, "description");
      return (
        `<li><h3><a href="${origin}${base}/${slug}">${escapeHtml(title)}</a></h3>` +
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
  extraHtml?: string;
}

const mailtoHtml = `<p><a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>`;

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
  "editorial-policy": {
    path: "/editorial-policy",
    titleKey: "editorial.title",
    subtitleKey: "editorial.subtitle",
    blocks: [
      ["editorial.s1.title", "editorial.s1.p1", "editorial.s1.p2"],
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

function renderStaticPage(origin: string, spec: StaticPageSpec): Meta {
  const title = t(spec.titleKey);
  const subtitle = spec.subtitleKey ? t(spec.subtitleKey) : "";
  const body = spec.blocks
    .map(([headingKey, ...bodyKeys]) => {
      const heading = headingKey ? t(headingKey) : "";
      return (
        `<section>` +
        (heading ? `<h2>${escapeHtml(heading)}</h2>` : "") +
        bodyKeys.map((k) => `<p>${escapeHtml(t(k))}</p>`).join("") +
        `</section>`
      );
    })
    .join("");

  const contentHtml =
    `<main>${siteNav(origin)}<article>` +
    `<h1>${escapeHtml(title)}</h1>` +
    (subtitle ? `<p>${escapeHtml(subtitle)}</p>` : "") +
    body +
    (spec.extraHtml ?? "") +
    `</article></main>`;

  return {
    title: `${title} · ${SITE_NAME}`,
    description: subtitle || SITE_TAGLINE,
    url: `${origin}${spec.path}`,
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
  author: displayAuthor(a.author, "ar"),
  tags: Array.isArray(a.tags) ? a.tags : [],
  image: a.image ?? null,
  published: true,
  views: typeof a.views === "number" ? a.views : 0,
  createdAt: a.createdAt ?? null,
  updatedAt: a.updatedAt ?? null,
  ...(full && Array.isArray(a.faq) ? { faq: a.faq } : {}),
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
});

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
            ...renderStaticPage(origin, spec),
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
          `<main>${siteNav(origin)}<h1>${escapeHtml(t("articles.title"))}</h1>` +
          `<p>${escapeHtml(t("articles.subtitle") || SITE_TAGLINE)}</p>` +
          cardList(origin, "/articles", articles, "excerpt") +
          DISCLAIMER +
          `</main>`;
        meta = {
          title: `${t("articles.title")} · ${SITE_NAME}`,
          description:
            t("articles.subtitle") ||
            "مقالات في علم النفس والشخصية والذكاء وتطوير الذات.",
          url: `${origin}/articles`,
        };
      } else if (type === "categories") {
        const byCategory = new Map<string, Record<string, unknown>[]>();
        for (const q of quizzes) {
          const cat = localized(q, "category") || "أخرى";
          if (!byCategory.has(cat)) byCategory.set(cat, []);
          byCategory.get(cat)!.push(q);
        }
        contentHtml =
          `<main>${siteNav(origin)}<h1>${escapeHtml(t("categories.title"))}</h1>` +
          [...byCategory.entries()]
            .map(
              ([cat, items]) =>
                `<section><h2>${escapeHtml(cat)}</h2>` +
                cardList(origin, "/quiz", items, "description") +
                `</section>`,
            )
            .join("") +
          DISCLAIMER +
          `</main>`;
        meta = {
          title: `${t("categories.title")} · ${SITE_NAME}`,
          description: "تصفح اختبارات المعرفة حسب التصنيف.",
          url: `${origin}/categories`,
        };
      } else if (type === "explore") {
        contentHtml =
          `<main>${siteNav(origin)}<h1>${escapeHtml(t("explore.title"))}</h1>` +
          `<p>${escapeHtml(SITE_TAGLINE)}</p>` +
          cardList(origin, "/quiz", quizzes, "description") +
          DISCLAIMER +
          `</main>`;
        meta = {
          title: `${t("explore.title")} · ${SITE_NAME}`,
          description: `تصفح جميع اختبارات المعرفة (${quizzes.length} اختبارًا).`,
          url: `${origin}/explore`,
        };
      } else {
        contentHtml =
          `<main>${siteNav(origin)}` +
          `<h1>${escapeHtml(SITE_NAME)} — اختبارات شخصية وذكاء ومقالات نفسية</h1>` +
          `<p>${escapeHtml(SITE_TAGLINE)}</p>` +
          `<section><h2>${escapeHtml(t("home.trending"))}</h2>` +
          cardList(origin, "/quiz", quizzes, "description") +
          `</section>` +
          `<section><h2>${escapeHtml(t("articles.title"))}</h2>` +
          cardList(origin, "/articles", articles, "excerpt") +
          `</section>` +
          DISCLAIMER +
          `</main>`;
        meta = {
          title: `${SITE_NAME} — اختبارات شخصية وذكاء ومقالات نفسية مجانًا`,
          description: SITE_TAGLINE,
          url: `${origin}/`,
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
              name: SITE_NAME,
              url: `${origin}/`,
              inLanguage: "ar",
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
        const title = `${clean(quiz.title)} · ${SITE_NAME}`;
        const description =
          clean(quiz.seoDescription) || clean(quiz.description);
        const results = Array.isArray(quiz.results) ? quiz.results : [];
        const resultsHtml = results
          .map(
            (r: any) =>
              `<h3>${escapeHtml(r?.title ?? "")}</h3>${paragraphs(r?.description)}`,
          )
          .join("");
        const contentHtml =
          `<main>${siteNav(origin)}<article>` +
          `<h1>${escapeHtml(clean(quiz.title))}</h1>` +
          paragraphs(quiz.description) +
          // The long-form intro: whatever an editor wrote, else the
          // repo-side fallback. Every quiz in Firestore currently has an
          // empty longDescription, leaving these pages at ~40 words of prose.
          markdownToHtml(getQuizIntro(quiz.slug, quiz.longDescription)) +
          `<p>${escapeHtml(clean(quiz.category))}</p>` +
          (resultsHtml ? `<h2>النتائج المحتملة</h2>${resultsHtml}` : "") +
          `<p><a href="${origin}/quiz/${encodeURIComponent(slug)}/take">ابدأ الاختبار</a></p>` +
          DISCLAIMER +
          `</article></main>`;
        return send(
          {
            title,
            description,
            url: `${origin}/quiz/${encodeURIComponent(slug)}`,
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
        const title = `${clean(article.title)} · ${SITE_NAME}`;
        const description = clean(article.excerpt);
        const author = displayAuthor(article.author, "ar");
        const published = String(article.createdAt ?? "");
        const modified = String(article.updatedAt ?? published);
        const url = `${origin}/articles/${encodeURIComponent(slug)}`;
        const image = absoluteImage(origin, article.image, "article", slug);

        const contentHtml =
          `<main>${siteNav(origin)}<article>` +
          `<h1>${escapeHtml(clean(article.title))}</h1>` +
          `<p>${escapeHtml(author)}` +
          (published
            ? ` · <time datetime="${escapeHtml(published)}">${escapeHtml(
                published.slice(0, 10),
              )}</time>`
            : "") +
          ` · ${escapeHtml(clean(article.category))}</p>` +
          paragraphs(article.excerpt) +
          markdownToHtml(article.content) +
          DISCLAIMER +
          `</article></main>`;

        return send(
          {
            title,
            description,
            url,
            image,
            contentHtml,
            noindex: !isIndexableArticle(article),
            ssrData: buildSsrData(articles, quizzes, slug),
            jsonLd: [
              {
                "@context": "https://schema.org",
                "@type": "Article",
                headline: clean(article.title),
                description,
                inLanguage: "ar",
                mainEntityOfPage: { "@type": "WebPage", "@id": url },
                author: isTeamByline(article.author)
                  ? { "@type": "Organization", name: author, url: `${origin}/editorial-policy` }
                  : { "@type": "Person", name: author },
                publisher: {
                  "@type": "Organization",
                  name: SITE_NAME,
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
        `<title>${SITE_NAME}</title></head><body><h1>${SITE_NAME}</h1>` +
        `<p>تعذّر تحميل الصفحة مؤقتًا. يرجى المحاولة بعد قليل.</p></body></html>`,
    );
  }
}
