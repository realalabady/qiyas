/**
 * Article attribution — PURE DATA, no imports, no side effects.
 *
 * Shared by the React pages and the SSR renderer in `api/`.
 *
 * Every article in Firestore is bylined "Admin", which is not a name and gives
 * a reader no way to judge who stands behind psychology and IQ content.
 * Articles are attributed to the site's editor, Mohammed Al-Harbi, who reviews
 * and approves every piece before publication. `/editorial-policy` carries his
 * bio, states that drafts are AI-assisted, and says plainly that he is not a
 * licensed clinician — Google treats fabricated credentials as deception, so
 * nothing here claims expertise that is not held.
 */

export const EDITORIAL_TEAM = {
  ar: "محمد الحربي",
  en: "Mohammed Al-Harbi",
} as const;

/** Where a byline links, so readers can find out who stands behind a piece. */
export const EDITOR_PROFILE_PATH = "/editorial-policy";

/** Placeholder bylines that carry no information about who wrote the piece. */
const PLACEHOLDER_AUTHORS = new Set([
  "",
  "admin",
  "administrator",
  "al-maarefah team",
  "المشرف",
  "ادمن",
  "أدمن",
]);

/**
 * The byline to display: a real author's name when one is set, otherwise the
 * editorial team.
 */
export function displayAuthor(
  author: unknown,
  language: "ar" | "en" = "ar",
): string {
  const name = String(author ?? "").trim();
  if (!name || PLACEHOLDER_AUTHORS.has(name.toLowerCase()))
    return EDITORIAL_TEAM[language];
  return name;
}

/** True when the piece is attributed to the team rather than a named person. */
export function isTeamByline(author: unknown): boolean {
  const name = String(author ?? "").trim();
  return !name || PLACEHOLDER_AUTHORS.has(name.toLowerCase());
}
