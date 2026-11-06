/**
 * Dynamic sitemap — Vercel serverless function served at /sitemap.xml
 * (via the rewrite in vercel.json).
 *
 * Lists the fixed public pages plus every PUBLISHED quiz and article read
 * live from Firestore, so newly published content shows up without a redeploy.
 *
 * Reads the same Firebase config the frontend uses. On Vercel, project env
 * vars (including VITE_-prefixed ones) are available to functions via
 * process.env. Public/published docs are world-readable per firestore.rules,
 * so no admin credentials are needed.
 */

import {
  CANONICAL_HOST,
  fetchPublished,
  isIndexableArticle,
} from "./_shared.js";
import {
  hasEnglishArticle,
  hasEnglishQuiz,
  pathForLocale,
} from "../src/lib/locale-routing.js";

const STATIC_ROUTES: Array<{
  path: string;
  changefreq: string;
  priority: string;
}> = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/explore", changefreq: "daily", priority: "0.9" },
  { path: "/categories", changefreq: "weekly", priority: "0.8" },
  { path: "/articles", changefreq: "daily", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.4" },
  { path: "/contact", changefreq: "monthly", priority: "0.4" },
  { path: "/faq", changefreq: "monthly", priority: "0.4" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/editorial-policy", changefreq: "yearly", priority: "0.4" },
  { path: "/image-credits", changefreq: "monthly", priority: "0.3" },
];

const toLastmod = (value: unknown): string | undefined =>
  typeof value === "string" && value.length >= 10 ? value.slice(0, 10) : undefined;

/**
 * One entry, optionally declaring its translation.
 *
 * Where a page exists in both languages, each side lists both alternates and
 * names Arabic as x-default. Google discards an hreflang pair that does not
 * point back, so the two entries have to agree — hence both links are built
 * from one shared path rather than written out per side.
 */
const urlEntry = (
  loc: string,
  changefreq: string,
  priority: string,
  lastmod?: string,
  alternates?: { ar: string; en: string },
) => {
  const alt = alternates
    ? `    <xhtml:link rel="alternate" hreflang="ar" href="${alternates.ar}"/>
` +
      `    <xhtml:link rel="alternate" hreflang="en" href="${alternates.en}"/>
` +
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${alternates.ar}"/>
`
    : "";
  return (
    `  <url>
    <loc>${loc}</loc>
` +
    (lastmod ? `    <lastmod>${lastmod}</lastmod>
` : "") +
    alt +
    `    <changefreq>${changefreq}</changefreq>
` +
    `    <priority>${priority}</priority>
  </url>`
  );
};

export default async function handler(req: any, res: any) {
  // Build absolute URLs from the host that requested the sitemap so they always
  // match (www vs non-www) — Google rejects sitemaps whose URLs are on a
  // different host than the sitemap itself.
  const host = (req?.headers?.host as string) || CANONICAL_HOST;
  const proto = (req?.headers?.["x-forwarded-proto"] as string) || "https";
  const BASE_URL = `${proto}://${host}`;

  const urls: string[] = [];
  const seenLocs = new Set<string>();
  const addEntry = (
    loc: string,
    changefreq: string,
    priority: string,
    lastmod?: string,
    alternates?: { ar: string; en: string },
  ) => {
    if (seenLocs.has(loc)) return; // skip duplicate URLs
    seenLocs.add(loc);
    urls.push(urlEntry(loc, changefreq, priority, lastmod, alternates));
  };

  /**
   * List a path in Arabic, and in English too when there is real English
   * behind it. An /en URL that merely re-serves the Arabic is a duplicate,
   * so it stays out of the sitemap exactly as it stays out of the index.
   */
  const addPair = (
    path: string,
    changefreq: string,
    priority: string,
    lastmod?: string,
    translated = true,
  ) => {
    const ar = `${BASE_URL}${pathForLocale(path, "ar")}`;
    const en = `${BASE_URL}${pathForLocale(path, "en")}`;
    const alt = translated ? { ar, en } : undefined;
    addEntry(ar, changefreq, priority, lastmod, alt);
    if (translated) addEntry(en, changefreq, priority, lastmod, alt);
  };

  // Every fixed page is fully translated — its strings come from one map.
  for (const r of STATIC_ROUTES) {
    addPair(r.path, r.changefreq, r.priority);
  }

  try {
    const [quizzes, articles] = await Promise.all([
      fetchPublished("quizzes"),
      fetchPublished("articles"),
    ]);

    for (const quiz of quizzes) {
      const slug = quiz.slug;
      if (typeof slug === "string" && slug.trim()) {
        addPair(
          `/quiz/${encodeURIComponent(slug.trim())}`,
          "weekly",
          "0.7",
          toLastmod(quiz.updatedAt),
          hasEnglishQuiz(quiz),
        );
      }
    }

    for (const article of articles) {
      const slug = article.slug;
      // Thin articles are served noindex, so keep them out of the sitemap too
      // rather than inviting Google to crawl and rate them.
      if (!isIndexableArticle(article)) continue;
      if (typeof slug === "string" && slug.trim()) {
        addPair(
          `/articles/${encodeURIComponent(slug.trim())}`,
          "weekly",
          "0.6",
          toLastmod(article.updatedAt),
          hasEnglishArticle(article),
        );
      }
    }
  } catch (error) {
    // If Firestore is unreachable, still return a valid sitemap of static routes.
    console.error("sitemap generation failed", error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join(
    "\n",
  )}\n</urlset>\n`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  // Cache at the edge for an hour so we don't hit Firestore on every crawl.
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600");
  res.status(200).send(xml);
}
