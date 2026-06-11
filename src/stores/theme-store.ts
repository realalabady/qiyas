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

        // Convert hex to HSL string format expected by CSS vars (e.g. "330 80% 60%")
        const hexToHsl = (hex: string) => {
          const parsed = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          if (!parsed) return "271 91% 65%";

          const r = parseInt(parsed[1], 16) / 255;
          const g = parseInt(parsed[2], 16) / 255;
          const b = parseInt(parsed[3], 16) / 255;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const l = (max + min) / 2;
          const d = max - min;

          if (d === 0) {
            return `0 0% ${Math.round(l * 100)}%`;
          }

          const s = d / (1 - Math.abs(2 * l - 1));
          let h: number;
          switch (max) {
            case r:
              h = ((g - b) / d) % 6;
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            default:
              h = (r - g) / d + 4;
          }
          h = Math.round(h * 60);
          if (h < 0) h += 360;

          return `${h} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
        };

        root.style.setProperty("--primary", hexToHsl(theme.primaryColor));
        root.style.setProperty("--ring", hexToHsl(theme.primaryColor));
        root.style.setProperty("--accent", hexToHsl(theme.accentColor));

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
