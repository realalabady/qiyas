import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Clock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { staggerItem, tapScale } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n";
import { categoryLabel } from "@/lib/category-i18n";
import { localizedArticle } from "@/lib/localized-content";
import { readingTimeMinutes } from "@/lib/content-selectors";
import type { Article } from "@/data/seed-articles";

/**
 * Shared article card — a real <a> (via <Link>) so crawlers follow it. Design
 * mirrors the Articles listing card to keep one visual language across the app.
 */
export function ArticleCard({ article: raw }: { article: Article }) {
  const { t, language } = useLanguage();
  const article = localizedArticle(raw, language);
  const minutes = readingTimeMinutes(article.content);

  return (
    <motion.div variants={staggerItem} whileTap={tapScale} className="h-full">
      <Link to={`/articles/${article.slug}`} className="block h-full group">
        <Card className="glass-card h-full flex flex-col overflow-hidden hover:border-primary/50 transition-colors">
          {article.image && (
            <div className="overflow-hidden h-40 bg-gradient-to-br from-primary/20 to-accent/20">
              <img
                src={article.image}
                alt={article.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          )}
          <div className="p-5 flex-1 flex flex-col">
            <div className="mb-3">
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary">
                {categoryLabel(article.category, t)}
              </span>
            </div>
            <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{article.author}</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {minutes} {t("article.min_read")}
              </span>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-primary">
              {t("articles.read_more")}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
