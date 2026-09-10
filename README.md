# BIS Saathi

**Understand Standards. Simplify Compliance.**

A conversational, evidence-first assistant for the Bureau of Indian Standards ecosystem — Indian Standards (IS), BIS certification, Quality Control Orders (QCOs), recognised testing laboratories, and gold hallmarking.

> Built for hackathon problem statement **SH26107 — BIS-Sathi**.

---

## Quick start

```bash
pnpm install
cp .env.example .env.local
```

Then open `.env.local` and paste your Gemini API key:

```
GEMINI_API_KEY=AIza...your-key-here
```

Get a free key at **https://aistudio.google.com/apikey** (Google AI Studio → *Create API key*).

```bash
pnpm dev
```

Open **http://localhost:3000** — it redirects to `/en` (or `/hi`, `/ta`, `/te`, `/kn` for Hindi, Tamil, Telugu, and Kannada).

### Where the API key goes — the short version

| | |
|---|---|
| **File** | `.env.local` in the project root (create it from `.env.example`) |
| **Variable** | `GEMINI_API_KEY` |
| **Model** | `gemini-2.5-flash` |
| **Read by** | `lib/bis/env.ts` → used server-side only in `app/api/chat/route.ts` |
| **Committed?** | No. `.env*` is gitignored; only `.env.example` is tracked. |

The key is **never** exposed to the browser — it has no `NEXT_PUBLIC_` prefix and is only read inside a server route handler.

**Restart `pnpm dev` after adding the key.** Next.js reads env files at boot.

Verify it is picked up:

```bash
curl -s http://localhost:3000/api/health
```

`{"ok":true,"aiConfigured":true,"model":"gemini-2.5-flash",...}` means you are ready to demo.

> If `aiConfigured` is `false`, the app still runs. It falls back to showing retrieved
> sources without AI-generated guidance, so a missing key never produces a blank screen
> mid-demo — but you lose the headline feature.

---

## What it does

- **AI compliance assistant** — ask in plain English, Hindi, Tamil, Telugu, or Kannada ("I manufacture stainless steel water bottles, do I need BIS certification?"). Answers stream in with a direct verdict, the applicable standard, certification status, required tests, and next steps.
- **Clause-level citations** — every material claim carries an inline `[1]` marker that opens the exact clause, page, and passage it came from. Click through to a document viewer with the cited passage highlighted.
- **Standards Explorer** — search and filter the corpus by sector and status, with scope, clauses, tests, linked QCO, and revision relationships.
- **Certification guide** — step-by-step process, document checklist, fees, and timelines per scheme (ISI Mark, CRS, FMCS, Hallmarking, ECO Mark, MSCS).
- **Laboratory finder** — search recognised labs by location and test scope, and compare up to three side by side.
- **Hallmarking** — a consumer-facing HUID check (demonstration) plus an assaying-centre finder.
- **Reports** — generate and download a compliance summary for a product.
- **Multilingual** — English, Hindi, Tamil, Telugu, and Kannada, on locale-prefixed routes (`/en`, `/hi`, `/ta`, `/te`, `/kn`).

---

## How it works

```
Question
   ↓
lib/bis/retrieval.ts        keyword + intent retrieval over the local corpus
   ↓                         → ranked sources, numbered [1]..[4]
   ↓                         → compact context block
app/api/chat/route.ts       NDJSON stream: status → sources → deltas → answer
   ↓
lib/bis/gemini.ts           gemini-2.5-flash, structured JSON output
   ↓                         (the model may only cite the sources it was given)
components/assistant/       live streaming UI + evidence panel + document viewer
```

**Retrieval happens before the model runs.** Sources appear in the evidence panel
within milliseconds, and the model is constrained to the numbered sources it was
handed — so citations always resolve to a real record and the model cannot invent
an IS number. This is a deliberately simple, fully local RAG: no vector database,
no network dependency beyond Gemini itself.

### Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 + CSS custom properties · next-intl · Gemini 2.5 Flash

---

## Demo script (about 3 minutes)

1. **Landing** — read the promise, then click the first example question.
2. **Ask** *"I manufacture stainless steel water bottles. Which Indian Standard applies and do I need BIS certification?"*
   Watch the retrieval steps resolve, sources land in the right panel, then the answer type out.
3. **Click a `[1]` citation** in the answer → the evidence panel jumps to that source → **View highlighted passage** → the document viewer opens on the exact clause.
4. **Point at the calibrated verdict** — it says *applicability check required*, not a false certainty, and it asks the one question that would change the answer.
5. **Follow up:** *"It is vacuum-insulated, 750 ml, for domestic use."* — the answer sharpens using conversation context.
6. **Standards Explorer** — search `helmet`, filter by sector, open a standard, show clauses and the linked QCO.
7. **Labs** — search `Pune`, select two labs, compare turnaround.
8. **Language switch to हिन्दी, தமிழ், తెలుగు, or ಕನ್ನಡ** — the interface localises.

---

## Scope and honesty

This is a hackathon prototype, and it is explicit about that in the interface.

- **Regulatory data is an illustrative demo corpus** held in `lib/bis/data/`. IS numbers and sectors are realistic, but values are **not** an authoritative source. Every answer surface says so.
- **Authentication is intentionally disabled.** The Supabase scaffolding is present and null-guarded, so the app runs with no Supabase project configured. Sign-in is out of scope for this build.
- **Hallmark verification is a demonstration**, not a query against the real BIS HUID registry.
- Real deployment would swap `lib/bis/data/` and `lib/bis/retrieval.ts` for the official BIS document corpus behind a proper vector index. Nothing above that layer would need to change — the `RetrievalResult` contract in `lib/bis/types.ts` is the seam.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Answers show sources but no AI guidance | `GEMINI_API_KEY` missing or empty in `.env.local`; restart the dev server |
| "The Gemini API key was rejected" | Key is wrong or the Generative Language API is not enabled on that project |
| "Rate limit" / 429 | Free-tier quota exhausted — wait, or use another key |
| Port 3000 in use | `pnpm dev` picks the next free port; check the terminal output |
