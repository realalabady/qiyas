/**
 * Entertainment / non-diagnostic disclaimer for quiz and article pages.
 *
 * Psychology- and IQ-adjacent content needs this visible on the page itself.
 * It previously lived only in Terms §4 — a page that, before the SSR fix,
 * rendered as an empty shell to crawlers and reviewers.
 */

import { useLanguage } from "@/lib/i18n";

export function ContentDisclaimer({ className = "" }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <p
      className={`text-xs text-muted-foreground/80 border-t border-border/40 pt-4 mt-8 ${className}`}
    >
      {t("content.disclaimer")}
    </p>
  );
}
