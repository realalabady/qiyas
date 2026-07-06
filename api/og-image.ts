/**
 * Serverless image endpoint for social link previews.
 *
 * Admin-uploaded thumbnails are stored as base64 `data:` URLs, which social
 * crawlers (WhatsApp, Facebook, …) cannot use as an `og:image`. This function
 * looks the quiz/article up in Firestore, and:
 *   - if the image is a `data:` URL → decodes it and returns real image bytes
 *   - if it's already an `http(s)` URL → redirects to it
 *   - otherwise → redirects to the site's default share image
 *
 * The middleware points `og:image` at `/api/og-image?type=…&slug=…` whenever the
 * stored image is a data URL, so crawlers fetch a normal image response here.
 */

const PROJECT_ID = "qiyas-5da06";
const DEFAULT_IMAGE = "/al-maarefah-header.png";

async function fetchImageValue(
  collectionId: string,
  slug: string,
): Promise<string> {
  const endpoint = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
  const body = {
    structuredQuery: {
      from: [{ collectionId }],
      where: {
        fieldFilter: {
          field: { fieldPath: "slug" },
          op: "EQUAL",
          value: { stringValue: slug },
        },
      },
      limit: 1,
    },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return "";

  const rows = (await res.json()) as Array<{
    document?: { fields?: Record<string, { stringValue?: string }> };
  }>;
  const fields = rows[0]?.document?.fields;
  if (!fields) return "";
  return fields.thumbnail?.stringValue || fields.image?.stringValue || "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any): Promise<void> {
  try {
    const { type = "quiz", slug = "" } = req.query as {
      type?: string;
      slug?: string;
    };

    if (!slug) {
      res.writeHead(302, { Location: DEFAULT_IMAGE });
      res.end();
      return;
    }

    const collection = type === "article" ? "articles" : "quizzes";
    const image = await fetchImageValue(collection, String(slug));

    // Decode a base64 data URL into real image bytes.
    const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/s.exec(image);
    if (match) {
      const contentType = match[1];
      const buffer = Buffer.from(match[2], "base64");
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      });
      res.end(buffer);
      return;
    }

    // Already a hosted URL — send the crawler there.
    if (image.startsWith("http")) {
      res.writeHead(302, {
        Location: image,
        "Cache-Control": "public, max-age=86400",
      });
      res.end();
      return;
    }

    res.writeHead(302, { Location: DEFAULT_IMAGE });
    res.end();
  } catch {
    res.writeHead(302, { Location: DEFAULT_IMAGE });
    res.end();
  }
}
