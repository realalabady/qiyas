/**
 * Article attribution — PURE DATA, no imports, no side effects.
 *
 * Shared by the React pages and the SSR renderer in `api/`.
 *
 * Every article in Firestore is bylined "Admin", which is not a name and gives
 * a reader no way to judge who stands behind psychology and IQ content. Rather
 * than invent a person with credentials nobody holds, articles are attributed
 * to the editorial team, and `/editorial-policy` explains publicly how the
 * content is written, reviewed and corrected. Replace the display name below
 * with a real author once individual bylines are assigned in the admin panel.
 */

export const EDITORIAL_TEAM = {
  ar: "فريق تحرير المعرفة",
  en: "Al-Maarefah Editorial Team",
} as const;

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
