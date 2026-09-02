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
];

const toLastmod = (value: unknown): string | undefined =>
  typeof value === "string" && value.length >= 10 ? value.slice(0, 10) : undefined;

const urlEntry = (
  loc: string,
  changefreq: string,
  priority: string,
  lastmod?: string,
) =>
  `  <url>\n    <loc>${loc}</loc>\n${
    lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""
  }    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

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
  ) => {
    if (seenLocs.has(loc)) return; // skip duplicate URLs
    seenLocs.add(loc);
    urls.push(urlEntry(loc, changefreq, priority, lastmod));
  };

  for (const r of STATIC_ROUTES) {
    addEntry(`${BASE_URL}${r.path}`, r.changefreq, r.priority);
  }

  try {
    const [quizzes, articles] = await Promise.all([
      fetchPublished("quizzes"),
      fetchPublished("articles"),
    ]);

    for (const quiz of quizzes) {
      const slug = quiz.slug;
      if (typeof slug === "string" && slug.trim()) {
        addEntry(
          `${BASE_URL}/quiz/${encodeURIComponent(slug.trim())}`,
          "weekly",
          "0.7",
          toLastmod(quiz.updatedAt),
        );
      }
    }

    for (const article of articles) {
      const slug = article.slug;
      // Thin articles are served noindex, so keep them out of the sitemap too
      // rather than inviting Google to crawl and rate them.
      if (!isIndexableArticle(article)) continue;
      if (typeof slug === "string" && slug.trim()) {
        addEntry(
          `${BASE_URL}/articles/${encodeURIComponent(slug.trim())}`,
          "weekly",
          "0.6",
          toLastmod(article.updatedAt),
        );
      }
    }
  } catch (error) {
    // If Firestore is unreachable, still return a valid sitemap of static routes.
    console.error("sitemap generation failed", error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
    "\n",
  )}\n</urlset>\n`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  // Cache at the edge for an hour so we don't hit Firestore on every crawl.
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600");
  res.status(200).send(xml);
}
