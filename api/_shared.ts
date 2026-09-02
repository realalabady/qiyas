/**
 * Shared helpers for the SSR-lite serverless functions (`render.ts`, `sitemap.ts`).
 *
 * Arabic is the canonical language of the site: the content is authored in
 * Arabic, so every server-rendered page is Arabic and carries lang="ar"
 * dir="rtl". The English UI strings remain available client-side via the
 * language toggle, but are never server-rendered and never indexed.
 */

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { parseArticleBlocks, parseInline } from "../src/lib/article-blocks";

export const CANONICAL_HOST = "www.al-maarefah.com";

export const firebaseConfig = () => ({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});

/**
 * Read published docs from a Firestore collection.
 *
 * Throws when the Firebase env vars are missing rather than returning `[]`.
 * Silently serving an empty page on a misconfiguration is exactly what got the
 * site rejected by AdSense the first time, so this failure must be loud.
 */
export async function fetchPublished(
  name: string,
): Promise<Record<string, unknown>[]> {
  const config = firebaseConfig();
  if (!config.projectId) {
    throw new Error(
      `Firebase env vars missing (VITE_FIREBASE_PROJECT_ID) — cannot render "${name}". ` +
        `Set the VITE_FIREBASE_* variables in the Vercel project settings.`,
    );
  }
  const app = getApps().length ? getApp() : initializeApp(config as any);
  const db = getFirestore(app);
  const snap = await getDocs(
    query(collection(db, name), where("published", "==", true)),
  );
  return snap.docs.map((d) => d.data() as Record<string, unknown>);
}

export const escapeHtml = (value: unknown): string =>
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

/** Render inline `**bold**` / `*italic*` / `[label](url)` to escaped HTML. */
const inlineHtml = (text: string): string =>
  parseInline(text)
    .map((seg) => {
      if (seg.kind === "strong") return `<strong>${escapeHtml(seg.text)}</strong>`;
      if (seg.kind === "em") return `<em>${escapeHtml(seg.text)}</em>`;
      if (seg.kind === "link")
        return `<a href="${escapeHtml(seg.href)}" rel="noopener noreferrer">${escapeHtml(seg.text)}</a>`;
      return escapeHtml(seg.text);
    })
    .join("");

/**
 * Render an article/quiz body to crawler-visible HTML.
 *
 * Structure comes from `parseArticleBlocks`, the same parser the React
 * renderer uses, so the SSR markup and the client markup always agree. Every
 * segment is escaped, so this is safe on admin-authored content.
 */
export function markdownToHtml(text: unknown): string {
  return parseArticleBlocks(String(text ?? ""))
    .map((block) => {
      if (block.type === "ul")
        return `<ul>${block.items.map((i) => `<li>${inlineHtml(i)}</li>`).join("")}</ul>`;
      return `<${block.type}>${inlineHtml(block.text)}</${block.type}>`;
    })
    .join("");
}

/** Wrap plain text lines in paragraphs (no Markdown interpretation). */
export const paragraphs = (text: unknown): string =>
  String(text ?? "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");

/**
 * Minimum body length for a page we are willing to have indexed.
 *
 * A handful of published articles are 50–230 words. Rather than let Google
 * judge the site by its thinnest pages ("no pages with minimal or no
 * substantive material"), those are served with `noindex,follow` and left out
 * of the sitemap. They stay reachable for visitors and still pass link equity;
 * they just are not offered up as reasons to rate the site.
 */
export const MIN_INDEXABLE_WORDS = 250;

export const wordCount = (text: unknown): number =>
  String(text ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

/** Whether an article has enough body text to be worth indexing. */
export const isIndexableArticle = (doc: Record<string, unknown>): boolean =>
  wordCount(doc.content) >= MIN_INDEXABLE_WORDS;
