import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useArticles } from "@/stores/articles-store";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n";

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getArticleBySlug } = useArticles();
  const { t } = useLanguage();

  const article = getArticleBySlug(slug || "");

  if (!article || !article.published) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">
            {t("quizDetail.notFound.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("quizDetail.notFound.subtitle")}
          </p>
          <Button asChild>
            <Link to="/articles">{t("articles.title")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            {t("quizDetail.back")}
          </Link>
        </motion.div>

        <motion.article
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="glass-card rounded-2xl overflow-hidden"
        >
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 sm:h-80 object-cover"
            />
          )}

          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary">
                {article.category}
              </span>
              <span>•</span>
              <span>{article.author}</span>
              <span>•</span>
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              {article.title}
            </h1>

            <p className="text-muted-foreground text-lg">{article.excerpt}</p>

            <div className="prose prose-invert max-w-none whitespace-pre-line text-foreground/90 leading-relaxed">
              {article.content}
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
