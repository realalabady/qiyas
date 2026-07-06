/**
 * Maps a quiz's English `category` string to a translated label.
 *
 * Quizzes store their category as a canonical English string (it doubles as a
 * linkage key). This helper resolves that string to the matching `categories.*`
 * i18n entry so category chips/badges render in the active language without any
 * admin data entry. Unknown categories fall back to the raw string.
 */

const CATEGORY_KEY: Record<string, string> = {
  Personality: "categories.personality",
  "Personality Tests": "categories.personality",
  "IQ Tests": "categories.iq",
  IQ: "categories.iq",
  "Mental Age": "categories.mental-age",
  "Mental Age Tests": "categories.mental-age",
  Career: "categories.career",
  "Career Tests": "categories.career",
  Relationship: "categories.relationship",
  "Relationship Tests": "categories.relationship",
  Friendship: "categories.friendship",
  "Friendship Tests": "categories.friendship",
  Stress: "categories.stress",
  "Stress Tests": "categories.stress",
  Memory: "categories.memory",
  "Memory Tests": "categories.memory",
  Entertainment: "categories.entertainment",
  "Entertainment Quizzes": "categories.entertainment",
  Anime: "categories.anime",
  "Anime Quizzes": "categories.anime",
  "Color Personality": "categories.color",
  "Color Personality Tests": "categories.color",
  "General Knowledge": "categories.knowledge",
  Knowledge: "categories.knowledge",
};

/**
 * Translate a canonical (English) quiz-category string using the i18n map.
 * Returns the raw name unchanged if it isn't a known category.
 */
export function categoryLabel(
  name: string,
  t: (key: string) => string,
): string {
  const key = CATEGORY_KEY[name?.trim()];
  return key ? t(key) : name;
}
