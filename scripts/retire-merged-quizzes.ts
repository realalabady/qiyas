/**
 * Unpublish quizzes absorbed by the October 2026 consolidation.
 *
 * The site carried two near-identical colour-personality quizzes competing on
 * one topic — the same duplication the article consolidation removed.
 *
 * The retired URL keeps working: once a slug stops resolving as published,
 * api/render.ts looks it up in QUIZ_MERGES and 301s to the surviving quiz.
 *
 * Usage:
 *   node --experimental-strip-types scripts/retire-merged-quizzes.ts [--apply]
 */

import fs from "node:fs";
import path from "node:path";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";

import { QUIZ_MERGES } from "../src/data/slug-migrations.ts";

const APPLY = process.argv.includes("--apply");

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) throw new Error(".env.local not found");
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line.replace("\r", ""));
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
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

  await signInWithEmailAndPassword(
    getAuth(app),
    process.env.ADMIN_EMAIL!,
    process.env.ADMIN_PASSWORD!,
  );
  const db = getFirestore(app);

  const snap = await getDocs(collection(db, "quizzes"));
  const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  const bySlug = new Map(
    docs.map((d) => [String(d.slug ?? "").trim(), d] as const),
  );

  let retired = 0;
  for (const [from, to] of Object.entries(QUIZ_MERGES)) {
    const source = bySlug.get(from);
    const target = bySlug.get(to);

    if (!target || target.published !== true) {
      console.log(`BLOCKED  target not published: ${to}`);
      continue;
    }
    if (!source || source.published !== true) {
      console.log(`skip     already retired: ${from}`);
      continue;
    }

    console.log(`retire   ${from}  ->  ${to}`);
    if (!APPLY) continue;
    await updateDoc(doc(db, "quizzes", source.id), {
      published: false,
      updatedAt: new Date().toISOString(),
    });
    retired++;
  }

  const remaining = docs.filter(
    (d) => d.published === true && !QUIZ_MERGES[String(d.slug ?? "").trim()],
  ).length;

  console.log(
    `\n${APPLY ? `Retired ${retired}.` : "Dry run — nothing written."}` +
      `  Published quizzes remaining: ${remaining}`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error("Failed:", e?.message || e);
  process.exit(1);
});
