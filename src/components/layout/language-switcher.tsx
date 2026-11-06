import { useLocation, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { pathForLocale, splitLocale } from "@/lib/locale-routing";

/**
 * Switching language now changes the URL rather than only the store.
 *
 * English lives under /en/…, so a reader who switches gets an address they can
 * share or bookmark, and the page they land on is the one Google indexes as
 * English. PublicLayout reads the prefix back and sets the language, so the
 * two never disagree.
 */
export function LanguageSwitcher() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();

  const next = language === "en" ? "ar" : "en";

  const switchTo = () => {
    const { path } = splitLocale(pathname);
    navigate(`${pathForLocale(path, next)}${search}${hash}`);
  };

  return (
    <Button variant="ghost" size="sm" onClick={switchTo} className="gap-2">
      <Globe className="w-4 h-4" />
      <span>
        {language === "en" ? t("lang.switch_to_ar") : t("lang.switch_to_en")}
      </span>
    </Button>
  );
}
