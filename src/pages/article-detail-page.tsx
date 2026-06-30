import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Check } from "lucide-react";
import { useArticles } from "@/stores/articles-store";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n";
import { setSEOMetadata } from "@/lib/seo";

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getArticleBySlug } = useArticles();
  const { t } = useLanguage();
  const [shared, setShared] = useState(false);

  const article = getArticleBySlug(slug || "");

  useEffect(() => {
    if (!article) return;
    const origin = window.location.origin;
    setSEOMetadata({
      title: `${article.title} \xB7 Al-Maarefah`,
      description: article.excerpt,
      ogUrl: `${origin}/articles/${article.slug}`,
      ogImage: article.image
        ? article.image.startsWith("http")
          ? article.image
          : `${origin}${article.image}`
        : undefined,
    });
  }, [article]);

  const handleShare = async () => {
    const url = `${window.location.origin}/articles/${article!.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: article!.title, text: article!.excerpt, url });
        return;
      }
    } catch {
      // user cancelled — fall back to clipboard copy
    }
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // clipboard unavailable — ignore
    }
  };

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
          className="mb-6 flex items-center justify-between"
        >
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            {t("quizDetail.back")}
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            {shared ? (
              <>
                <Check className="size-4" />
                {t("quizDetail.shareCopied")}
              </>
            ) : (
              <>
                <Share2 className="size-4" />
                {t("btn.share")}
              </>
            )}
          </Button>
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
