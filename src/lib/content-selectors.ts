/**
 * Deterministic content-selection helpers for internal linking / SEO.
 *
 * These are pure functions (no React, no store access) that rank the article
 * and quiz collections for the various homepage / sidebar / footer rails and,
 * crucially, pick **relevance-based** related content (category + tags +
 * keyword overlap) — never random. Deterministic ordering matters because a
 * crawler renders the page with empty client-side analytics, so link targets
 * must be stable regardless of local view counts.
 */

import type { Article } from "@/data/seed-articles";
import type { Quiz } from "@/stores/quizzes-admin-store";

/* ─────────────────────────── Shared utils ─────────────────────────── */

/** Explore/articles filter slug for a category name ("IQ Tests" → "iq-tests"). */
export function categorySlug(name: string): string {
  return (name || "").toLowerCase().trim().replace(/\s+/g, "-");
}

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "your",
  "you", "how", "what", "why", "is", "are", "test", "tests", "quiz", "quizzes",
  "about", "into", "this", "that", "from", "guide", "deep", "dive",
]);

/** Lower-cased, de-duplicated keyword set from arbitrary text fragments. */
function keywords(...parts: (string | string[] | undefined)[]): Set<string> {
  const out = new Set<string>();
  for (const part of parts) {
    if (!part) continue;
    const text = Array.isArray(part) ? part.join(" ") : part;
    for (const raw of text.toLowerCase().split(/[^a-z0-9؀-ۿ]+/)) {
      const w = raw.trim();
      if (w.length > 2 && !STOP_WORDS.has(w)) out.add(w);
    }
  }
  return out;
}

/** Number of shared keywords between two sets. */
function overlap(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const w of a) if (b.has(w)) n++;
  return n;
}

const dayMs = 24 * 60 * 60 * 1000;

function ageDays(date: Date): number {
  return Math.max(0, (Date.now() - new Date(date).getTime()) / dayMs);
}

/** Recency weight in (0, 1]: 1 for brand-new, decaying with a ~30-day half-life. */
function recencyWeight(date: Date): number {
  return 1 / (1 + ageDays(date) / 30);
}

/* ─────────────────────────── Articles ─────────────────────────── */

const published = (a: Article) => a.published;

/** Newest published articles (by creation date). */
export function latestArticles(articles: Article[], limit = 8): Article[] {
  return articles
    .filter(published)
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}

/** Most-viewed published articles. */
export function popularArticles(articles: Article[], limit = 8): Article[] {
  return articles
    .filter(published)
    .slice()
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit);
}

/** Trending = views blended with recency, so fresh popular content floats up. */
export function trendingArticles(articles: Article[], limit = 8): Article[] {
  return articles
    .filter(published)
    .slice()
    .map((a) => ({ a, score: (a.views || 1) * recencyWeight(a.createdAt) }))
    .sort((x, y) => y.score - x.score)
    .map((x) => x.a)
    .slice(0, limit);
}

/**
 * Related articles for a given article, ranked by relevance:
 * same category (strong), shared tags (strong), title/excerpt keyword overlap.
 * Never random — falls back to newest same-nothing only to fill the count.
 */
export function relatedArticles(
  current: Article,
  all: Article[],
  limit = 6,
): Article[] {
  const curKeys = keywords(current.title, current.excerpt, current.tags);
  const curTags = new Set((current.tags || []).map((t) => t.toLowerCase()));

  const scored = all
    .filter((a) => a.published && a.id !== current.id)
    .map((a) => {
      let score = 0;
      if (a.category === current.category) score += 5;
      const tagHits = overlap(curTags, new Set((a.tags || []).map((t) => t.toLowerCase())));
      score += tagHits * 3;
      score += overlap(curKeys, keywords(a.title, a.excerpt, a.tags));
      // Small recency nudge to break ties toward fresher content.
      score += recencyWeight(a.createdAt) * 0.5;
      return { a, score };
    })
    .sort((x, y) => y.score - x.score);

  return scored.slice(0, limit).map((x) => x.a);
}

/* ─────────────────────────── Quizzes ─────────────────────────── */

const publishedQ = (q: Quiz) => q.published;

/** Newest published quizzes. */
export function latestQuizzes(quizzes: Quiz[], limit = 8): Quiz[] {
  return quizzes
    .filter(publishedQ)
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}

/**
 * Popular quizzes. Uses client analytics views when available, otherwise a
 * deterministic proxy (richer quizzes first) so crawler ordering is stable.
 */
export function popularQuizzes(
  quizzes: Quiz[],
  viewsById: Record<string, number> = {},
  limit = 8,
): Quiz[] {
  return quizzes
    .filter(publishedQ)
    .slice()
    .sort((a, b) => {
      const va = viewsById[a.id] || 0;
      const vb = viewsById[b.id] || 0;
      if (vb !== va) return vb - va;
      return (b.questions?.length || 0) - (a.questions?.length || 0);
    })
    .slice(0, limit);
}

/** Trending quizzes = engagement proxy (question depth) blended with recency. */
export function trendingQuizzes(
  quizzes: Quiz[],
  viewsById: Record<string, number> = {},
  limit = 8,
): Quiz[] {
  return quizzes
    .filter(publishedQ)
    .slice()
    .map((q) => ({
      q,
      score:
        ((viewsById[q.id] || 0) + (q.questions?.length || 1)) *
        recencyWeight(q.createdAt),
    }))
    .sort((x, y) => y.score - x.score)
    .map((x) => x.q)
    .slice(0, limit);
}

/** Related quizzes for a quiz: same category first, then keyword overlap. */
export function relatedQuizzes(
  current: Quiz,
  all: Quiz[],
  limit = 6,
): Quiz[] {
  const curKeys = keywords(current.title, current.description, current.category);
  const scored = all
    .filter((q) => q.published && q.id !== current.id)
    .map((q) => {
      let score = 0;
      if (q.category === current.category) score += 5;
      score += overlap(curKeys, keywords(q.title, q.description, q.category));
      score += recencyWeight(q.createdAt) * 0.5;
      return { q, score };
    })
    .sort((x, y) => y.score - x.score);
  return scored.slice(0, limit).map((x) => x.q);
}

/**
 * Recommended articles for a quiz (cross-type linking). Scores article
 * relevance to the quiz by category name and keyword overlap.
 */
export function recommendedArticlesForQuiz(
  quiz: Quiz,
  articles: Article[],
  limit = 6,
): Article[] {
  const quizKeys = keywords(quiz.title, quiz.description, quiz.category);
  const scored = articles
    .filter((a) => a.published)
    .map((a) => {
      let score = 0;
      // Category names differ across types; a loose contains match still helps.
      const qc = quiz.category.toLowerCase();
      const ac = a.category.toLowerCase();
      if (qc.includes(ac) || ac.includes(qc)) score += 4;
      score += overlap(quizKeys, keywords(a.title, a.excerpt, a.tags));
      score += recencyWeight(a.createdAt) * 0.5;
      return { a, score };
    })
    .sort((x, y) => y.score - x.score);
  return scored.slice(0, limit).map((x) => x.a);
}

/**
 * Related quizzes for an article (cross-type linking): category-name contains
 * match plus keyword overlap between article and quiz text.
 */
export function relatedQuizzesForArticle(
  article: Article,
  quizzes: Quiz[],
  limit = 4,
): Quiz[] {
  const artKeys = keywords(article.title, article.excerpt, article.tags);
  const ac = article.category.toLowerCase();
  const scored = quizzes
    .filter((q) => q.published)
    .map((q) => {
      let score = 0;
      const qc = q.category.toLowerCase();
      if (qc.includes(ac) || ac.includes(qc)) score += 4;
      score += overlap(artKeys, keywords(q.title, q.description, q.category));
      score += recencyWeight(q.createdAt) * 0.5;
      return { q, score };
    })
    .sort((x, y) => y.score - x.score);
  return scored.slice(0, limit).map((x) => x.q);
}

/* ─────────────────────────── Reading time ─────────────────────────── */

/** Estimated reading time in minutes (~200 wpm), min 1. */
export function readingTimeMinutes(content: string): number {
  const words = (content || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
