import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Sparkles, Flame, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/quiz/quiz-card";
import { ContentRail } from "@/components/content/content-rail";
import { QuizRailCard } from "@/components/content/quiz-rail-card";
import { ArticleCard } from "@/components/content/article-card";
import { AdBanner } from "@/components/ads/ad-banner";
import { staggerContainer, staggerItem, fadeUp } from "@/lib/motion";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import { useArticles } from "@/stores/articles-store";
import { useAnalyticsStore } from "@/stores/analytics-store";
import {
  useCategories,
  localizedCategoryName,
} from "@/stores/categories-store";
import {
  useAutoTranslateQuizzes,
  useAutoTranslateArticles,
  useAutoTranslateCategories,
} from "@/hooks/use-auto-translate";
import {
  latestArticles,
  trendingArticles,
  popularArticles,
  latestQuizzes,
  trendingQuizzes,
  popularQuizzes,
  categorySlug,
} from "@/lib/content-selectors";
import { useLanguage } from "@/lib/i18n";

/* ── Component ────────────────────────────────────────────────────────────── */
function HomePage() {
  const { quizzes } = useQuizzesAdmin();
  const { articles } = useArticles();
  const { categories } = useCategories();
  const views = useAnalyticsStore((s) => s.views);
  const quizCategories = categories.filter((c) => c.type === "quiz");
  const { t, language } = useLanguage();

  // Backfill translations for pre-existing content in the background.
  const publishedQuizzes = quizzes.filter((q) => q.published);
  useAutoTranslateQuizzes(publishedQuizzes);
  useAutoTranslateArticles(articles);
  useAutoTranslateCategories(categories);

  // Deterministic, crawlable rails.
  const trendingQ = trendingQuizzes(quizzes, views, 6);
  const popularQ = popularQuizzes(quizzes, views, 6);
  const latestQ = latestQuizzes(quizzes, 6);
  const latestA = latestArticles(articles, 6);
  const trendingA = trendingArticles(articles, 6);
  const popularA = popularArticles(articles, 6);

  return (
    <div className="relative">
      {/* Ambient gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-[500px] h-[400px] bg-cyan-600/8 rounded-full blur-[100px]" />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 sm:py-32 px-4">
        <motion.div
          className="mx-auto max-w-4xl text-center flex flex-col items-center gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={staggerItem}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight"
          >
            <span className="gradient-text">{t("hero.title")}</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-wrap gap-3 justify-center"
          >
            <Button size="lg" asChild>
              <Link to="/explore">
                {t("hero.cta_explore")} <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/categories">{t("hero.cta_categories")}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20 pb-20">
        {/* ── Trending Quizzes ──────────────────────────────────────────── */}
        {trendingQ.length > 0 && (
          <ContentRail
            title={
              <>
                <Flame className="inline size-5 mr-2 text-primary" />
                {t("home.trending")}
              </>
            }
            viewAllTo="/explore?sort=trending"
          >
            {trendingQ.map((quiz) => (
              <QuizRailCard key={quiz.id} quiz={quiz} />
            ))}
          </ContentRail>
        )}

        {/* ── Latest Quizzes ────────────────────────────────────────────── */}
        {latestQ.length > 0 && (
          <ContentRail
            title={
              <>
                <Sparkles className="inline size-5 mr-2 text-primary" />
                {t("home.latest_quizzes")}
              </>
            }
            viewAllTo="/explore?sort=newest"
          >
            {latestQ.map((quiz) => (
              <QuizRailCard key={quiz.id} quiz={quiz} />
            ))}
          </ContentRail>
        )}

        {/* ── Ad Banner ─────────────────────────────────────────────────── */}
        <AdBanner />

        {/* ── Categories ────────────────────────────────────────────────── */}
        {quizCategories.length > 0 && (
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <SectionHeader
              title={t("home.browse_category")}
              viewAllTo="/categories"
            />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {quizCategories.slice(0, 12).map((category) => (
                <motion.div key={category.id} variants={staggerItem}>
                  <Link
                    to={`/explore?category=${categorySlug(category.name)}`}
                    className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center hover:-translate-y-1 hover:border-white/20 transition-all duration-200 block group"
                  >
                    <span className="text-3xl">{category.icon}</span>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {localizedCategoryName(category, language)}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* ── Popular Quizzes ───────────────────────────────────────────── */}
        {popularQ.length > 0 && (
          <ContentRail
            title={
              <>
                <TrendingUp className="inline size-5 mr-2 text-primary" />
                {t("home.popular_week")}
              </>
            }
            viewAllTo="/explore?sort=popular"
          >
            {popularQ.map((quiz) => (
              <QuizRailCard key={quiz.id} quiz={quiz} />
            ))}
          </ContentRail>
        )}

        {/* ── Latest Articles ───────────────────────────────────────────── */}
        {latestA.length > 0 && (
          <ContentRail
            title={
              <>
                <Clock className="inline size-5 mr-2 text-primary" />
                {t("home.latest_articles")}
              </>
            }
            viewAllTo="/articles"
          >
            {latestA.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </ContentRail>
        )}

        {/* ── Trending Articles ─────────────────────────────────────────── */}
        {trendingA.length > 0 && (
          <ContentRail
            title={
              <>
                <Flame className="inline size-5 mr-2 text-primary" />
                {t("home.trending_articles")}
              </>
            }
            viewAllTo="/articles"
          >
            {trendingA.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </ContentRail>
        )}

        {/* ── Popular Articles ──────────────────────────────────────────── */}
        {popularA.length > 0 && (
          <ContentRail
            title={
              <>
                <TrendingUp className="inline size-5 mr-2 text-primary" />
                {t("home.popular_articles")}
              </>
            }
            viewAllTo="/articles"
          >
            {popularA.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </ContentRail>
        )}

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="glass-card rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-600/10 via-transparent to-violet-600/10" />
          <Badge variant="default">{t("home.cta.badge")}</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold max-w-xl">
            <span className="gradient-text">{t("home.cta.title")}</span>
          </h2>
          <p className="text-muted-foreground max-w-md">
            {t("home.cta.description")}
          </p>
          <Button size="xl" asChild>
            <Link to="/explore">
              {t("home.cta.explore_all")} <ArrowRight className="size-5 rtl:rotate-180" />
            </Link>
          </Button>
        </motion.section>
      </div>
    </div>
  );
}

export default HomePage;
