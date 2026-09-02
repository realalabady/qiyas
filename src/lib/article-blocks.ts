/**
 * Article body parser — PURE, no imports, no DOM, no side effects.
 *
 * Shared by the React renderer (`src/components/content/article-body.tsx`) and
 * the crawler-facing SSR renderer (`api/_shared.ts`) so the two can never
 * disagree about an article's structure.
 *
 * The articles are authored as loose Markdown, but they mark sections with
 * Arabic ordinals on a standalone line ("أولاً: حدد هدفك") rather than with
 * `##` headings, and their bullets are often written `*text` with no space.
 * Parsed naively, every article collapsed into one wall of text with literal
 * `*` and `⸻` characters visible on the page.
 */

export type ArticleBlock =
  | { type: "h2" | "h3" | "p"; text: string }
  | { type: "ul"; items: string[] };

/** Arabic ordinals used as section headers across the article corpus. */
const ORDINAL =
  /^(?:أولا|ثانيا|ثالثا|رابعا|خامسا|سادسا|سابعا|ثامنا|تاسعا|عاشرا)ً?\s*[:：-]/;

/** Horizontal rules, including the U+2E3B separator these articles use. */
const RULE = /^(?:[-*_]{3,}|⸻+|—{3,})$/;

export function parseArticleBlocks(content: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let list: string[] | null = null;

  const closeList = () => {
    if (list && list.length) blocks.push({ type: "ul", items: list });
    list = null;
  };

  for (const raw of (content || "").split(/\r?\n/)) {
    const line = raw.trim();

    if (!line || RULE.test(line)) {
      closeList();
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading && heading[2].trim()) {
      closeList();
      // Demote one level — the page title already occupies <h1>.
      blocks.push({
        type: heading[1].length >= 2 ? "h3" : "h2",
        text: heading[2].trim(),
      });
      continue;
    }

    // Section header written as an Arabic ordinal. Length-capped so ordinary
    // prose that happens to start with one is left as a paragraph.
    if (ORDINAL.test(line) && line.length <= 80) {
      closeList();
      blocks.push({ type: "h2", text: line.replace(/\s*[:：-]\s*$/, "") });
      continue;
    }

    // `*text`, `- text`, `• text` — the space is optional in this corpus.
    const bullet = /^[*\-•]\s*(.+)$/.exec(line);
    if (bullet) {
      if (!list) list = [];
      list.push(bullet[1].trim());
      continue;
    }

    // "1. اختبارات تعليمية" introduces a section that a paragraph then
    // explains, so these are sub-headings rather than ordered-list items.
    const numbered = /^(\d+)[.)]\s+(.+)$/.exec(line);
    if (numbered) {
      closeList();
      blocks.push({ type: "h3", text: numbered[2].trim() });
      continue;
    }

    closeList();
    blocks.push({ type: "p", text: line });
  }

  closeList();
  return blocks;
}

export type InlineSegment =
  | { kind: "text"; text: string }
  | { kind: "strong"; text: string }
  | { kind: "em"; text: string }
  | { kind: "link"; text: string; href: string };

/** Split a line into `**bold**`, `*italic*`, `[label](url)` and plain runs. */
export function parseInline(text: string): InlineSegment[] {
  const pattern =
    /\*\*([^*]+)\*\*|\*([^*\n]+)\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
  const out: InlineSegment[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last)
      out.push({ kind: "text", text: text.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ kind: "strong", text: m[1] });
    else if (m[2] !== undefined) out.push({ kind: "em", text: m[2] });
    else out.push({ kind: "link", text: m[3], href: m[4] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ kind: "text", text: text.slice(last) });
  return out;
}

/** Stable anchor id for a heading, used by the table of contents. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9؀-ۿ\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}
