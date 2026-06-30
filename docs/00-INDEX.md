# Qiyas / Al-Maarefah — Documentation Index

> Reference docs generated from a full read of the codebase. Use these instead of re-reading every file.
> Project: bilingual (AR/EN, RTL) viral-quiz platform. React 19 + TS + Vite + Tailwind v4 + Zustand + Firebase (auth only).

## Map of docs

| File | What it covers |
|------|----------------|
| [01-architecture.md](01-architecture.md) | Big picture, tech stack, the localStorage-as-database model, folder layout, build/run |
| [02-data-layer-stores.md](02-data-layer-stores.md) | Every Zustand store, persistence keys, normalizers, seed data shapes |
| [03-quiz-engine.md](03-quiz-engine.md) | `QuizEngine` class, 4 quiz types, full take→result flow, validation |
| [04-routing-pages.md](04-routing-pages.md) | Router tree, every public + admin page, what each renders/uses |
| [05-i18n-theming-seo.md](05-i18n-theming-seo.md) | i18n store, RTL, theme store / CSS vars, SEO helpers |
| [06-auth-firebase.md](06-auth-firebase.md) | Admin auth context, Firebase singletons, Firestore rules, admin setup |
| [ANALYSIS.md](ANALYSIS.md) | Prioritized improvement plan: bugs, security, data integrity, UX, tech debt |

## 30-second mental model

- **All app content lives in `localStorage`**, seeded from `src/data/seed-*.ts`, managed by `src/stores/*`. Firestore rules/docs describe an *intended* backend that is **not** the source of truth.
- **Firebase is used only for admin login** (email/password → check `admins/{uid}.isActive` in Firestore).
- **Two router trees**: `/` (public, `PublicLayout`) and `/admin` (gated by `ProtectedAdminRoute`).
- **The quiz engine** (`src/lib/quiz-engine.ts`) is framework-agnostic and supports 4 scoring strategies.
- Most **seed quizzes have empty `questions`/`results` and `published:false`**, so only 4 engine quizzes + curated ones are actually playable.

## Key files to know

- `src/lib/quiz-engine.ts` — scoring brain
- `src/stores/quizzes-admin-store.ts` — canonical quiz data + types
- `src/stores/quiz-take-store.ts` — live quiz session (NOT persisted)
- `src/lib/i18n.ts` — flat `section.key` translation map (en/ar)
- `src/contexts/admin-context.tsx` — auth gate
- `src/app/router.tsx` — all routes
