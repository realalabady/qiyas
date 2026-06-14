# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # tsc -b (typecheck all projects) then vite build — build fails on type errors
npm run lint     # ESLint (flat config, eslint.config.js)
npm run preview  # serve the production build
```

There is no test runner configured. `npm run build` is the de facto correctness gate because it runs `tsc -b` first.

Path alias: `@/` → `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`). Always import internal modules via `@/...`.

## Environment

Copy `.env.example` to `.env.local` and fill the `VITE_FIREBASE_*` keys (project `qiyas-5da06`). `src/config/env.ts` validates the six required keys at runtime and throws a descriptive error listing the missing ones; `isFirebaseConfigured` is exported for guarding. `VITE_FIREBASE_MEASUREMENT_ID` is optional.

## Architecture

Single-page React 19 + TypeScript app (Vite, TailwindCSS v4, shadcn/ui components in `src/components/ui`). Arabic/English bilingual with RTL. Deployed on Vercel (`vercel.json` rewrites everything to `/index.html` for client-side routing).

### Data layer — this is the most important thing to understand

Despite the Firestore rules (`firestore.rules`) and `ADMIN_SETUP.md` describing Firestore collections, **the application data does not live in Firestore**. All content (quizzes, articles, categories, theme, analytics, quiz attempts) is held in **Zustand stores that persist to `localStorage`** (`src/stores/*`), seeded from hardcoded data in `src/data/seed-*.ts`. The admin panel edits these localStorage-backed stores. When changing data behavior, work in the relevant store — do not assume reads/writes hit Firebase.

**Firebase is used only for admin authentication.** `src/contexts/admin-context.tsx` wraps the app, watches `onAuthStateChanged`, and on login checks `isAdminUid` (`src/lib/firebase/admins.ts`) which reads the `admins/{uid}` Firestore doc and requires `isActive`. `src/lib/firebase/services.ts` lazily creates singleton Auth/Firestore/Storage instances via `getFirebaseApp()`. The Firestore rules and admin-setup docs describe an intended/partial backend, not the current source of truth.

Each store follows the same pattern: `create(persist(...))` with a versioned `name` key (e.g. `qiyas-quizzes-admin-v1`), a `partialize` to choose persisted fields, and frequently a `merge` that runs persisted data through a `normalize*` function so older/partial localStorage shapes are repaired on load. Follow this pattern when adding stores or fields — bump the store `name` or extend the normalizer rather than assuming clean data.

### Quiz engine

`src/lib/quiz-engine.ts` is a standalone `QuizEngine` class (no React/store dependency) supporting four `QuizType`s: `weighted_personality` (default), `score_based`, `personality_based`, `percentage_matching`. You feed it a `QuizConfig` and `userAnswers`, call `calculateResult()`, and it dispatches to the matching private calculator. Note the engine's `Question`/`Answer`/`Result` interfaces are similar to but **separate from** the admin store's interfaces in `src/stores/quizzes-admin-store.ts` (the store adds a `QuestionType` discriminator and quiz metadata like `slug`, `seoTitle`, `published`). Keep both in sync when changing the data shape.

### Routing

`src/app/router.tsx` defines a `createBrowserRouter` with two layout trees:
- `/` → `PublicLayout` (home, explore, categories, search, `quiz/:slug`, `quiz/:slug/take`, `quiz/:slug/result/:resultId`, articles, static pages).
- `/admin` → `AdminLayout`. Every admin route except `/admin/login` is wrapped in `<ProtectedAdminRoute>` (`src/components/auth/protected-admin-route.tsx`), which gates on `useAdmin()`.

### i18n & theming

`src/lib/i18n.ts` is a Zustand store holding a flat `translations` map keyed `"section.key"` for `en`/`ar`, plus current `language` and `getDirection()`. `App.tsx` syncs `<html lang>`/`dir` to it. Add new UI strings to **both** language maps. `src/stores/theme-store.ts` persists admin-configurable brand colors and writes them as HSL CSS custom properties (`--primary`, `--accent`, `--ring`) onto `documentElement` via `applyTheme()`, which `App.tsx` re-runs on theme change.

## Conventions

- Files are kebab-case (`quiz-take-page.tsx`, `admin-context.tsx`).
- Pages live in `src/pages`, reusable UI primitives in `src/components/ui`, feature components grouped by domain (`src/components/quiz`, `src/components/layout`, etc.).
- `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) is the standard className combiner.
