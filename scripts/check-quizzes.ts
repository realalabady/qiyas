/**
 * Validate every published quiz against the same rules the take page uses.
 *
 * /quiz/<slug>/take refuses to run a quiz that fails validateQuizConfig and
 * shows "Quiz Setup Incomplete" instead. That check runs in the browser
 * against whatever Firestore actually holds, so the only way to know which
 * quizzes are broken — and why — is to read the live documents and run the
 * real validator over them. This imports that validator rather than
 * reimplementing it, so the two cannot drift.
 *
 * Reads only, no auth needed: the rules allow published documents.
 *
 *   node --experimental-strip-types scripts/check-quizzes.ts [--verbose]
 */
import fs from "node:fs";
import path from "node:path";

import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";

import { validateQuizConfig } from "../src/lib/quiz-validation.ts";

const VERBOSE = process.argv.includes("--verbose");

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

  const snap = await getDocs(
    query(collection(db, "quizzes"), where("published", "==", true)),
  );

  let broken = 0;
  for (const d of snap.docs) {
    const raw = d.data() as Record<string, unknown>;
    const quiz = {
      title: String(raw.title ?? ""),
      description: String(raw.description ?? ""),
      quizType: String(raw.quizType ?? ""),
      questions: Array.isArray(raw.questions) ? raw.questions : [],
      results: Array.isArray(raw.results) ? raw.results : [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const v = validateQuizConfig(quiz);
    const slug = String(raw.slug ?? d.id);
    const shape =
      `${String(quiz.quizType).padEnd(22)} ` +
      `Q${String(quiz.questions.length).padStart(2)} ` +
      `R${String(quiz.results.length).padStart(2)}`;

    if (v.isValid) {
      console.log(`  ok    ${shape}  ${slug}`);
      continue;
    }
    broken++;
    console.log(`  FAIL  ${shape}  ${slug}`);
    const shown = VERBOSE ? v.errors : v.errors.slice(0, 4);
    for (const e of shown) console.log(`          ${e}`);
    if (!VERBOSE && v.errors.length > 4) {
      console.log(`          ... and ${v.errors.length - 4} more`);
    }
  }

  console.log(
    `\n${snap.size} published quiz(zes); ${broken} would show "Quiz Setup Incomplete".`,
  );
  process.exit(broken ? 1 : 0);
}

main().catch((e) => {
  console.error("\nFailed:", e?.message || e);
  process.exit(1);
});
