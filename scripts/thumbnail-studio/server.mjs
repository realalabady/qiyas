/**
 * Local-only rendering host for the thumbnail studio.
 *
 * Canvas is the only way to get correctly shaped Arabic text into a PNG here:
 * there is no image library installed, the `convert` on PATH is the Windows
 * filesystem utility, and diffusion models cannot render Arabic script.
 *
 * So the browser draws, and this server writes what it draws. It binds to
 * 127.0.0.1, serves its own directory, and accepts PNG bytes on POST /save.
 * Filenames are restricted to [a-z0-9-] so a POST can only ever land inside
 * public/thumbnails.
 *
 *   node scripts/thumbnail-studio/server.mjs
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(process.cwd(), "public", "thumbnails");
const PORT = Number(process.argv[2]) || 7331;
fs.mkdirSync(OUT, { recursive: true });

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

http
  .createServer((req, res) => {
    if (req.method === "POST" && req.url?.startsWith("/save/")) {
      const name = decodeURIComponent(req.url.slice("/save/".length));
      if (!/^[a-z0-9-]+\.(png|jpg)$/.test(name)) {
        res.writeHead(400).end("bad name");
        return;
      }
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(path.join(OUT, name), buf);
        console.log(`${String(Math.round(buf.length / 1024)).padStart(4)} KB  ${name}`);
        res.writeHead(200, { "access-control-allow-origin": "*" }).end("ok");
      });
      return;
    }
    const file = path.join(HERE, req.url === "/" ? "index.html" : req.url.split("?")[0]);
    if (!file.startsWith(HERE) || !fs.existsSync(file)) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    res.end(fs.readFileSync(file));
  })
  .listen(PORT, "127.0.0.1", () =>
    console.log(`thumbnail studio on http://127.0.0.1:${PORT}`),
  );
