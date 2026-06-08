import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Zap, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "@/lib/i18n";

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
  const { t } = useLanguage();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

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
          <nav className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-lg shrink-0"
            >
              <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 shadow-lg shadow-primary/40">
                <Zap className="size-4 text-white" />
              </span>
              <span className="gradient-text">Qiyas</span>
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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className="hidden sm:inline-flex"
              >
                <Link to="/search" aria-label="Search">
                  <Search className="size-4" />
                </Link>
              </Button>

              <LanguageSwitcher />

              <Button size="sm" asChild>
                <Link to="/explore">{t("btn.start")}</Link>
              </Button>

              {/* Hamburger */}
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Toggle menu"
                className="md:hidden flex size-9 items-center justify-center rounded-xl border border-border/50 bg-white/5 transition hover:bg-white/10"
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

            {/* Drawer */}
            <motion.nav
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-40 w-72 bg-card border-l border-border flex flex-col gap-2 pt-20 pb-8 px-4 md:hidden"
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
                {t("nav.home")}
              </NavLink>

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
