/**
 * Shared plumbing for the article rewrite scripts.
 *
 * Firestore writes require an authenticated admin (see firestore.rules), so
 * these run locally with admin credentials rather than from a build step.
 * Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD in .env.local, or are
 * prompted for. Remove those two lines from .env.local when you are done —
 * they are only needed while a rewrite is running.
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

export interface Replacement {
  excerpt: string;
  content: string;
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

export const wordCount = (s: unknown): number =>
  String(s ?? "").trim().split(/\s+/).filter(Boolean).length;

export async function runRewrite(
  articles: Record<string, Replacement>,
  label: string,
): Promise<void> {
  const apply = process.argv.includes("--apply");
  try {
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
    console.log(`Signed in as ${email}\n${label}\n`);

    const snap = await getDocs(collection(db, "articles"));
    const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

    let applied = 0;
    let missing = 0;
    for (const [slug, replacement] of Object.entries(articles)) {
      const target = docs.find((d) => String(d.slug ?? "").trim() === slug);
      if (!target) {
        console.log(`SKIP  slug not found: ${slug}`);
        missing++;
        continue;
      }
      console.log(
        `${String(target.title ?? "").trim().slice(0, 52)}\n` +
          `   ${wordCount(target.content)}w -> ${wordCount(replacement.content)}w`,
      );
      if (!apply) continue;
      await updateDoc(doc(db, "articles", target.id), {
        content: replacement.content,
        excerpt: replacement.excerpt,
        updatedAt: new Date().toISOString(),
      });
      applied++;
    }

    console.log(
      apply
        ? `\nUpdated ${applied} article(s).${missing ? ` ${missing} not found.` : ""}`
        : `\nDry run — nothing written. Re-run with --apply.${
            missing ? ` ${missing} slug(s) not found.` : ""
          }`,
    );
  } catch (error: any) {
    console.error("\nFailed:", error?.message || error);
    process.exit(1);
  }
  // The Firebase client holds its connection open and would hang the process.
  process.exit(0);
}
