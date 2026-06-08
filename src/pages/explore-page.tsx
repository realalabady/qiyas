import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuizCard, SectionHeader } from "@/components/quiz/quiz-card";
import { AdBanner } from "@/components/ads/ad-banner";
import { staggerContainer, staggerItem, fadeUp } from "@/lib/motion";
import { QUIZZES, CATEGORIES } from "@/data/seed-quizzes";

const SORT_OPTIONS = [
  { value: "trending", label: "🔥 Trending" },
  { value: "popular", label: "⭐ Popular" },
  { value: "newest", label: "🆕 Newest" },
  { value: "fastest", label: "⚡ Quickest" },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedCat, setSelectedCat] = useState(
    searchParams.get("category") ?? "",
  );
  const [sort, setSort] = useState(searchParams.get("sort") ?? "trending");

  const filtered = useMemo(() => {
    let list = [...QUIZZES];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(q) ||
          quiz.description.toLowerCase().includes(q) ||
          quiz.category.toLowerCase().includes(q),
      );
    }

    if (selectedCat) {
      const cat = CATEGORIES.find((c) => c.slug === selectedCat);
      if (cat) list = list.filter((q) => q.category === cat.label);
    }

    switch (sort) {
      case "popular":
        list.sort((a, b) => b.completions - a.completions);
        break;
      case "newest":
        list.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case "fastest":
        list.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
        break;
      default: // trending
        list.sort((a, b) => b.completions - a.completions);
    }

    return list;
  }, [query, selectedCat, sort]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center space-y-3"
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold">
          Explore <span className="gradient-text">All Quizzes</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {QUIZZES.length} quizzes across {CATEGORIES.length} categories — find
          your next favourite.
        </p>
      </motion.div>

      {/* Search bar */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative max-w-2xl mx-auto"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          className="pl-11 pr-11 h-12 text-base"
          placeholder="Search quizzes…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            updateParam("q", e.target.value);
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              updateParam("q", "");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </motion.div>

      {/* Filters row */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        {/* Category chips */}
        <div className="flex flex-wrap gap-2 items-center">
          <SlidersHorizontal className="size-4 text-muted-foreground shrink-0" />
          <button
            onClick={() => {
              setSelectedCat("");
              updateParam("category", "");
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !selectedCat
                ? "bg-primary text-primary-foreground"
                : "bg-white/5 text-muted-foreground hover:bg-white/10"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                const next = selectedCat === cat.slug ? "" : cat.slug;
                setSelectedCat(next);
                updateParam("category", next);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCat === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-2 shrink-0">
          {SORT_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant={sort === opt.value ? "default" : "outline"}
              onClick={() => {
                setSort(opt.value);
                updateParam("sort", opt.value);
              }}
              className="text-xs"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Results count */}
      {(query || selectedCat) && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
          {query && <Badge variant="secondary">"{query}"</Badge>}
          {selectedCat && (
            <Badge variant="secondary">
              {CATEGORIES.find((c) => c.slug === selectedCat)?.label}
            </Badge>
          )}
        </div>
      )}

      <AdBanner />

      {/* Quiz grid */}
      {filtered.length === 0 ? (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center py-20 space-y-4"
        >
          <p className="text-5xl">🔍</p>
          <p className="text-xl font-semibold">No quizzes found</p>
          <p className="text-muted-foreground">
            Try a different keyword or category
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              setSelectedCat("");
              setSearchParams({});
            }}
          >
            Clear Filters
          </Button>
        </motion.div>
      ) : (
        <>
          <SectionHeader
            title={`${filtered.length} Quiz${filtered.length !== 1 ? "zes" : ""} Found`}
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((quiz) => (
              <motion.div key={quiz.id} variants={staggerItem}>
                <QuizCard quiz={quiz} />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
