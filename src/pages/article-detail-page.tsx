import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Check,
  User,
  CalendarDays,
  RefreshCw,
  Clock,
  ListTree,
} from "lucide-react";

import { useArticles } from "@/stores/articles-store";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n";
import { localizedArticle } from "@/lib/localized-content";
import { categoryLabel } from "@/lib/category-i18n";
import {
  useAutoTranslateArticles,
  useAutoTranslateQuizzes,
} from "@/hooks/use-auto-translate";
import { setSEOMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ArticleBody, extractHeadings } from "@/components/content/article-body";
import { ContentRail } from "@/components/content/content-rail";
import { ArticleCard } from "@/components/content/article-card";
import { QuizRailCard } from "@/components/content/quiz-rail-card";
import { ContentSidebar } from "@/components/content/content-sidebar";
import {
  relatedArticles,
  relatedQuizzesForArticle,
  readingTimeMinutes,
  categorySlug,
} from "@/lib/content-selectors";

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { articles, getArticleBySlug } = useArticles();
  const { quizzes } = useQuizzesAdmin();
  const { t, language } = useLanguage();
  const [shared, setShared] = useState(false);

  const rawArticle = getArticleBySlug(slug || "");
  const article = rawArticle ? localizedArticle(rawArticle, language) : undefined;

  // Backfill translations for this article + any quizzes we cross-link to.
  useAutoTranslateArticles(rawArticle ? [rawArticle] : []);
  useAutoTranslateQuizzes(quizzes.filter((q) => q.published));

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
  }, [rawArticle, language]);

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

  const locale = language === "ar" ? "ar-EG" : "en-US";
  const publishedDate = new Date(article.createdAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const updatedDate = new Date(article.updatedAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const showUpdated =
    new Date(article.updatedAt).getTime() - new Date(article.createdAt).getTime() >
    24 * 60 * 60 * 1000;
  const minutes = readingTimeMinutes(article.content);
  const headings = extractHeadings(article.content);

  const related = relatedArticles(rawArticle!, articles, 6);
  const relatedQuizzes = relatedQuizzesForArticle(article, quizzes, 4);
  const faq = article.faq?.filter((f) => f.question && f.answer) ?? [];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs
          items={[
            { label: t("nav.home"), to: "/" },
            { label: t("articles.title"), to: "/articles" },
            {
              label: categoryLabel(article.category, t),
              to: `/articles?category=${categorySlug(article.category)}`,
            },
            { label: article.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 min-w-0">
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
                <ArrowLeft className="size-4 rtl:rotate-180" />
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
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                  {article.title}
                </h1>

                {/* Meta row: category · author · published · updated · reading time */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <Link
                    to={`/articles?category=${categorySlug(article.category)}`}
                    className="px-2.5 py-1 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                  >
                    {categoryLabel(article.category, t)}
                  </Link>
                  <span className="inline-flex items-center gap-1.5">
                    <User className="size-3.5" />
                    {article.author}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" />
                    {publishedDate}
                  </span>
                  {showUpdated && (
                    <span className="inline-flex items-center gap-1.5">
                      <RefreshCw className="size-3.5" />
                      {t("article.updated")} {updatedDate}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {minutes} {t("article.min_read")}
                  </span>
                </div>

                <p className="text-muted-foreground text-lg">{article.excerpt}</p>

                {/* Table of contents (renders only when the article has headings) */}
                {headings.length >= 2 && (
                  <nav
                    aria-label={t("article.toc")}
                    className="rounded-xl border border-border/50 bg-white/5 p-4"
                  >
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <ListTree className="size-4" />
                      {t("article.toc")}
                    </p>
                    <ul className="space-y-1.5">
                      {headings.map((h) => (
                        <li key={h.id} className={h.level === 3 ? "ps-4" : ""}>
                          <a
                            href={`#${h.id}`}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}

                <ArticleBody content={article.content} />

                {/* Tags — extra crawlable context */}
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-border/50 text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>

            {/* FAQ (renders + emits FAQPage schema only when the article has FAQs) */}
            {faq.length > 0 && (
              <motion.section
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-8 glass-card rounded-2xl p-6 sm:p-8"
              >
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "FAQPage",
                      mainEntity: faq.map((f) => ({
                        "@type": "Question",
                        name: f.question,
                        acceptedAnswer: { "@type": "Answer", text: f.answer },
                      })),
                    }),
                  }}
                />
                <h2 className="text-2xl font-bold mb-4">{t("article.faq")}</h2>
                <div className="divide-y divide-border/40">
                  {faq.map((f, i) => (
                    <div key={i} className="py-4">
                      <h3 className="font-semibold text-foreground mb-1.5">
                        {f.question}
                      </h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {f.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Related articles (6) */}
            {related.length > 0 && (
              <div className="mt-12">
                <ContentRail
                  title={t("article.related_articles")}
                  viewAllTo="/articles"
                >
                  {related.map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </ContentRail>
              </div>
            )}

            {/* Related quizzes (4) */}
            {relatedQuizzes.length > 0 && (
              <div className="mt-12">
                <motion.section
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                      {t("article.related_quizzes")}
                    </h2>
                  </div>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                  >
                    {relatedQuizzes.map((q) => (
                      <motion.div key={q.id} variants={staggerItem}>
                        <QuizRailCard quiz={q} />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.section>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <ContentSidebar className="lg:col-span-1 mt-6 lg:mt-16" />
        </div>
      </div>
    </div>
  );
}
