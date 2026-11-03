/**
 * Shared plumbing for the scripts that ADD new articles and quizzes.
 *
 * `_rewrite-lib.ts` only updates documents that already exist, matched by slug.
 * These helpers create new ones, and are idempotent: a slug that is already in
 * Firestore is reported and skipped, never duplicated. Document ids are derived
 * from the slug rather than from `Date.now()`, so a re-run writes to the same
 * document instead of making a second copy.
 *
 * Both helpers honour `--apply`; without it they print what they would do.
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  type Firestore,
} from "firebase/firestore";

export const APPLY = process.argv.includes("--apply");

/**
 * Rewrite a document this script already created, instead of skipping it.
 *
 * Only allowed when the slug maps to the id this script would derive from it,
 * so `--force` can never clobber a document somebody wrote by hand or through
 * the admin panel — in that case the slug is still reported and skipped.
 */
const FORCE = process.argv.includes("--force");

export const wordCount = (s: unknown): number =>
  String(s ?? "").trim().split(/\s+/).filter(Boolean).length;

/** Stable, collision-resistant-enough id for a slug (FNV-1a, base36). */
function slugId(prefix: string, slug: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `${prefix}-${h.toString(36)}`;
}

export interface NewArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  faq?: { question: string; answer: string }[];
  /** Path under public/, e.g. "/thumbnails/article-big-five.png". */
  image?: string;
  /** ISO date. Defaults to now. */
  publishedAt?: string;
}

export interface NewQuizAnswer {
  text: string;
  /** weighted_personality */
  weights?: Record<string, number>;
  /** score_based */
  score?: number;
  /** personality_based */
  resultId?: string;
}

export interface NewQuizQuestion {
  text: string;
  answers: NewQuizAnswer[];
}

export interface NewQuizResult {
  id: string;
  title: string;
  description: string;
  strengths?: string[];
  weaknesses?: string[];
}

export interface NewQuiz {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  quizType: "weighted_personality" | "score_based" | "personality_based" | "percentage_matching";
  questions: NewQuizQuestion[];
  results: NewQuizResult[];
  /** Path under public/, e.g. "/thumbnails/quiz-big-five.png". */
  thumbnail?: string;
  publishedAt?: string;
}

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) {
    throw new Error(".env.local not found — run this from the project root.");
  }
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

async function connect(): Promise<Firestore> {
  loadEnv();
  const app = initializeApp({
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  });

  let email = process.env.ADMIN_EMAIL;
  let password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    const rl = readline.createInterface({ input: stdin, output: stdout });
    email ||= await rl.question("Admin email: ");
    password ||= await rl.question("Admin password: ");
    rl.close();
  }
  await signInWithEmailAndPassword(getAuth(app), email!, password!);
  console.log(`Signed in as ${email}\n`);
  return getFirestore(app);
}

/** Slug -> document id for everything already in a collection. */
async function existingSlugs(
  db: Firestore,
  name: string,
): Promise<Map<string, string>> {
  const snap = await getDocs(collection(db, name));
  return new Map(
    snap.docs.map((d) => [String((d.data() as any).slug ?? "").trim(), d.id]),
  );
}

/**
 * Whether to write this slug: true to proceed, false to skip. Prints why.
 */
function shouldWrite(
  taken: Map<string, string>,
  slug: string,
  id: string,
): boolean {
  const existing = taken.get(slug);
  if (existing === undefined) return true;
  if (FORCE && existing === id) {
    console.log(`force overwriting: ${slug.slice(0, 44)}`);
    return true;
  }
  console.log(
    existing === id
      ? `SKIP  slug already exists (pass --force to rewrite): ${slug.slice(0, 44)}`
      : `SKIP  slug belongs to a document this script did not create: ${slug.slice(0, 44)}`,
  );
  return false;
}

export async function runAddArticles(
  articles: NewArticle[],
  label: string,
): Promise<void> {
  try {
    const db = await connect();
    const taken = await existingSlugs(db, "articles");

    let written = 0;
    let skipped = 0;

    for (const a of articles) {
      const words = wordCount(a.content);
      const links = (a.content.match(/\]\(https?:\/\//g) ?? []).length;
      const id = slugId("article", a.slug);

      if (!shouldWrite(taken, a.slug, id)) {
        skipped++;
        continue;
      }

      console.log(
        `add   ${String(words).padStart(4)}w  ${links} links  ${a.slug.slice(0, 44)}`,
      );
      if (!APPLY) continue;

      const now = a.publishedAt ?? new Date().toISOString();
      await setDoc(doc(db, "articles", id), {
        id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        category: a.category,
        // `displayAuthor()` maps this to the editor's name; the byline is set
        // in one place rather than baked into every document.
        author: "Admin",
        tags: a.tags ?? [],
        image: a.image ?? "",
        published: true,
        ...(a.faq?.length ? { faq: a.faq } : {}),
        views: 0,
        createdAt: now,
        updatedAt: now,
      });
      written++;
    }

    console.log(
      APPLY
        ? `\n${label}: wrote ${written} article(s), skipped ${skipped}.`
        : `\n${label}: dry run — nothing written. Re-run with --apply.`,
    );
    process.exit(0);
  } catch (e: any) {
    console.error("\nFailed:", e?.message || e);
    process.exit(1);
  }
}

export async function runAddQuizzes(
  quizzes: NewQuiz[],
  label: string,
): Promise<void> {
  try {
    const db = await connect();
    const taken = await existingSlugs(db, "quizzes");

    let written = 0;
    let skipped = 0;

    for (const q of quizzes) {
      const resultWords = q.results.reduce(
        (n, r) => n + wordCount(r.description),
        0,
      );

      const id = slugId("quiz", q.slug);
      if (!shouldWrite(taken, q.slug, id)) {
        skipped++;
        continue;
      }

      // A weighted quiz whose answers reference an unknown result id would
      // silently score nothing, so check the wiring before writing.
      const ids = new Set(q.results.map((r) => r.id));
      const bad = new Set<string>();
      for (const question of q.questions) {
        for (const ans of question.answers) {
          for (const key of Object.keys(ans.weights ?? {})) {
            if (!ids.has(key)) bad.add(key);
          }
          if (ans.resultId && !ids.has(ans.resultId)) bad.add(ans.resultId);
        }
      }
      if (bad.size) {
        console.log(
          `ERROR ${q.slug}: answers reference unknown result id(s): ${[...bad].join(", ")}`,
        );
        continue;
      }

      console.log(
        `add   ${String(q.questions.length).padStart(2)}Q  ${q.results.length} results  ` +
          `intro ${String(wordCount(q.longDescription)).padStart(3)}w  ` +
          `results ${String(resultWords).padStart(4)}w  ${q.slug.slice(0, 36)}`,
      );
      if (!APPLY) continue;

      const now = q.publishedAt ?? new Date().toISOString();
      await setDoc(doc(db, "quizzes", id), {
        id,
        slug: q.slug,
        title: q.title,
        description: q.description,
        longDescription: q.longDescription,
        category: q.category,
        thumbnail: q.thumbnail ?? "",
        seoTitle: q.seoTitle,
        seoDescription: q.seoDescription,
        quizType: q.quizType,
        questions: q.questions.map((question, qi) => ({
          id: `q_${id}_${qi + 1}`,
          text: question.text,
          image: "",
          type: q.quizType === "score_based" ? "scored" : "personality",
          answers: question.answers.map((ans, ai) => ({
            id: `a_${id}_${qi + 1}_${ai + 1}`,
            text: ans.text,
            weights: ans.weights ?? {},
            ...(ans.score !== undefined ? { score: ans.score } : { score: 0 }),
            ...(ans.resultId ? { resultId: ans.resultId } : {}),
          })),
        })),
        results: q.results.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          image: "",
          ...(r.strengths?.length ? { strengths: r.strengths } : {}),
          ...(r.weaknesses?.length ? { weaknesses: r.weaknesses } : {}),
        })),
        published: true,
        createdAt: now,
        updatedAt: now,
      });
      written++;
    }

    console.log(
      APPLY
        ? `\n${label}: wrote ${written} quiz(zes), skipped ${skipped}.`
        : `\n${label}: dry run — nothing written. Re-run with --apply.`,
    );
    process.exit(0);
  } catch (e: any) {
    console.error("\nFailed:", e?.message || e);
    process.exit(1);
  }
}
