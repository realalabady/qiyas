import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

import { Separator } from "@/components/ui/separator";

const CATEGORY_LINKS = [
  { to: "/categories", label: "All Categories" },
  { to: "/category/personality", label: "Personality" },
  { to: "/category/iq", label: "IQ Tests" },
  { to: "/category/career", label: "Career" },
  { to: "/category/entertainment", label: "Entertainment" },
];

const COMPANY_LINKS = [
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
];

const LEGAL_LINKS = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
];

const SOCIAL = [
  { href: "#", label: "X (Twitter)", abbr: "𝕏" },
  { href: "#", label: "Instagram", abbr: "IG" },
  { href: "#", label: "YouTube", abbr: "YT" },
  { href: "#", label: "Facebook", abbr: "FB" },
];

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {links.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

export function Footer() {
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
              <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 shadow-lg shadow-primary/40">
                <Zap className="size-4 text-white" />
              </span>
              <span className="gradient-text">Qiyas</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              Discover yourself through fun, accurate, and engaging personality
              quizzes.
            </p>
            <div className="flex gap-3">
              {SOCIAL.map(({ href, label, abbr }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-white/5 text-muted-foreground hover:text-foreground hover:border-border transition-colors text-xs font-bold"
                >
                  {abbr}
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Categories" links={CATEGORY_LINKS} />
          <FooterCol title="Company" links={COMPANY_LINKS} />
          <FooterCol title="Legal" links={LEGAL_LINKS} />
        </div>

        <Separator className="my-8 opacity-40" />

        {/* Bottom bar */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Qiyas. All rights reserved.</p>
          <p>Made with ❤️ for curious minds</p>
        </div>
      </div>
    </footer>
  );
}
