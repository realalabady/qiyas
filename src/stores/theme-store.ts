import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  logo: string | null;
  favicon: string | null;
}

const DEFAULT_THEME: ThemeSettings = {
  primaryColor: "#ec4899", // fuchsia-500
  accentColor: "#7c3aed", // violet-600
  logo: null,
  favicon: null,
};

interface ThemeStore {
  theme: ThemeSettings;
  updateTheme: (settings: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
  applyTheme: () => void;
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: DEFAULT_THEME,

      updateTheme: (settings) => {
        set((state) => ({
          theme: { ...state.theme, ...settings },
        }));
        get().applyTheme();
      },

      resetTheme: () => {
        set({ theme: DEFAULT_THEME });
        get().applyTheme();
      },

      applyTheme: () => {
        const { theme } = get();
        const root = document.documentElement;

        // Convert hex to RGB for CSS variables
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result
            ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
            : "236 72 153"; // fallback to fuchsia-500
        };

        root.style.setProperty("--color-primary", hexToRgb(theme.primaryColor));
        root.style.setProperty("--color-accent", hexToRgb(theme.accentColor));

        // Update logo if exists
        if (theme.logo) {
          const logoImg = document.querySelector(
            'header img[alt="logo"]',
          ) as HTMLImageElement;
          if (logoImg) logoImg.src = theme.logo;
        }

        // Update favicon if exists
        if (theme.favicon) {
          const favicon = document.querySelector(
            'link[rel="icon"]',
          ) as HTMLLinkElement;
          if (favicon) favicon.href = theme.favicon;
        }
      },
    }),
    {
      name: "theme-settings",
    },
  ),
);
