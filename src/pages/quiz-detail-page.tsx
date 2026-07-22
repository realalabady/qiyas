import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  BarChart2,
  ArrowRight,
  ChevronLeft,
  Share2,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/quiz/quiz-card";
import { AdBanner } from "@/components/ads/ad-banner";
import { staggerContainer, staggerItem, fadeUp, scaleIn } from "@/lib/motion";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import { useArticles } from "@/stores/articles-store";
import { useAnalyticsStore } from "@/stores/analytics-store";
import { useLanguage } from "@/lib/i18n";
import { localizedQuiz } from "@/lib/localized-content";
import {
  useAutoTranslateQuizzes,
  useAutoTranslateArticles,
} from "@/hooks/use-auto-translate";
import { setSEOMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ContentRail } from "@/components/content/content-rail";
import { QuizRailCard } from "@/components/content/quiz-rail-card";
import { ArticleCard } from "@/components/content/article-card";
import { categoryLabel } from "@/lib/category-i18n";
import {
  relatedQuizzes as pickRelatedQuizzes,
  recommendedArticlesForQuiz,
  latestArticles,
  categorySlug,
} from "@/lib/content-selectors";

export default function QuizDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const quizStore = useQuizzesAdmin();
  const { quizzes } = quizStore;
  const { articles } = useArticles();
  const recordView = useAnalyticsStore((s) => s.recordView);
  const { t, language } = useLanguage();
  const [shared, setShared] = useState(false);

  // Backfill translations for the content we cross-link to.
  useAutoTranslateArticles(articles);

  // Find quiz by slug (includes all quizzes: published and unpublished),
  // then swap its display text to the active language (category kept in English
  // so category lookups keep working).
  const rawQuiz = quizStore.getQuizBySlug(slug || "");
  const quiz = rawQuiz ? localizedQuiz(rawQuiz, language) : undefined;

  // Backfill a translation for this quiz if it was created before the feature.
  useAutoTranslateQuizzes(rawQuiz ? [rawQuiz] : []);

  // Record a view once per quiz visit (real analytics).
  useEffect(() => {
    if (quiz) recordView(quiz.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz?.id]);

  // Reflect the quiz name in the page title and share/link metadata
  useEffect(() => {
    if (!quiz) return;
    const title =
      language === "ar" && quiz.slug === "dark-personality-test"
        ? t("quiz.seed.dark.title")
        : quiz.title;
    const description =
      language === "ar" && quiz.slug === "dark-personality-test"
        ? t("quiz.seed.dark.description")
        : quiz.description;
    const origin = window.location.origin;
    setSEOMetadata({
      title: `${title} · Al-Maarefah`,
      description,
      ogUrl: `${origin}/quiz/${quiz.slug}`,
      ogImage: quiz.thumbnail
        ? quiz.thumbnail.startsWith("http")
          ? quiz.thumbnail
          : `${origin}${quiz.thumbnail}`
        : `${origin}/al-maarefah-header.png`,
      canonical: `${origin}/quiz/${quiz.slug}`,
      twitterHandle: "@almaarefahh",
    });
    return () => {
      document.title = "Al-Maarefah";
    };
  }, [quiz, language, t]);

  // Relevance-ranked related content (category + keyword overlap — never random).
  const related = rawQuiz ? pickRelatedQuizzes(rawQuiz, quizzes, 6) : [];
  const recommendedArticles = rawQuiz
    ? recommendedArticlesForQuiz(rawQuiz, articles, 6)
    : [];
  const newestArticles = latestArticles(articles, 6);

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <p className="text-6xl">😕</p>
        <h1 className="text-2xl font-bold">{t("quizDetail.notFound.title")}</h1>
        <p className="text-muted-foreground">
          {t("quizDetail.notFound.subtitle")}
        </p>
        <Button asChild>
          <Link to="/explore">{t("quizDetail.notFound.cta")}</Link>
        </Button>
      </div>
    );
  }

  // Mock difficulty if not available
  const difficulty = (quiz as any).difficulty || "Medium";
  const localizedDifficulty =
    difficulty === "Easy"
      ? t("quizDetail.difficulty.easy")
      : difficulty === "Hard"
        ? t("quizDetail.difficulty.hard")
        : t("quizDetail.difficulty.medium");

  const localizedQuizType =
    quiz.quizType === "weighted_personality"
      ? t("quizDetail.type.weighted_personality")
      : quiz.quizType === "personality_based"
        ? t("quizDetail.type.personality_based")
        : quiz.quizType === "score_based"
          ? t("quizDetail.type.score_based")
          : quiz.quizType === "percentage_matching"
            ? t("quizDetail.type.percentage_matching")
            : t("quizDetail.type.standard");

  const localizedCategory = (() => {
    const map: Record<string, string> = {
      "Personality Tests": t("categories.personality"),
      Personality: t("categories.personality"),
      "IQ Tests": t("categories.iq"),
      "Mental Age Tests": t("categories.mental-age"),
      "Mental Age": t("categories.mental-age"),
      "Career Tests": t("categories.career"),
      Career: t("categories.career"),
      "Relationship Tests": t("categories.relationship"),
      Relationship: t("categories.relationship"),
      Friendship: t("categories.friendship"),
      "Friendship Tests": t("categories.friendship"),
      Stress: t("categories.stress"),
      "Stress Tests": t("categories.stress"),
      Memory: t("categories.memory"),
      "Memory Tests": t("categories.memory"),
      Entertainment: t("categories.entertainment"),
      "Entertainment Quizzes": t("categories.entertainment"),
      Anime: t("categories.anime"),
      "Anime Quizzes": t("categories.anime"),
      "Color Personality": t("categories.color"),
      "Color Personality Tests": t("categories.color"),
      "General Knowledge": t("categories.knowledge"),
    };
    return map[quiz.category] || quiz.category;
  })();

  const localizedTitle =
    language === "ar" && quiz.slug === "dark-personality-test"
      ? t("quiz.seed.dark.title")
      : quiz.title;
  const localizedDescription =
    language === "ar" && quiz.slug === "dark-personality-test"
      ? t("quiz.seed.dark.description")
      : quiz.description;
  const difficultyColor = {
    Easy: "success",
    Medium: "warning",
    Hard: "destructive",
  } as const;

  const handleShare = async () => {
    const url = `${window.location.origin}/quiz/${quiz.slug}`;
    const shareData = {
      title: localizedTitle,
      text: localizedDescription,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // user cancelled or share failed — fall back to copy
    }
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t("nav.home"), to: "/" },
          { label: t("nav.explore"), to: "/explore" },
          {
            label: categoryLabel(quiz.category, t),
            to: `/explore?category=${categorySlug(quiz.category)}`,
          },
          { label: localizedTitle },
        ]}
      />

      {/* Back link */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
          {t("quizDetail.back")}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: main content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Hero card */}
          <motion.div variants={scaleIn} initial="hidden" animate="visible">
            <div className="glass-card rounded-3xl overflow-hidden">
              {/* Thumbnail / gradient banner */}
              <div className="relative h-52 sm:h-64 bg-gradient-to-br from-fuchsia-900/60 via-violet-900/60 to-cyan-900/40 flex items-center justify-center">
                {quiz.thumbnail ? (
                  <img
                    src={quiz.thumbnail}
                    alt={quiz.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <span className="text-7xl">🧠</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent" />
                <Badge
                  className="absolute top-4 left-4"
                  variant={difficultyColor[difficulty as keyof typeof difficultyColor]}
                >
                  {localizedDifficulty}
                </Badge>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <Badge variant="secondary">{localizedCategory}</Badge>
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                  {localizedTitle}
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  {localizedDescription}
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-5 text-sm text-muted-foreground border-t border-border/50 pt-4">
                  <span className="flex items-center gap-1.5">
                    <BarChart2 className="size-4 text-primary" />
                    {quiz.questions.length} {t("quizDetail.questions")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4 text-primary" />
                    ~{Math.ceil(quiz.questions.length / 2) || 5} {t("quizDetail.minutes")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4 text-primary" />0 {t("quizDetail.taken")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ad between detail and related */}
          <AdBanner />

          {/* Related quizzes (relevance-ranked) */}
          {related.length > 0 && (
            <motion.section
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SectionHeader
                title={t("quizDetail.related")}
                viewAllTo={`/explore?category=${categorySlug(quiz.category)}`}
              />
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                {related.map((rawRelated) => (
                  <motion.div key={rawRelated.id} variants={staggerItem}>
                    <QuizRailCard quiz={rawRelated} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          )}

          {/* Recommended articles for this quiz */}
          {recommendedArticles.length > 0 && (
            <ContentRail
              title={t("quizDetail.recommended_articles")}
              viewAllTo="/articles"
              cols={2}
            >
              {recommendedArticles.slice(0, 4).map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </ContentRail>
          )}

          {/* Newest articles */}
          {newestArticles.length > 0 && (
            <ContentRail
              title={t("quizDetail.newest_articles")}
              viewAllTo="/articles"
              cols={2}
            >
              {newestArticles.slice(0, 4).map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </ContentRail>
          )}
        </div>

        {/* Right: sticky CTA sidebar */}
        <div className="lg:col-span-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="sticky top-24 space-y-4"
          >
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {t("quizDetail.ready")}
                </p>
                <p className="font-semibold text-lg">
                  {quiz.questions.length} {t("quizDetail.questions")} ·{" "}
                  ~{Math.ceil(quiz.questions.length / 2) || 5} {t("quizDetail.min")}
                </p>
              </div>

              <Button size="lg" className="w-full" asChild>
                <Link to={`/quiz/${quiz.slug}/take`}>
                  {t("quizDetail.startQuiz")} <ArrowRight className="size-5" />
                </Link>
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                {t("quizDetail.freeNote")}
              </p>

              <div className="border-t border-border/40 pt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>{t("quizDetail.category")}</span>
                  <span className="text-foreground font-medium">
                    {localizedCategory}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("quizDetail.difficulty")}</span>
                  <span className="text-foreground font-medium">
                    {localizedDifficulty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("quizDetail.type")}</span>
                  <span className="text-foreground font-medium">
                    {localizedQuizType}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleShare}
              >
                {shared ? (
                  <>
                    <Check className="size-5" />
                    {t("quizDetail.shareCopied")}
                  </>
                ) : (
                  <>
                    <Share2 className="size-5" />
                    {t("quizDetail.share")}
                  </>
                )}
              </Button>
            </div>

            {/* Sidebar ad */}
            <AdBanner />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
