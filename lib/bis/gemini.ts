/**
 * Direct Gemini REST client for BIS Saathi. No SDK, no npm dependency — just
 * `fetch` against the Generative Language API's SSE streaming endpoint.
 *
 * The model returns structured JSON (an `AssistantAnswer` minus `sources`).
 * The server attaches the real, retrieved `sources` afterwards so the model
 * can never fabricate evidence.
 */

import { GEMINI_MODEL, getGeminiKey } from "@/lib/bis/env";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/bis/prompt";
import type { AssistantAnswer, ChatMessage } from "@/lib/bis/types";

/** The model's half of the contract: everything except `sources`. */
export type ModelAnswer = Omit<AssistantAnswer, "sources">;

export type StreamChunk =
  | { kind: "delta"; text: string }
  | { kind: "done"; answer: ModelAnswer };

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const CANDIDATE_MODELS = Array.from(
  new Set(
    [
      GEMINI_MODEL,
      "gemini-3.5-flash",
      "gemini-flash-latest",
      "gemini-3.6-flash",
      "gemini-3.8-flash",
    ].filter(Boolean),
  ),
);

function endpoint(model: string = GEMINI_MODEL): string {
  return `${API_BASE}/${model}:streamGenerateContent?alt=sse`;
}

/* -------------------------------------------------------------------------- */
/* Response schema (Gemini's OpenAPI subset)                                   */
/* -------------------------------------------------------------------------- */

/**
 * `propertyOrdering` puts `summary` first on purpose: the JSON arrives as a
 * character stream, so generating `summary` first is what lets the UI type the
 * answer out live before the structured fields land.
 */
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    summary: {
      type: "STRING",
      description:
        "2-5 plain-language sentences answering the question, with inline [1], [2] citation markers placed immediately after the claim each supports.",
    },
    product: {
      type: "OBJECT",
      description: "The product the question is about, if identifiable.",
      properties: {
        name: { type: "STRING" },
        category: { type: "STRING" },
        attributes: { type: "ARRAY", items: { type: "STRING" } },
      },
      required: ["name", "category", "attributes"],
      propertyOrdering: ["name", "category", "attributes"],
    },
    standards: {
      type: "ARRAY",
      description:
        "Indian Standards that apply, taken only from the provided sources.",
      items: {
        type: "OBJECT",
        properties: {
          number: {
            type: "STRING",
            description: "The IS number exactly as it appears in the sources.",
          },
          title: { type: "STRING" },
          why: {
            type: "STRING",
            description:
              "One sentence on why it applies, ending with its citation marker.",
          },
          confidence: { type: "STRING", enum: ["high", "medium", "low"] },
        },
        required: ["number", "title", "why", "confidence"],
        propertyOrdering: ["number", "title", "why", "confidence"],
      },
    },
    certification: {
      type: "OBJECT",
      properties: {
        status: {
          type: "STRING",
          enum: ["mandatory", "voluntary", "check-required", "not-applicable"],
        },
        scheme: {
          type: "STRING",
          description: "The certification scheme name, if the sources name one.",
        },
        reason: {
          type: "STRING",
          description: "Why that status, grounded in the sources.",
        },
      },
      required: ["status", "reason"],
      propertyOrdering: ["status", "scheme", "reason"],
    },
    tests: {
      type: "ARRAY",
      description: "Tests the sources associate with this product.",
      items: { type: "STRING" },
    },
    clarifyingQuestion: {
      type: "STRING",
      description:
        "At most one question, only when a specific missing detail would change the answer. Omit otherwise.",
    },
    nextSteps: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          detail: { type: "STRING" },
        },
        required: ["title", "detail"],
        propertyOrdering: ["title", "detail"],
      },
    },
  },
  required: ["summary", "standards", "certification", "tests", "nextSteps"],
  propertyOrdering: [
    "summary",
    "product",
    "standards",
    "certification",
    "tests",
    "clarifyingQuestion",
    "nextSteps",
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Request body                                                                */
/* -------------------------------------------------------------------------- */

interface GeminiPart {
  text: string;
}
interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

interface GeminiRequestBody {
  contents: GeminiContent[];
  systemInstruction: { parts: GeminiPart[] };
  generationConfig: Record<string, unknown>;
}

function buildBody(
  question: string,
  context: string,
  history: ChatMessage[],
  withThinkingConfig: boolean = false,
  locale?: string,
): GeminiRequestBody {
  const generationConfig: Record<string, unknown> = {
    temperature: 0.3,
    maxOutputTokens: 4096,
    responseMimeType: "application/json",
    responseSchema: RESPONSE_SCHEMA,
  };

  if (withThinkingConfig) {
    generationConfig.thinkingConfig = { thinkingBudget: 0 };
  }

  return {
    contents: [
      {
        role: "user",
        parts: [{ text: buildUserPrompt(question, context, history, locale) }],
      },
    ],
    systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
    generationConfig,
  };
}

/* -------------------------------------------------------------------------- */
/* Errors                                                                      */
/* -------------------------------------------------------------------------- */

/** Pull a useful message out of Gemini's error envelope, if there is one. */
function extractApiMessage(body: string): string {
  try {
    const parsed: unknown = JSON.parse(body);
    if (parsed && typeof parsed === "object") {
      const err = (parsed as { error?: { message?: unknown } }).error;
      if (err && typeof err.message === "string" && err.message.trim()) {
        return err.message.trim();
      }
    }
  } catch {
    /* not JSON — fall through */
  }
  return body.slice(0, 300).trim();
}

/** Human-readable messages: these strings are shown to the user verbatim. */
function httpError(status: number, body: string): Error {
  const detail = extractApiMessage(body);

  if (status === 400) {
    return new Error(
      `Gemini rejected the request (400). This usually means the API key is malformed or the request is invalid. Check GEMINI_API_KEY in .env.local.${
        detail ? ` Details: ${detail}` : ""
      }`,
    );
  }
  if (status === 401 || status === 403) {
    return new Error(
      "The Gemini API key was rejected. Check GEMINI_API_KEY in .env.local — it may be invalid, revoked, or not authorised for the Generative Language API.",
    );
  }
  if (status === 404) {
    return new Error(
      `The model "${GEMINI_MODEL}" was not found for this API key. The key may not have access to Gemini 2.5 Flash.`,
    );
  }
  if (status === 429) {
    return new Error(
      "Gemini rate limit reached (429). The free-tier quota is exhausted or requests are coming in too fast — wait a moment and try again.",
    );
  }
  if (status >= 500) {
    return new Error(
      `Gemini is temporarily unavailable (${status}). This is on Google's side — please try again in a moment.`,
    );
  }
  return new Error(
    `Gemini returned an unexpected error (${status}).${
      detail ? ` ${detail}` : ""
    }`,
  );
}


/* -------------------------------------------------------------------------- */
/* Progressive "summary" extraction                                            */
/* -------------------------------------------------------------------------- */

/**
 * Tolerantly reads the value of the top-level `"summary"` string out of a
 * partial JSON buffer.
 *
 * Walks the raw characters after `"summary"`'s opening quote, honouring `\"`
 * escapes, and stops at the closing quote or at the end of the buffer. Returns
 * the decoded text so far, or `null` if the key has not arrived yet.
 */
export function extractPartialSummary(buffer: string): string | null {
  const keyIndex = buffer.indexOf('"summary"');
  if (keyIndex === -1) return null;

  // Find the ':' then the opening quote of the value.
  let i = keyIndex + '"summary"'.length;
  while (i < buffer.length && /\s/.test(buffer[i])) i++;
  if (i >= buffer.length) return null;
  if (buffer[i] !== ":") return null;
  i++;
  while (i < buffer.length && /\s/.test(buffer[i])) i++;
  if (i >= buffer.length) return null;
  if (buffer[i] !== '"') return null;
  i++;

  let out = "";
  while (i < buffer.length) {
    const ch = buffer[i];

    if (ch === "\\") {
      // An escape may be split across chunks — stop and wait for more.
      if (i + 1 >= buffer.length) break;
      const next = buffer[i + 1];
      if (next === "n") out += "\n";
      else if (next === "t") out += "\t";
      else if (next === "r") out += "\r";
      else if (next === '"') out += '"';
      else if (next === "\\") out += "\\";
      else if (next === "/") out += "/";
      else if (next === "b") out += "\b";
      else if (next === "f") out += "\f";
      else if (next === "u") {
        if (i + 5 >= buffer.length) break; // incomplete \uXXXX
        const hex = buffer.slice(i + 2, i + 6);
        if (!/^[0-9a-fA-F]{4}$/.test(hex)) break;
        out += String.fromCharCode(parseInt(hex, 16));
        i += 6;
        continue;
      } else {
        out += next;
      }
      i += 2;
      continue;
    }

    if (ch === '"') break; // closing quote — value complete
    out += ch;
    i++;
  }

  return out;
}

/* -------------------------------------------------------------------------- */
/* JSON repair + validation                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Last-ditch repair for a truncated response: trim the buffer back to the last
 * point where braces and brackets balance outside of strings, closing any open
 * containers.
 */
function repairJson(raw: string): string | null {
  const text = raw.trim();
  const stack: string[] = [];
  let inString = false;
  let escaped = false;
  let lastSafe = -1;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") stack.push("}");
    else if (ch === "[") stack.push("]");
    else if (ch === "}" || ch === "]") stack.pop();

    // A comma or a closing brace at depth >= 1 outside a string is a safe
    // truncation point: everything before it is a complete key/value.
    if ((ch === "," || ch === "}" || ch === "]") && !inString) {
      lastSafe = i;
    }
  }

  if (lastSafe === -1) return null;

  let candidate = text.slice(0, text[lastSafe] === "," ? lastSafe : lastSafe + 1);

  // Recompute what is still open after the trim and close it.
  const open: string[] = [];
  let s = false;
  let e = false;
  for (let i = 0; i < candidate.length; i++) {
    const ch = candidate[i];
    if (s) {
      if (e) e = false;
      else if (ch === "\\") e = true;
      else if (ch === '"') s = false;
      continue;
    }
    if (ch === '"') s = true;
    else if (ch === "{") open.push("}");
    else if (ch === "[") open.push("]");
    else if (ch === "}" || ch === "]") open.pop();
  }
  if (s) candidate += '"';
  while (open.length > 0) candidate += open.pop();

  return candidate;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const STATUSES = new Set([
  "mandatory",
  "voluntary",
  "check-required",
  "not-applicable",
]);
const CONFIDENCES = new Set(["high", "medium", "low"]);

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.length > 0);
}

/**
 * Normalise the parsed JSON into a `ModelAnswer`. Missing optional fields are
 * dropped, unknown enum values fall back to the safe option, and `sources` is
 * stripped if the model produced it anyway.
 */
function coerceAnswer(parsed: unknown): ModelAnswer {
  if (!isRecord(parsed)) {
    throw new Error("Gemini returned a response that was not a JSON object.");
  }

  const summary =
    typeof parsed.summary === "string" ? parsed.summary.trim() : "";
  if (!summary) {
    throw new Error("Gemini returned an answer with no summary text.");
  }

  const standards = Array.isArray(parsed.standards)
    ? parsed.standards.filter(isRecord).map((s) => {
        const confidence =
          typeof s.confidence === "string" && CONFIDENCES.has(s.confidence)
            ? (s.confidence as "high" | "medium" | "low")
            : "low";
        return {
          number: typeof s.number === "string" ? s.number : "",
          title: typeof s.title === "string" ? s.title : "",
          why: typeof s.why === "string" ? s.why : "",
          confidence,
        };
      })
    : [];

  const certRaw = isRecord(parsed.certification) ? parsed.certification : {};
  const status =
    typeof certRaw.status === "string" && STATUSES.has(certRaw.status)
      ? (certRaw.status as ModelAnswer["certification"]["status"])
      : "check-required";

  const certification: ModelAnswer["certification"] = {
    status,
    reason:
      typeof certRaw.reason === "string" && certRaw.reason.trim()
        ? certRaw.reason.trim()
        : "Applicability must be confirmed against the official BIS documents.",
  };
  if (typeof certRaw.scheme === "string" && certRaw.scheme.trim()) {
    certification.scheme = certRaw.scheme.trim();
  }

  const nextSteps = Array.isArray(parsed.nextSteps)
    ? parsed.nextSteps
        .filter(isRecord)
        .map((step) => ({
          title: typeof step.title === "string" ? step.title : "",
          detail: typeof step.detail === "string" ? step.detail : "",
        }))
        .filter((step) => step.title || step.detail)
    : [];

  const answer: ModelAnswer = {
    summary,
    standards,
    certification,
    tests: asStringArray(parsed.tests),
    nextSteps,
  };

  if (isRecord(parsed.product)) {
    const p = parsed.product;
    const name = typeof p.name === "string" ? p.name : "";
    const category = typeof p.category === "string" ? p.category : "";
    if (name || category) {
      answer.product = {
        name,
        category,
        attributes: asStringArray(p.attributes),
      };
    }
  }

  if (
    typeof parsed.clarifyingQuestion === "string" &&
    parsed.clarifyingQuestion.trim()
  ) {
    answer.clarifyingQuestion = parsed.clarifyingQuestion.trim();
  }

  return answer;
}

function parseFinal(buffer: string): ModelAnswer {
  const text = buffer.trim();
  if (!text) {
    throw new Error(
      "Gemini returned an empty response. Try again — if it keeps happening, the request may have been blocked by a safety filter.",
    );
  }

  try {
    return coerceAnswer(JSON.parse(text));
  } catch (first) {
    const repaired = repairJson(text);
    if (repaired) {
      try {
        return coerceAnswer(JSON.parse(repaired));
      } catch {
        /* fall through to the thrown error below */
      }
    }
    const why = first instanceof Error ? first.message : String(first);
    throw new Error(
      `Gemini's answer could not be read as JSON (it may have been cut off). ${why}`,
    );
  }
}

/* -------------------------------------------------------------------------- */
/* SSE parsing                                                                 */
/* -------------------------------------------------------------------------- */

interface GeminiStreamPayload {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string; code?: number };
}

/** Pull the text out of one SSE `data:` payload. */
function textFromPayload(payload: GeminiStreamPayload): string {
  const parts = payload.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  let out = "";
  for (const part of parts) {
    if (typeof part?.text === "string") out += part.text;
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                  */
/* -------------------------------------------------------------------------- */

async function postToGemini(
  key: string,
  body: GeminiRequestBody,
  model: string = GEMINI_MODEL,
  signal?: AbortSignal,
): Promise<Response> {
  return fetch(endpoint(model), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify(body),
    signal,
    cache: "no-store",
  });
}

/**
 * Streams a grounded answer from Gemini.
 *
 * Yields `{kind:"delta"}` with the newly generated characters of `summary` as
 * they arrive (so the UI can type it out live), then exactly one
 * `{kind:"done"}` with the fully parsed answer.
 */
export async function* streamAnswer(
  question: string,
  context: string,
  history: ChatMessage[],
  signal?: AbortSignal,
  locale?: string,
): AsyncGenerator<StreamChunk> {
  const key = getGeminiKey();
  if (!key) {
    throw new Error(
      "No Gemini API key is configured. Add GEMINI_API_KEY to .env.local to enable AI answers.",
    );
  }

  let response: Response | null = null;
  let lastError: Error | null = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const res = await postToGemini(
        key,
        buildBody(question, context, history, false, locale),
        model,
        signal,
      );

      if (!res.ok) {
        const errorBody = await res.text().catch(() => "");
        if (res.status === 404 || res.status === 503) {
          lastError = httpError(res.status, errorBody);
          continue;
        }
        throw httpError(res.status, errorBody);
      }

      response = res;
      break;
    } catch (err) {
      if (signal?.aborted) throw err;
      lastError = err instanceof Error ? err : new Error(String(err));
      if (lastError.message.includes("401") || lastError.message.includes("403")) {
        throw lastError;
      }
    }
  }

  if (!response || !response.ok) {
    throw lastError ?? new Error("Gemini service could not be reached.");
  }

  if (!response.body) {
    throw new Error("Gemini returned a response with no body to stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let sseBuffer = ""; // raw SSE text not yet split into events
  let jsonBuffer = ""; // accumulated model JSON
  let emitted = 0; // characters of `summary` already yielded
  const state: { blockReason: string | null } = { blockReason: null };

  /** Handle one `data:` payload; returns the delta text to yield, if any. */
  const consume = (raw: string): string | null => {
    const data = raw.trim();
    if (!data || data === "[DONE]") return null;

    let payload: GeminiStreamPayload;
    try {
      payload = JSON.parse(data) as GeminiStreamPayload;
    } catch {
      return null; // ignore keep-alives / malformed frames
    }

    if (payload.error?.message) {
      throw new Error(`Gemini reported an error: ${payload.error.message}`);
    }
    if (payload.promptFeedback?.blockReason) {
      state.blockReason = payload.promptFeedback.blockReason;
    }

    jsonBuffer += textFromPayload(payload);

    const summary = extractPartialSummary(jsonBuffer);
    if (summary === null || summary.length <= emitted) return null;

    const delta = summary.slice(emitted);
    emitted = summary.length;
    return delta;
  };

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      sseBuffer += decoder.decode(value, { stream: true });

      // SSE events are separated by a blank line; each may carry several
      // `data:` lines that concatenate.
      let sep = sseBuffer.search(/\r?\n\r?\n/);
      while (sep !== -1) {
        const rawEvent = sseBuffer.slice(0, sep);
        sseBuffer = sseBuffer.slice(sep + (sseBuffer[sep] === "\r" ? 4 : 2));

        const dataLines = rawEvent
          .split(/\r?\n/)
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5));

        if (dataLines.length > 0) {
          const delta = consume(dataLines.join("\n"));
          if (delta) yield { kind: "delta", text: delta };
        }

        sep = sseBuffer.search(/\r?\n\r?\n/);
      }
    }

    // Flush any trailing event that was not terminated by a blank line.
    const tail = sseBuffer + decoder.decode();
    const tailData = tail
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5));
    if (tailData.length > 0) {
      const delta = consume(tailData.join("\n"));
      if (delta) yield { kind: "delta", text: delta };
    }
  } finally {
    reader.cancel().catch(() => {});
  }

  if (!jsonBuffer.trim() && state.blockReason) {
    throw new Error(
      `Gemini blocked this request (${state.blockReason}). Try rephrasing the question.`,
    );
  }

  const answer = parseFinal(jsonBuffer);

  // The full summary may end with characters the progressive scanner never
  // saw (e.g. the tail arrived in the same frame as the closing brace).
  if (answer.summary.length > emitted) {
    yield { kind: "delta", text: answer.summary.slice(emitted) };
  }

  yield { kind: "done", answer };
}

/**
 * Non-streaming convenience wrapper — collects the generator and returns the
 * final answer. Handy for tests and scripts.
 */
export async function generateAnswer(
  question: string,
  context: string,
  history: ChatMessage[] = [],
  signal?: AbortSignal,
): Promise<ModelAnswer> {
  for await (const chunk of streamAnswer(question, context, history, signal)) {
    if (chunk.kind === "done") return chunk.answer;
  }
  throw new Error("Gemini stream ended before a complete answer was produced.");
}
