/**
 * Article renderer with heading anchors + Table-of-Contents support.
 *
 * Structure comes from `parseArticleBlocks` in `@/lib/article-blocks`, the same
 * parser the crawler-facing SSR renderer uses, so the HTML a visitor sees and
 * the HTML Googlebot receives always agree.
 */

import {
  type ArticleBlock,
  parseArticleBlocks,
  slugifyHeading,
} from "@/lib/article-blocks";
import { InlineMarkdown } from "@/components/content/inline-markdown";

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Assign a unique anchor id to every heading block, in document order. */
function withHeadingIds(blocks: ArticleBlock[]): Map<ArticleBlock, string> {
  const ids = new Map<ArticleBlock, string>();
  const seen = new Set<string>();
  for (const block of blocks) {
    if (block.type !== "h2" && block.type !== "h3") continue;
    const base = slugifyHeading(block.text);
    let id = base;
    let n = 2;
    while (seen.has(id)) id = `${base}-${n++}`;
    seen.add(id);
    ids.set(block, id);
  }
  return ids;
}

/** Collect the headings from an article's content (for the TOC). */
export function extractHeadings(content: string): Heading[] {
  const blocks = parseArticleBlocks(content);
  const ids = withHeadingIds(blocks);
  const out: Heading[] = [];
  for (const block of blocks) {
    const id = ids.get(block);
    if (!id || (block.type !== "h2" && block.type !== "h3")) continue;
    out.push({ id, text: block.text, level: block.type === "h3" ? 3 : 2 });
  }
  return out;
}


export function ArticleBody({ content }: { content: string }) {
  const blocks = parseArticleBlocks(content);
  const ids = withHeadingIds(blocks);

  return (
    <div className="prose prose-invert max-w-none text-foreground/90 leading-relaxed space-y-4">
      {blocks.map((block, i) => {
        if (block.type === "ul") {
          return (
            <ul key={i} className="list-disc ps-6 space-y-1">
              {block.items.map((item, j) => (
                <li key={j}>
                  <InlineMarkdown text={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "h2") {
          return (
            <h2
              key={i}
              id={ids.get(block)}
              className="text-2xl font-bold mt-8 mb-3 scroll-mt-24"
            >
              <InlineMarkdown text={block.text} />
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3
              key={i}
              id={ids.get(block)}
              className="text-xl font-semibold mt-6 mb-2 scroll-mt-24"
            >
              <InlineMarkdown text={block.text} />
            </h3>
          );
        }
        return (
          <p key={i}>
            <InlineMarkdown text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
