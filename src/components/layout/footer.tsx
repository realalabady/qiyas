import { Link } from "react-router-dom";

import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/i18n";
import { useCategories } from "@/stores/categories-store";

const COMPANY_LINKS = [
  { to: "/about", labelKey: "footer.about_us" },
  { to: "/contact", labelKey: "footer.contact" },
  { to: "/faq", labelKey: "footer.faq" },
];

const LEGAL_LINKS = [
  { to: "/privacy-policy", labelKey: "footer.privacy_policy" },
  { to: "/terms", labelKey: "footer.terms" },
];

const SOCIAL = [
  { href: "https://x.com/almaarefahh", label: "X (Twitter)", abbr: "𝕏" },
  { href: "https://instagram.com/almaarefahh", label: "Instagram", abbr: "IG" },
];

function FooterCol({
  titleKey,
  links,
  t,
}: {
  titleKey: string;
  links: { to: string; labelKey: string }[];
  t: (key: string) => string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-foreground">{t(titleKey)}</p>
      {links.map(({ to, labelKey }) => (
        <Link
          key={to}
          to={to}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t(labelKey)}
        </Link>
      ))}
    </div>
  );
}

export function Footer() {
  const { t } = useLanguage();
  const { categories } = useCategories();

  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
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
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
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

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground">
              {t("footer.categories")}
            </p>
            <Link
              to="/categories"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("footer.all_categories")}
            </Link>
            {categories
              .filter((category) => category.type === "quiz")
              .slice(0, 4)
              .map((category) => (
              <Link
                key={category.id}
                to={`/explore?category=${category.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
          <FooterCol titleKey="footer.company" links={COMPANY_LINKS} t={t} />
          <FooterCol titleKey="footer.legal" links={LEGAL_LINKS} t={t} />
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
