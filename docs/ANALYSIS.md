# ANALYSIS — Improvement Plan

Findings from a full read of the codebase, prioritized. Each item: **what**, **why it matters**, **where**, **fix**.

Severity legend: 🔴 high (bug / data loss / security) · 🟡 medium (UX / correctness) · 🟢 low (polish / tech debt).

---

## 🔴 High priority

### H1. Result page breaks on refresh / shared link
- **What:** `quiz-result-page.tsx` reads the result from `location.state`. On refresh or when a *shared* result URL is opened, `state` is null → "Result Not Found". The `:resultId` route param is never used to reconstruct the result.
- **Why:** The product's whole point is sharing results. Every shared `/quiz/:slug/result/:resultId` link is broken for the recipient.
- **Fix:** Persist the last result (per slug) to localStorage on completion, and on the result page, if `state` is missing, look up the quiz + result by `slug`/`resultId` and render a generic view. At minimum, recompute `primaryResult` from `quiz.results.find(r => r.id === resultId)`.

### H2. Selected answer not restored when navigating Previous
- **What:** In `quiz-take-page.tsx`, `selectedAnswerId` is local state reset to `null` on Next/Previous. Going back shows the previous question with **no answer highlighted**, and Next is disabled until you re-click — even though the answer is already recorded in the store.
- **Why:** Confusing UX; users think their answer was lost.
- **Fix:** Derive selection from `quizTakeStore.userAnswers[currentQuestion.id]`; compute `isAnswered` from the store.

### H3. `multiple-select` questions can't actually multi-select
- **What:** The data model + engine support `multiple` questions (arrays of answer IDs), but the take page renders single-select only (`handleSelectAnswer` overwrites with one id). Admin can create `multiple-select` questions that don't work for players.
- **Why:** Silent feature gap → broken quizzes.
- **Fix:** Implement multi-select UI (checkbox group, store `string[]`) or remove `multiple-select` from `QuestionType` until supported.

### H4. `auth_data.json` with password hash committed to repo
- **What:** `auth_data.json` (Firebase Auth emulator export) is tracked in git and includes `passwordHash`, `salt`, email for a local admin.
- **Why:** Credential material should never be in VCS, even emulator hashes.
- **Fix:** `git rm --cached auth_data.json`, add it (and `*.local`, emulator export dirs) to `.gitignore`. Rotate the password if it was ever real.

### H5. Analytics are fake / placeholder
- **What:** `admin-analytics-page.tsx` shows entirely hardcoded numbers and **isn't even routed**. `analytics-store.calculateAnalytics` fabricates `views = completions*3`, `starts = completions*2`, `abandonRate = 0.35`, `quizTitle = "Quiz Title" // TODO`.
- **Why:** Admin sees data that looks real but is invented.
- **Fix:** Track real `views`/`starts` events (record on detail view and take-start), compute real abandon rate, look up real titles from the quiz store, and route the page (or delete it).

---

## 🟡 Medium priority

### M1. Two overlapping quiz-session stores
- `quiz-store.ts` (`useQuizStore`, persisted `quiz-storage`) and `quiz-take-store.ts` (`useQuizTakeStore`, in-memory) both model an in-progress quiz. The take flow uses the latter; the former looks orphaned.
- **Fix:** Confirm `useQuizStore` is unused and delete it, or consolidate into one persisted session store (also helps H1).

### M2. Duplicate type definitions (engine vs admin store)
- `Answer`/`Question`/`Result` exist in both `quiz-engine.ts` and `quizzes-admin-store.ts` with different `Question.type` enums, requiring manual mapping + `as any` casts in the take page.
- **Fix:** Shared base types in one module; engine + store extend them; remove the `as any` config cast.

### M3. Category data is fragmented across 3 sources
- `useCategories` store (seeds **empty**), `seed-quizzes.ts` `CATEGORIES` (rich, unused), and a hardcoded `CATEGORIES` array in `admin-quizzes-page.tsx` (different label strings). The detail page needs a 25-entry map to localize category names.
- **Why:** Mismatched strings cause filter misses ("Personality Tests" vs chip slug "personality").
- **Fix:** Single source of truth; seed the store from it; derive dropdown + chips + i18n keys from the same list.

### M4. Default homepage looks empty out of the box
- `useCategories` seeds empty → homepage "Browse by Category" and explore chips are empty until an admin creates categories. Only ~4 quizzes are published by default.
- **Fix:** Seed categories store from the canonical list; publish more seed quizzes (or generate their questions).

### M5. Store getters create new arrays each render
- `getPublishedQuizzes`/`getQuizzesByCategory` filter on every call; components call them directly in render → unnecessary re-renders; `explore-page` rebuilds `CATEGORIES` each render and lists it as a `useMemo` dep.
- **Fix:** Zustand selectors with `useShallow`, or memoize derived lists.

### M6. SEO is client-only (no SSR/prerender)
- Meta/OG tags set at runtime; crawlers/social scrapers see static `index.html`. Share previews won't show quiz-specific titles/images. Only `quiz-detail-page` sets meta.
- **Fix:** Add prerendering/SSG for quiz + static pages; centralize a `<SEO>` component used by every page.

### M7. Download-result feature is a stub
- `handleDownloadResult` only `console.log`s despite `html2canvas` being installed.
- **Fix:** Implement `html2canvas(#result-card)` → PNG download, or remove the button + dependency.

### M8. No logout button in admin UI
- `logout()` exists in `admin-context` but `admin-layout.tsx` renders no logout control.
- **Fix:** Add a logout button to the admin header.

### M9. `confirm()`/`alert()` for destructive actions
- Native `confirm()` used for delete and quiz-exit — inconsistent with the custom UI and untranslated.
- **Fix:** Use the existing shadcn `dialog`; localize.

---

## 🟢 Low priority / tech debt

- **G1. Dead files:** `admin-analytics-page.tsx` (unrouted), `admin-media-library-page.tsx` (empty 0 bytes), `placeholder-page.tsx` (unrouted), possibly `quiz-store.ts`. Remove or wire up.
- **G2. Explore "trending" vs "popular" sort identical** (both by question count). Use real metrics (completions) once tracked.
- **G3. `console.log` in production paths** (analytics completion log, download stub). Strip or gate behind a debug flag.
- **G4. `isFirebaseConfigured` exported but never used to guard** — app throws at first auth use if env missing instead of degrading. Guard admin routes / show a setup message.
- **G5. No i18n key-coverage check** — missing AR keys silently fall back to EN. Add a dev-time assertion/test that both maps share the same key set.
- **G6. Hardcoded English strings** in take/result/admin pages bypass i18n. Route them through `t()`.
- **G7. No tests at all.** Add Vitest unit tests for `quiz-engine` (4 strategies, edge cases) and `quiz-validation` — pure and high-value.
- **G8. `as any` / `as unknown as any[]` casts** in `seedQuizzes` and take page. Tighten types (ties to M2).
- **G9. Analytics dual storage** — store pushes to its own state AND manually writes a separate `quiz_completions` localStorage key. Pick one (persist via middleware) to avoid drift.
- **G10. `estimatedMinutes` always `ceil(questions/2)`** — add a real per-quiz duration/difficulty field (detail page already mocks `difficulty`).
- **G11. Accessibility:** the selection radio is a styled `<div>` — use real radio semantics / `aria-checked`; ensure focus-visible states on custom controls.

---

## Suggested sequencing

1. **Ship-blockers for the "viral share" promise:** H1, H2, H3 (play + share loop must work end-to-end).
2. **Trust & safety:** H4 (remove committed creds), H5 (stop showing fake data).
3. **Data model cleanup:** M1, M2, M3 (one session store, shared types, one category source).
4. **Polish & growth:** M6 SEO/prerender, M7 download, M4 default content, then the 🟢 list.

## Quick wins (low effort, real value)
- Delete dead files (G1), add logout button (M8), implement download (M7), strip console logs (G3), gitignore `auth_data.json` (H4), add engine/validation unit tests (G7).
