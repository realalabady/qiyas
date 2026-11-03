/**
 * Bilingual content helpers.
 *
 *  - `buildQuizI18n` / `buildArticleI18n` run at *save time* in the admin panel.
 *    They snapshot the typed (source) language and auto-translate every display
 *    string into the other language, returning an `i18n` map keyed by language.
 *
 *  - `localizedQuiz` / `localizedArticle` run at *display time*. They return a
 *    shallow copy of the entity with all display text swapped to the requested
 *    language (falling back to the stored source text when a translation is
 *    missing — e.g. legacy content saved before this feature existed).
 *
 * Ids, slugs, weights, scores, colors and category linkage are never touched.
 */

import { translateText, translateMany, detectLang, type Lang } from "./translate";
import type { Quiz, QuizI18n, QuizLang } from "@/stores/quizzes-admin-store";
import type { Article, ArticleI18n, ArticleLang } from "@/data/seed-articles";
import type { Category, CategoryLang } from "@/stores/categories-store";

const OTHER: Record<Lang, Lang> = { en: "ar", ar: "en" };

/* ─────────────────────────── Quizzes ─────────────────────────── */

/** Snapshot the quiz's current (typed) text into a QuizI18n structure. */
function snapshotQuiz(quiz: Quiz): QuizI18n {
  return {
    title: quiz.title,
    description: quiz.description,
    longDescription: quiz.longDescription,
    seoTitle: quiz.seoTitle,
    seoDescription: quiz.seoDescription,
    questions: Object.fromEntries(
      quiz.questions.map((q) => [
        q.id,
        {
          text: q.text,
          answers: Object.fromEntries(q.answers.map((a) => [a.id, a.text])),
        },
      ]),
    ),
    results: Object.fromEntries(
      quiz.results.map((r) => [
        r.id,
        {
          title: r.title,
          description: r.description,
          strengths: r.strengths,
          weaknesses: r.weaknesses,
          careers: r.careers,
        },
      ]),
    ),
  };
}

/** Translate a whole quiz snapshot into `target`. */
async function translateQuizSnapshot(
  snap: QuizI18n,
  target: Lang,
): Promise<QuizI18n> {
  const [title, description, longDescription, seoTitle, seoDescription] =
    await translateMany(
      [
        snap.title ?? "",
        snap.description ?? "",
        snap.longDescription ?? "",
        snap.seoTitle ?? "",
        snap.seoDescription ?? "",
      ],
      target,
    );

  const questions: NonNullable<QuizI18n["questions"]> = {};
  for (const [qid, q] of Object.entries(snap.questions ?? {})) {
    const text = await translateText(q.text ?? "", target);
    const answers: Record<string, string> = {};
    const answerEntries = Object.entries(q.answers ?? {});
    const translatedAnswers = await translateMany(
      answerEntries.map(([, v]) => v),
      target,
    );
    answerEntries.forEach(([aid], i) => {
      answers[aid] = translatedAnswers[i];
    });
    questions[qid] = { text, answers };
  }

  const results: NonNullable<QuizI18n["results"]> = {};
  for (const [rid, r] of Object.entries(snap.results ?? {})) {
    const [title2, description2] = await translateMany(
      [r.title ?? "", r.description ?? ""],
      target,
    );
    results[rid] = {
      title: title2,
      description: description2,
      strengths: r.strengths
        ? await translateMany(r.strengths, target)
        : r.strengths,
      weaknesses: r.weaknesses
        ? await translateMany(r.weaknesses, target)
        : r.weaknesses,
      careers: r.careers ? await translateMany(r.careers, target) : r.careers,
    };
  }

  return {
    title,
    description,
    longDescription,
    seoTitle,
    seoDescription,
    questions,
    results,
  };
}

/**
 * Build the `i18n` map for a quiz: the source language from its typed text plus
 * an auto-translated copy in the other language.
 */
export async function buildQuizI18n(
  quiz: Quiz,
): Promise<Partial<Record<QuizLang, QuizI18n>>> {
  const source = detectLang(quiz.title || quiz.description || "");
  const other = OTHER[source];
  const sourceSnap = snapshotQuiz(quiz);
  const otherSnap = await translateQuizSnapshot(sourceSnap, other);
  return { [source]: sourceSnap, [other]: otherSnap } as Partial<
    Record<QuizLang, QuizI18n>
  >;
}

/** Return a copy of the quiz with all display text in `language`. */
export function localizedQuiz(quiz: Quiz, language: string): Quiz {
  const loc = quiz.i18n?.[language as QuizLang];
  if (!loc) return quiz;

  return {
    ...quiz,
    title: loc.title || quiz.title,
    description: loc.description || quiz.description,
    longDescription: loc.longDescription || quiz.longDescription,
    seoTitle: loc.seoTitle || quiz.seoTitle,
    seoDescription: loc.seoDescription || quiz.seoDescription,
    questions: quiz.questions.map((q) => {
      const lq = loc.questions?.[q.id];
      return {
        ...q,
        text: lq?.text || q.text,
        answers: q.answers.map((a) => ({
          ...a,
          text: lq?.answers?.[a.id] || a.text,
        })),
      };
    }),
    results: quiz.results.map((r) => {
      const lr = loc.results?.[r.id];
      return {
        ...r,
        title: lr?.title || r.title,
        description: lr?.description || r.description,
        strengths: lr?.strengths?.length ? lr.strengths : r.strengths,
        weaknesses: lr?.weaknesses?.length ? lr.weaknesses : r.weaknesses,
        careers: lr?.careers?.length ? lr.careers : r.careers,
      };
    }),
  };
}

/* ─────────────────────────── Articles ─────────────────────────── */

export async function buildArticleI18n(
  article: Pick<Article, "title" | "excerpt" | "content" | "faq">,
): Promise<Partial<Record<ArticleLang, ArticleI18n>>> {
  const source = detectLang(article.title || article.excerpt || "");
  const other = OTHER[source];
  const faq = article.faq?.filter((f) => f.question && f.answer) ?? [];
  const sourceSnap: ArticleI18n = {
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    ...(faq.length ? { faq } : {}),
  };
  const [title, excerpt, content] = await translateMany(
    [article.title ?? "", article.excerpt ?? "", article.content ?? ""],
    other,
  );
  // Questions and answers are translated as one flat list, then re-paired, so
  // the FAQ keeps the same order as the article's own `faq`.
  const flat = faq.length
    ? await translateMany(
        faq.flatMap((f) => [f.question, f.answer]),
        other,
      )
    : [];
  const otherSnap: ArticleI18n = {
    title,
    excerpt,
    content,
    ...(faq.length
      ? {
          faq: faq.map((_, i) => ({
            question: flat[i * 2],
            answer: flat[i * 2 + 1],
          })),
        }
      : {}),
  };
  return { [source]: sourceSnap, [other]: otherSnap } as Partial<
    Record<ArticleLang, ArticleI18n>
  >;
}

/* ─────────────────────────── Categories ─────────────────────────── */

/**
 * Build the `i18n` map for a custom category. Uses the manual name/description
 * plus their Arabic counterparts when present, and auto-translates whatever is
 * missing so both languages are always available.
 */
export async function buildCategoryI18n(
  category: Pick<Category, "name" | "nameAr" | "description" | "descriptionAr">,
): Promise<Partial<Record<CategoryLang, { name: string; description: string }>>> {
  const source = detectLang(category.name || category.description || "");
  const other = OTHER[source];

  // Known values per language (manual fields take precedence).
  const known: Record<Lang, { name: string; description: string }> = {
    en: { name: "", description: "" },
    ar: { name: "", description: "" },
  };
  known[source] = { name: category.name, description: category.description };
  if (category.nameAr.trim()) known.ar.name = category.nameAr;
  if (category.descriptionAr.trim())
    known.ar.description = category.descriptionAr;
  if (!known[other].name)
    known[other].name = await translateText(category.name, other);
  if (!known[other].description)
    known[other].description = await translateText(
      category.description,
      other,
    );

  return { en: known.en, ar: known.ar };
}

/** Return a copy of the article with title/excerpt/content in `language`. */
export function localizedArticle(article: Article, language: string): Article {
  const loc = article.i18n?.[language as ArticleLang];
  if (!loc) return article;
  return {
    ...article,
    title: loc.title || article.title,
    excerpt: loc.excerpt || article.excerpt,
    content: loc.content || article.content,
    // Only swap the FAQ when the translation has an entry for every item, so a
    // partial snapshot can never drop questions off the page.
    faq:
      loc.faq?.length && loc.faq.length === article.faq?.length
        ? loc.faq
        : article.faq,
  };
}
