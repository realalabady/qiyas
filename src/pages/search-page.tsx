import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, TrendingUp } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QuizCard } from "@/components/quiz/quiz-card";
import { staggerContainer, staggerItem, fadeUp } from "@/lib/motion";
import { QUIZZES, TRENDING_QUIZZES } from "@/data/seed-quizzes";

const POPULAR_SEARCHES = [
  "personality test",
  "IQ test",
  "mental age",
  "love language",
  "career quiz",
  "anime character",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return QUIZZES.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(q) ||
        quiz.description.toLowerCase().includes(q) ||
        quiz.category.toLowerCase().includes(q) ||
        quiz.tags?.some((t) => t.includes(q)),
    );
  }, [query]);

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
          <span className="gradient-text">Search</span> Quizzes
        </h1>
        <p className="text-muted-foreground">
          Find your perfect quiz from our library
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
          placeholder="Type to search…"
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
            <TrendingUp className="size-4" /> Popular Searches
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
              {results.length} result{results.length !== 1 ? "s" : ""} for
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
            <p className="text-xl font-semibold">No results found</p>
            <p className="text-muted-foreground">
              Try different keywords or browse categories
            </p>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-primary hover:underline text-sm mt-2"
            >
              Browse all categories →
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
            🔥 Trending Now
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TRENDING_QUIZZES.slice(0, 4).map((quiz) => (
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
              View all quizzes →
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
            Filter by Category
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Personality",
              "IQ Tests",
              "Mental Age",
              "Career",
              "Relationship",
              "Anime",
            ].map((cat) => (
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
