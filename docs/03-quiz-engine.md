# 03 — Quiz Engine, Flow & Validation

## `src/lib/quiz-engine.ts` — `QuizEngine` class

Framework-agnostic (no React/store import). You feed it a `QuizConfig`, record answers, call `calculateResult()`.

### Engine types (separate from admin-store types!)

```ts
type QuizType = "score_based" | "personality_based" | "weighted_personality" | "percentage_matching";
interface Answer  { id; text; weights?: Record<string,number>; score?; resultId? }
interface Question{ id; text; description?; image?; answers: Answer[]; type?: "single"|"multiple" }
interface Result  { id; title; description; image?; strengths?; weaknesses?; careers?; percentage?; personality? }
interface QuizConfig { id; type; title; description; questions; results }
interface QuizResult { primaryResult; allResults; scores; percentages; quizId; completedAt }
```

> The admin store's `Question.type` is `QuestionType` (`personality|scored|image-choice|multiple-select`), while the engine's `Question.type` is `single|multiple`. The take page maps between them. Keep both in sync when changing shapes.

### The four scoring strategies

`calculateResult()` switches on `config.type` (default `weighted_personality`):

1. **`weighted_personality`** (default) — sums `answer.weights[resultId]` across all answers → percentages = each score / **total** of all scores. Best for trait-mix personality quizzes.
2. **`percentage_matching`** — same weight accumulation, but percentages = each score / **max** score (so the top result is 100%). "Match %" framing.
3. **`personality_based`** — counts how often each `answer.resultId` is chosen; highest count wins; percentages = count/total answers.
4. **`score_based`** — sums numeric `answer.score`; maps total to a result. If no explicit ranges, evenly buckets `normalized = total/maxPossible` across the results array.

### Robustness already built in

- `accumulateWeightedScores` ignores weights pointing to unknown result IDs and non-finite numbers.
- `mapScoreToResult` throws if zero results; handles single-result and zero-max cases.
- Progress helpers: `getProgress`, `getAnsweredCount`, `isComplete`.

## Take → Result flow

### `quiz-take-page.tsx` (`QuizTakePage`, route `quiz/:slug/take`)

1. `getQuizBySlug(slug)`; if missing → `navigate("/not-found")`.
2. `validateQuizConfig(quiz)` — if invalid, render "Quiz Setup Incomplete" screen (no questions/results mapping).
3. On mount (if config not loaded for this quiz): map admin questions → engine questions (translate `QuestionType` → `single|multiple`), build `QuizConfig`, call `quizTakeStore.loadQuiz`.
4. One question per screen; selecting an answer calls `quizTakeStore.answerQuestion`.
5. **Next/Submit**: on last question, compute `timeSpent`, `calculateResult()`, `analyticsStore.recordCompletion({... source:"direct"})`, then `navigate('/quiz/:slug/result/:resultId', { state: { result, timeSpent } })`.
6. Back button uses `confirm()` and resets the take store.

### `quiz-result-page.tsx` (`QuizResultPage`, route `quiz/:slug/result/:resultId`)

- Reads `result`/`timeSpent` from `location.state`. **If you deep-link/refresh the result URL, `location.state` is null → "Result Not Found"** (the `:resultId` param is not used to recompute).
- Renders `<ResultsDisplay>`, share buttons (copy link, Twitter/X, Facebook, WhatsApp via `window.open`), retake, and suggested quizzes (same category).
- `handleDownloadResult` is a **stub** (`console.log` only) even though `html2canvas` is a dependency.

### `quiz-detail-page.tsx` (route `quiz/:slug`)

- Marketing/landing page for a quiz: hero, stats, sticky CTA → `/quiz/:slug/take`, related quizzes, share via `navigator.share` w/ clipboard fallback.
- Sets SEO meta (`setSEOMetadata`) and has special-case AR localization only for slug `dark-personality-test`.
- `difficulty` is mocked: `(quiz as any).difficulty || "Medium"` — there is no real difficulty field.

## Validation — `src/lib/quiz-validation.ts`

- `normalizeSlug(value)` — lowercases, strips non-alphanumerics, collapses dashes.
- `getResultOptions(results)` — `{id,label}[]` for editor dropdowns (drops blank IDs).
- `validateQuizConfig(quiz)` → `{ isValid, errors[] }`. Checks: title/description present, ≥1 question, ≥1 result, **unique non-empty result IDs**, each question text + ≥2 answers + each answer text, and per-type rules:
  - weighted/percentage → each answer needs ≥1 positive weight to a valid result ID.
  - personality_based → each answer must map to an existing result ID.
  - score_based → each answer `score` must be finite.

Used by the admin editor (live, blocks publish) and by the take page (blocks playing an invalid quiz).
