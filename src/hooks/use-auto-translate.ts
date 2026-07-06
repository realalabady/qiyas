/**
 * Background auto-translation for content that predates the bilingual feature.
 *
 * When a page renders quizzes/articles that have no stored `i18n`, these hooks
 * generate the translations once (via the same free translator used at save
 * time) and cache them into the store's localStorage — no cloud writes. On the
 * next render the content shows in whichever language the user picked.
 *
 * Work is de-duplicated across renders with a module-level id set, and run with
 * small concurrency so we never fire dozens of requests at once.
 */

import { useEffect, useRef } from "react";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import type { Quiz } from "@/stores/quizzes-admin-store";
import { useArticles } from "@/stores/articles-store";
import type { Article } from "@/data/seed-articles";
import { useCategories } from "@/stores/categories-store";
import type { Category } from "@/stores/categories-store";
import {
  buildQuizI18n,
  buildArticleI18n,
  buildCategoryI18n,
} from "@/lib/localized-content";

// Ids already processed (or in-flight) this session — survives re-renders.
const doneQuizIds = new Set<string>();
const doneArticleIds = new Set<string>();
const doneCategoryIds = new Set<string>();

async function runLimited<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(limit, queue.length) }, () =>
    (async () => {
      while (queue.length) {
        const next = queue.shift();
        if (next !== undefined) await worker(next);
      }
    })(),
  );
  await Promise.all(runners);
}

/** Ensure every quiz in `quizzes` has an `i18n` map (translating if missing). */
export function useAutoTranslateQuizzes(quizzes: Quiz[]): void {
  const busy = useRef(false);

  useEffect(() => {
    const pending = quizzes.filter(
      (q) => !q.i18n && !doneQuizIds.has(q.id) && (q.title || q.description),
    );
    if (pending.length === 0 || busy.current) return;
    busy.current = true;
    pending.forEach((q) => doneQuizIds.add(q.id));

    runLimited(pending, 2, async (quiz) => {
      try {
        const i18n = await buildQuizI18n(quiz);
        useQuizzesAdmin.getState().setQuizI18n(quiz.id, i18n);
      } catch {
        doneQuizIds.delete(quiz.id); // allow a later retry
      }
    }).finally(() => {
      busy.current = false;
    });
  }, [quizzes]);
}

/** Ensure every article in `articles` has an `i18n` map (translating if missing). */
export function useAutoTranslateArticles(articles: Article[]): void {
  const busy = useRef(false);

  useEffect(() => {
    const pending = articles.filter(
      (a) => !a.i18n && !doneArticleIds.has(a.id) && (a.title || a.excerpt),
    );
    if (pending.length === 0 || busy.current) return;
    busy.current = true;
    pending.forEach((a) => doneArticleIds.add(a.id));

    runLimited(pending, 2, async (article) => {
      try {
        const i18n = await buildArticleI18n(article);
        useArticles.getState().setArticleI18n(article.id, i18n);
      } catch {
        doneArticleIds.delete(article.id);
      }
    }).finally(() => {
      busy.current = false;
    });
  }, [articles]);
}

/** Ensure every custom category has an `i18n` map (translating if missing). */
export function useAutoTranslateCategories(categories: Category[]): void {
  const busy = useRef(false);

  useEffect(() => {
    const pending = categories.filter(
      (c) => !c.i18n && !doneCategoryIds.has(c.id) && (c.name || c.description),
    );
    if (pending.length === 0 || busy.current) return;
    busy.current = true;
    pending.forEach((c) => doneCategoryIds.add(c.id));

    runLimited(pending, 3, async (category) => {
      try {
        const i18n = await buildCategoryI18n(category);
        useCategories.getState().setCategoryI18n(category.id, i18n);
      } catch {
        doneCategoryIds.delete(category.id);
      }
    }).finally(() => {
      busy.current = false;
    });
  }, [categories]);
}
