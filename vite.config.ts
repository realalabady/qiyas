import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Emit the SPA shell as `app.html` instead of `index.html`.
 *
 * Vercel gives "precedence to the filesystem prior to rewrites being applied",
 * so while a file exists at `/`, the `"source": "/"` rewrite in vercel.json can
 * never fire and the homepage would keep serving the empty shell to crawlers —
 * the exact thing AdSense rejected the site for. With no `index.html` in the
 * output, `/` falls through to the rewrite and is server-rendered by
 * `api/render.ts`, which loads this file as its shell.
 *
 * Dev is unaffected: `index.html` stays in the project root and `vite dev`
 * serves it at `/` as usual. Only the built output is renamed.
 */
function emitShellAsAppHtml(): Plugin {
  return {
    name: "emit-shell-as-app-html",
    enforce: "post",
    apply: "build",
    // Renamed on disk rather than by mutating the bundle: Rolldown ignores
    // assignments to the bundle object in generateBundle.
    async writeBundle(options) {
      const outDir = options.dir ?? "dist";
      const from = path.join(outDir, "index.html");
      const to = path.join(outDir, "app.html");
      try {
        await fs.rename(from, to);
      } catch (error) {
        this.error(
          `Failed to rename ${from} to ${to}: ${String(error)}. Without this, ` +
            `Vercel serves index.html at / and the homepage rewrite never fires.`,
        );
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), emitShellAsAppHtml()],
  server: {
    host: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
