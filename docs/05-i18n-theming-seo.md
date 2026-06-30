# 05 — i18n, Theming & SEO

## i18n — `src/lib/i18n.ts`

- `useLanguage` Zustand store: `{ language, t(key), setLanguage(lang), getDirection() }`.
- `translations: Record<"en"|"ar", Record<string,string>>` — a **flat map keyed `"section.key"`** (e.g. `"nav.home"`, `"admin.settings.save_changes"`). ~250 keys per language.
- `t(key)` falls back: current language → English → the raw key string.
- Language persisted to `localStorage["language"]` (separate from the zustand stores; defaults to `"en"`).
- `setLanguage` writes localStorage **and** directly sets `document.documentElement.lang`/`dir`. `App.tsx` also syncs `<html lang/dir>` via effect.
- **RTL**: `getDirection()` returns `"rtl"` for Arabic.

### When adding UI strings

Add the key to **both** `en` and `ar` maps. Missing AR keys silently fall back to EN. (There's no tooling to detect missing keys — see ANALYSIS.)

### Localization gaps to know

- Several pages hardcode English (e.g. `quiz-take-page.tsx` "Quiz Setup Incomplete", "Previous/Next/Submit"; `quiz-result-page.tsx` "Quiz Complete!", share labels; admin-quizzes form labels). Only some pages fully use `t()`.
- AR-specific quiz title/description override exists only for the single slug `dark-personality-test`.

## Theming — `src/stores/theme-store.ts`

- `ThemeSettings { primaryColor, accentColor, logo, favicon }`; default `#ec4899` / `#7c3aed`.
- `applyTheme()` converts hex → HSL string (`"H S% L%"`) and sets CSS custom properties on `documentElement`: `--primary`, `--ring` (= primary), `--accent`. Falls back to a violet HSL if hex is malformed.
- Favicon: if `theme.favicon` set, updates `link[rel="icon"].href`. **Logo is stored but `applyTheme` does not apply it** to any element (consumers read `theme.logo` directly).
- `App.tsx` re-runs `applyTheme()` when `primaryColor/accentColor/logo/favicon` change.
- Persisted under localStorage key `theme-settings` (whole object).

### CSS variables

Brand colors flow through `--primary`/`--accent`/`--ring` consumed by Tailwind theme + shadcn components. Base tokens live in `src/index.css`. `gradient-text` / `glass-card` are custom utility classes used throughout.

## SEO — `src/lib/seo.ts`

Client-side meta management (SPA — no SSR):

- `setSEOMetadata({ title, description, keywords?, ogImage?, ogUrl?, twitterHandle?, author?, canonical? })` — imperatively creates/updates `<meta>`/`<link>` tags (title, OG, Twitter, canonical).
- `getStructuredData("Quiz"|"FAQPage"|"Organization")` — returns JSON-LD objects (Organization has real data; Quiz is a generic placeholder).
- `addStructuredData(obj)` — appends a `<script type="application/ld+json">`.
- `generateSitemap(routes)` — builds sitemap XML (helper; not wired to a build step).

### SEO limitations (SPA)

- Meta tags are set **at runtime in the browser**, so crawlers that don't execute JS see only `index.html`'s static head. Real social-share previews / SEO would need SSR or prerendering. Only `quiz-detail-page` currently calls `setSEOMetadata`.

## Motion — `src/lib/motion.ts`

Shared framer-motion `Variants`: `fadeIn`, `fadeUp`, `fadeDown`, `scaleIn`, `slideInLeft/Right`, `staggerContainer`/`staggerItem`, `pageTransition`, plus `tapScale`/`hoverLift` constants. Use these instead of inline variants for consistency.
