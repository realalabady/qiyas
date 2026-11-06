/**
 * Resolve the `.js` specifiers in api/ back to the `.ts` files on disk.
 *
 * The functions under api/ import each other with explicit `.js` extensions,
 * which is what NodeNext wants and what Vercel compiles. Plain Node with
 * --experimental-strip-types does not do that rewrite, so the renderer cannot
 * be imported locally without this. Used only by scripts/check-ssr-locales.ts.
 */
export async function resolve(specifier, context, next) {
  if (specifier.startsWith(".") && specifier.endsWith(".js")) {
    try {
      return await next(specifier, context);
    } catch {
      return next(`${specifier.slice(0, -3)}.ts`, context);
    }
  }
  return next(specifier, context);
}
