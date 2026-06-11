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
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import type { QuizCardData } from "@/components/quiz/quiz-card";
import { useLanguage } from "@/lib/i18n";

export default function ExplorePage() {
  const { t } = useLanguage();
  const SORT_OPTIONS = [
    { value: "trending", label: t("explore.sort.trending") },
    { value: "popular", label: t("explore.sort.popular") },
    { value: "newest", label: t("explore.sort.newest") },
    { value: "fastest", label: t("explore.sort.fastest") },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedCat, setSelectedCat] = useState(
    searchParams.get("category") ?? "",
  );
  const [sort, setSort] = useState(searchParams.get("sort") ?? "trending");

  const quizStore = useQuizzesAdmin();
  const allQuizzes = quizStore.getPublishedQuizzes();

  // Dynamic categories from quizzes
  const CATEGORIES = [
    ...new Set(allQuizzes.map((q) => q.category)),
  ].map((cat) => ({
    slug: cat.toLowerCase().replace(/\s+/g, "-"),
    label: cat,
  }));

  const filtered = useMemo(() => {
    let list = [...allQuizzes];

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
        list.sort((a, b) => (b.questions?.length || 0) - (a.questions?.length || 0));
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "fastest":
        list.sort((a, b) => (a.questions?.length || 0) - (b.questions?.length || 0));
        break;
      default: // trending
        list.sort((a, b) => (b.questions?.length || 0) - (a.questions?.length || 0));
    }

    return list;
  }, [query, selectedCat, sort, allQuizzes, CATEGORIES]);

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
          <span className="gradient-text">{t("explore.title")}</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {allQuizzes.length} {t("explore.subtitle")}
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
          placeholder={t("explore.search_placeholder")}
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
            {t("explore.filter_all")}
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
              {cat.label}
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
            {filtered.length} {t("explore.results_suffix")}
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
          <p className="text-xl font-semibold">{t("explore.none_title")}</p>
          <p className="text-muted-foreground">
            {t("explore.none_subtitle")}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              setSelectedCat("");
              setSearchParams({});
            }}
          >
            {t("explore.clear_filters")}
          </Button>
        </motion.div>
      ) : (
        <>
          <SectionHeader
            title={`${filtered.length} ${t("explore.found_suffix")}`}
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((quiz) => (
              <motion.div key={quiz.id} variants={staggerItem}>
                <QuizCard 
                  quiz={{
                    id: quiz.id,
                    slug: quiz.slug,
                    title: quiz.title,
                    description: quiz.description,
                    category: quiz.category,
                    thumbnail: quiz.thumbnail,
                    questionCount: quiz.questions.length,
                    estimatedMinutes: Math.ceil(quiz.questions.length / 2) || 5,
                    completions: 0,
                  } as QuizCardData}
                />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
