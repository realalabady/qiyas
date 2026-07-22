import { Link } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/i18n";
import {
  useCategories,
  localizedCategoryName,
} from "@/stores/categories-store";
import { useArticles } from "@/stores/articles-store";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import { useAnalyticsStore } from "@/stores/analytics-store";
import { localizedArticle, localizedQuiz } from "@/lib/localized-content";
import {
  popularArticles,
  latestArticles,
  popularQuizzes,
  latestQuizzes,
  categorySlug,
} from "@/lib/content-selectors";

const COMPANY_LINKS = [
  { to: "/about", labelKey: "footer.about_us" },
  { to: "/contact", labelKey: "footer.contact" },
  { to: "/faq", labelKey: "footer.faq" },
  { to: "/privacy-policy", labelKey: "footer.privacy_policy" },
  { to: "/terms", labelKey: "footer.terms" },
];

const SOCIAL = [
  { href: "https://x.com/almaarefahh", label: "X (Twitter)", abbr: "𝕏" },
  { href: "https://instagram.com/almaarefahh", label: "Instagram", abbr: "IG" },
];

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {children}
    </div>
  );
}

const footerLink =
  "text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-1";

export function Footer() {
  const { t, language } = useLanguage();
  const { categories } = useCategories();
  const { articles } = useArticles();
  const { quizzes } = useQuizzesAdmin();
  const views = useAnalyticsStore((s) => s.views);

  const popArticles = popularArticles(articles, 5);
  const recentArticles = latestArticles(articles, 5);
  const popQuizzes = popularQuizzes(quizzes, views, 5);
  const recentQuizzes = latestQuizzes(quizzes, 5);
  const quizCategories = categories.filter((c) => c.type === "quiz").slice(0, 6);

  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Brand row */}
        <div className="flex flex-col gap-4 mb-10 max-w-sm">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg w-fit"
          >
            <img
              src="/al-maarefah-header.png"
              alt="Al-Maarefah"
              className="h-14 w-auto object-contain"
            />
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t("footer.description")}
          </p>
          <div className="flex gap-3">
            {SOCIAL.map(({ href, label, abbr }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-white/5 text-muted-foreground hover:text-foreground hover:border-border transition-colors text-xs font-bold"
              >
                {abbr}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns — all crawlable anchors for deep internal linking */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {popArticles.length > 0 && (
            <FooterCol title={t("footer.popular_articles")}>
              {popArticles.map((raw) => {
                const a = localizedArticle(raw, language);
                return (
                  <Link key={a.id} to={`/articles/${a.slug}`} className={footerLink}>
                    {a.title}
                  </Link>
                );
              })}
            </FooterCol>
          )}

          {recentArticles.length > 0 && (
            <FooterCol title={t("footer.recent_articles")}>
              {recentArticles.map((raw) => {
                const a = localizedArticle(raw, language);
                return (
                  <Link key={a.id} to={`/articles/${a.slug}`} className={footerLink}>
                    {a.title}
                  </Link>
                );
              })}
            </FooterCol>
          )}

          {popQuizzes.length > 0 && (
            <FooterCol title={t("footer.popular_quizzes")}>
              {popQuizzes.map((raw) => {
                const q = localizedQuiz(raw, language);
                return (
                  <Link key={q.id} to={`/quiz/${q.slug}`} className={footerLink}>
                    {q.title}
                  </Link>
                );
              })}
            </FooterCol>
          )}

          {recentQuizzes.length > 0 && (
            <FooterCol title={t("footer.recent_quizzes")}>
              {recentQuizzes.map((raw) => {
                const q = localizedQuiz(raw, language);
                return (
                  <Link key={q.id} to={`/quiz/${q.slug}`} className={footerLink}>
                    {q.title}
                  </Link>
                );
              })}
            </FooterCol>
          )}

          <FooterCol title={t("footer.categories")}>
            <Link to="/categories" className={footerLink}>
              {t("footer.all_categories")}
            </Link>
            {quizCategories.map((category) => (
              <Link
                key={category.id}
                to={`/explore?category=${categorySlug(category.name)}`}
                className={footerLink}
              >
                {localizedCategoryName(category, language)}
              </Link>
            ))}
          </FooterCol>

          <FooterCol title={t("footer.company")}>
            {COMPANY_LINKS.map(({ to, labelKey }) => (
              <Link key={to} to={to} className={footerLink}>
                {t(labelKey)}
              </Link>
            ))}
          </FooterCol>
        </div>

        <Separator className="my-8 opacity-40" />

        {/* Bottom bar */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Al-Maarefah. {t("footer.rights_only")}
          </p>
          <p>{t("footer.made_with")}</p>
        </div>
      </div>
    </footer>
  );
}
