/**
 * Lightweight text translation used by the admin panel to auto-fill the
 * opposite language when content is created or edited.
 *
 * Strategy: call Google's free (unofficial, key-less) translate endpoint.
 * If that fails for any reason we fall back to MyMemory, and if BOTH fail we
 * return the original text unchanged so a save is never blocked by the network.
 *
 * Only *display text* is ever translated — never ids, slugs, weights, colors,
 * or category linkage keys.
 */

export type Lang = "en" | "ar";

/** Translate a single string into `target`. Returns original text on failure. */
export async function translateText(
  text: string,
  target: Lang,
): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return text ?? "";

  // 1) Google gtx endpoint (auto source detection)
  try {
    const url =
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" +
      target +
      "&dt=t&q=" +
      encodeURIComponent(trimmed);
    const res = await fetch(url);
    if (res.ok) {
      const data = (await res.json()) as unknown;
      // Shape: [[["translated","source",...], ...], ...]
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const out = (data[0] as unknown[])
          .map((seg) => (Array.isArray(seg) ? String(seg[0] ?? "") : ""))
          .join("");
        if (out.trim()) return out;
      }
    }
  } catch {
    /* fall through */
  }

  // 2) MyMemory fallback
  try {
    const url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(trimmed) +
      "&langpair=" +
      (target === "en" ? "ar|en" : "en|ar");
    const res = await fetch(url);
    if (res.ok) {
      const data = (await res.json()) as {
        responseData?: { translatedText?: string };
      };
      const out = data?.responseData?.translatedText;
      if (out && out.trim()) return out;
    }
  } catch {
    /* fall through */
  }

  // 3) Give up gracefully
  return text;
}

/** Rough heuristic: does the string contain Arabic script? */
export function detectLang(text: string): Lang {
  return /[؀-ۿ]/.test(text || "") ? "ar" : "en";
}

/**
 * Translate many strings in one go, preserving order. Empty strings are kept
 * as-is (and not sent to the network).
 */
export async function translateMany(
  texts: string[],
  target: Lang,
): Promise<string[]> {
  return Promise.all(texts.map((tx) => translateText(tx, target)));
}
