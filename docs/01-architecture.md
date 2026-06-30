# 01 — Architecture

## Tech stack

| Concern | Choice |
|---------|--------|
| Framework | React 19 (`react`, `react-dom` ^19.2) |
| Language | TypeScript ~6.0, strict, `@/` → `src/` alias |
| Build | Vite ^8 (`npm run build` = `tsc -b && vite build`) |
| Styling | TailwindCSS v4 (`@tailwindcss/vite`), shadcn/ui primitives in `src/components/ui` |
| State | Zustand ^5 (`create` + `persist` middleware) |
| Routing | react-router-dom ^7 (`createBrowserRouter`) |
| Animation | framer-motion ^12 (shared variants in `src/lib/motion.ts`) |
| Icons | lucide-react |
| Backend | Firebase ^12 — **auth only** (+ Firestore for the `admins` doc) |
| Deploy | Vercel (`vercel.json` rewrites all → `/index.html`) |

## The single most important fact: data lives in localStorage

Despite `firestore.rules` and `ADMIN_SETUP.md` describing Firestore collections, **the app does not read/write app content from Firestore.** All quizzes, articles, categories, theme, and analytics are held in **Zustand stores persisted to `localStorage`**, seeded from `src/data/seed-*.ts`.

- The admin panel edits these localStorage-backed stores.
- Firestore is touched in exactly one place for content: `admins/{uid}` lookup during login.
- When changing data behavior, work in the relevant store — do **not** assume reads/writes hit Firebase.

### Store pattern (followed by every persisted store)

```
create(persist((set, get) => ({...}), {
  name: "qiyas-<thing>-v1",          // versioned localStorage key
  storage: createJSONStorage(() => localStorage),
  partialize: (s) => ({ <fields> }), // what gets persisted
  merge: (persisted, current) =>      // repair old/partial shapes via normalize*()
    ({ ...current, <field>: persisted?.<field>?.map(normalizeX) ?? current.<field> }),
}))
```

To add fields safely: **bump the store `name`** (e.g. `-v1` → `-v2`) or extend the `normalize*` function. Don't assume clean data on load.

## Folder layout

```
src/
  app/router.tsx              # all routes (2 layout trees + 404)
  App.tsx                     # AdminProvider + RouterProvider; syncs <html lang/dir> & theme
  main.tsx                    # React root
  config/env.ts               # validates 6 VITE_FIREBASE_* keys, exports isFirebaseConfigured
  contexts/admin-context.tsx  # auth gate (onAuthStateChanged → isAdminUid)
  layouts/                    # public-layout, admin-layout
  pages/                      # one file per route (+ some unused: see ANALYSIS)
  components/
    ui/                       # shadcn primitives (button, card, dialog, input, ...)
    layout/                   # navbar, footer, app-frame, language-switcher
    quiz/                     # quiz-card, results-display, question-editor, answer-editor, results-editor, image-upload
    ads/ad-banner.tsx         # returns null (disabled)
    auth/protected-admin-route.tsx
  data/seed-*.ts              # hardcoded seed content
  lib/
    quiz-engine.ts            # scoring engine (no React)
    quiz-validation.ts        # validateQuizConfig, normalizeSlug, getResultOptions
    i18n.ts                   # translations + useLanguage store
    seo.ts                    # meta tag / JSON-LD helpers
    motion.ts                 # framer-motion variants
    utils.ts                  # cn() = clsx + tailwind-merge
    firebase/{app,services,admins}.ts
  stores/                     # zustand stores (see 02)
```

## Environment

- Copy `.env.example` → `.env.local`, fill `VITE_FIREBASE_*` (project `qiyas-5da06`).
- `src/config/env.ts` validates the 6 required keys at runtime and throws listing missing ones; `VITE_FIREBASE_MEASUREMENT_ID` optional.
- `isFirebaseConfigured` exported for guarding (note: **currently not used to guard** — see ANALYSIS).

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # tsc -b (typecheck) then vite build — fails on type errors
npm run lint     # ESLint flat config
npm run preview  # serve production build
```

No test runner is configured. `npm run build` is the de-facto correctness gate.

## Render/boot sequence

1. `main.tsx` mounts `<App/>`.
2. `App.tsx` wraps everything in `<AdminProvider>` (starts `onAuthStateChanged`) and renders `<RouterProvider>`.
3. Two `useEffect`s sync `<html lang>`/`dir` from i18n and apply theme CSS vars.
4. Stores hydrate from localStorage lazily on first `use*` call, running their `merge`/`normalize`.
