/**
 * GET /api/health — setup sanity check.
 *
 * The UI uses `aiConfigured` to show the "AI connected" badge; the presenter
 * uses the whole payload to confirm the demo is wired up before going on
 * stage. It must never 500, so every lookup is defensive.
 */

import { GEMINI_MODEL, isAiConfigured } from "@/lib/bis/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CorpusCounts {
  standards: number;
  qcos: number;
  labs: number;
}

function countOf(value: unknown): number {
  if (Array.isArray(value)) return value.length;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Read corpus sizes from the data barrel. The data module is owned by another
 * part of the app and may not export every collection yet, so this is a
 * dynamic import behind a try/catch and reads properties loosely.
 */
async function readCorpus(): Promise<CorpusCounts> {
  const empty: CorpusCounts = { standards: 0, qcos: 0, labs: 0 };
  try {
    const data: Record<string, unknown> = await import("@/lib/bis/data");
    const counts = isRecord(data.corpusCounts) ? data.corpusCounts : {};
    return {
      standards: countOf(counts.standards ?? data.standards),
      qcos: countOf(counts.qcos ?? data.qcos),
      labs: countOf(counts.labs ?? data.labs),
    };
  } catch {
    return empty;
  }
}

export async function GET(): Promise<Response> {
  let corpus: CorpusCounts = { standards: 0, qcos: 0, labs: 0 };
  try {
    corpus = await readCorpus();
  } catch {
    /* keep the zeroed counts — health must never fail */
  }

  let aiConfigured = false;
  try {
    aiConfigured = isAiConfigured();
  } catch {
    /* treat an unreadable env as "not configured" */
  }

  return Response.json(
    {
      ok: true,
      aiConfigured,
      model: GEMINI_MODEL,
      corpus,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
