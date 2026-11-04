/**
 * Drive every published quiz through the real QuizEngine.
 *
 * Passing validateQuizConfig only means the take page will start the quiz; it
 * says nothing about whether the quiz can actually produce each of its
 * results. A quiz whose fourth result is mathematically unreachable looks
 * perfectly healthy to the validator and is still broken for the reader.
 *
 * So for each result this builds the answer sheet that should favour it,
 * runs the engine, and reports which results can and cannot be reached.
 *
 * Reads only, no auth needed.
 *
 *   node --experimental-strip-types scripts/simulate-quizzes.ts
 */
import fs from "node:fs";
import path from "node:path";

import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";

import { QuizEngine } from "../src/lib/quiz-engine.ts";

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) throw new Error(".env.local not found");
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Several ways of favouring `target`, because no single greedy rule is
 * guaranteed to find the answer sheet that makes a result win. Calling a
 * result unreachable on one heuristic's say-so would be a false alarm, so a
 * result only counts as unreachable when every strategy fails to produce it.
 */
const STRATEGIES: Array<(a: any, target: string, type: string) => number> = [
  // Take the most weight for the target, ignoring collateral.
  (a, target, type) => {
    if (type === "personality_based") return a.resultId === target ? 1 : 0;
    return Number((a.weights ?? {})[target]) || 0;
  },
  // Take the target's weight net of everything it also feeds.
  (a, target, type) => {
    if (type === "personality_based") return a.resultId === target ? 1 : 0;
    const w = a.weights ?? {};
    const mine = Number(w[target]) || 0;
    const others = Object.entries(w)
      .filter(([id]) => id !== target)
      .reduce((sum, [, v]) => sum + (Number(v) || 0), 0);
    return mine * 2 - others;
  },
  // Take the target's lead over its single closest rival.
  (a, target, type) => {
    if (type === "personality_based") return a.resultId === target ? 1 : 0;
    const w = a.weights ?? {};
    const mine = Number(w[target]) || 0;
    const rival = Math.max(
      0,
      ...Object.entries(w)
        .filter(([id]) => id !== target)
        .map(([, v]) => Number(v) || 0),
    );
    return mine - rival;
  },
];

function buildConfig(raw: any) {
  return {
    id: String(raw.slug),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    type: String(raw.quizType),
    questions: (raw.questions ?? []).map((q: any) => ({
      id: q.id,
      text: q.text,
      answers: q.answers,
      type: "single",
    })),
    results: raw.results ?? [],
  } as any;
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

  let bad = 0;

  for (const d of snap.docs) {
    const raw = d.data() as any;
    const slug = String(raw.slug ?? d.id);
    const type = String(raw.quizType);
    const config = buildConfig(raw);
    const ids: string[] = config.results.map((r: any) => String(r.id));

    const reached = new Set<string>();

    const record = (pick: (q: any) => any) => {
      const engine = new QuizEngine(config);
      for (const q of config.questions) engine.answerQuestion(q.id, pick(q).id);
      try {
        reached.add(String(engine.calculateResult().primaryResult.id));
      } catch (e: any) {
        console.log(`  ERROR ${slug}: ${e?.message || e}`);
      }
    };

    if (type === "score_based") {
      // A score_based quiz has one total, not a target per result, so aiming
      // at each result in turn just picks the top answer every time and makes
      // every band but the last look unreachable. Sweep the whole range of
      // achievable totals instead and see which bands it lands in.
      for (let step = 0; step <= 40; step++) {
        const f = step / 40;
        record((q: any) => {
          const scores = q.answers.map((a: any) => Number(a.score) || 0);
          const lo = Math.min(...scores), hi = Math.max(...scores);
          const want = lo + f * (hi - lo);
          return [...q.answers].sort(
            (a: any, b: any) =>
              Math.abs((Number(a.score) || 0) - want) -
              Math.abs((Number(b.score) || 0) - want),
          )[0];
        });
      }
    } else {
      for (const target of ids) {
        for (const favour of STRATEGIES) {
          record(
            (q: any) =>
              [...q.answers].sort(
                (a: any, b: any) =>
                  favour(b, target, type) - favour(a, target, type),
              )[0],
          );
        }
      }
    }

    const missed = ids.filter((id) => !reached.has(id));
    if (missed.length) {
      bad++;
      console.log(
        `  UNREACHABLE  ${type.padEnd(22)} ${slug}\n` +
          `               ${missed.length}/${ids.length} never win: ${missed.join(", ")}`,
      );
    } else {
      console.log(`  ok  ${String(ids.length).padStart(2)}/${String(ids.length).padEnd(2)} ${type.padEnd(22)} ${slug}`);
    }
  }

  console.log(
    `\n${snap.size} quiz(zes); ${bad} with results a reader can never get.`,
  );
  process.exit(bad ? 1 : 0);
}

main().catch((e) => {
  console.error("\nFailed:", e?.message || e);
  process.exit(1);
});
