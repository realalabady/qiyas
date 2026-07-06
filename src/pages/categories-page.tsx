import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { staggerContainer, staggerItem, fadeUp } from "@/lib/motion";
import { AdBanner } from "@/components/ads/ad-banner";
import { useLanguage } from "@/lib/i18n";
import {
  useCategories,
  localizedCategoryName,
  localizedCategoryDescription,
} from "@/stores/categories-store";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";

export default function CategoriesPage() {
  const { t, language } = useLanguage();
  const { categories } = useCategories();
  const quizCategories = categories.filter((cat) => cat.type === "quiz");
  const { getPublishedQuizzes } = useQuizzesAdmin();
  const publishedQuizzes = getPublishedQuizzes();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center space-y-3"
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold">
          <span className="gradient-text">{t("categories.title")}</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {t("categories.subtitle")}
        </p>
      </motion.div>

      <AdBanner />

      {/* Category grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {quizCategories.map((cat) => (
          <motion.div key={cat.slug} variants={staggerItem}>
            <Link
              to={`/explore?category=${cat.slug}`}
              className="glass-card rounded-2xl p-6 flex items-start gap-5 group hover:-translate-y-1 hover:border-white/20 transition-all duration-300 block"
            >
              <div className="text-4xl shrink-0 group-hover:scale-110 transition-transform duration-200">
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {localizedCategoryName(cat, language)}
                  </h2>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {localizedCategoryDescription(cat, language)}
                </p>
                <p className="text-xs text-primary mt-2 font-medium">
                  {publishedQuizzes.filter((quiz) => quiz.category === cat.name).length}{" "}
                  {t("categories.count_suffix")}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
      {quizCategories.length === 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center py-12 text-muted-foreground">
          {t("categories.subtitle")}
        </motion.div>
      )}

      {/* Bottom CTA */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="glass-card rounded-3xl p-8 text-center space-y-4"
      >
        <p className="text-xl font-bold">
          {t("categories.cta.title")}
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          {t("categories.cta.button")} <ChevronRight className="size-4" />
        </Link>
      </motion.div>
    </div>
  );
}
