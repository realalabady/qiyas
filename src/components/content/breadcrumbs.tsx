import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

import { useLanguage } from "@/lib/i18n";

export interface Crumb {
  /** Visible label. */
  label: string;
  /** Internal path. Omit for the current (last) page. */
  to?: string;
}

/**
 * Semantic breadcrumb trail with BreadcrumbList structured data.
 *
 * Renders a real <nav><ol> of anchors (crawlable) and emits a JSON-LD
 * BreadcrumbList so Google understands the site hierarchy. Direction-aware:
 * the separator flips for RTL (Arabic).
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { getDirection } = useLanguage();
  const isRtl = getDirection() === "rtl";
  const Sep = isRtl ? ChevronLeft : ChevronRight;
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.to ? { item: `${origin}${item.to}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  {i === 0 && <Home className="size-3.5" />}
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-foreground font-medium line-clamp-1 max-w-[16rem]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
              {!isLast && <Sep className="size-3.5 opacity-60 shrink-0" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
