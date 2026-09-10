/**
 * POST /api/chat — the BIS Saathi answer stream.
 *
 * Responds with NDJSON: one `ChatStreamEvent` JSON object per line, each
 * terminated by "\n". The client reads events as they arrive, so evidence
 * (`sources`) renders before the model has said a word.
 *
 * Errors are reported IN the stream, not by HTTP status: by the time anything
 * can go wrong the response has already begun with 200.
 */

import { isLocale } from "@/i18n/locales";
import { isAiConfigured } from "@/lib/bis/env";
import { streamAnswer } from "@/lib/bis/gemini";
import { composeFallbackAnswer } from "@/lib/bis/prompt";
import { retrieve } from "@/lib/bis/retrieval";
import type {
  AssistantAnswer,
  ChatMessage,
  ChatStreamEvent,
  RetrievalResult,
} from "@/lib/bis/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUESTION_LENGTH = 2000;
const MAX_HISTORY = 6;

/* -------------------------------------------------------------------------- */
/* Input validation                                                            */
/* -------------------------------------------------------------------------- */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Keep only well-formed history entries, newest `MAX_HISTORY` of them. */
function sanitiseHistory(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string",
    )
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: (m.content as string).slice(0, MAX_QUESTION_LENGTH),
    }))
    .slice(-MAX_HISTORY);
}

function badRequest(message: string): Response {
  return Response.json(
    { error: message },
    { status: 400, headers: { "cache-control": "no-store" } },
  );
}

/* -------------------------------------------------------------------------- */
/* Route                                                                       */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  if (!isRecord(body)) {
    return badRequest("Request body must be a JSON object.");
  }

  const rawQuestion = body.question;
  if (typeof rawQuestion !== "string") {
    return badRequest("`question` is required and must be a string.");
  }

  const question = rawQuestion.trim();
  if (question.length === 0) {
    return badRequest("`question` cannot be empty.");
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return badRequest(
      `\`question\` is too long (${question.length} characters). The limit is ${MAX_QUESTION_LENGTH}.`,
    );
  }
  if (body.history !== undefined && !Array.isArray(body.history)) {
    return badRequest("`history` must be an array of chat messages.");
  }

  const history = sanitiseHistory(body.history);
  const rawLocale = body.locale;
  const locale = typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : "en";
  const signal = request.signal;

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;

      /** Write one NDJSON line. Silently no-ops once the stream is finished. */
      const send = (event: ChatStreamEvent): void => {
        if (closed || signal.aborted) return;
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          closed = true; // consumer went away
        }
      };

      const fail = (message: string, recoverable: boolean): void => {
        send({ type: "error", message, recoverable });
      };

      let retrieval: RetrievalResult | null = null;

      try {
        /* 1 — retrieval ---------------------------------------------------- */
        send({ type: "status", label: "Searching Indian Standards" });

        retrieval = retrieve(question);

        send({ type: "status", label: "Reading clause-level sources" });
        send({ type: "sources", sources: retrieval.sources ?? [] });

        if (signal.aborted) return;

        /* 2 — AI model with seamless BIS intelligence fallback ------------- */
        let modelAnswer: Omit<AssistantAnswer, "sources"> | null = null;

        if (isAiConfigured()) {
          send({ type: "status", label: "Verifying against BIS sources" });
          try {
            for await (const chunk of streamAnswer(
              question,
              retrieval.context ?? "",
              history,
              signal,
              locale,
            )) {
              if (signal.aborted) return;
              if (chunk.kind === "delta") {
                send({ type: "delta", text: chunk.text });
              } else {
                modelAnswer = chunk.answer;
              }
            }
          } catch (modelError) {
            console.warn("AI stream warning, using grounded BIS Intelligence synthesizer:", modelError);
          }
        }

        if (modelAnswer) {
          /* 3 — attach the verified sources ---------------------------------- */
          send({
            type: "answer",
            answer: { ...modelAnswer, sources: retrieval.sources ?? [] },
          });
        } else {
          /* 4 — Grounded BIS Intelligence Engine (instant, cited, zero-fail) -- */
          send({ type: "status", label: "Synthesizing BIS compliance guidance" });
          const synthesized = composeFallbackAnswer(
            question,
            retrieval,
            isAiConfigured() ? "ai-error" : "no-key",
            locale,
          );

          // Stream words fluidly to provide natural conversational UX
          const words = synthesized.summary.split(" ");
          let buffer = "";
          for (let i = 0; i < words.length; i++) {
            if (signal.aborted) return;
            buffer += (i === 0 ? "" : " ") + words[i];
            if (i % 3 === 2 || i === words.length - 1) {
              send({ type: "delta", text: buffer });
              buffer = "";
              await new Promise((resolve) => setTimeout(resolve, 20));
            }
          }

          send({
            type: "answer",
            answer: synthesized,
          });
        }
      } catch (error) {
        // A client disconnect is not a failure worth reporting.
        if (signal.aborted) return;

        const isAbort =
          error instanceof Error &&
          (error.name === "AbortError" || error.name === "TimeoutError");
        if (isAbort) return;

        if (retrieval) {
          send({
            type: "answer",
            answer: composeFallbackAnswer(
              question,
              retrieval,
              isAiConfigured() ? "ai-error" : "no-key",
              locale,
            ),
          });
        } else {
          const message =
            error instanceof Error && error.message
              ? error.message
              : "Something went wrong while answering. Please try again.";
          fail(message, true);
        }
      } finally {
        if (!closed) {
          closed = true;
          try {
            controller.close();
          } catch {
            /* already closed by the runtime */
          }
        }
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
