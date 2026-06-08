import { Outlet } from "react-router-dom";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Skip to main content for a11y */}
      <a
        href="#main-content"
        className="sr-only absolute left-4 top-2 z-50 rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:not-sr-only"
      >
        Skip to content
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
