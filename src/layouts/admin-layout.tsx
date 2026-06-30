import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { Home, LogOut } from "lucide-react";

import AppFrame from "@/components/layout/app-frame";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useLanguage } from "@/lib/i18n";
import { useAdmin } from "@/contexts/admin-context";
import { cn } from "@/lib/utils";

const adminLinks = [
  { to: "/admin", labelKey: "admin.overview", end: true },
  { to: "/admin/quizzes", labelKey: "admin.quizzes" },
  { to: "/admin/categories", labelKey: "admin.categories" },
  { to: "/admin/analytics", labelKey: "admin.analytics" },
  { to: "/admin/articles", labelKey: "admin.articles" },
  { to: "/admin/media", labelKey: "admin.media" },
  { to: "/admin/settings", labelKey: "admin.settings" },
];

function AdminLayout() {
  const { t } = useLanguage();
  const { user, logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <AppFrame
      maxWidthClassName="max-w-7xl"
      className="py-6 sm:py-8"
      showBackdrop={false}
    >
      <div className="glass-card flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden lg:flex-row">
        <aside className="hidden w-72 border-r border-white/10 p-4 lg:block">
          <div className="mb-6 px-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {t("admin.area")}
            </p>
            <h1 className="mt-2 text-lg font-semibold text-foreground">
              {t("admin.console")}
            </h1>
          </div>
          <nav className="space-y-1">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "block rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/10 hover:text-foreground",
                    isActive && "bg-white/10 text-foreground",
                  )
                }
                >
                  {t(link.labelKey)}
                </NavLink>
              ))}
          </nav>
        </aside>
        <section className="flex flex-1 flex-col">
          <header className="border-b border-white/10 px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t("admin.secure_workspace")}
                </p>
                <p className="mt-1 text-sm text-foreground">{t("admin.secure_note")}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-white/10 transition-colors"
                >
                  <Home className="size-3.5" />
                  {t("admin.go_home")}
                </Link>
                {user && (
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-white/10 transition-colors"
                  >
                    <LogOut className="size-3.5" />
                    {t("admin.logout")}
                  </button>
                )}
                <LanguageSwitcher />
              </div>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {adminLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      "whitespace-nowrap rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-white/10 hover:text-foreground",
                      isActive && "bg-white/10 text-foreground",
                    )
                  }
                >
                  {t(link.labelKey)}
                </NavLink>
              ))}
            </nav>
          </header>
          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </section>
      </div>
    </AppFrame>
  );
}

export default AdminLayout;
