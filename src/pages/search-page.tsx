import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, TrendingUp } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QuizCard } from "@/components/quiz/quiz-card";
import { staggerContainer, staggerItem, fadeUp } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import { localizedQuiz } from "@/lib/localized-content";
import { categoryLabel } from "@/lib/category-i18n";

const POPULAR_SEARCHES = [
  "personality test",
  "IQ test",
  "mental age",
  "love language",
  "career quiz",
  "anime character",
];

export default function SearchPage() {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const quizStore = useQuizzesAdmin();
  const quizzes = quizStore.getPublishedQuizzes().map((raw) => {
    const quiz = localizedQuiz(raw, language);
    return {
      id: quiz.id,
      slug: quiz.slug,
      title: quiz.title,
      description: quiz.description,
      category: categoryLabel(raw.category, t),
      thumbnail: quiz.thumbnail,
      questionCount: quiz.questions.length,
      estimatedMinutes: Math.ceil(quiz.questions.length / 2) || 5,
      completions: 0,
    };
  });
  const categoryFilters = [...new Set(quizzes.map((quiz) => quiz.category))].slice(0, 6);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return quizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(q) ||
        quiz.description.toLowerCase().includes(q) ||
        quiz.category.toLowerCase().includes(q),
    );
  }, [query, quizzes]);

  const showResults = query.trim().length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center space-y-3"
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold">
          <span className="gradient-text">{t("search.title")}</span>
        </h1>
        <p className="text-muted-foreground">
          {t("search.subtitle")}
        </p>
      </motion.div>

      {/* Search bar */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
        <Input
          autoFocus
          className="pl-12 h-14 text-lg"
          placeholder={t("search.placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </motion.div>

      {/* Popular searches */}
      {!showResults && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="size-4" /> {t("search.popular")}
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-border/40 text-sm text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results */}
      {showResults ? (
        results.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              {results.length} {t("search.results_for")}
              &ldquo;{query}&rdquo;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {results.map((quiz) => (
                <motion.div key={quiz.id} variants={staggerItem}>
                  <QuizCard quiz={quiz} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center py-16 space-y-3"
          >
            <p className="text-5xl">🔍</p>
            <p className="text-xl font-semibold">{t("search.none_title")}</p>
            <p className="text-muted-foreground">
              {t("search.none_subtitle")}
            </p>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm mt-2"
            >
              {t("search.browse_categories")} →
            </Link>
          </motion.div>
        )
      ) : (
        /* Trending when no query */
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
            <p className="font-semibold flex items-center gap-2">
              {t("search.trending_now")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {quizzes.slice(0, 4).map((quiz) => (
              <motion.div key={quiz.id} variants={staggerItem}>
                <QuizCard quiz={quiz} />
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/explore"
              className="text-sm text-primary hover:underline"
            >
              {t("search.view_all")} →
            </Link>
          </div>
        </motion.div>
      )}

      {/* Category filters */}
      {!showResults && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <p className="text-sm font-medium text-muted-foreground">
            {t("search.filter_by_category")}
          </p>
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className="cursor-pointer hover:bg-primary/20 hover:border-primary/40 transition-colors px-3 py-1.5"
                onClick={() => setQuery(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
