# 04 — Routing & Pages

## Router (`src/app/router.tsx`) — `createBrowserRouter`

### Public tree (`/` → `PublicLayout`: Navbar + `<Outlet>` + Footer, skip-link)

| Path | Page file | Notes |
|------|-----------|-------|
| `/` (index) | `home-page.tsx` | Hero, trending/popular (first 6 published quizzes), categories (only if non-empty), CTA |
| `/explore` | `explore-page.tsx` | Search + category chips + sort; reads `?q/?category/?sort`; categories derived from published quizzes |
| `/categories` | `categories-page.tsx` | Category grid |
| `/search` | `search-page.tsx` | Search UI |
| `/quiz/:slug` | `quiz-detail-page.tsx` | Quiz landing page |
| `/quiz/:slug/take` | `quiz-take-page.tsx` | The quiz player |
| `/quiz/:slug/result/:resultId` | `quiz-result-page.tsx` | Result + share (needs `location.state`) |
| `/about`,`/contact`,`/faq`,`/privacy-policy`,`/terms` | static pages | i18n content |
| `/articles`,`/articles/:slug` | `articles-page.tsx`,`article-detail-page.tsx` | Blog |
| `*` | `not-found-page.tsx` | 404 |

### Admin tree (`/admin` → `AdminLayout`: sidebar nav + header)

| Path | Page file | Protected? |
|------|-----------|-----------|
| `/admin/login` | `admin-login-page.tsx` | no |
| `/admin` (index) | `admin-dashboard-page.tsx` | `<ProtectedAdminRoute>` |
| `/admin/quizzes` | `admin-quizzes-page.tsx` | yes |
| `/admin/categories` | `admin-categories-page.tsx` | yes |
| `/admin/media` | `admin-media-page.tsx` | yes |
| `/admin/settings` | `admin-settings-page.tsx` | yes |
| `/admin/articles` | `admin-articles-page.tsx` | yes |

`ProtectedAdminRoute`: shows spinner while `isLoading`; redirects to `/admin/login` (with `state.from`) if `!user || !isAdmin`.

## Notable page behaviors

- **`admin-quizzes-page.tsx`** (584 lines) — the big one. Full create/edit form: title, slug (`normalizeSlug` on change), description, category (hardcoded `CATEGORIES` list — *different strings* than other category sources), quiz type, thumbnail (`ImageUpload`), SEO fields, `QuestionEditor`, `ResultsEditor`, publish checkbox. Live `validateQuizConfig`; blocks publish when invalid; duplicate-slug guard; `confirm()` on delete; ephemeral notification banner.
- **`admin-dashboard-page.tsx`** — real stats from stores (total/published quizzes, total completions, distinct categories) + quick-action links. Quick actions list has no "Analytics" or "Articles" tile but admin nav does.
- **`home-page.tsx`** — `SAMPLE_QUIZZES` = first 6 published quizzes mapped to `QuizCardData`. Categories section hidden when `useCategories` is empty (which is the default seed state).
- **`explore-page.tsx`** — sort options "trending"/"popular"/"newest"/"fastest" but **trending and popular both sort by `questions.length`** (identical). Category slug derived as `cat.toLowerCase().replace(/\s+/g,"-")`.

## Dead / unused / empty files (see ANALYSIS)

- `src/pages/admin-analytics-page.tsx` — fully built with **hardcoded fake numbers**, but **not referenced in the router** and no nav link → dead.
- `src/pages/admin-media-library-page.tsx` — **0 bytes / empty**.
- `src/pages/placeholder-page.tsx` — generic placeholder, not routed.
- `src/stores/quiz-store.ts` — older session store, superseded by `quiz-take-store.ts`.

## Layout components

- `layouts/public-layout.tsx` — `min-h-screen flex flex-col`, fixed navbar offset `pt-16`, a11y skip link.
- `layouts/admin-layout.tsx` — `AppFrame` + sidebar (`adminLinks`) + mobile horizontal nav + "Go Home" + `LanguageSwitcher`. **No logout button rendered here** (logout exists in context but isn't surfaced in this layout).
- `components/layout/{navbar,footer,app-frame,language-switcher}.tsx`.
- `components/quiz/{quiz-card,results-display,question-editor,answer-editor,results-editor,image-upload}.tsx`.
- `components/ads/ad-banner.tsx` — returns `null` (AdSense disabled).
