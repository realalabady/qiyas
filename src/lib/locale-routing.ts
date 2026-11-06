/**
 * English lives at /en/… — PURE DATA, no imports, no side effects.
 *
 * Shared by the React router and the SSR renderer in `api/`.
 *
 * The site has hand-written English for most of its content, but the language
 * was only ever a localStorage preference: every page answered on one URL and
 * the renderer served `<html lang="ar">` to every crawler. Google had no
 * English URL to index, so none of that translation could ever rank. Giving
 * English its own path fixes that, and lets each page declare its counterpart
 * with hreflang.
 *
 * Arabic stays unprefixed and remains x-default: it is the canonical language
 * and the larger audience.
 */

export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ar";

/** Path segment that marks a non-default locale. "" for Arabic. */
export const localePrefix = (locale: Locale): string =>
  locale === DEFAULT_LOCALE ? "" : `/${locale}`;

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (LOCALES as readonly string[]).includes(value);

/** The locale a pathname asks for, and that path with the prefix removed. */
export function splitLocale(pathname: string): {
  locale: Locale;
  path: string;
} {
  const m = /^\/(en)(?=\/|$)(.*)$/.exec(pathname);
  if (!m) return { locale: DEFAULT_LOCALE, path: pathname || "/" };
  return { locale: m[1] as Locale, path: m[2] || "/" };
}

/** The same page in another locale. Pass an unprefixed path. */
export function pathForLocale(path: string, locale: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const prefix = localePrefix(locale);
  if (clean === "/") return prefix || "/";
  return `${prefix}${clean}`;
}

/** `ar_AR` / `en_US`, for og:locale. */
export const ogLocale = (locale: Locale): string =>
  locale === "ar" ? "ar_AR" : "en_US";

export const localeDir = (locale: Locale): "rtl" | "ltr" =>
  locale === "ar" ? "rtl" : "ltr";

/**
 * Is there real English here, or would /en/… just re-serve the Arabic?
 *
 * localizedArticle and localizedQuiz both fall back to Arabic silently, which
 * is right for the UI and wrong for indexing: an /en/ URL that renders Arabic
 * is a duplicate of the page it claims to translate. Pages that fail this test
 * are served `noindex` with their canonical pointing at the Arabic original,
 * and are left out of the sitemap.
 */
export function hasEnglishArticle(article: unknown): boolean {
  const en = (article as { i18n?: { en?: { content?: unknown; title?: unknown } } })
    ?.i18n?.en;
  return Boolean(
    en && String(en.content ?? "").trim() && String(en.title ?? "").trim(),
  );
}

export function hasEnglishQuiz(quiz: unknown): boolean {
  const en = (
    quiz as {
      i18n?: { en?: { title?: unknown; longDescription?: unknown; questions?: unknown } };
    }
  )?.i18n?.en;
  if (!en) return false;
  const hasQuestions =
    !!en.questions && Object.keys(en.questions as object).length > 0;
  return Boolean(String(en.title ?? "").trim() && hasQuestions);
}
