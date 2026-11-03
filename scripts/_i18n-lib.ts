/**
 * Attach hand-written English to the November 2026 articles and quizzes.
 *
 * These are written by hand rather than run through `src/lib/translate.ts`,
 * which calls Google's free gtx endpoint. Machine translation is the wrong
 * tool here on the merits: Google's own spam policy names "automated
 * transformations like synonymizing, translating, or other obfuscation
 * techniques, where little value is provided to users" as scaled content
 * abuse — so auto-translating fifteen thousand words onto a site that was
 * already rejected for low-value content would argue against us.
 *
 * Arabic stays the source language and the only indexed one: `api/render.ts`
 * serves every crawler `<html lang="ar">`. The English here is for the in-app
 * language toggle, so it is a reader-facing change rather than an SEO one.
 *
 * The `ar` half of each i18n map is snapshotted from the document's current
 * fields, matching what `buildQuizI18n` / `buildArticleI18n` produce in the
 * admin panel, so a later edit there behaves normally.
 *
 * Quiz questions and answers are matched BY POSITION against what is stored,
 * because their ids are generated. Counts are asserted before anything is
 * written, so a reordered or resized list fails loudly instead of silently
 * pairing the wrong strings.
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
  updateDoc,
  type Firestore,
} from "firebase/firestore";

const APPLY = process.argv.includes("--apply");

export interface ArticleEn {
  title: string;
  excerpt: string;
  content: string;
  faq?: { question: string; answer: string }[];
}

export interface QuizQuestionEn {
  text: string;
  answers: string[];
}

export interface QuizEn {
  title: string;
  description: string;
  longDescription: string;
  seoTitle: string;
  seoDescription: string;
  questions: QuizQuestionEn[];
  /** Keyed by result id, which is authored and stable. */
  results: Record<string, { title: string; description: string }>;
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

const words = (s: unknown) =>
  String(s ?? "").trim().split(/\s+/).filter(Boolean).length;

export async function runArticleI18n(
  entries: Record<string, ArticleEn>,
  label: string,
): Promise<void> {
  try {
    const db = await connect();
    const snap = await getDocs(collection(db, "articles"));
    const bySlug = new Map(
      snap.docs.map((d) => [
        String((d.data() as any).slug ?? "").trim(),
        { id: d.id, data: d.data() as any },
      ]),
    );

    let written = 0;
    let problems = 0;

    for (const [slug, en] of Object.entries(entries)) {
      const found = bySlug.get(slug);
      if (!found) {
        console.log(`MISS  no article with slug: ${slug.slice(0, 44)}`);
        problems++;
        continue;
      }
      const a = found.data;
      const arFaq = Array.isArray(a.faq) ? a.faq : [];

      if ((en.faq?.length ?? 0) !== arFaq.length) {
        console.log(
          `ERROR ${slug.slice(0, 40)}: ${en.faq?.length ?? 0} English FAQ entries vs ${arFaq.length} stored`,
        );
        problems++;
        continue;
      }

      console.log(
        `en    ${String(words(en.content)).padStart(4)}w  ` +
          `${String(arFaq.length)} faq  ${slug.slice(0, 44)}`,
      );
      if (!APPLY) continue;

      await updateDoc(doc(db, "articles", found.id), {
        i18n: {
          ...(a.i18n ?? {}),
          ar: {
            title: a.title,
            excerpt: a.excerpt,
            content: a.content,
            ...(arFaq.length ? { faq: arFaq } : {}),
          },
          en: {
            title: en.title,
            excerpt: en.excerpt,
            content: en.content,
            ...(en.faq?.length ? { faq: en.faq } : {}),
          },
        },
        updatedAt: new Date().toISOString(),
      });
      written++;
    }

    console.log(
      APPLY
        ? `\n${label}: wrote English for ${written} article(s).`
        : `\n${label}: dry run — nothing written. Re-run with --apply.`,
    );
    if (problems) console.log(`${problems} problem(s) above — not written.`);
    process.exit(problems ? 1 : 0);
  } catch (e: any) {
    console.error("\nFailed:", e?.message || e);
    process.exit(1);
  }
}

export async function runQuizI18n(
  entries: Record<string, QuizEn>,
  label: string,
): Promise<void> {
  try {
    const db = await connect();
    const snap = await getDocs(collection(db, "quizzes"));
    const bySlug = new Map(
      snap.docs.map((d) => [
        String((d.data() as any).slug ?? "").trim(),
        { id: d.id, data: d.data() as any },
      ]),
    );

    let written = 0;
    let problems = 0;

    for (const [slug, en] of Object.entries(entries)) {
      const found = bySlug.get(slug);
      if (!found) {
        console.log(`MISS  no quiz with slug: ${slug.slice(0, 44)}`);
        problems++;
        continue;
      }
      const q = found.data;
      const qs = Array.isArray(q.questions) ? q.questions : [];
      const rs = Array.isArray(q.results) ? q.results : [];

      // Positional pairing is only safe if the shapes line up exactly.
      const issues: string[] = [];
      if (qs.length !== en.questions.length) {
        issues.push(`${en.questions.length} English questions vs ${qs.length} stored`);
      } else {
        qs.forEach((sq: any, i: number) => {
          const n = Array.isArray(sq.answers) ? sq.answers.length : 0;
          if (n !== en.questions[i].answers.length) {
            issues.push(
              `Q${i + 1}: ${en.questions[i].answers.length} English answers vs ${n} stored`,
            );
          }
        });
      }
      const storedIds = new Set(rs.map((r: any) => String(r.id)));
      for (const id of Object.keys(en.results)) {
        if (!storedIds.has(id)) issues.push(`unknown result id "${id}"`);
      }
      for (const id of storedIds) {
        if (!(id in en.results)) issues.push(`missing English for result "${id}"`);
      }

      if (issues.length) {
        console.log(`ERROR ${slug.slice(0, 40)}:`);
        for (const i of issues) console.log(`        ${i}`);
        problems++;
        continue;
      }

      const enQuestions: Record<string, { text: string; answers: Record<string, string> }> = {};
      const arQuestions: Record<string, { text: string; answers: Record<string, string> }> = {};
      qs.forEach((sq: any, i: number) => {
        const answersEn: Record<string, string> = {};
        const answersAr: Record<string, string> = {};
        sq.answers.forEach((sa: any, j: number) => {
          answersEn[sa.id] = en.questions[i].answers[j];
          answersAr[sa.id] = sa.text;
        });
        enQuestions[sq.id] = { text: en.questions[i].text, answers: answersEn };
        arQuestions[sq.id] = { text: sq.text, answers: answersAr };
      });

      const enResults: Record<string, { title: string; description: string }> = {};
      const arResults: Record<string, { title: string; description: string }> = {};
      rs.forEach((r: any) => {
        enResults[r.id] = en.results[r.id];
        arResults[r.id] = { title: r.title, description: r.description };
      });

      console.log(
        `en    ${String(qs.length).padStart(2)}Q  ${rs.length} results  ` +
          `intro ${String(words(en.longDescription)).padStart(3)}w  ` +
          `results ${String(Object.values(en.results).reduce((n, r) => n + words(r.description), 0)).padStart(4)}w  ` +
          slug.slice(0, 32),
      );
      if (!APPLY) continue;

      await updateDoc(doc(db, "quizzes", found.id), {
        i18n: {
          ...(q.i18n ?? {}),
          ar: {
            title: q.title,
            description: q.description,
            longDescription: q.longDescription,
            seoTitle: q.seoTitle,
            seoDescription: q.seoDescription,
            questions: arQuestions,
            results: arResults,
          },
          en: {
            title: en.title,
            description: en.description,
            longDescription: en.longDescription,
            seoTitle: en.seoTitle,
            seoDescription: en.seoDescription,
            questions: enQuestions,
            results: enResults,
          },
        },
        updatedAt: new Date().toISOString(),
      });
      written++;
    }

    console.log(
      APPLY
        ? `\n${label}: wrote English for ${written} quiz(zes).`
        : `\n${label}: dry run — nothing written. Re-run with --apply.`,
    );
    if (problems) console.log(`${problems} problem(s) above — not written.`);
    process.exit(problems ? 1 : 0);
  } catch (e: any) {
    console.error("\nFailed:", e?.message || e);
    process.exit(1);
  }
}
