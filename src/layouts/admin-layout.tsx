import { NavLink, Outlet } from "react-router-dom";

import AppFrame from "@/components/layout/app-frame";
import { cn } from "@/lib/utils";

const adminLinks = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/quizzes", label: "Quizzes" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/articles", label: "Articles" },
  { to: "/admin/media", label: "Media" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/settings", label: "Settings" },
];

function AdminLayout() {
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
              Admin Area
            </p>
            <h1 className="mt-2 text-lg font-semibold text-foreground">
              Qiyas Console
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
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section className="flex flex-1 flex-col">
          <header className="border-b border-white/10 px-4 py-3 sm:px-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Secure Workspace
            </p>
            <p className="mt-1 text-sm text-foreground">
              Admin authentication and route protection will be added in Phase
              5.
            </p>
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
                  {link.label}
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
