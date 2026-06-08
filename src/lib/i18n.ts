/**
 * i18n configuration for Arabic/English support with RTL.
 */

import { create } from "zustand";

export type Language = "en" | "ar";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.explore": "Explore",
    "nav.categories": "Categories",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.articles": "Articles",

    // Hero
    "hero.badge": "100% Free · No Registration Required",
    "hero.title": "Discover Who You Really Are",
    "hero.subtitle":
      "Viral personality quizzes, IQ tests, and career assessments — take any quiz instantly and share your results with friends.",
    "hero.cta_explore": "Explore Quizzes",
    "hero.cta_create": "Create Your Quiz",

    // Buttons
    "btn.start": "Start Quiz",
    "btn.next": "Next",
    "btn.previous": "Previous",
    "btn.submit": "Submit",
    "btn.share": "Share",
    "btn.download": "Download",
    "btn.copy": "Copy",
    "btn.view_all": "View All",

    // Quiz
    "quiz.trending": "Trending Quizzes",
    "quiz.popular": "Popular Quizzes",
    "quiz.new": "New Quizzes",
    "quiz.featured": "Featured Quizzes",
    "quiz.related": "Related Quizzes",
    "quiz.suggested": "Try Another Quiz",

    // Admin
    "admin.dashboard": "Admin Dashboard",
    "admin.login": "Admin Login",
    "admin.logout": "Logout",
    "admin.quizzes": "Manage Quizzes",
    "admin.categories": "Categories",
    "admin.media": "Media Library",
    "admin.analytics": "Analytics",
    "admin.articles": "Manage Articles",
    "admin.settings": "Settings",

    // Articles
    "articles.title": "Articles",
    "articles.latest": "Latest Articles",
    "articles.read_more": "Read More",
    "articles.published": "Published",

    // Settings
    "settings.theme": "Theme Settings",
    "settings.colors": "Website Colors",
    "settings.logo": "Logo",
    "settings.save": "Save Changes",

    // Footer
    "footer.company": "Company",
    "footer.product": "Product",
    "footer.legal": "Legal",
    "footer.copyright": "© 2026 Qiyas. All rights reserved.",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.explore": "استكشاف",
    "nav.categories": "الفئات",
    "nav.about": "عن",
    "nav.contact": "اتصل",
    "nav.articles": "المقالات",

    // Hero
    "hero.badge": "100% مجاني · لا يتطلب تسجيل",
    "hero.title": "اكتشف من أنت حقاً",
    "hero.subtitle":
      "اختبارات شخصية فيروسية واختبارات ذكاء وتقييمات مهنية - أجب على أي اختبار على الفور وشارك النتائج مع الأصدقاء.",
    "hero.cta_explore": "استكشف الاختبارات",
    "hero.cta_create": "أنشئ اختبارك",

    // Buttons
    "btn.start": "ابدأ الاختبار",
    "btn.next": "التالي",
    "btn.previous": "السابق",
    "btn.submit": "إرسال",
    "btn.share": "مشاركة",
    "btn.download": "تحميل",
    "btn.copy": "نسخ",
    "btn.view_all": "عرض الكل",

    // Quiz
    "quiz.trending": "الاختبارات الرائجة",
    "quiz.popular": "الاختبارات الشهيرة",
    "quiz.new": "اختبارات جديدة",
    "quiz.featured": "اختبارات مميزة",
    "quiz.related": "اختبارات ذات صلة",
    "quiz.suggested": "جرب اختبار آخر",

    // Admin
    "admin.dashboard": "لوحة تحكم المسؤول",
    "admin.login": "دخول المسؤول",
    "admin.logout": "تسجيل الخروج",
    "admin.quizzes": "إدارة الاختبارات",
    "admin.categories": "الفئات",
    "admin.media": "مكتبة الوسائط",
    "admin.analytics": "التحليلات",
    "admin.articles": "إدارة المقالات",
    "admin.settings": "الإعدادات",

    // Articles
    "articles.title": "المقالات",
    "articles.latest": "أحدث المقالات",
    "articles.read_more": "اقرأ المزيد",
    "articles.published": "منشور",

    // Settings
    "settings.theme": "إعدادات المظهر",
    "settings.colors": "ألوان الموقع",
    "settings.logo": "الشعار",
    "settings.save": "حفظ التغييرات",

    // Footer
    "footer.company": "الشركة",
    "footer.product": "المنتج",
    "footer.legal": "قانوني",
    "footer.copyright": "© 2026 Qiyas. جميع الحقوق محفوظة.",
  },
};

interface LanguageStore {
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  getDirection: () => "ltr" | "rtl";
}

export const useLanguage = create<LanguageStore>((set, get) => ({
  language: (localStorage.getItem("language") as Language) || "en",

  t: (key: string) => {
    const { language } = get();
    return translations[language][key] || translations["en"][key] || key;
  },

  setLanguage: (lang: Language) => {
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    set({ language: lang });
  },

  getDirection: () => {
    return get().language === "ar" ? "rtl" : "ltr";
  },
}));
