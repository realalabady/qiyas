/**
 * Measure what is actually published, so a comparison against another site
 * rests on numbers rather than impressions.
 *
 * AdSense rejected this site twice for "low value content". The useful
 * question is not "does our content feel thorough" but how it measures on the
 * things a reviewer can see in thirty seconds: how long a piece is, whether
 * it cites anything, whether a quiz says more than a sentence about its
 * result, and how much of it is substance versus boilerplate.
 *
 * Reads only, no auth needed.
 *
 *   node --experimental-strip-types scripts/audit-content.ts [--per-item]
 */
import fs from "node:fs";
import path from "node:path";

import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";

const PER_ITEM = process.argv.includes("--per-item");

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Arabic text has no reliable tokenizer here; whitespace runs are close enough. */
const words = (s: unknown) =>
  String(s ?? "").trim().split(/\s+/).filter(Boolean).length;

const countMatches = (s: unknown, re: RegExp) =>
  (String(s ?? "").match(re) ?? []).length;

function stats(nums: number[]) {
  if (!nums.length) return { n: 0, min: 0, med: 0, mean: 0, max: 0, total: 0 };
  const sorted = [...nums].sort((a, b) => a - b);
  const total = nums.reduce((a, b) => a + b, 0);
  return {
    n: nums.length,
    min: sorted[0],
    med: sorted[Math.floor(sorted.length / 2)],
    mean: Math.round(total / nums.length),
    max: sorted[sorted.length - 1],
    total,
  };
}

const row = (label: string, s: ReturnType<typeof stats>) =>
  `  ${label.padEnd(30)} n=${String(s.n).padStart(3)}  min ${String(s.min).padStart(5)}  median ${String(s.med).padStart(5)}  mean ${String(s.mean).padStart(5)}  max ${String(s.max).padStart(5)}  total ${s.total.toLocaleString()}`;

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) throw new Error(".env.local not found");
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

async function main() {
  loadEnv();
  const app = initializeApp({
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  });
  const db = getFirestore(app);

  const [aSnap, qSnap] = await Promise.all([
    getDocs(query(collection(db, "articles"), where("published", "==", true))),
    getDocs(query(collection(db, "quizzes"), where("published", "==", true))),
  ]);

  /* ───────── articles ───────── */
  const aWords: number[] = [];
  const aLinks: number[] = [];
  const aHeads: number[] = [];
  const aFaq: number[] = [];
  let aEnglish = 0;
  const aRows: string[] = [];

  for (const d of aSnap.docs) {
    const a = d.data() as any;
    const w = words(a.content);
    const links = countMatches(a.content, /https?:\/\/[^)\s]+/g);
    const heads = countMatches(a.content, /^#{2,3}\s/gm);
    const faq = Array.isArray(a.faq) ? a.faq.length : 0;
    aWords.push(w);
    aLinks.push(links);
    aHeads.push(heads);
    aFaq.push(faq);
    if (a.i18n?.en?.content) aEnglish++;
    aRows.push(
      `  ${String(w).padStart(5)}w ${String(links).padStart(3)} links ${String(heads).padStart(2)} h  ${String(faq)} faq  ${String(a.slug).slice(0, 44)}`,
    );
  }

  /* ───────── quizzes ───────── */
  const qQuestions: number[] = [];
  const qResults: number[] = [];
  const qResultWords: number[] = [];
  const qIntroWords: number[] = [];
  let qEnglish = 0;
  const qRows: string[] = [];

  for (const d of qSnap.docs) {
    const q = d.data() as any;
    const nq = Array.isArray(q.questions) ? q.questions.length : 0;
    const results = Array.isArray(q.results) ? q.results : [];
    const rw = results.map((r: any) => words(r.description));
    const intro = words(q.longDescription);
    qQuestions.push(nq);
    qResults.push(results.length);
    qResultWords.push(...rw);
    qIntroWords.push(intro);
    if (q.i18n?.en?.questions || q.i18n?.en?.longDescription) qEnglish++;
    const avg = rw.length ? Math.round(rw.reduce((a, b) => a + b, 0) / rw.length) : 0;
    qRows.push(
      `  ${String(nq).padStart(2)}Q ${String(results.length).padStart(2)}R  intro ${String(intro).padStart(4)}w  result avg ${String(avg).padStart(4)}w  ${String(q.slug).slice(0, 40)}`,
    );
  }

  console.log(`\n=== ARTICLES (${aSnap.size} published) ===`);
  console.log(row("body words", stats(aWords)));
  console.log(row("outbound citations", stats(aLinks)));
  console.log(row("h2/h3 headings", stats(aHeads)));
  console.log(row("FAQ entries", stats(aFaq)));
  console.log(`  ${"with English translation".padEnd(30)} ${aEnglish}/${aSnap.size}`);
  console.log(`  ${"under 800 words".padEnd(30)} ${aWords.filter((w) => w < 800).length}`);
  console.log(`  ${"with no citation at all".padEnd(30)} ${aLinks.filter((l) => l === 0).length}`);

  console.log(`\n=== QUIZZES (${qSnap.size} published) ===`);
  console.log(row("questions per quiz", stats(qQuestions)));
  console.log(row("results per quiz", stats(qResults)));
  console.log(row("words per result", stats(qResultWords)));
  console.log(row("intro (longDescription)", stats(qIntroWords)));
  console.log(`  ${"with English translation".padEnd(30)} ${qEnglish}/${qSnap.size}`);
  console.log(`  ${"results under 40 words".padEnd(30)} ${qResultWords.filter((w) => w < 40).length}`);
  console.log(`  ${"quizzes with no intro".padEnd(30)} ${qIntroWords.filter((w) => w === 0).length}`);

  const corpus =
    stats(aWords).total + stats(qResultWords).total + stats(qIntroWords).total;
  console.log(`\n=== TOTAL ===`);
  console.log(`  ${"indexable Arabic words".padEnd(30)} ${corpus.toLocaleString()}`);
  console.log(`  ${"pages of real content".padEnd(30)} ${aSnap.size + qSnap.size}`);

  if (PER_ITEM) {
    console.log(`\n--- articles ---\n${aRows.sort().join("\n")}`);
    console.log(`\n--- quizzes ---\n${qRows.sort().join("\n")}`);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error("\nFailed:", e?.message || e);
  process.exit(1);
});
