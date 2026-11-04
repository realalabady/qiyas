/**
 * Make every result winnable in the two quizzes where some never were.
 *
 * scripts/simulate-quizzes.ts found results no reader could reach whatever
 * they answered. Both causes are content, not code:
 *
 *   مم تتكون شخصيتك     الحساسية was never the primary weight on any answer.
 *                       It appeared only as a 1 or a 2 beside something else,
 *                       so it topped out at 15 against 31 for المنطق. الفضول
 *                       had the opposite problem: 12 of the 48 primaries.
 *
 *   الحيوان الذي يشبه   النمر was offered in 3 of 10 questions and الأسد in
 *                       8, so النمر could collect at most 3 votes against 8.
 *                       40 answer slots over 8 animals should be 5 each.
 *
 * Every change below is a reassignment that the answer's own text supports —
 * "أتبع إحساسي" leading on الحساسية, "أتصرف بسرعة وأواجهها" on النمر — not an
 * arbitrary nudge to satisfy the simulator.
 *
 * Each edit states the value it expects to find. If the stored data has moved
 * on, the script refuses rather than overwriting something it does not
 * recognise — except where it already holds the target value, which is just
 * a re-run and is skipped.
 *
 *   node --experimental-strip-types scripts/rebalance-quizzes.ts [--apply]
 */
import fs from "node:fs";
import path from "node:path";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";

const APPLY = process.argv.includes("--apply");

/* eslint-disable @typescript-eslint/no-explicit-any */

interface WeightEdit {
  answerId: string;
  note: string;
  from: Record<string, number>;
  to: Record<string, number>;
}

interface ResultEdit {
  answerId: string;
  note: string;
  from: string;
  to: string;
}

/** Rewording a question or an answer, matched on its exact current text. */
interface TextEdit {
  id: string;
  kind: "question" | "answer";
  note: string;
  from: string;
  to: string;
}

/**
 * مم تتكون شخصيتك — give الحساسية the lead on the answers that are actually
 * about feeling things, and stop الفضول taking primaries that belong
 * elsewhere. "إسعاد الآخرين" leading on الفضول was plainly a copy of the
 * answer below it; it reads as الكرم.
 */
const WEIGHTS: Record<string, WeightEdit[]> = {
  "مم-تتكون-شخصيتك": [
    {
      answerId: "answer-1783516598430",
      note: "أتبع إحساسي → الحساسية leads",
      from: { "2": 3, "5": 1, "6": 2 },
      to: { "2": 2, "5": 1, "6": 3 },
    },
    {
      answerId: "answer-1783518177812",
      note: "أسمع قلبي → الحساسية leads",
      from: { "2": 3, "5": 1, "6": 2 },
      to: { "2": 2, "5": 1, "6": 3 },
    },
    {
      answerId: "answer-1783518305009",
      note: "الظلم يزعجني → الحساسية leads",
      from: { "2": 2, "5": 3, "6": 1 },
      to: { "2": 1, "5": 2, "6": 3 },
    },
    {
      answerId: "answer-1783518997635",
      note: "أستمع للجميع → الحساسية leads",
      from: { "2": 3, "5": 2, "6": 1 },
      to: { "2": 2, "5": 1, "6": 3 },
    },
    {
      answerId: "answer-1783518623284",
      note: "أبتعد عنه → الحساسية leads, الهدوء second",
      from: { "1": 1, "6": 2, "7": 3 },
      to: { "1": 1, "6": 3, "7": 2 },
    },
    {
      answerId: "answer-1783518790829",
      note: "إسعاد الآخرين → الكرم, not الفضول",
      from: { "1": 2, "3": 3, "4": 1 },
      to: { "2": 2, "5": 3, "6": 1 },
    },
    {
      answerId: "answer-1783517840705",
      note: "قراءة كتاب → الهدوء leads",
      from: { "1": 2, "3": 3, "7": 1 },
      to: { "1": 2, "3": 2, "7": 3 },
    },
  ],
};

/**
 * الحيوان الذي يشبه شخصيتك — level the animals at five appearances each.
 * الأسد keeps leadership (goals, leading the team, being the best, firm,
 * power) and gives up the two answers that are really about daring.
 */
const RESULTS: Record<string, ResultEdit[]> = {
  "الحيوان-الذي-يشبه-شخصيتك": [
    { answerId: "answer-1783635092265", note: "أتصرف بسرعة وأواجهها → النمر", from: "1", to: "8" },
    { answerId: "answer-1783635179180", note: "الشجاعة → النمر", from: "1", to: "8" },
    { answerId: "answer-1783635522824", note: "أعبر عن مشاعري بسرعة → الذئب", from: "1", to: "6" },
    { answerId: "answer-1783634544448", note: "في المنزل بهدوء → السلحفاة", from: "2", to: "7" },
    { answerId: "answer-1783635385209", note: "الشخص الذي يخطط بصمت → النسر", from: "2", to: "4" },
  ],
};

/**
 * جاهزيتك لسوق العمل asked the same question twice, word for word, as Q7 and
 * Q8 — so a reader answered it twice and it counted twice. Q8 becomes the
 * thing the quiz never asked about: coping under pressure. Its hedged answer
 * also pointed at the lowest band, where Q7's identical hedge pointed at the
 * middle one.
 */
const TEXTS: Record<string, TextEdit[]> = {
  "جاهزيتك-لسوق-العمل": [
    {
      id: "q_1783463942107",
      kind: "question",
      note: "Q8 was a word-for-word copy of Q7",
      from: "لدي القدرة على الالتزام بالأنظمة والتعليمات في مكان العمل",
      to: "أتعامل مع ضغط العمل والمواقف الطارئة دون أن يتأثر أدائي.",
    },
    {
      id: "answer-1783464685036",
      kind: "answer",
      note: "typo: أوافق الى بشدة",
      from: "أوافق الى بشدة",
      to: "أوافق بشدة",
    },
  ],
};

/** A hedged answer belongs in the middle band, as its twin in Q7 already is. */
const HEDGE: Record<string, ResultEdit[]> = {
  "جاهزيتك-لسوق-العمل": [
    {
      answerId: "answer-1783464745220",
      note: "أوافق ولكن متردد → middle band, not lowest",
      from: "0-40",
      to: "41-70",
    },
  ],
};

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) throw new Error(".env.local not found");
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const same = (a: unknown, b: unknown) =>
  JSON.stringify(a, Object.keys(a as object).sort()) ===
  JSON.stringify(b, Object.keys(b as object).sort());

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
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD missing from .env.local");
  await signInWithEmailAndPassword(getAuth(app), email, password);
  const db = getFirestore(app);
  console.log(`Signed in as ${email}\n`);

  const snap = await getDocs(collection(db, "quizzes"));
  const bySlug = new Map(
    snap.docs.map((d) => [String((d.data() as any).slug ?? "").trim(), d]),
  );

  let changed = 0;
  const problems: string[] = [];

  for (const [slug, edits] of [
    ...Object.entries(WEIGHTS).map((e) => [...e, "weights"] as const),
    ...Object.entries(RESULTS).map((e) => [...e, "resultId"] as const),
    ...Object.entries(HEDGE).map((e) => [...e, "resultId"] as const),
  ]) {
    const d = bySlug.get(slug as string);
    if (!d) {
      problems.push(`quiz not found: ${slug}`);
      continue;
    }
    const data = d.data() as any;
    const questions = JSON.parse(JSON.stringify(data.questions ?? []));
    let touched = 0;

    for (const edit of edits as Array<WeightEdit | ResultEdit>) {
      let found = false;
      for (const q of questions) {
        for (const a of q.answers ?? []) {
          if (String(a.id) !== edit.answerId) continue;
          found = true;
          if (typeof edit.from === "object") {
            const we = edit as WeightEdit;
            if (same(a.weights ?? {}, we.to)) break; // already applied
            if (!same(a.weights ?? {}, we.from)) {
              problems.push(
                `${slug} ${edit.answerId}: expected ${JSON.stringify(we.from)}, found ${JSON.stringify(a.weights)}`,
              );
              break;
            }
            a.weights = we.to;
          } else {
            const re = edit as ResultEdit;
            if (String(a.resultId) === re.to) break; // already applied
            if (String(a.resultId) !== re.from) {
              problems.push(
                `${slug} ${edit.answerId}: expected resultId ${re.from}, found ${a.resultId}`,
              );
              break;
            }
            a.resultId = re.to;
          }
          touched++;
          console.log(`  ${slug.slice(0, 26).padEnd(28)} ${edit.note}`);
        }
      }
      if (!found) problems.push(`${slug}: answer ${edit.answerId} not found`);
    }

    if (touched && APPLY) {
      await updateDoc(doc(db, "quizzes", d.id), {
        questions,
        updatedAt: new Date().toISOString(),
      });
      changed++;
    }
  }

  // Question and answer wording, matched on the exact current text.
  for (const [slug, edits] of Object.entries(TEXTS)) {
    const d = bySlug.get(slug);
    if (!d) {
      problems.push(`quiz not found: ${slug}`);
      continue;
    }
    const data = d.data() as any;
    const questions = JSON.parse(JSON.stringify(data.questions ?? []));
    let touched = 0;

    for (const edit of edits) {
      let found = false;
      for (const q of questions) {
        if (edit.kind === "question" && String(q.id) === edit.id) {
          found = true;
          if (String(q.text).trim() === edit.to) break; // already applied
          if (String(q.text).trim() !== edit.from) {
            problems.push(`${slug} ${edit.id}: text is not what was expected`);
            break;
          }
          q.text = edit.to;
          touched++;
          console.log(`  ${slug.slice(0, 26).padEnd(28)} ${edit.note}`);
        }
        for (const a of q.answers ?? []) {
          if (edit.kind !== "answer" || String(a.id) !== edit.id) continue;
          found = true;
          if (String(a.text).trim() === edit.to) break; // already applied
          if (String(a.text).trim() !== edit.from) {
            problems.push(`${slug} ${edit.id}: text is not what was expected`);
            break;
          }
          a.text = edit.to;
          touched++;
          console.log(`  ${slug.slice(0, 26).padEnd(28)} ${edit.note}`);
        }
      }
      if (!found) problems.push(`${slug}: ${edit.id} not found`);
    }

    if (touched && APPLY && !problems.length) {
      await updateDoc(doc(db, "quizzes", d.id), {
        questions,
        updatedAt: new Date().toISOString(),
      });
      changed++;
    }
  }

  if (problems.length) {
    console.error("\nRefusing to write — the stored data is not what was expected:");
    for (const p of problems) console.error("  " + p);
    process.exit(1);
  }

  console.log(
    APPLY
      ? `\nUpdated ${changed} quiz document(s).`
      : "\nDry run — nothing written. Re-run with --apply.",
  );
  process.exit(0);
}

main().catch((e) => {
  console.error("\nFailed:", e?.message || e);
  process.exit(1);
});
