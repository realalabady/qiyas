# 02 — Data Layer & Stores

All app content is in Zustand stores. Most persist to `localStorage`. Seed data is hardcoded in `src/data/seed-*.ts`.

## Store summary

| Store (file) | localStorage key | Persisted? | Seeded from | Purpose |
|--------------|------------------|-----------|-------------|---------|
| `quizzes-admin-store.ts` (`useQuizzesAdmin`) | `qiyas-quizzes-admin-v1` | yes (`quizzes`) | 4 engine quizzes + `QUIZZES` | **Canonical quiz data + CRUD + type defs** |
| `articles-store.ts` (`useArticles`) | `qiyas-articles-v1` | yes (`articles`) | `SAMPLE_ARTICLES` | Blog/articles CRUD + filtering |
| `categories-store.ts` (`useCategories`) | `qiyas-categories-v1` | yes (`categories`) | **empty `[]`** | Admin-managed categories |
| `theme-store.ts` (`useTheme`) | `theme-settings` | yes (whole) | `DEFAULT_THEME` | Brand colors → CSS vars |
| `quiz-store.ts` (`useQuizStore`) | `quiz-storage` | yes (whole) | — | **Legacy/older** quiz session state (slug, answers, result emoji). Largely superseded by quiz-take-store. |
| `quiz-take-store.ts` (`useQuizTakeStore`) | — | **NO** (in-memory) | — | **Live quiz session**: engine instance, current index, answers, result |
| `analytics-store.ts` (`useAnalyticsStore`) | partial (writes raw `quiz_completions` key manually) | mixed | — | Completion tracking + computed analytics |

> ⚠️ There are **two** quiz-session stores (`quiz-store` and `quiz-take-store`) and **two** quiz-type definitions (engine vs admin store). See ANALYSIS for the duplication.

## `useQuizzesAdmin` — the canonical store

Defines the app's core types (note: separate from but parallel to the engine's types in `quiz-engine.ts`):

```ts
type QuestionType = "personality" | "scored" | "image-choice" | "multiple-select";
interface Answer  { id; text; image?; weights?: Record<string,number>; score?; resultId? }
interface Question{ id; text; description?; type: QuestionType; image?; answers: Answer[] }
interface Result  { id; title; description; image?; strengths?; weaknesses?; careers?; personality? }
interface Quiz    { id; title; slug; description; category; thumbnail; seoTitle; seoDescription;
                    quizType: QuizType; questions: Question[]; results: Result[]; published; createdAt; updatedAt }
```

CRUD: `addQuiz`, `updateQuiz`, `deleteQuiz`, `duplicateQuiz` (slug `-copy`, title `(Copy)`, unpublished).
Queries: `getQuizBySlug`, `getPublishedQuizzes`, `getQuizzesByCategory`.
Publishing: `publishQuiz`/`unpublishQuiz`.

`seedQuizzes()` = `[PERSONALITY_QUIZ, IQ_QUIZ, CAREER_QUIZ, COMPATIBILITY_QUIZ, ...QUIZZES]`.
**The `...QUIZZES` entries are mapped with `questions: []`, `results: []`, `published: false`** — they exist as drafts only and can't be played until edited. `normalizeQuiz` repairs persisted shapes and defaults `quizType` to `weighted_personality`.

## `useQuizTakeStore` — live session (in-memory only)

Holds `quizConfig`, an `engine: QuizEngine`, `currentQuestionIndex`, `userAnswers`, `result`.
Actions: `loadQuiz(config)`, `answerQuestion(qid, aid)` (also forwards to engine), `nextQuestion`/`previousQuestion`/`goToQuestion`, `calculateResult()`, `resetQuiz()`.
Queries: `getCurrentQuestion`, `getProgress`, `canGoNext`, `canGoPrevious`.
Because it's not persisted, a page refresh mid-quiz loses progress (the take page re-loads from the admin store on mount).

## `useAnalyticsStore`

- `recordCompletion(c)` pushes a `QuizCompletion`, recomputes analytics, **and also manually writes to a separate raw `quiz_completions` localStorage key** (parallel storage), plus `console.log`s.
- `calculateAnalytics(quizId)` computes per-quiz metrics — but contains **mock/placeholder math**: `views = completions*3`, `starts = completions*2`, `abandonRate = 0.35` hardcoded, `quizTitle = "Quiz Title" // TODO`.
- Global getters: `getTotalCompletions`, `getTotalUniqueUsers` (by userAgent), `getMostPopularQuiz`, `getTopResults`, `exportAnalytics`.
- `quizAnalytics` is a `Map` held in store state (Maps don't serialize via JSON.persist — fine here since this store isn't persisted, but a known footgun if persistence is added).

## `useArticles`

`Article` shape in `src/data/seed-articles.ts`. CRUD + `getFilteredArticles` (search title/excerpt + category + published), `getArticleBySlug`, `getArticlesByCategory`, `getTrendingArticles(limit)` (by `views`). `normalizeArticle` repairs persisted shapes.

## `useCategories`

`Category { id; name; slug; icon(emoji); description; color; createdAt }`. **Seeds empty** — so the homepage "Browse by Category" section and category chips are empty until an admin creates categories. (Note `seed-quizzes.ts` exports a richer `CATEGORIES` constant that is **not** wired into this store.)

## `useTheme`

`ThemeSettings { primaryColor; accentColor; logo; favicon }`, default fuchsia/violet. `applyTheme()` converts hex→HSL and sets `--primary`, `--ring`, `--accent` on `documentElement`; updates favicon link if set.

## Seed data files

| File | Exports | Notes |
|------|---------|-------|
| `seed-engine-quizzes.ts` | `PERSONALITY_QUIZ`, `IQ_QUIZ`, `CAREER_QUIZ`, `COMPATIBILITY_QUIZ` | Fully-populated, **published** quizzes demonstrating each engine type |
| `seed-quizzes.ts` | `CATEGORIES`, `QUIZZES` (`QuizCardData[]`) | Card metadata only (no questions); `CATEGORIES` here is unused by the categories store |
| `seed-questions.ts` | question banks (~1061 lines) | Large hardcoded question sets |
| `seed-articles.ts` | `SAMPLE_ARTICLES` | MBTI/IQ/etc. article content |

## Estimated-minutes convention

Everywhere a quiz duration is shown: `Math.ceil(questions.length / 2) || 5`. There is no per-quiz duration field.
