import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { staggerContainer, staggerItem, fadeUp } from "@/lib/motion";
import { CATEGORIES } from "@/data/seed-quizzes";
import { AdBanner } from "@/components/ads/ad-banner";

export default function CategoriesPage() {
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
          Quiz <span className="gradient-text">Categories</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Explore {CATEGORIES.length} categories and find quizzes that match
          your curiosity.
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
        {CATEGORIES.map((cat) => (
          <motion.div key={cat.slug} variants={staggerItem}>
            <Link
              to={`/explore?category=${cat.slug}`}
              className="glass-card rounded-2xl p-6 flex items-start gap-5 group hover:-translate-y-1 hover:border-white/20 transition-all duration-300 block"
            >
              <div className="text-4xl shrink-0 group-hover:scale-110 transition-transform duration-200">
                {cat.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {cat.label}
                  </h2>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {cat.description}
                </p>
                <p className="text-xs text-primary mt-2 font-medium">
                  {cat.quizCount} quiz{cat.quizCount !== 1 ? "zes" : ""}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="glass-card rounded-3xl p-8 text-center space-y-4"
      >
        <p className="text-xl font-bold">
          Can&apos;t decide? Start with the most popular quiz.
        </p>
        <Link
          to="/quiz/dark-personality-test"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          🔥 Dark Personality Test <ChevronRight className="size-4" />
        </Link>
      </motion.div>
    </div>
  );
}
