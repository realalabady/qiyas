/**
 * Legacy → descriptive slug map. PURE DATA, no imports.
 *
 * Much of the published content carries placeholder slugs left over from the
 * admin panel — `/quiz/0-copy` (reads as a duplicated draft), and numeric ones
 * like `/articles/43243`. Two article slugs contain literal spaces. These are
 * exactly the "low-effort / test page" signals a reviewer notices.
 *
 * Renaming happens in Firestore via `scripts/migrate-slugs.mjs` (it needs admin
 * credentials). This map is the single source of truth for that script AND for
 * the 301 redirects in `api/render.ts`, so old URLs keep working and their
 * ranking transfers to the new ones.
 *
 * IMPORTANT: entries are removed from this map only once the old URLs have
 * dropped out of Google's index — the redirect is what preserves them.
 */

export const QUIZ_SLUG_MIGRATIONS: Record<string, string> = {
  "011": "اختبار-مستوى-الذكاء",
  "1": "العمر-العاطفي-لشخصيتك",
  "11": "هل-تعاني-من-القلق",
  "111": "ما-لغة-الحب-الخاصة-بك",
  "2": "ما-يستنزف-طاقتك-النفسية",
  "3": "ما-نسبة-العناد-لديك",
  "0-copy": "جاهزيتك-لسوق-العمل",
  "4": "مم-تتكون-شخصيتك",
  "5": "كم-مرة-يخدعك-عقلك",
  "222": "اللون-الذي-يكشف-اسرار-شخصيتك",
  "55": "هل-تصلح-لتكون-مهندسا",
  "77": "الحيوان-الذي-يشبه-شخصيتك",
  "4884": "اي-لون-يعكس-شخصيتك",
};

export const ARTICLE_SLUG_MIGRATIONS: Record<string, string> = {
  "001": "كيف-تختار-الاختبار-المناسب-لك",
  "002": "كيف-تؤثر-شخصيتك-على-قراراتك-اليومية",
  "003": "ما-هو-اختبار-الذكاء-وكيف-يقاس",
  "004": "كيف-تعمل-اختبارات-الذكاء",
  // Two articles shared "005"; the migration keeps this one on the slug and
  // derives a new one for the other from its title.
  "005": "كيف-تختار-المهنة-المناسبة-لك",
  "006": "اكثر-الوظائف-طلبا-في-المستقبل",
  "007": "اهمية-النوم-الجيد-وتاثيره-على-الصحة",
  "008": "كيف-تبني-روتينا-صباحيا-مناسبا",
  "009": "تمارين-لتقوية-العقل-والذكاء",
  "010": "اعلى-الاشخاص-في-معدل-الذكاء",
  "011": "كيف-تعيش-حياة-صحية-ومتوازنة",
  "012": "كيف-تتكون-الشخصية",
  "88": "كيف-تتعامل-مع-الطفل-العصبي",
  "99": "كيف-تتعامل-مع-الغضب",
  "01": "كيف-تقول-لا-دون-الشعور-بالذنب",
  "98": "تاثير-السوشال-ميديا-على-حياتنا",
  "67": "اسباب-فقدان-الشغف-وكيف-تستعيده",
  "445": "القلق-اسبابه-واعراضه-وكيفية-التعامل-معه",
  "33": "كيف-تتخلص-من-الشعور-بالوحدة",
  "8434": "كيف-تسامح-نفسك-بعد-الخطا",
  "474": "الفرق-بين-الحب-والتعلق-والاعجاب",
  "43243": "لماذا-نتعلق-باشخاص-لا-يناسبوننا",
  // Slugs containing literal spaces — these produce URLs with %20 in them.
  "5-حقائق مفاجئة-حول-اختبارات الذكاء": "خمس-حقائق-حول-اختبارات-الذكاء",
  "اختبارات التوافق الوظيفي لعلم النفس": "اختبارات-التوافق-الوظيفي",
};

/** The destination slug for a legacy one, or undefined if it is not legacy. */
export function migratedSlug(
  type: "quiz" | "article",
  slug: string,
): string | undefined {
  const map =
    type === "quiz" ? QUIZ_SLUG_MIGRATIONS : ARTICLE_SLUG_MIGRATIONS;
  return map[slug];
}
