/**
 * Server-injected page data.
 *
 * `api/render.ts` embeds the published quizzes and articles as
 * `window.__SSR_DATA__` before the app bundle runs, so the Zustand stores can
 * initialise from real content **synchronously**.
 *
 * Why this exists: the stores used to start from the hardcoded seed data in
 * `src/data/seed-*.ts` and swap in Firestore content from an async `hydrate()`.
 * Googlebot renders the page and snapshots the DOM, and it was capturing that
 * intermediate state — so the indexed version of the homepage showed three
 * English stub articles bylined "Admin", with links to slugs that no longer
 * exist, instead of the real Arabic content. Google indexes the rendered DOM,
 * not the SSR HTML, so serving correct HTML was not enough on its own.
 *
 * The stores still call `hydrate()` afterwards to pick up anything the payload
 * omits (question banks, and the bodies of articles other than the one being
 * read) and to refresh a page served from the CDN cache.
 */

export interface SsrPayload {
  articles?: unknown[];
  quizzes?: unknown[];
}

declare global {
  interface Window {
    __SSR_DATA__?: SsrPayload;
  }
}

function payload(): SsrPayload | undefined {
  if (typeof window === "undefined") return undefined;
  const data = window.__SSR_DATA__;
  if (!data || typeof data !== "object") return undefined;
  return data;
}

/** Server-provided articles, or undefined when the page was not rendered. */
export function ssrArticles<T>(): T[] | undefined {
  const list = payload()?.articles;
  return Array.isArray(list) && list.length ? (list as T[]) : undefined;
}

/** Server-provided quizzes, or undefined when the page was not rendered. */
export function ssrQuizzes<T>(): T[] | undefined {
  const list = payload()?.quizzes;
  return Array.isArray(list) && list.length ? (list as T[]) : undefined;
}

/**
 * Merge a persisted (localStorage) list with the server payload.
 *
 * The server is authoritative for which items exist and for their metadata,
 * because localStorage can hold content from an older visit — including the
 * retired seed data. Persisted entries are kept only to fill in fields the
 * payload deliberately omits, such as the body of an article the reader is not
 * currently on.
 */
export function mergeWithSsr<T extends Record<string, any>>(
  ssr: T[] | undefined,
  persisted: T[] | undefined,
  key: (item: T) => string,
  fillable: (keyof T)[],
): T[] | undefined {
  if (!ssr) return persisted;
  if (!persisted?.length) return ssr;

  const byKey = new Map(persisted.map((item) => [key(item), item]));
  return ssr.map((item) => {
    const old = byKey.get(key(item));
    if (!old) return item;
    const filled = { ...item };
    for (const field of fillable) {
      const current = filled[field];
      const isEmpty =
        current == null ||
        (typeof current === "string" && !current) ||
        (Array.isArray(current) && current.length === 0);
      if (isEmpty && old[field] != null) filled[field] = old[field];
    }
    return filled;
  });
}
