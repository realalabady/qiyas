import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "ar" : "en")}
      className="gap-2"
    >
      <Globe className="w-4 h-4" />
      <span>{language === "en" ? t("lang.switch_to_ar") : t("lang.switch_to_en")}</span>
    </Button>
  );
}
