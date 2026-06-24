# Graph Report - qiyas  (2026-06-15)

## Corpus Check
- 89 files · ~38,047 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 438 nodes · 457 edges · 40 communities (27 shown, 13 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 78 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eea1642e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 36|Community 36]]

## God Nodes (most connected - your core abstractions)
1. `useLanguage` - 23 edges
2. `cn()` - 23 edges
3. `compilerOptions` - 18 edges
4. `QuizEngine` - 17 edges
5. `compilerOptions` - 16 edges
6. `useQuizzesAdmin` - 10 edges
7. `tailwind` - 6 edges
8. `aliases` - 6 edges
9. `scripts` - 5 edges
10. `getFirebaseApp()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `AppFrame()` --calls--> `cn()`  [INFERRED]
  src/components/layout/app-frame.tsx → src/lib/utils.ts
- `Footer()` --calls--> `useLanguage`  [INFERRED]
  src/components/layout/footer.tsx → src/lib/i18n.ts
- `Navbar()` --calls--> `cn()`  [INFERRED]
  src/components/layout/navbar.tsx → src/lib/utils.ts
- `Card()` --calls--> `cn()`  [INFERRED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardHeader()` --calls--> `cn()`  [INFERRED]
  src/components/ui/card.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (40 total, 13 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (28): getResultOptions(), QuizLike, QuizValidationResult, validateQuizConfig(), AdminDashboardPage(), QUICK_ACTIONS, AdminQuizzesPage(), CATEGORIES (+20 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (23): LanguageSwitcher(), NAV_LINKS, Navbar(), AdminLayout(), adminLinks, PublicLayout(), Language, LanguageStore (+15 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (28): AppFrame(), AppFrameProps, cn(), Badge(), BadgeProps, badgeVariants, Button(), ButtonProps (+20 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (22): ProtectedAdminRoute(), ProtectedRouteProps, getFirebaseConfig(), hasMissingFirebaseConfig, OptionalFirebaseEnvKey, readEnv(), RequiredFirebaseEnvKey, requiredFirebaseEnvKeys (+14 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (25): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, firebase-admin, globals, tailwindcss (+17 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (8): Answer, Question, QuizConfig, QuizEngine, QuizResult, QuizType, Result, UserAnswers

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (11): COMPANY_LINKS, Footer(), LEGAL_LINKS, SOCIAL, AdminCategoriesPage(), ICON_OPTIONS, CategoriesPage(), HomePage() (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (18): dependencies, class-variance-authority, clsx, firebase, framer-motion, graphifyy, html2canvas, lucide-react (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (10): AnswerOption, colorTest, introvertTest, iqTest, loveLanguageTest, Question, QuestionType, QUIZ_DATA_MAP (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.17
Nodes (11): fadeDown, fadeIn, fadeUp, hoverLift, pageTransition, scaleIn, slideInLeft, slideInRight (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (5): AdminArticlesPage(), ArticleDetailPage(), ArticlesPage(), ArticlesStore, useArticles

### Community 14 - "Community 14"
Cohesion: 0.20
Nodes (8): Architecture, Commands, Conventions, Data layer — this is the most important thing to understand, Environment, i18n & theming, Quiz engine, Routing

### Community 15 - "Community 15"
Cohesion: 0.22
Nodes (8): Adding Admin Users, Admin Login Credentials, Default Demo Admin (For Testing), Environment Variables, Firebase CLI Commands, Firestore Collections Structure, Qiyas Admin Setup Guide, Verifying Admin Access

### Community 16 - "Community 16"
Cohesion: 0.22
Nodes (6): CATEGORIES, Category, NEWEST_QUIZZES, QuizSeed, QUIZZES, TRENDING_QUIZZES

### Community 17 - "Community 17"
Cohesion: 0.32
Nodes (4): SEOMetadata, setSEOMetadata(), updateLinkTag(), updateMetaTag()

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (5): CAREER_QUIZ, COMPATIBILITY_QUIZ, ENGINE_SEED_QUIZZES, IQ_QUIZ, PERSONALITY_QUIZ

### Community 19 - "Community 19"
Cohesion: 0.40
Nodes (3): AnswerEditor(), AnswerEditorProps, QuestionEditorProps

### Community 20 - "Community 20"
Cohesion: 0.33
Nodes (5): Current foundation status, Development, Environment setup, Qiyas, Quality checks

### Community 25 - "Community 25"
Cohesion: 0.50
Nodes (3): QuizAnswer, QuizState, useQuizStore

## Knowledge Gaps
- **216 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+211 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLanguage` connect `Community 1` to `Community 8`, `Community 0`, `Community 13`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `Navbar()` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `useLanguage` (e.g. with `Footer()` and `LanguageSwitcher()`) actually correct?**
  _`useLanguage` has 22 INFERRED edges - model-reasoned connections that need verification._
- **Are the 22 inferred relationships involving `cn()` (e.g. with `AppFrame()` and `Navbar()`) actually correct?**
  _`cn()` has 22 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _216 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05226480836236934 - nodes in this community are weakly interconnected._