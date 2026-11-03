/**
 * Generate the thumbnail images for the November 2026 articles and quizzes.
 *
 * The new content shipped without images, so its cards fell back to a plain
 * gradient while every older card had one. Rather than hotlink somebody else's
 * photographs — a licensing problem and an external dependency on every page
 * view — these are drawn here from primitives and committed to `public/`.
 *
 * Why real files and not `data:` URLs, which the admin panel also accepts:
 *   - `article-detail-page.tsx` builds `og:image` as
 *     `image.startsWith("http") ? image : origin + image`, so a `data:` URL
 *     would come out as `https://host/data:image/...`.
 *   - Social crawlers reject SVG for `og:image`, and `api/og-image.ts` only
 *     decodes base64 `data:` URLs, so an SVG would break link previews.
 * A path under `public/` avoids both: the origin prefix is exactly right, and
 * crawlers get a normal PNG. Vercel serves it straight off the filesystem,
 * which takes precedence over the catch-all rewrite in `vercel.json`.
 *
 * No image library is installed and the only `convert` on PATH here is the
 * Windows filesystem utility, so this writes the PNG itself: an RGB pixel
 * buffer, per-scanline filter 0, `zlib.deflateSync`, and hand-assembled
 * IHDR/IDAT/IEND chunks. Shapes are drawn by signed distance with a one-pixel
 * smoothstep, which antialiases them without supersampling.
 *
 * Output is deterministic: re-running produces byte-identical files.
 *
 * Usage:
 *   node --experimental-strip-types scripts/generate-thumbnails.ts
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const W = 1200;
const H = 630;
const OUT = path.join(process.cwd(), "public", "thumbnails");

type RGB = [number, number, number];

const hex = (s: string): RGB => [
  parseInt(s.slice(1, 3), 16),
  parseInt(s.slice(3, 5), 16),
  parseInt(s.slice(5, 7), 16),
];

/** Brand colours, from DEFAULT_THEME in src/stores/theme-store.ts. */
const FUCHSIA = hex("#ec4899");
const VIOLET = hex("#7c3aed");
const INK = hex("#0b0712");

class Canvas {
  buf = new Float64Array(W * H * 3);

  /** Alpha-blend a colour over one pixel. */
  px(x: number, y: number, c: RGB, a: number) {
    if (a <= 0 || x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 3;
    const k = a > 1 ? 1 : a;
    this.buf[i] += (c[0] - this.buf[i]) * k;
    this.buf[i + 1] += (c[1] - this.buf[i + 1]) * k;
    this.buf[i + 2] += (c[2] - this.buf[i + 2]) * k;
  }

  /** Add light without darkening what is underneath. */
  add(x: number, y: number, c: RGB, a: number) {
    if (a <= 0 || x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 3;
    this.buf[i] = Math.min(255, this.buf[i] + c[0] * a);
    this.buf[i + 1] = Math.min(255, this.buf[i + 1] + c[1] * a);
    this.buf[i + 2] = Math.min(255, this.buf[i + 2] + c[2] * a);
  }

  /** Diagonal two-stop gradient across the whole frame. */
  background(a: RGB, b: RGB) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const t = (x / W + y / H) / 2;
        const i = (y * W + x) * 3;
        this.buf[i] = a[0] + (b[0] - a[0]) * t;
        this.buf[i + 1] = a[1] + (b[1] - a[1]) * t;
        this.buf[i + 2] = a[2] + (b[2] - a[2]) * t;
      }
    }
  }

  /** Soft radial light, falling off as a smooth square. */
  glow(cx: number, cy: number, r: number, c: RGB, strength: number) {
    const x0 = Math.max(0, Math.floor(cx - r));
    const x1 = Math.min(W - 1, Math.ceil(cx + r));
    const y0 = Math.max(0, Math.floor(cy - r));
    const y1 = Math.min(H - 1, Math.ceil(cy + r));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / r;
        if (d >= 1) continue;
        const f = (1 - d) * (1 - d);
        this.add(x, y, c, f * strength);
      }
    }
  }

  /**
   * Fill wherever `sdf` is negative, antialiased over one pixel.
   * Every shape below is expressed as a signed distance field.
   */
  private fill(
    sdf: (x: number, y: number) => number,
    box: [number, number, number, number],
    c: RGB,
    alpha: number,
  ) {
    const [bx0, by0, bx1, by1] = box;
    const x0 = Math.max(0, Math.floor(bx0));
    const x1 = Math.min(W - 1, Math.ceil(bx1));
    const y0 = Math.max(0, Math.floor(by0));
    const y1 = Math.min(H - 1, Math.ceil(by1));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const d = sdf(x + 0.5, y + 0.5);
        const cov = d <= -0.5 ? 1 : d >= 0.5 ? 0 : 0.5 - d;
        if (cov > 0) this.px(x, y, c, cov * alpha);
      }
    }
  }

  disc(cx: number, cy: number, r: number, c: RGB, alpha = 1) {
    this.fill(
      (x, y) => Math.hypot(x - cx, y - cy) - r,
      [cx - r - 1, cy - r - 1, cx + r + 1, cy + r + 1],
      c,
      alpha,
    );
  }

  ring(cx: number, cy: number, r: number, w: number, c: RGB, alpha = 1) {
    const o = r + w / 2;
    this.fill(
      (x, y) => Math.abs(Math.hypot(x - cx, y - cy) - r) - w / 2,
      [cx - o - 1, cy - o - 1, cx + o + 1, cy + o + 1],
      c,
      alpha,
    );
  }

  /** Annulus sector. Angles in radians, measured clockwise from 12 o'clock. */
  arc(
    cx: number,
    cy: number,
    r: number,
    w: number,
    a0: number,
    a1: number,
    c: RGB,
    alpha = 1,
  ) {
    const o = r + w / 2;
    this.fill(
      (x, y) => {
        let a = Math.atan2(x - cx, cy - y);
        if (a < 0) a += Math.PI * 2;
        let lo = a0;
        let hi = a1;
        if (hi < lo) hi += Math.PI * 2;
        let aa = a;
        if (aa < lo) aa += Math.PI * 2;
        if (aa > hi) return 1;
        return Math.abs(Math.hypot(x - cx, y - cy) - r) - w / 2;
      },
      [cx - o - 1, cy - o - 1, cx + o + 1, cy + o + 1],
      c,
      alpha,
    );
  }

  roundRect(
    x: number,
    y: number,
    w: number,
    h: number,
    rad: number,
    c: RGB,
    alpha = 1,
  ) {
    const r = Math.min(rad, w / 2, h / 2);
    const cx = x + w / 2;
    const cy = y + h / 2;
    const hx = w / 2 - r;
    const hy = h / 2 - r;
    this.fill(
      (px, py) => {
        const dx = Math.abs(px - cx) - hx;
        const dy = Math.abs(py - cy) - hy;
        const ox = Math.max(dx, 0);
        const oy = Math.max(dy, 0);
        return Math.hypot(ox, oy) + Math.min(Math.max(dx, dy), 0) - r;
      },
      [x - 1, y - 1, x + w + 1, y + h + 1],
      c,
      alpha,
    );
  }

  line(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    w: number,
    c: RGB,
    alpha = 1,
  ) {
    const vx = x1 - x0;
    const vy = y1 - y0;
    const len2 = vx * vx + vy * vy || 1;
    this.fill(
      (x, y) => {
        let t = ((x - x0) * vx + (y - y0) * vy) / len2;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        return Math.hypot(x - (x0 + vx * t), y - (y0 + vy * t)) - w / 2;
      },
      [
        Math.min(x0, x1) - w - 1,
        Math.min(y0, y1) - w - 1,
        Math.max(x0, x1) + w + 1,
        Math.max(y0, y1) + w + 1,
      ],
      c,
      alpha,
    );
  }

  /** Mix between the two brand colours. */
  static brand(t: number): RGB {
    return [
      FUCHSIA[0] + (VIOLET[0] - FUCHSIA[0]) * t,
      FUCHSIA[1] + (VIOLET[1] - FUCHSIA[1]) * t,
      FUCHSIA[2] + (VIOLET[2] - FUCHSIA[2]) * t,
    ];
  }

  toPng(): Buffer {
    // Filter type 0 on every scanline; RGB, 8 bits per channel.
    const raw = Buffer.alloc(H * (1 + W * 3));
    let p = 0;
    for (let y = 0; y < H; y++) {
      raw[p++] = 0;
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 3;
        raw[p++] = Math.round(Math.min(255, Math.max(0, this.buf[i])));
        raw[p++] = Math.round(Math.min(255, Math.max(0, this.buf[i + 1])));
        raw[p++] = Math.round(Math.min(255, Math.max(0, this.buf[i + 2])));
      }
    }

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(W, 0);
    ihdr.writeUInt32BE(H, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 2; // colour type: truecolour
    // 10..12 stay 0: deflate, adaptive filtering, no interlace.

    return Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk("IHDR", ihdr),
      chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
      chunk("IEND", Buffer.alloc(0)),
    ]);
  }
}

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf: Buffer): number {
  let c = -1;
  for (let i = 0; i < buf.length; i++)
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

/** Shared staging: dark field, two brand lights, a faint dot grid. */
function stage(tilt = 0): Canvas {
  const c = new Canvas();
  c.background(INK, [26, 14, 46]);
  c.glow(180 + tilt, 120, 620, VIOLET, 0.42);
  c.glow(1050 - tilt, 560, 560, FUCHSIA, 0.34);
  for (let y = 40; y < H; y += 42) {
    for (let x = 40; x < W; x += 42) c.disc(x, y, 1.6, [255, 255, 255], 0.07);
  }
  return c;
}

const TAU = Math.PI * 2;
const CX = W / 2;
const CY = H / 2;

/** Five spokes of different length — the five factors. */
function bigFive(): Canvas {
  const c = stage();
  const lens = [0.95, 0.72, 0.86, 0.6, 0.78];
  c.ring(CX, CY, 198, 2, [255, 255, 255], 0.14);
  c.ring(CX, CY, 132, 2, [255, 255, 255], 0.1);
  c.ring(CX, CY, 66, 2, [255, 255, 255], 0.08);
  const pts: [number, number][] = [];
  lens.forEach((L, i) => {
    const a = (i / 5) * TAU;
    const r = 198 * L;
    const x = CX + Math.sin(a) * r;
    const y = CY - Math.cos(a) * r;
    pts.push([x, y]);
    c.line(CX, CY, x, y, 7, Canvas.brand(i / 4), 0.9);
    c.disc(x, y, 17, Canvas.brand(i / 4), 1);
    c.disc(x, y, 7, [255, 255, 255], 0.85);
  });
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % pts.length];
    c.line(x0, y0, x1, y1, 3, [255, 255, 255], 0.3);
  }
  c.disc(CX, CY, 13, [255, 255, 255], 0.95);
  return c;
}

/** Two axes, four quadrants, one marked point — the attachment plane. */
function attachmentPlane(markQuadrant: number): Canvas {
  const c = stage(60);
  const S = 196;
  c.roundRect(CX - S, CY - S, S * 2, S * 2, 26, [255, 255, 255], 0.05);
  c.line(CX - S, CY, CX + S, CY, 3, [255, 255, 255], 0.3);
  c.line(CX, CY - S, CX, CY + S, 3, [255, 255, 255], 0.3);
  // Quadrant tints, clockwise from top-left.
  const q: [number, number][] = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  q.forEach(([sx, sy], i) => {
    const on = i === markQuadrant;
    c.disc(CX + sx * 98, CY + sy * 98, on ? 46 : 26, Canvas.brand(i / 3), on ? 1 : 0.5);
    if (on) {
      c.glow(CX + sx * 98, CY + sy * 98, 170, Canvas.brand(i / 3), 0.5);
      c.disc(CX + sx * 98, CY + sy * 98, 17, [255, 255, 255], 0.95);
    }
  });
  c.ring(CX, CY, 7, 3, [255, 255, 255], 0.6);
  return c;
}

/** Three declining bars — exhaustion, distance, efficacy. */
function burnout(steep: boolean): Canvas {
  const c = stage(40);
  const base = CY + 150;
  const hs = steep ? [250, 165, 80] : [230, 150, 70];
  hs.forEach((h, i) => {
    const x = CX - 226 + i * 170;
    c.roundRect(x, base - h, 112, h, 24, Canvas.brand(i / 2), 0.92);
    c.roundRect(x, base - h, 112, 26, 13, [255, 255, 255], 0.22);
  });
  c.line(CX - 290, base + 18, CX + 290, base + 18, 4, [255, 255, 255], 0.22);
  // The line of decline.
  for (let i = 0; i < hs.length - 1; i++) {
    c.line(
      CX - 226 + i * 170 + 56,
      base - hs[i] - 34,
      CX - 226 + (i + 1) * 170 + 56,
      base - hs[i + 1] - 34,
      4,
      [255, 255, 255],
      0.4,
    );
  }
  hs.forEach((h, i) =>
    c.disc(CX - 226 + i * 170 + 56, base - h - 34, 11, [255, 255, 255], 0.85),
  );
  return c;
}

/** A clock whose remaining arc is nearly gone. */
function procrastination(): Canvas {
  const c = stage(-40);
  c.ring(CX, CY, 186, 10, [255, 255, 255], 0.16);
  c.arc(CX, CY, 186, 16, TAU * 0.74, TAU * 0.995, FUCHSIA, 0.95);
  c.arc(CX, CY, 186, 10, 0, TAU * 0.74, VIOLET, 0.45);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    const r0 = 150;
    c.line(
      CX + Math.sin(a) * r0,
      CY - Math.cos(a) * r0,
      CX + Math.sin(a) * (r0 - 20),
      CY - Math.cos(a) * (r0 - 20),
      4,
      [255, 255, 255],
      i % 3 === 0 ? 0.5 : 0.22,
    );
  }
  // Hands near the eleventh hour.
  c.line(CX, CY, CX + Math.sin(TAU * 0.92) * 120, CY - Math.cos(TAU * 0.92) * 120, 9, [255, 255, 255], 0.9);
  c.line(CX, CY, CX + Math.sin(TAU * 0.5) * 78, CY - Math.cos(TAU * 0.5) * 78, 7, FUCHSIA, 0.95);
  c.disc(CX, CY, 15, [255, 255, 255], 0.95);
  return c;
}

/** Four petals around a centre — the four branches. */
function fourBranches(nested: boolean): Canvas {
  const c = stage(20);
  if (nested) {
    [206, 158, 110, 62].forEach((r, i) =>
      c.ring(CX, CY, r, 16, Canvas.brand(i / 3), 0.9 - i * 0.07),
    );
    c.disc(CX, CY, 24, [255, 255, 255], 0.92);
    return c;
  }
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU + TAU / 8;
    const d = 118;
    const x = CX + Math.sin(a) * d;
    const y = CY - Math.cos(a) * d;
    c.disc(x, y, 92, Canvas.brand(i / 3), 0.72);
    c.ring(x, y, 92, 5, [255, 255, 255], 0.3);
  }
  c.disc(CX, CY, 46, INK, 0.85);
  c.ring(CX, CY, 46, 5, [255, 255, 255], 0.5);
  c.disc(CX, CY, 15, [255, 255, 255], 0.9);
  return c;
}

/** Identical rows, one highlighted — one description fits everybody. */
function barnum(): Canvas {
  const c = stage(-60);
  const rows = 5;
  const cols = 4;
  const bw = 196;
  const bh = 66;
  const gx = 28;
  const gy = 22;
  const x0 = CX - (cols * bw + (cols - 1) * gx) / 2;
  const y0 = CY - (rows * bh + (rows - 1) * gy) / 2;
  for (let r = 0; r < rows; r++) {
    for (let k = 0; k < cols; k++) {
      const x = x0 + k * (bw + gx);
      const y = y0 + r * (bh + gy);
      const mine = r === 2 && k === 1;
      c.roundRect(x, y, bw, bh, 18, mine ? FUCHSIA : [255, 255, 255], mine ? 0.95 : 0.11);
      c.roundRect(x + 22, y + 22, bw - 86, 10, 5, [255, 255, 255], mine ? 0.85 : 0.2);
      c.roundRect(x + 22, y + 40, bw - 130, 8, 4, [255, 255, 255], mine ? 0.6 : 0.14);
      if (mine) c.glow(x + bw / 2, y + bh / 2, 230, FUCHSIA, 0.4);
    }
  }
  return c;
}

/** A profile of five bars — the Big Five article. */
function fiveBars(): Canvas {
  const c = stage(80);
  const base = CY + 168;
  const hs = [196, 268, 150, 232, 118];
  hs.forEach((h, i) => {
    const x = CX - 298 + i * 124;
    c.roundRect(x, base - h, 86, h, 20, Canvas.brand(i / 4), 0.92);
    c.roundRect(x, base - h, 86, 22, 11, [255, 255, 255], 0.24);
    c.disc(x + 43, base + 44, 9, Canvas.brand(i / 4), 0.8);
  });
  c.line(CX - 320, base + 16, CX + 320, base + 16, 4, [255, 255, 255], 0.24);
  return c;
}

/** A compressed timeline — everything happens at the deadline. */
function timeline(): Canvas {
  const c = stage(-20);
  const y = CY;
  c.roundRect(CX - 320, y - 7, 640, 14, 7, [255, 255, 255], 0.14);
  // Sparse early, dense late — stopping short of the deadline bar at 0.97.
  const marks = [0.04, 0.15, 0.3, 0.46, 0.72, 0.78, 0.83, 0.87, 0.9, 0.925];
  marks.forEach((t, i) => {
    const x = CX - 320 + 640 * t;
    const late = t > 0.6;
    const h = late ? 86 + (i % 3) * 26 : 44;
    c.roundRect(x - 11, y - h, 22, h, 11, late ? FUCHSIA : VIOLET, late ? 0.95 : 0.55);
  });
  c.roundRect(CX + 302, y - 130, 16, 260, 8, [255, 255, 255], 0.6);
  c.glow(CX + 250, y, 260, FUCHSIA, 0.45);
  c.disc(CX - 320, y, 15, VIOLET, 0.9);
  return c;
}

const SCENES: Record<string, () => Canvas> = {
  // quizzes
  "quiz-big-five": bigFive,
  "quiz-attachment": () => attachmentPlane(2),
  "quiz-burnout": () => burnout(true),
  "quiz-procrastination": procrastination,
  "quiz-emotional-intelligence": () => fourBranches(false),
  // articles
  "article-big-five": fiveBars,
  "article-attachment": () => attachmentPlane(0),
  "article-barnum": barnum,
  "article-emotional-intelligence": () => fourBranches(true),
  "article-burnout": () => burnout(false),
  "article-procrastination": timeline,
};

fs.mkdirSync(OUT, { recursive: true });
let total = 0;
for (const [name, draw] of Object.entries(SCENES)) {
  const png = draw().toPng();
  const file = path.join(OUT, `${name}.png`);
  fs.writeFileSync(file, png);
  total += png.length;
  console.log(`${String(Math.round(png.length / 1024)).padStart(4)} KB  /thumbnails/${name}.png`);
}
console.log(`\n${Object.keys(SCENES).length} images, ${Math.round(total / 1024)} KB total`);
