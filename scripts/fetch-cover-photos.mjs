/**
 * Download one licensed background photograph per new cover.
 *
 * The covers are composited in two stages: this script fetches the photograph,
 * and scripts/thumbnail-studio/covers.html draws the Arabic headline over it.
 * They are split because image models cannot spell Arabic and canvas cannot
 * paint a photograph — each stage does the half it is good at.
 *
 * Three stock providers are supported because none of them can be relied on
 * to be issuing keys: Pexels paused new API keys entirely while this was being
 * written. Put whichever key you can actually obtain in .env.local and the
 * script picks it up:
 *
 *   UNSPLASH_ACCESS_KEY   unsplash.com/developers  — best photographs, but
 *                         their API terms require crediting the photographer,
 *                         so this also needs a credits page on the site
 *   PIXABAY_API_KEY       pixabay.com/api/docs     — key shown on that page
 *                         once signed in; no attribution obligation
 *   PEXELS_API_KEY        pexels.com/api           — paused as of Nov 2025
 *
 * Every photographer and source URL is recorded in photos/manifest.json so the
 * provenance of anything on the site can be checked without re-running this.
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

/* Each provider normalises to the same shape so the rest of the script does
 * not care which one answered. `track` is Unsplash's download ping, which
 * their API terms require us to fire when a photo is actually used. */

const PROVIDERS = [
  {
    name: "unsplash",
    env: "UNSPLASH_ACCESS_KEY",
    search: (q, key) => [
      "https://api.unsplash.com/search/photos?orientation=landscape&per_page=20&query=" +
        encodeURIComponent(q),
      { Authorization: `Client-ID ${key}` },
    ],
    parse: (body) =>
      (body.results ?? []).map((p) => ({
        url: p.urls.raw ? `${p.urls.raw}&w=1800&fm=jpg&q=85` : p.urls.full,
        width: p.width,
        height: p.height,
        photographer: p.user?.name ?? "",
        photographer_url: p.user?.links?.html ?? "",
        source: p.links?.html ?? "",
        alt: p.alt_description ?? "",
        track: p.links?.download_location ?? "",
      })),
  },
  {
    name: "pexels",
    env: "PEXELS_API_KEY",
    search: (q, key) => [
      "https://api.pexels.com/v1/search?orientation=landscape&size=large&per_page=20&query=" +
        encodeURIComponent(q),
      { Authorization: key },
    ],
    parse: (body) =>
      (body.photos ?? []).map((p) => ({
        url: p.src?.large2x ?? p.src?.original,
        width: p.width,
        height: p.height,
        photographer: p.photographer ?? "",
        photographer_url: p.photographer_url ?? "",
        source: p.url ?? "",
        alt: p.alt ?? "",
      })),
  },
  {
    name: "pixabay",
    env: "PIXABAY_API_KEY",
    search: (q, key) => [
      `https://pixabay.com/api/?image_type=photo&orientation=horizontal&per_page=20&safesearch=true&key=${key}&q=` +
        encodeURIComponent(q),
      {},
    ],
    parse: (body) =>
      (body.hits ?? []).map((p) => ({
        url: p.largeImageURL ?? p.webformatURL,
        width: p.imageWidth,
        height: p.imageHeight,
        photographer: p.user ?? "",
        photographer_url: `https://pixabay.com/users/${p.user}-${p.user_id}/`,
        source: p.pageURL ?? "",
        alt: p.tags ?? "",
      })),
  },
];

/**
 * Pick the widest landscape result that is not close to square — a 4:3 frame
 * loses too much to the 1200x630 crop.
 */
function pick(photos) {
  return photos
    .filter((p) => p.url && p.width / p.height >= 1.45)
    .sort((a, b) => b.width - a.width)[0];
}

async function main() {
  loadEnv();
  const provider = PROVIDERS.find((p) => process.env[p.env]);
  if (!provider) {
    console.error(
      "No stock photo key found. Add ONE of these to .env.local:\n\n" +
        PROVIDERS.map((p) => `  ${p.env}=...`).join("\n") +
        "\n\nSee the comment at the top of this file for where to get each.",
    );
    process.exit(1);
  }
  const key = process.env[provider.env];
  console.log(`provider: ${provider.name}\n`);

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

    const [url, headers] = provider.search(query, key);
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error(`${name}: search failed (${res.status} ${res.statusText})`);
      failed++;
      continue;
    }
    const photo = pick(provider.parse(await res.json()));
    if (!photo) {
      console.error(`${name}: no wide-enough result for "${query}"`);
      failed++;
      continue;
    }

    // Unsplash's terms require this ping whenever a photo is actually used.
    if (photo.track) {
      await fetch(photo.track, { headers }).catch(() => {});
    }

    const img = await fetch(photo.url);
    if (!img.ok) {
      console.error(`${name}: download failed (${img.status})`);
      failed++;
      continue;
    }
    const buf = Buffer.from(await img.arrayBuffer());
    fs.writeFileSync(path.join(OUT, `${name}.jpg`), buf);
    manifest[name] = {
      provider: provider.name,
      query,
      photographer: photo.photographer,
      photographer_url: photo.photographer_url,
      source: photo.source,
      size: `${photo.width}x${photo.height}`,
      alt: photo.alt,
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
