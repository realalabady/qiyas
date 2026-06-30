import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/stores/theme-store";

const NAV_LINKS = [
  { to: "/", label: "nav.home", end: true },
  { to: "/explore", label: "nav.explore" },
  { to: "/categories", label: "nav.categories" },
  { to: "/articles", label: "nav.articles" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isRtl = language === "ar";

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Drawer slides in from the same side the hamburger lives on.
  // In RTL the flex row reverses so the actions block (containing the
  // hamburger) sits on the LEFT — the drawer should come from there too.
  const drawerSide = isRtl
    ? { position: "left-0", border: "border-r", initial: "-100%", exit: "-100%" }
    : { position: "right-0", border: "border-l", initial: "100%", exit: "100%" };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-lg shadow-black/10"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex h-16 items-center justify-between gap-2 sm:gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-lg shrink-0"
            >
              <img
                src={theme.logo || "/al-maarefah-header.png"}
                alt="Al-Maarefah"
                className="h-10 sm:h-14 w-auto max-w-[140px] sm:max-w-none object-contain"
              />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "bg-white/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                    )
                  }
                >
                  {t(label)}
                </NavLink>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search — hidden on smallest screens */}
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className="hidden sm:inline-flex"
              >
                <Link to="/search" aria-label={t("nav.search")}>
                  <Search className="size-4" />
                </Link>
              </Button>

              <LanguageSwitcher />

              {/* Start-quiz CTA — hidden on mobile to make room for hamburger */}
              <Button size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/explore">{t("btn.start")}</Link>
              </Button>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label={t("nav.toggle_menu")}
                className="md:hidden flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-white/5 transition hover:bg-white/10"
              >
                {open ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/60 md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer — slides from the hamburger's side */}
            <motion.nav
              key="drawer"
              initial={{ x: drawerSide.initial }}
              animate={{ x: 0 }}
              exit={{ x: drawerSide.exit }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className={cn(
                "fixed top-0 bottom-0 z-40 w-72 bg-card flex flex-col gap-2 pt-20 pb-8 px-4 md:hidden",
                drawerSide.position,
                drawerSide.border,
                "border-border",
              )}
            >
              {NAV_LINKS.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                    )
                  }
                >
                  {t(label)}
                </NavLink>
              ))}

              <NavLink
                to="/search"
                className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <Search className="size-4" />
                {t("nav.search")}
              </NavLink>

              {/* Start-quiz CTA inside the drawer on mobile */}
              <div className="mt-2">
                <Button asChild className="w-full">
                  <Link to="/explore">{t("btn.start")}</Link>
                </Button>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <LanguageSwitcher />
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
