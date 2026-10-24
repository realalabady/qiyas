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


/**
 * Consolidation map, October 2026.
 *
 * The second AdSense rejection pointed at Google's helpful-content rubric,
 * which asks whether content is "substantial, complete, or comprehensive" and
 * warns against work that is "mass-produced ... so that individual pages don't
 * get as much attention or care". Thirty-four articles of ~525 words each were
 * both: several competed with each other on one topic, and none went deep.
 *
 * They were merged into fourteen comprehensive, sourced pieces. The twenty
 * absorbed articles are unpublished and 301 here, so their content survives
 * inside the merged piece and their links keep working.
 */
export const ARTICLE_MERGES: Record<string, string> = {
  // five IQ articles -> one guide
  "كيف-تعمل-اختبارات-الذكاء": "ما-هو-اختبار-الذكاء-وكيف-يقاس",
  "خمس-حقائق-حول-اختبارات-الذكاء": "ما-هو-اختبار-الذكاء-وكيف-يقاس",
  "تمارين-لتقوية-العقل-والذكاء": "ما-هو-اختبار-الذكاء-وكيف-يقاس",
  "اعلى-الاشخاص-في-معدل-الذكاء": "ما-هو-اختبار-الذكاء-وكيف-يقاس",

  // personality
  "فهم-شخصية-أنواع-مايرز-بريجز": "كيف-تتكون-الشخصية",
  "كيف-تختار-الاختبار-المناسب-لك": "كيف-تتكون-الشخصية",
  "كيف-تؤثر-شخصيتك-على-قراراتك-اليومية": "شخصية-قيادية",

  // anxiety
  "كيف-تتعامل-مع-نوبات-الهلع؟-خطوات-تساعدك-على-استعادة-هدوئك":
    "القلق-اسبابه-واعراضه-وكيفية-التعامل-معه",

  // rumination
  "لماذا-يصعب-علينا-نسيان-الماضي؟-وكيف-نتعلم-المضي-قدمًا؟":
    "-كيف-تتوقف-عن-التفكير-الزائد؟-دليل-عملي-لاستعادة-هدوء-عقلك",

  // anger
  "كيف-تتعامل-مع-الطفل-العصبي": "كيف-تتعامل-مع-الغضب",

  // habits & routine
  "كيف-تبني-روتينا-صباحيا-مناسبا":
    "-كيف-تبني-عادات-تدوم؟-دليل-عملي-من-علم-النفس",

  // sleep & healthy living
  "كيف-تعيش-حياة-صحية-ومتوازنة": "اهمية-النوم-الجيد-وتاثيره-على-الصحة",

  // attachment
  "لماذا-نتعلق-باشخاص-لا-يناسبوننا": "الفرق-بين-الحب-والتعلق-والاعجاب",

  // career
  "اختبارات-التوافق-الوظيفي": "كيف-تختار-المهنة-المناسبة-لك",
  "أخطاء-المقابلة-الشخصية-وكيف-تتجنبها": "كيف-تختار-المهنة-المناسبة-لك",
  "اكثر-الوظائف-طلبا-في-المستقبل": "كيف-تختار-المهنة-المناسبة-لك",

  // loneliness & motivation
  "اسباب-فقدان-الشغف-وكيف-تستعيده": "كيف-تتخلص-من-الشعور-بالوحدة",
  "تاثير-السوشال-ميديا-على-حياتنا": "كيف-تتخلص-من-الشعور-بالوحدة",

  // forgiveness
  "كيف-تسامح-نفسك-بعد-الخطا":
    "-لماذا-يصعب-علينا-مسامحة-الآخرين؟-وهل-المسامحة-تعني-نسيان-ما-حدث؟",

  // boundaries & fear of failure
  "كيف-تقول-لا-دون-الشعور-بالذنب":
    "-لماذا-نخاف-من-الفشل؟-وما-الذي-يمنعنا-من-المحاولة؟",
};

/**
 * Quizzes merged away, October 2026. The site carried two near-identical
 * colour-personality quizzes competing on one topic — the same problem the
 * article consolidation fixed.
 */
export const QUIZ_MERGES: Record<string, string> = {
  "اي-لون-يعكس-شخصيتك": "اللون-الذي-يكشف-اسرار-شخصيتك",
};

/** The destination slug for a legacy one, or undefined if it is not legacy. */
export function migratedSlug(
  type: "quiz" | "article",
  slug: string,
): string | undefined {
  if (type === "quiz") {
    const renamedQuiz = QUIZ_SLUG_MIGRATIONS[slug];
    return (
      QUIZ_MERGES[slug] ??
      (renamedQuiz ? QUIZ_MERGES[renamedQuiz] ?? renamedQuiz : undefined)
    );
  }
  // A renamed article may also have been merged away afterwards, so follow the
  // rename first and then the merge.
  const renamed = ARTICLE_SLUG_MIGRATIONS[slug];
  return ARTICLE_MERGES[slug] ?? (renamed ? ARTICLE_MERGES[renamed] ?? renamed : undefined);
}
