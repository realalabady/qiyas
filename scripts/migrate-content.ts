/**
 * One-off content migration for the AdSense remediation.
 *
 * Firestore writes require an authenticated admin (see firestore.rules), so
 * this cannot run from a build step or a serverless function — you run it
 * locally with your admin login.
 *
 * It performs four fixes:
 *   1. Renames placeholder slugs ("0-copy", "43243", slugs containing spaces)
 *      to the descriptive ones in src/data/slug-migrations.ts. Old URLs keep
 *      working: api/render.ts 301-redirects them using the same map.
 *   2. Resolves the DUPLICATE "005" article slug — two published articles
 *      share it today, so one of them is unreachable on the site.
 *   3. Fills each quiz's empty longDescription from src/data/quiz-intros.ts.
 *   4. Reports articles below the indexable word threshold.
 *
 * Usage:
 *   node --experimental-strip-types scripts/migrate-content.ts --dry-run      # show what would change
 *   node --experimental-strip-types scripts/migrate-content.ts --apply        # write the changes
 *
 * Credentials (prompted for if absent):
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=... node --experimental-strip-types scripts/migrate-content.ts --apply
 *
 * Reads VITE_FIREBASE_* from .env.local.
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

import {
  ARTICLE_SLUG_MIGRATIONS,
  QUIZ_SLUG_MIGRATIONS,
} from "../src/data/slug-migrations.ts";
import { getQuizIntro } from "../src/data/quiz-intros.ts";

const APPLY = process.argv.includes("--apply");
const MIN_INDEXABLE_WORDS = 250;

// --- config ---------------------------------------------------------------

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

const wordCount = (s) => String(s ?? "").trim().split(/\s+/).filter(Boolean).length;

// --- main -----------------------------------------------------------------

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

  await signInWithEmailAndPassword(getAuth(app), email, password);
  const db = getFirestore(app);
  console.log(`Signed in as ${email}\n`);

  const readAll = async (name) => {
    const snap = await getDocs(collection(db, name));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

  const quizzes = await readAll("quizzes");
  const articles = await readAll("articles");
  const changes = [];

  // 1 + 3. Quiz slugs and long descriptions.
  for (const q of quizzes) {
    const slug = String(q.slug ?? "").trim();
    const update = {};

    // Several titles carry stray leading/trailing spaces, which show up in the
    // admin list and in <title>. The renderers trim on the way out; fix the
    // stored value too so the data itself is clean.
    if (typeof q.title === "string" && q.title !== q.title.trim()) {
      update.title = q.title.trim();
    }

    const newSlug = QUIZ_SLUG_MIGRATIONS[slug];
    if (newSlug && newSlug !== slug) update.slug = newSlug;

    if (!String(q.longDescription ?? "").trim()) {
      const intro = getQuizIntro(slug);
      if (intro) update.longDescription = intro;
    }

    if (Object.keys(update).length) {
      changes.push({ col: "quizzes", id: q.id, title: q.title, update });
    }
  }

  // 2. The duplicate "005" article slug — one of the two is unreachable.
  const bySlug = new Map();
  for (const a of articles) {
    const slug = String(a.slug ?? "").trim();
    if (!bySlug.has(slug)) bySlug.set(slug, []);
    bySlug.get(slug).push(a);
  }
  for (const [slug, docs] of bySlug) {
    if (docs.length < 2) continue;
    console.log(`DUPLICATE slug "${slug}" on ${docs.length} articles:`);
    // Keep the first; give the rest a slug derived from their title.
    docs.slice(1).forEach((a, i) => {
      const derived =
        String(a.title ?? "")
          .trim()
          .replace(/[^\p{L}\p{N}\s-]/gu, "")
          .replace(/\s+/g, "-")
          .slice(0, 60) || `${slug}-${i + 2}`;
      console.log(`   - "${a.title}" -> ${derived}`);
      changes.push({
        col: "articles",
        id: a.id,
        title: a.title,
        update: { slug: derived },
      });
    });
    console.log();
  }

  // 1. Article slugs and titles.
  for (const a of articles) {
    const slug = String(a.slug ?? "").trim();
    const update = {};

    if (typeof a.title === "string" && a.title !== a.title.trim()) {
      update.title = a.title.trim();
    }

    const newSlug = ARTICLE_SLUG_MIGRATIONS[slug];
    if (newSlug && newSlug !== slug) update.slug = newSlug;

    if (!Object.keys(update).length) continue;

    // The duplicate-slug pass above may already have queued this document —
    // merge into it rather than writing the same doc twice. Its derived slug
    // wins, because the shared slug maps to the article we are keeping.
    const existing = changes.find((c) => c.id === a.id);
    if (existing) {
      existing.update = { ...update, ...existing.update };
      continue;
    }

    changes.push({ col: "articles", id: a.id, title: a.title, update });
  }

  // 4. Report thin articles.
  const thin = articles
    .filter((a) => a.published && wordCount(a.content) < MIN_INDEXABLE_WORDS)
    .map((a) => `   ${String(wordCount(a.content)).padStart(4)}w  ${a.title}`);
  if (thin.length) {
    console.log(
      `Thin articles (< ${MIN_INDEXABLE_WORDS} words). These are served\n` +
        `noindex and kept out of the sitemap. Expand or unpublish them:`,
    );
    console.log(thin.join("\n"), "\n");
  }

  // --- apply --------------------------------------------------------------

  console.log(`${changes.length} document(s) to update:\n`);
  for (const c of changes) {
    console.log(`  [${c.col}] ${String(c.title ?? c.id).slice(0, 48)}`);
    for (const [k, v] of Object.entries(c.update)) {
      const shown = k === "longDescription" ? `${wordCount(v)} words` : v;
      console.log(`      ${k}: ${shown}`);
    }
  }

  if (!APPLY) {
    console.log("\nDry run — nothing written. Re-run with --apply to commit.");
    return;
  }

  console.log("\nApplying…");
  for (const c of changes) {
    await updateDoc(doc(db, c.col, c.id), {
      ...c.update,
      updatedAt: new Date().toISOString(),
    });
    console.log(`  updated ${c.col}/${c.id}`);
  }
  console.log(
    `\nDone. Old URLs 301-redirect to the new slugs via api/render.ts.\n` +
      `Resubmit the sitemap in Search Console afterwards.`,
  );
}

main().catch((error) => {
  console.error("\nMigration failed:", error?.message || error);
  process.exit(1);
});

