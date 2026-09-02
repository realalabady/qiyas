/**
 * i18n configuration for Arabic/English support with RTL.
 *
 * The raw strings live in `translations.ts` (pure data, no imports) so the
 * `api/` serverless functions can server-render the same copy for crawlers.
 */

import { create } from "zustand";

import { type Language, translations } from "@/lib/translations";

export type { Language };
export { translations };

/**
 * Arabic is the canonical, indexed language of the site — the content is
 * written in Arabic and the English strings are a client-side convenience.
 * Default to Arabic so a first-time visitor (and the initial paint) matches
 * what the server rendered and what Google indexes.
 */
export const DEFAULT_LANGUAGE: Language = "ar";

interface LanguageStore {
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  getDirection: () => "ltr" | "rtl";
}

export const useLanguage = create<LanguageStore>((set, get) => ({
  language:
    (localStorage.getItem("language") as Language | null) ?? DEFAULT_LANGUAGE,

  t: (key: string) => {
    const { language } = get();
    return (
      translations[language][key] ||
      translations[DEFAULT_LANGUAGE][key] ||
      key
    );
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
