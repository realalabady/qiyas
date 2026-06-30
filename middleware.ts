/**
 * Vercel Edge Middleware — injects Open Graph meta tags for social crawlers.
 *
 * Bots (WhatsApp, Facebook, Twitter, etc.) don't execute JavaScript, so
 * client-side setSEOMetadata() is invisible to them.  This middleware
 * intercepts /articles/:slug and /quiz/:slug requests from known crawler
 * user-agents, fetches the document from Firestore (REST API — no SDK
 * needed, publicly readable for published docs) and returns a minimal HTML
 * shell whose <head> has the correct og:title, og:description, og:image and
 * og:url tags plus a meta-refresh redirect so real browsers end up at the SPA.
 *
 * All other requests fall through to the normal Vercel rewrite (index.html).
 */

const PROJECT_ID = "qiyas-5da06";

const BOT_PATTERN =
  /bot|crawl|spider|facebookexternalhit|whatsapp|telegrambot|twitterbot|linkedinbot|slackbot|discordbot|skypeuri|viber|line-poker|snapchat|pinterestbot|applebot|bingbot|googlebot|yandexbot/i;

interface OgData {
  title: string;
  description: string;
  image: string;
}

type FirestoreStringValue = { stringValue: string };

async function fetchFromFirestore(
  collectionId: string,
  slug: string,
): Promise<OgData | null> {
  const endpoint = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;

  const body = {
    structuredQuery: {
      from: [{ collectionId }],
      where: {
        compositeFilter: {
          op: "AND",
          filters: [
            {
              fieldFilter: {
                field: { fieldPath: "slug" },
                op: "EQUAL",
                value: { stringValue: slug },
              },
            },
            {
              fieldFilter: {
                field: { fieldPath: "published" },
                op: "EQUAL",
                value: { booleanValue: true },
              },
            },
          ],
        },
      },
      limit: 1,
    },
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;

    const rows = (await res.json()) as Array<{
      document?: { fields: Record<string, unknown> };
    }>;
    const fields = rows[0]?.document?.fields as
      | Record<string, FirestoreStringValue>
      | undefined;
    if (!fields) return null;

    const str = (key: string) => fields[key]?.stringValue ?? "";

    return {
      title: str("title"),
      description: str("description") || str("excerpt"),
      image: str("thumbnail") || str("image"),
    };
  } catch {
    return null;
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(data: OgData, pageUrl: string): string {
  const absImage = data.image.startsWith("http") ? data.image : "";
  const imgTags = absImage
    ? `<meta property="og:image" content="${esc(absImage)}">
<meta name="twitter:image" content="${esc(absImage)}">`
    : "";

  return `<!DOCTYPE html>
<html lang="ar">
<head>
<meta charset="UTF-8">
<title>${esc(data.title)} \xB7 Al-Maarefah</title>
<meta name="description" content="${esc(data.description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Al-Maarefah">
<meta property="og:title" content="${esc(data.title)}">
<meta property="og:description" content="${esc(data.description)}">
<meta property="og:url" content="${esc(pageUrl)}">
${imgTags}
<meta name="twitter:card" content="${absImage ? "summary_large_image" : "summary"}">
<meta name="twitter:site" content="@almaarefahh">
<meta name="twitter:title" content="${esc(data.title)}">
<meta name="twitter:description" content="${esc(data.description)}">
<meta http-equiv="refresh" content="0;url=${esc(pageUrl)}">
</head>
<body></body>
</html>`;
}

export default async function middleware(
  request: Request,
): Promise<Response | undefined> {
  const ua = request.headers.get("user-agent") ?? "";
  if (!BOT_PATTERN.test(ua)) return undefined;

  const { pathname, href } = new URL(request.url);

  const articleMatch = pathname.match(/^\/articles\/([^/?#]+)/);
  const quizMatch = pathname.match(/^\/quiz\/([^/?#]+)/);

  let data: OgData | null = null;

  if (articleMatch) {
    data = await fetchFromFirestore("articles", articleMatch[1]);
  } else if (quizMatch) {
    data = await fetchFromFirestore("quizzes", quizMatch[1]);
  }

  if (!data?.title) return undefined;

  return new Response(buildHtml(data, href), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

export const config = {
  matcher: ["/articles/:slug*", "/quiz/:slug*"],
};
