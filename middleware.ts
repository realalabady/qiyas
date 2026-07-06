/**
 * Vercel Edge Middleware — injects Open Graph meta tags for social crawlers.
 *
 * Bots (WhatsApp, Facebook, Twitter, etc.) don't execute JavaScript, so
 * client-side setSEOMetadata() is invisible to them. This middleware:
 *  1. Detects bot user-agents
 *  2. Looks up OG data from the embedded seed table first (no network needed)
 *  3. Falls back to a Firestore REST query for admin-added content
 *  4. Returns a minimal HTML shell with og:title / og:image / og:description
 *     plus a <meta http-equiv="refresh"> so real browsers still reach the SPA
 *
 * Non-bot requests return undefined → falls through to vercel.json rewrite.
 */

const PROJECT_ID = "qiyas-5da06";

const BOT_PATTERN =
  /bot|crawl|spider|facebookexternalhit|whatsapp|telegrambot|twitterbot|linkedinbot|slackbot|discordbot|skypeuri|viber|snapchat|pinterestbot|applebot|bingbot|googlebot|yandexbot/i;

interface OgData {
  title: string;
  description: string;
  image: string;
}

// ---------------------------------------------------------------------------
// Static seed lookup — works without any Firestore sync
// ---------------------------------------------------------------------------

const SEED_ARTICLES: Record<string, OgData> = {
  "understanding-personality-types-myers-briggs": {
    title:
      "Understanding Personality Types: A Deep Dive into the Myers-Briggs System",
    description:
      "Discover the foundations of the Myers-Briggs Type Indicator and how it can help you understand yourself and others better.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  "5-surprising-facts-about-iq-tests": {
    title: "5 Surprising Facts About IQ Tests You Didn't Know",
    description:
      "Learn surprising facts about IQ testing and what intelligence tests really measure.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
  "psychology-career-compatibility-tests": {
    title: "The Psychology Behind Career Compatibility Tests",
    description:
      "Explore the science behind career compatibility tests and how they can guide your professional path.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
};

const SEED_QUIZZES: Record<string, OgData> = {
  "personality-types": {
    title: "What Is Your Personality Type?",
    description:
      "Discover your core personality traits and how you interact with the world.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  },
  "iq-test-quick": {
    title: "Quick IQ Test",
    description:
      "A fun 10-minute test to estimate your intelligence quotient.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
  "career-match-test": {
    title: "Find Your Ideal Career",
    description:
      "Discover the career path that matches your natural strengths and personality.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
  "relationship-compatibility": {
    title: "Relationship Compatibility Test",
    description:
      "Discover how compatible you are with your partner across key relationship dimensions.",
    image:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",
  },
};

// ---------------------------------------------------------------------------
// Firestore fallback — for articles / quizzes added by admin via Sync
// ---------------------------------------------------------------------------

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
      description:
        str("description") || str("excerpt") || str("seoDescription"),
      image: str("thumbnail") || str("image"),
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// HTML builder
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(data: OgData, pageUrl: string): string {
  const absImage =
    data.image && data.image.startsWith("http") ? data.image : "";
  const imgTags = absImage
    ? `<meta property="og:image" content="${esc(absImage)}">
<meta property="og:image:width" content="800">
<meta property="og:image:height" content="418">
<meta name="twitter:image" content="${esc(absImage)}">`
    : "";

  return `<!DOCTYPE html>
<html lang="ar">
<head>
<meta charset="UTF-8">
<title>${esc(data.title)} · Al-Maarefah</title>
<meta name="description" content="${esc(data.description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Al-Maarefah | المعرفة">
<meta property="og:title" content="${esc(data.title)}">
<meta property="og:description" content="${esc(data.description)}">
<meta property="og:url" content="${esc(pageUrl)}">
${imgTags}
<meta name="twitter:card" content="${absImage ? "summary_large_image" : "summary"}">
<meta name="twitter:title" content="${esc(data.title)}">
<meta name="twitter:description" content="${esc(data.description)}">
<meta http-equiv="refresh" content="0;url=${esc(pageUrl)}">
</head>
<body></body>
</html>`;
}

// ---------------------------------------------------------------------------
// Middleware entry point
// ---------------------------------------------------------------------------

export default async function middleware(
  request: Request,
): Promise<Response | undefined> {
  const ua = request.headers.get("user-agent") ?? "";
  if (!BOT_PATTERN.test(ua)) return undefined;

  const { pathname, href } = new URL(request.url);

  const articleMatch = pathname.match(/^\/articles\/([^/?#]+)/);
  const quizMatch = pathname.match(/^\/quiz\/([^/?#]+)/);

  let data: OgData | null = null;
  let type: "article" | "quiz" | null = null;
  let matchedSlug = "";

  if (articleMatch) {
    type = "article";
    matchedSlug = articleMatch[1];
    data = SEED_ARTICLES[matchedSlug] ?? null;
    if (!data) data = await fetchFromFirestore("articles", matchedSlug);
  } else if (quizMatch) {
    type = "quiz";
    matchedSlug = quizMatch[1];
    data = SEED_QUIZZES[matchedSlug] ?? null;
    if (!data) data = await fetchFromFirestore("quizzes", matchedSlug);
  }

  if (!data?.title) return undefined;

  // Uploaded images are stored as base64 `data:` URLs, which crawlers can't use.
  // Route those through the image endpoint so they resolve to real image bytes.
  if (data.image && data.image.startsWith("data:") && type) {
    const origin = new URL(href).origin;
    data = {
      ...data,
      image: `${origin}/api/og-image?type=${type}&slug=${encodeURIComponent(matchedSlug)}`,
    };
  }

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
