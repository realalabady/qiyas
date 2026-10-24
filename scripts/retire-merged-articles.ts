/**
 * Unpublish the twenty articles absorbed by the October 2026 consolidation.
 *
 * Their content now lives inside one of the fourteen comprehensive pieces, so
 * leaving them published would mean several thin pages competing with the
 * merged one on the same topic — exactly the "substantial value" and
 * "mass-produced" problems the rewrite set out to fix.
 *
 * Unpublishing (rather than deleting) keeps the original text recoverable in
 * Firestore. The URLs keep working: once a slug stops resolving as published,
 * api/render.ts looks it up in ARTICLE_MERGES and serves a 301 to the merged
 * article, so nothing 404s and link equity transfers.
 *
 * Usage:
 *   node --experimental-strip-types scripts/retire-merged-articles.ts [--apply]
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
} from "firebase/firestore";

import { ARTICLE_MERGES } from "../src/data/slug-migrations.ts";

const APPLY = process.argv.includes("--apply");

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) throw new Error(".env.local not found");
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
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

  let email = process.env.ADMIN_EMAIL;
  let password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    const rl = readline.createInterface({ input: stdin, output: stdout });
    email ||= await rl.question("Admin email: ");
    password ||= await rl.question("Admin password: ");
    rl.close();
  }
  await signInWithEmailAndPassword(getAuth(app), email!, password!);
  const db = getFirestore(app);
  console.log(`Signed in as ${email}\n`);

  const snap = await getDocs(collection(db, "articles"));
  const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  const bySlug = new Map(
    docs.map((d) => [String(d.slug ?? "").trim(), d] as const),
  );

  let retired = 0;
  let missingTarget = 0;

  for (const [from, to] of Object.entries(ARTICLE_MERGES)) {
    const source = bySlug.get(from);
    const target = bySlug.get(to);

    if (!target || target.published !== true) {
      console.log(`BLOCKED  target not published: ${to}`);
      missingTarget++;
      continue;
    }
    if (!source) {
      console.log(`skip     already gone: ${from.slice(0, 44)}`);
      continue;
    }
    if (source.published !== true) {
      console.log(`skip     already retired: ${from.slice(0, 44)}`);
      continue;
    }

    console.log(`retire   ${from.slice(0, 44)}\n            -> ${to.slice(0, 44)}`);
    if (!APPLY) continue;
    await updateDoc(doc(db, "articles", source.id), {
      published: false,
      updatedAt: new Date().toISOString(),
    });
    retired++;
  }

  const stillPublished = docs.filter(
    (d) => d.published === true && !ARTICLE_MERGES[String(d.slug ?? "").trim()],
  ).length;

  console.log(
    `\n${APPLY ? `Retired ${retired} article(s).` : "Dry run — nothing written."}` +
      `\nPublished articles that remain: ${stillPublished}` +
      (missingTarget ? `\nWARNING: ${missingTarget} merge target(s) not published — those sources were left alone.` : ""),
  );
  process.exit(0);
}

main().catch((e) => {
  console.error("\nFailed:", e?.message || e);
  process.exit(1);
});
