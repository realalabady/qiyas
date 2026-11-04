import { parseInline, type InlineSegment } from "@/lib/article-blocks";

/**
 * Render a run of text with the inline Markdown the content is written in:
 * **bold**, *emphasis* and links.
 *
 * It lives in its own file because two unrelated places need it. Article
 * bodies always used it; quiz result descriptions are written in the same
 * dialect but were being printed raw, so readers saw the asterisks around
 * every emphasised phrase.
 */
export function InlineMarkdown({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((seg: InlineSegment, i: number) => {
        if (seg.kind === "strong") return <strong key={i}>{seg.text}</strong>;
        if (seg.kind === "em") return <em key={i}>{seg.text}</em>;
        if (seg.kind === "link")
          return (
            <a
              key={i}
              href={seg.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              {seg.text}
            </a>
          );
        return <span key={i}>{seg.text}</span>;
      })}
    </>
  );
}
