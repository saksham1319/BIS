/**
 * Server-only environment access for the BIS Saathi AI layer.
 *
 * The Gemini API key is read from `GEMINI_API_KEY` (preferred) or
 * `GOOGLE_API_KEY` (fallback). It is NEVER prefixed with `NEXT_PUBLIC_` and
 * must never be returned to the browser — only `isAiConfigured()` (a boolean)
 * is safe to surface to the client.
 */

/** The Gemini model used for every generation in this app. */
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";

/**
 * Values that people commonly leave in a `.env.local` template. Treating them
 * as "not configured" keeps the demo on the graceful-degradation path instead
 * of firing a request that is guaranteed to 400.
 */
const PLACEHOLDERS = new Set([
  "your_api_key_here",
  "your-api-key-here",
  "your_gemini_api_key",
  "your-gemini-api-key",
  "your_gemini_api_key_here",
  "gemini_api_key",
  "changeme",
  "change_me",
  "todo",
  "xxx",
  "xxxx",
  "undefined",
  "null",
  "none",
  "placeholder",
  "add_your_key",
  "sk-...",
  "...",
]);

/**
 * Returns the trimmed Gemini API key, or `null` when it is missing, blank, or
 * an obvious placeholder. Server-only — do not call this from a client
 * component.
 */
export function getGeminiKey(): string | null {
  const raw = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (typeof raw !== "string") return null;

  const key = raw.trim().replace(/^["']|["']$/g, "").trim();
  if (key.length === 0) return null;
  if (PLACEHOLDERS.has(key.toLowerCase())) return null;

  return key;
}

/** True when a usable Gemini API key is present in the server environment. */
export function isAiConfigured(): boolean {
  return getGeminiKey() !== null;
}
