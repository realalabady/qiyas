import { Link } from "react-router-dom";

import { useLanguage } from "@/lib/i18n";
import { useArticles } from "@/stores/articles-store";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import {
  useCategories,
  localizedCategoryName,
} from "@/stores/categories-store";
import { useAnalyticsStore } from "@/stores/analytics-store";
import { localizedArticle } from "@/lib/localized-content";
import { localizedQuiz } from "@/lib/localized-content";
import {
  latestArticles,
  trendingArticles,
  popularQuizzes,
  categorySlug,
} from "@/lib/content-selectors";

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

/**
 * Desktop content sidebar: Latest Articles, Trending Articles, Popular Quizzes
 * and Categories — all crawlable anchor lists. Hidden below `lg` to preserve
 * the existing mobile layout.
 */
export function ContentSidebar({ className = "" }: { className?: string }) {
  const { t, language } = useLanguage();
  const { articles } = useArticles();
  const { quizzes } = useQuizzesAdmin();
  const { categories } = useCategories();
  const views = useAnalyticsStore((s) => s.views);

  const latest = latestArticles(articles, 5);
  const trending = trendingArticles(articles, 5);
  const popular = popularQuizzes(quizzes, views, 5);
  const quizCategories = categories.filter((c) => c.type === "quiz").slice(0, 8);

  return (
    <aside className={`hidden lg:flex flex-col gap-5 ${className}`}>
      {latest.length > 0 && (
        <SidebarSection title={t("sidebar.latest_articles")}>
          {latest.map((raw) => {
            const a = localizedArticle(raw, language);
            return (
              <li key={a.id}>
                <Link
                  to={`/articles/${a.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-2"
                >
                  {a.title}
                </Link>
              </li>
            );
          })}
        </SidebarSection>
      )}

      {trending.length > 0 && (
        <SidebarSection title={t("sidebar.trending_articles")}>
          {trending.map((raw) => {
            const a = localizedArticle(raw, language);
            return (
              <li key={a.id}>
                <Link
                  to={`/articles/${a.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-2"
                >
                  {a.title}
                </Link>
              </li>
            );
          })}
        </SidebarSection>
      )}

      {popular.length > 0 && (
        <SidebarSection title={t("sidebar.popular_quizzes")}>
          {popular.map((raw) => {
            const q = localizedQuiz(raw, language);
            return (
              <li key={q.id}>
                <Link
                  to={`/quiz/${q.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-2"
                >
                  {q.title}
                </Link>
              </li>
            );
          })}
        </SidebarSection>
      )}

      {quizCategories.length > 0 && (
        <SidebarSection title={t("sidebar.categories")}>
          {quizCategories.map((cat) => (
            <li key={cat.id}>
              <Link
                to={`/explore?category=${categorySlug(cat.name)}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
              >
                <span>{cat.icon}</span>
                {localizedCategoryName(cat, language)}
              </Link>
            </li>
          ))}
        </SidebarSection>
      )}
    </aside>
  );
}
