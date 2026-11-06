import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { useLanguage } from "@/lib/i18n";
import { splitLocale } from "@/lib/locale-routing";

function PublicLayout() {
  const { t, language, setLanguage } = useLanguage();
  const { pathname } = useLocation();

  // The URL decides the language, not the stored preference. Both trees mount
  // this layout, so landing on /en/… switches the app to English even when
  // localStorage still says Arabic — otherwise a shared English link would
  // open in Arabic for anyone who had used the site before.
  const urlLocale = splitLocale(pathname).locale;
  useEffect(() => {
    if (language !== urlLocale) setLanguage(urlLocale);
  }, [urlLocale, language, setLanguage]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ScrollToTop />
      {/* Skip to main content for a11y */}
      <a
        href="#main-content"
        className="sr-only absolute left-4 top-2 z-50 rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:not-sr-only"
      >
        {t("a11y.skip_content")}
      </a>

      <Navbar />

      {/* pt-16 offsets the fixed navbar */}
      <main id="main-content" className="flex-1 pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default PublicLayout;
