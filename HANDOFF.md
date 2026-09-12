# BIS Saathi — Build Tracker & Handoff

> **Purpose:** if a session ends mid-build, start the next one by reading this file.
> Everything needed to resume is here. Last updated: 2026-09-10.
>
> **Resume prompt to paste into a new session:**
> *"Read HANDOFF.md and continue from the first unchecked item in 'Remaining work'."*

---

## 0. Context in one paragraph

Hackathon demo (problem statement **SH26107 — BIS-Sathi**) for the Bureau of Indian
Standards ecosystem. Next.js 16 App Router + React 19 + TypeScript + Tailwind v4.
There was already a **complete, good-looking static UI** (`app/bis-intelligence.tsx`,
~1100 lines, every screen hardcoded). This build is about giving it a **real brain**:
Gemini 2.5 Flash answers grounded in a local demo corpus, with clause-level citations.
**Not production.** Auth is deliberately skipped. Demo data is fine and is labelled as
illustrative in the UI.

---

## 1. Non-negotiable decisions already made

Do not re-litigate these in a later session — they are settled.

| Decision | Why |
|---|---|
| Model is `gemini-2.5-flash` | User specified it |
| API key lives in `.env.local` as `GEMINI_API_KEY` | Server-only, gitignored |
| **No npm dependency for Gemini** — direct `fetch` to the REST API | Zero install/version risk on demo day |
| Node runtime, not edge | Full Node APIs; streaming works fine on Node |
| Retrieval runs **before** the model, model may only cite sources it was handed | Citations always resolve; model cannot invent an IS number |
| Transport is **NDJSON** (one JSON object per line), not SSE | Simpler client, typed via `ChatStreamEvent` |
| **Graceful degradation**: missing/failed key still shows retrieved sources | A dead key must never blank the screen mid-demo |
| Auth stays off; Supabase is null-guarded and unconfigured | Out of scope, already safe |
| Brand name is **"BIS Saathi"** (double-a) | Matches `components/brand.tsx` + PRODUCT.md |

---

## 2. The contract — read this before touching anything

**`lib/bis/types.ts`** is the seam every layer speaks. **Do not modify it casually** —
four separate areas depend on it. Key types:

- `Standard`, `Clause`, `QualityControlOrder`, `Laboratory`, `CertificationScheme`, `HallmarkingCentre` — corpus records
- `EvidenceSource` — one inspectable citation (number, type, title, location, excerpt, page, docId)
- `RetrievalResult` — `{ sources, standards, qcos, labs, schemes, centres, context }`
- `AssistantAnswer` — `{ summary, product?, standards[], certification, tests[], clarifyingQuestion?, nextSteps[], sources[] }`
- `ChatStreamEvent` — `status | sources | delta | answer | error`

**Architecture:**

```
Question
   ↓  lib/bis/retrieval.ts      keyword + intent ranking over the local corpus
   ↓                             → sources numbered [1]..[4], + compact context block
   ↓  app/api/chat/route.ts     NDJSON: status → sources → delta* → answer
   ↓  lib/bis/gemini.ts         gemini-2.5-flash, structured JSON output
   ↓  components/assistant/     streaming UI, citations, evidence panel
```

Swapping the demo corpus for real BIS documents later means replacing only
`lib/bis/data/` + `lib/bis/retrieval.ts`. Nothing above that seam changes.

---

## 3. File ownership (this build was split across parallel agents)

| Area | Files | Status |
|---|---|---|
| **Contract** | `lib/bis/types.ts` | ✅ done |
| **Data + retrieval** | `lib/bis/data/*.ts`, `lib/bis/retrieval.ts` | 🔴 **BLOCKING** — see §4 |
| **AI + API** | `lib/bis/env.ts`, `prompt.ts`, `gemini.ts`, `app/api/chat/route.ts`, `app/api/health/route.ts` | ✅ written, blocked on data |
| **Assistant UI** | `components/assistant/*`, `app/styles/assistant.css` | ✅ done |
| **Workflow views** | `components/views/*`, `app/styles/views.css` | ✅ written, blocked on data |
| **Integration + docs** | `app/bis-intelligence.tsx`, `app/globals.css`, `README.md`, `.env*`, `i18n/dictionaries/*` | ✅ done |

---

## 4. Status

### ✅ Done

- [x] `lib/bis/types.ts` — the shared contract (152 lines)
- [x] `.env.example` rewritten with the Gemini key + instructions
- [x] `.env.local` created (user must paste their key in)
- [x] Confirmed `.env*` is gitignored, `.env.example` tracked
- [x] Confirmed Supabase is null-guarded → app runs with auth unconfigured, no crash
- [x] `README.md` — setup, where the key goes, architecture, 3-min demo script, troubleshooting
- [x] Demo prompts sharpened in `i18n/dictionaries/en.json` + `hi.json`, `ta.json`, `te.json`, `kn.json` (`promptOne..promptFour`)
- [x] Baseline `npx tsc --noEmit` passes clean
- [x] Dev server confirmed running and serving `/en` → 200

### 🟡 In flight

- [ ] `lib/bis/data/` — **standards.ts (2746 lines), qcos.ts, labs.ts written; schemes.ts, hallmarking.ts, index.ts still missing**
- [ ] `lib/bis/retrieval.ts` — **still missing. This is the critical path: 44 typecheck errors are all downstream of it and `data/index.ts`.**

### ✅ Also done since first draft

- [x] `components/assistant/` — complete and verified by its agent (lint + typecheck clean)
- [x] `components/views/` — all 6 views + barrel written
- [x] `app/api/chat/route.ts` + `app/api/health/route.ts` written
- [x] `lib/bis/gemini.ts` + `prompt.ts` + `env.ts` written
- [x] `app/styles/assistant.css` + `views.css` imported into `app/globals.css`
- [x] **Integration into `app/bis-intelligence.tsx` is DONE** — 1124 → 612 lines:
      deleted the hardcoded `sources` array, `Citation`, `RetrievalState`, `AnswerCard`,
      `AssistantView`, `EvidencePanel`, `DocumentViewer`, `StandardsView`,
      `CertificationView`, `LabsView`, `HallmarkingView`, `ReportsView` and the fake
      1750ms loading timer; wired `useChat()` → `<ChatThread>` + live `<EvidencePanel>`;
      `GenericContent` now routes to the real views; floating-sources count is real;
      document viewer opens by `sourceId` or `standardId`+`clauseId`; 17 orphaned icon
      imports pruned. **This file typechecks clean.**

### 🔴 Remaining work — resume here, in this order

1. **Write `lib/bis/data/schemes.ts`, `hallmarking.ts`, `index.ts` and `lib/bis/retrieval.ts`**
   to the spec in §6. Nothing else is blocked on anything else — these two missing modules
   are the only reason the build is red.
2. **Fix the fallout**: after they land, most of the remaining `TS7006 implicitly any`
   errors in `components/views/*` will resolve themselves (they are inference failures
   caused by the missing module). Re-run `npx tsc --noEmit` and fix whatever survives.
3. **Verify end to end** (see §5).
4. **Optional polish if time allows** — see §7.

## 5. How to verify

```bash
pnpm dev                                  # already running on :3000 during the build
curl -s http://localhost:3000/api/health  # expect {"ok":true,"aiConfigured":true,...}
npx tsc --noEmit                          # must be clean
pnpm build                                # do this once before presenting
```

Then in the browser at `http://localhost:3000/en`:

- [ ] Landing loads, example chips are clickable
- [ ] Asking a question streams: retrieval steps → sources appear → answer types out
- [ ] `[1]` citations in the answer are clickable and select the right source
- [ ] "View highlighted passage" opens the document viewer on the correct clause
- [ ] Follow-up question uses conversation history
- [ ] Standards Explorer search + sector/status filters actually filter
- [ ] Labs finder search + compare works
- [ ] Certification stepper + document checklist works
- [ ] Hallmarking HUID check returns a clearly-labelled demo result
- [ ] Report generation downloads a file
- [ ] Language switch to `/hi`, `/ta`, `/te`, `/kn` works
- [ ] Mobile viewport (< 720px) — evidence becomes a bottom sheet, bottom nav works
- [ ] **Kill the API key and re-ask** — must still show sources, not a blank screen

---

## 6. Spec summary per area (if an agent's work is missing)

**`lib/bis/data/`** — export `standards` (~35, each with number/year/title/sector/scope/
keywords/status/tests/3-5 `clauses` with number+title+text+page/relatedIds/qcoId/schemeId),
`qcos` (12), `labs` (18 across Indian states), `schemes` (6: Scheme-I ISI Mark, CRS,
Hallmarking, FMCS, ECO Mark, MSCS), `hallmarkingCentres` (10). Plus lookups
`getStandardByNumber`, `getStandardById`, `getQcoById`, `getSchemeById`, `sectors`, `labStates`.

**`lib/bis/retrieval.ts`** — exact signatures other files import:
```ts
export function retrieve(query: string, options?: { limit?: number }): RetrievalResult
export function retrieveById(sourceId: string): EvidenceSource | undefined
export function searchStandards(query: string, filters?: { sector?: string; status?: string }): Standard[]
```
Tokenise + stopword-strip, detect explicit `IS 17803` patterns and hard-boost, score
keyword/title/scope/sector/clause matches, bias on intent words (lab/test → labs;
hallmark/gold → centres; licence/fee/apply → schemes). Pull in the QCO/scheme linked to a
top standard even if it didn't match directly. Build max-4 `sources` (best-matching clause
per standard) and a `context` string under ~3500 chars **numbered in the same 1-based order
as `sources`** — this is what makes `[1]` markers resolve. Never throw.

**`app/api/chat/route.ts`** — POST `{question, history?}`, `runtime = "nodejs"`,
`dynamic = "force-dynamic"`. Emits NDJSON in order: `status` → run retrieval → `status` +
`sources` → `status` → `delta`* → `answer` (model output + real `sources` attached).
Always HTTP 200; errors arrive as a final `error` event. If `isAiConfigured()` is false,
skip the model and emit a locally-composed fallback answer from the top retrieved standard.

**`lib/bis/gemini.ts`** — `POST https://generativelanguage.googleapis.com/v1beta/models/
gemini-2.5-flash:streamGenerateContent?alt=sse`, header `x-goog-api-key`.
`responseMimeType: "application/json"` + `responseSchema` for `AssistantAnswer` **minus
`sources`** (server attaches those). `propertyOrdering` puts `summary` first so it can be
streamed. `temperature: 0.3`, `thinkingConfig: { thinkingBudget: 0 }` for speed.
Tolerant incremental extraction of the `summary` string → `delta` events.

**`components/assistant/`** — `useChat()` hook (NDJSON reader; handle partial trailing
lines across chunks), `ChatThread`, `AnswerCard` (splits summary on `/\[(\d+)\]/g` into
citation buttons), `EvidencePanel`, `RetrievalState`. All reuse existing class names from
`app/globals.css` — read it, don't invent new styling.

**`components/views/`** — `StandardsExplorer`, `LabsFinder` (with 3-way compare),
`CertificationGuide` (stepper + tickable doc checklist), `HallmarkingView` (demo HUID
check + centre finder), `DocumentViewer` (real clause, highlighted, focus-trapped),
`ReportsView` (Blob download).

---

## 7. Optional polish (only if time allows)

- [ ] "AI connected" badge in the topbar driven by `/api/health`
- [ ] Persist chat history to `localStorage` so a refresh mid-demo doesn't lose the thread
- [ ] Wire the Products / History / Dashboard views to the corpus (currently still static)
- [ ] Multilingual answers — pass the active locale into the prompt so the model replies in Hindi on `/hi`, Tamil on `/ta`, Telugu on `/te`, and Kannada on `/kn`
- [ ] Deploy to Vercel (`vercel env add GEMINI_API_KEY`, then `vercel deploy --prod`)
- [ ] Reconcile "Sathi" vs "Saathi" if the submission requires the problem-statement spelling

---

## 8. Known gotchas

- **This is Next.js 16** — conventions differ from older versions. `middleware.ts` is
  `proxy.ts` here. Bundled docs live in `node_modules/next/dist/docs/` — read them before
  writing routing/API code (see `AGENTS.md`).
- `AGENTS.md` is regenerated by `next dev`; committing it with your work keeps the tree clean.
- A dev server may already be running on :3000 from a previous session — check before starting
  another, `pnpm dev` will otherwise pick :3001 and then refuse.
- The `.impeccable/` directory and `DESIGN.md` / `PRODUCT.md` are managed by a design tooling
  hook and may change on their own. Don't fight it.
- Restart the dev server after editing `.env.local`.
