/**
 * SSR-lite / dynamic rendering — Vercel serverless function.
 *
 * Routed (via vercel.json) for /quiz/:slug and /articles/:slug. It serves the
 * normal SPA shell but with REAL, unique <title> + meta tags + visible content
 * injected, so search-engine crawlers see the actual page content in the first
 * HTML response instead of an empty JavaScript shell. Real users still get the
 * full React app (it mounts on #root and replaces the injected content).
 *
 * Content is read from Firestore (published docs are world-readable per
 * firestore.rules), using the same public config the frontend uses.
 */

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const firebaseConfig = () => ({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});

// The built shell (with hashed asset tags) is cached per warm instance.
let shellCache: string | null = null;

async function getShell(origin: string): Promise<string> {
  if (shellCache) return shellCache;
  const res = await fetch(`${origin}/index.html`, {
    headers: { "x-ssr-shell": "1" },
  });
  shellCache = await res.text();
  return shellCache;
}

const escapeHtml = (value: string) =>
  String(value ?? "").replace(/[&<>"']/g, (c) =>
    c === "&"
      ? "&amp;"
      : c === "<"
        ? "&lt;"
        : c === ">"
          ? "&gt;"
          : c === '"'
            ? "&quot;"
            : "&#39;",
  );

const absoluteImage = (
  origin: string,
  image: unknown,
  type: string,
  slug: string,
): string | undefined => {
  if (typeof image !== "string" || !image) return undefined;
  // Admin-uploaded thumbnails are base64 data: URLs — crawlers can't use those
  // as og:image, so route them through the image endpoint that decodes them.
  if (image.startsWith("data:"))
    return `${origin}/api/og-image?type=${type}&slug=${encodeURIComponent(slug)}`;
  return image.startsWith("http") ? image : `${origin}${image}`;
};

async function fetchPublished(name: string) {
  const config = firebaseConfig();
  if (!config.projectId) return [] as Record<string, unknown>[];
  const app = getApps().length ? getApp() : initializeApp(config as any);
  const db = getFirestore(app);
  const snap = await getDocs(
    query(collection(db, name), where("published", "==", true)),
  );
  return snap.docs.map((d) => d.data() as Record<string, unknown>);
}

interface Meta {
  title: string;
  description: string;
  url: string;
  image?: string;
  contentHtml: string;
}

function render(shell: string, meta: Meta): string {
  const head =
    `<title>${escapeHtml(meta.title)}</title>` +
    `<meta name="description" content="${escapeHtml(meta.description)}" />` +
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />` +
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />` +
    `<meta property="og:url" content="${escapeHtml(meta.url)}" />` +
    (meta.image
      ? `<meta property="og:image" content="${escapeHtml(meta.image)}" />`
      : "") +
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />` +
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />` +
    `<link rel="canonical" href="${escapeHtml(meta.url)}" />`;

  let html = shell;
  // Drop the shell's existing <title> so ours wins.
  html = html.replace(/<title>[\s\S]*?<\/title>/i, "");
  // Inject our head tags right before </head>.
  html = html.replace(/<\/head>/i, `${head}</head>`);
  // Put crawler-visible content inside #root (React replaces it on mount).
  html = html.replace(
    /<div id="root">\s*<\/div>/i,
    `<div id="root">${meta.contentHtml}</div>`,
  );
  return html;
}

const paragraphs = (text: unknown): string =>
  String(text ?? "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");

export default async function handler(req: any, res: any) {
  const host = (req?.headers?.host as string) || "www.al-maarefah.com";
  const proto = (req?.headers?.["x-forwarded-proto"] as string) || "https";
  const origin = `${proto}://${host}`;

  const type = (req?.query?.type as string) || "";
  const slug = (req?.query?.slug as string) || "";

  try {
    const shell = await getShell(origin);

    if (type === "quiz" && slug) {
      const quizzes = await fetchPublished("quizzes");
      const quiz = quizzes.find((q) => q.slug === slug);
      if (quiz) {
        const title = `${quiz.title} · Al-Maarefah`;
        const description =
          (quiz.seoDescription as string) ||
          (quiz.description as string) ||
          "";
        const results = Array.isArray(quiz.results) ? quiz.results : [];
        const resultsHtml = results
          .map(
            (r: any) =>
              `<h2>${escapeHtml(r?.title ?? "")}</h2>${paragraphs(r?.description)}`,
          )
          .join("");
        const contentHtml =
          `<main><article>` +
          `<h1>${escapeHtml(quiz.title as string)}</h1>` +
          paragraphs(quiz.description) +
          `<p>${escapeHtml(String(quiz.category ?? ""))}</p>` +
          resultsHtml +
          `<p><a href="${origin}/quiz/${encodeURIComponent(slug)}/take">Start quiz</a></p>` +
          `</article></main>`;
        res
          .status(200)
          .setHeader("Content-Type", "text/html; charset=utf-8")
          .setHeader("Cache-Control", "public, max-age=0, s-maxage=3600");
        return res.send(
          render(shell, {
            title,
            description,
            url: `${origin}/quiz/${encodeURIComponent(slug)}`,
            image: absoluteImage(origin, quiz.thumbnail, "quiz", slug),
            contentHtml,
          }),
        );
      }
    }

    if (type === "article" && slug) {
      const articles = await fetchPublished("articles");
      const article = articles.find((a) => a.slug === slug);
      if (article) {
        const title = `${article.title} · Al-Maarefah`;
        const description = (article.excerpt as string) || "";
        const contentHtml =
          `<main><article>` +
          `<h1>${escapeHtml(article.title as string)}</h1>` +
          `<p>${escapeHtml(String(article.author ?? ""))} · ${escapeHtml(String(article.category ?? ""))}</p>` +
          paragraphs(article.excerpt) +
          paragraphs(article.content) +
          `</article></main>`;
        res
          .status(200)
          .setHeader("Content-Type", "text/html; charset=utf-8")
          .setHeader("Cache-Control", "public, max-age=0, s-maxage=3600");
        return res.send(
          render(shell, {
            title,
            description,
            url: `${origin}/articles/${encodeURIComponent(slug)}`,
            image: absoluteImage(origin, article.image, "article", slug),
            contentHtml,
          }),
        );
      }
    }

    // Unknown slug / type — serve the plain shell so the SPA handles it.
    res
      .status(200)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .setHeader("Cache-Control", "public, max-age=0, s-maxage=60");
    return res.send(shell);
  } catch (error) {
    console.error("SSR render failed", error);
    // Last resort: redirect the browser to the static shell so users still work.
    try {
      const shell = await getShell(origin);
      res.status(200).setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(shell);
    } catch {
      res.status(500).send("Internal Server Error");
    }
  }
}
