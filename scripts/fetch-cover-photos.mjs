/**
 * Download one licensed background photograph per new cover.
 *
 * The covers are composited in two stages: this script fetches the photograph,
 * and scripts/thumbnail-studio/covers.html draws the Arabic headline over it.
 * They are split because image models cannot spell Arabic and canvas cannot
 * paint a photograph — each stage does the half it is good at.
 *
 * Source is Pexels. Its licence allows free commercial use without
 * attribution, but every photographer and source URL is recorded in
 * photos/manifest.json so the provenance of anything on the site can be
 * checked later without re-running this.
 *
 * Needs PEXELS_API_KEY in .env.local (free key, no card: pexels.com/api).
 *
 *   node scripts/fetch-cover-photos.mjs [name ...]
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "scripts", "thumbnail-studio", "photos");

/**
 * Queries lean atmospheric rather than literal: "tired person at a desk"
 * returns stock cliché, while light, texture and gesture grade into one
 * visual set once the scrim and duotone go over them.
 */
const SHOTS = {
  "article-big-five": "thoughtful portrait silhouette window light",
  "article-attachment": "two people holding hands close warm backlight",
  "article-barnum": "blurred crowd motion street long exposure",
  "article-emotional-intelligence": "two people in conversation warm window light",
  "article-burnout": "empty desk late night office warm lamp",
  "article-procrastination": "vintage clock on desk moody shadow",

  "quiz-big-five": "person looking out of window pensive portrait",
  "quiz-attachment": "two hands reaching apart dark moody",
  "quiz-burnout": "office window dusk city tired atmosphere",
  "quiz-procrastination": "alarm clock morning bedside soft light",
  "quiz-emotional-intelligence": "close portrait expressive face studio light",
};

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

/**
 * Pick the widest landscape result that is not close to square — a 4:3 frame
 * loses too much to the 1200x630 crop.
 */
function pick(photos) {
  return photos
    .filter((p) => p.width / p.height >= 1.45)
    .sort((a, b) => b.width - a.width)[0];
}

async function main() {
  loadEnv();
  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    console.error(
      "PEXELS_API_KEY is not set.\n" +
        "Get a free key at https://www.pexels.com/api/ and add this line to .env.local:\n" +
        "  PEXELS_API_KEY=your_key_here",
    );
    process.exit(1);
  }

  fs.mkdirSync(OUT, { recursive: true });
  const manifestPath = path.join(OUT, "manifest.json");
  const manifest = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    : {};

  const only = process.argv.slice(2);
  const names = only.length ? only : Object.keys(SHOTS);
  let failed = 0;

  for (const name of names) {
    const query = SHOTS[name];
    if (!query) {
      console.error(`unknown cover: ${name}`);
      failed++;
      continue;
    }
    const url =
      "https://api.pexels.com/v1/search?orientation=landscape&size=large&per_page=20&query=" +
      encodeURIComponent(query);
    const res = await fetch(url, { headers: { Authorization: key } });
    if (!res.ok) {
      console.error(`${name}: search failed (${res.status} ${res.statusText})`);
      failed++;
      continue;
    }
    const photo = pick((await res.json()).photos ?? []);
    if (!photo) {
      console.error(`${name}: no wide-enough result for "${query}"`);
      failed++;
      continue;
    }
    const img = await fetch(photo.src.large2x ?? photo.src.original);
    if (!img.ok) {
      console.error(`${name}: download failed (${img.status})`);
      failed++;
      continue;
    }
    const buf = Buffer.from(await img.arrayBuffer());
    fs.writeFileSync(path.join(OUT, `${name}.jpg`), buf);
    manifest[name] = {
      query,
      photographer: photo.photographer,
      photographer_url: photo.photographer_url,
      source: photo.url,
      size: `${photo.width}x${photo.height}`,
      alt: photo.alt ?? "",
    };
    console.log(
      `${String(Math.round(buf.length / 1024)).padStart(4)} KB  ${name.padEnd(34)} ${photo.photographer}`,
    );
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nmanifest: ${manifestPath}`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error("\nFailed:", e?.message || e);
  process.exit(1);
});
