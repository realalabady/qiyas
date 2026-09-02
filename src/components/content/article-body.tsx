/**
 * Lightweight article renderer with heading anchors + Table-of-Contents support.
 *
 * Plain-text articles (no markdown headings) render exactly as before — a single
 * pre-wrapped block — so existing content is visually unchanged. When an article
 * uses markdown `##` / `###` headings, they become anchored <h2>/<h3> elements
 * and `extractHeadings` yields the TOC entries that link to them.
 */

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9؀-ۿ\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function headingMatch(line: string): { level: 2 | 3; text: string } | null {
  const m = /^(#{1,3})\s+(.*)$/.exec(line.trim());
  if (!m) return null;
  const level = m[1].length >= 3 ? 3 : 2;
  return { level, text: m[2].trim() };
}

/** Collect the markdown headings from an article's content (for the TOC). */
export function extractHeadings(content: string): Heading[] {
  const out: Heading[] = [];
  const seen = new Set<string>();
  for (const line of (content || "").split("\n")) {
    const h = headingMatch(line);
    if (!h || !h.text) continue;
    let id = slugify(h.text);
    let n = 2;
    while (seen.has(id)) id = `${slugify(h.text)}-${n++}`;
    seen.add(id);
    out.push({ id, text: h.text, level: h.level });
  }
  return out;
}

export function ArticleBody({ content }: { content: string }) {
  const headings = extractHeadings(content);

  // No structure → keep the original look untouched.
  if (headings.length === 0) {
    return (
      <div className="prose prose-invert max-w-none whitespace-pre-line text-foreground/90 leading-relaxed">
        {content}
      </div>
    );
  }

  const lines = (content || "").split("\n");
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let listOrdered = false;
  const seen = new Set<string>();
  let key = 0;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(
        <p key={key++} className="whitespace-pre-line">
          {paragraph.join("\n")}
        </p>,
      );
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      const items = list.map((li, i) => <li key={i}>{li}</li>);
      blocks.push(
        listOrdered ? (
          <ol key={key++} className="list-decimal ps-6 space-y-1">
            {items}
          </ol>
        ) : (
          <ul key={key++} className="list-disc ps-6 space-y-1">
            {items}
          </ul>
        ),
      );
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const h = headingMatch(line);
    if (h && h.text) {
      flushParagraph();
      flushList();
      let id = slugify(h.text);
      let n = 2;
      while (seen.has(id)) id = `${slugify(h.text)}-${n++}`;
      seen.add(id);
      if (h.level === 3) {
        blocks.push(
          <h3 key={key++} id={id} className="text-xl font-semibold mt-6 mb-2 scroll-mt-24">
            {h.text}
          </h3>,
        );
      } else {
        blocks.push(
          <h2 key={key++} id={id} className="text-2xl font-bold mt-8 mb-3 scroll-mt-24">
            {h.text}
          </h2>,
        );
      }
      continue;
    }

    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
    const ordered = /^\s*\d+\.\s+(.*)$/.exec(line);
    if (bullet || ordered) {
      flushParagraph();
      const nextOrdered = Boolean(ordered);
      if (list.length && nextOrdered !== listOrdered) flushList();
      listOrdered = nextOrdered;
      list.push((bullet?.[1] ?? ordered?.[1] ?? "").trim());
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    flushList();
    paragraph.push(line);
  }
  flushParagraph();
  flushList();

  return (
    <div className="prose prose-invert max-w-none text-foreground/90 leading-relaxed space-y-4">
      {blocks}
    </div>
  );
}
