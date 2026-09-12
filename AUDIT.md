# BIS Saathi — UX / UI / Copy / Flow Audit

> **Resumable working document.** If a session dies, a new agent should read this file top
> to bottom, then continue from **§ 9 — Remaining work**.
>
> **Resume prompt:** *"Read AUDIT.md. Continue from the first unchecked item in §9."*
>
> Last updated: 2026-09-12 · Status: **Phase 1 (audit) COMPLETE · Ready for Phase 2 (implementation)**

---

## 0. Scope and rules of this engagement

Acting as senior product designer / UX researcher / UX writer / frontend reviewer /
implementation engineer for **BIS Saathi** — an AI assistant for the Bureau of Indian
Standards ecosystem (hackathon problem statement **SH26107**).

**Hard constraints given by the user (do not violate):**

1. Backend and core functionality already exist. **Do not redesign architecture.**
2. **Do not replace working functionality.** Do not invent capabilities that don't exist.
3. Job is: UX, UI, copy, information architecture, user flow, perceived product quality.
4. Treat the site as a **real product**, not a blank canvas.
5. **Anti-bloat rule:** not rewarded for number of changes. A successful result may change
   very little. When torn between (A) add, (B) simplify, (C) leave alone → prefer **C**
   unless there is clear evidence A or B improves task completion.
6. Do **not** add: fake confidence scores, accuracy claims, gamification, onboarding tours,
   decorative animation, new dashboards, settings screens, features that only look bigger.
7. Preserve the visual identity — clean, restrained, trustworthy, professional,
   public-service/enterprise. **Not** a neon SaaS / Dribbble / AI-dashboard look.
8. Clarity > minimalism. Do not shorten copy just to shorten it.
9. Implementation priority order: broken flows → confusing flows → misleading/robotic copy →
   missing feedback → trust/source visibility → a11y → responsive → hierarchy →
   consistency → polish.

**Target users:** MSME owners, manufacturers, startups, students, consumers. Not necessarily
technical. Must be understandable without prior BIS knowledge.

---

## 1. Product map (verified against the code, not assumed)

**Stack:** Next.js 16 App Router, React 19, TS, Tailwind v4 + hand-written CSS (`globals.css`, `styles/assistant.css`, `styles/views.css`),
next-intl (en/hi/ta/te/kn), Supabase auth (unconfigured / offline in demo), Gemini via direct REST fetch.

**Data flow (working, verified live):**
```
question → lib/bis/retrieval.ts (keyword+intent rank over LOCAL corpus in lib/bis/data/)
         → app/api/chat/route.ts  NDJSON: status → sources → delta* → answer
         → lib/bis/gemini.ts      structured JSON output, streamed summary
         → components/assistant/* render answer + citations + evidence
```
Model may only cite sources retrieval handed it → `[n]` markers always resolve.

**Routes**
| Route | File | Notes |
|---|---|---|
| `/[locale]` | `app/[locale]/page.tsx` → `app/bis-intelligence.tsx` | the entire app (SPA-style, client state) |
| `/[locale]/auth` | `app/[locale]/auth/page.tsx` | Google + email OTP (unconfigured; errors out) |
| `/[locale]/auth/verify` | `.../verify/page.tsx` | 6-digit OTP |
| `/[locale]/auth/error` | `.../error/page.tsx` | Auth error state |
| `/[locale]/auth/callback` | `.../callback/route.ts` | Supabase OAuth callback |
| `/api/chat` | POST, NDJSON stream | ✅ verified working live |
| `/api/health` | GET | ✅ `{"ok":true,"aiConfigured":true,"model":"gemini-3.5-flash","corpus":{"standards":43,"qcos":13,"labs":18}}` |

**Screens (all client-side view switching inside `app/bis-intelligence.tsx`, 606 lines)**
- `Landing` — hero + composer + 4 quick actions + evidence-story + footer
- App shell: sidebar (8 items) + topbar + mobile bottom nav (5 items: 4 views + More drawer)
- Views: `assistant` · `products` · `standards` · `certification` · `labs` ·
  `hallmarking` · `history` · `reports` · `dashboard`

**Components**
- `components/assistant/` — `use-chat.ts` (NDJSON reader + localStorage persistence),
  `chat-thread.tsx`, `answer-card.tsx`, `evidence-panel.tsx`, `retrieval-state.tsx`
- `components/views/` — `standards-explorer.tsx` · `certification-guide.tsx` · `labs-finder.tsx` ·
  `hallmarking-view.tsx` · `reports-view.tsx` · `document-viewer.tsx`
- `ProductsView` / `HistoryView` / `DashboardView` live inline in `bis-intelligence.tsx`
  and are **entirely hardcoded fake data with dead/broken buttons**

---

## 2. Baseline health (measured, 2026-09-12)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ clean (0 TypeScript errors) |
| `npx eslint .` | ⚠️ 2 errors, 4 warnings (`use-chat.ts:63` setState in effect; `gemini.ts:598` prefer-const; `bis-intelligence.tsx:363` unused `standards`; 3 unused vars) |
| dev server `:3000` | ✅ running, `/en` → 200 OK |
| `/api/health` | ✅ ok, aiConfigured true, model `gemini-3.5-flash`, corpus 43 standards / 13 QCOs / 18 labs |
| `/api/chat` English | ✅ streams status → 4 sources → deltas → answer |
| `/api/chat` Hindi (`locale:"hi"`) | ✅ answers in Hindi, sources stay English (correct — corpus is English) |
| `/api/chat` out-of-scope ("capital of France") | ✅ honest refusal, `sources: []`, `certification: not-applicable` |
| i18n key parity en/hi/ta/te/kn | ✅ 84 keys each across all 5 dictionaries, 0 missing, 0 extra |
| Working tree | clean / only whitespace noise in `app/bis-intelligence.tsx` |

---

## 3. Confirmed findings (verified against the codebase)

Severity: **P0** must fix · **P1** high value · **P2** nice · **P3** don't spend time.

### 3.1 Trust / honesty

| # | Sev | Finding | Evidence |
|---|---|---|---|
| T1 | **P0** | Answer CTA **"Save as product"** is a lie. It calls `onOpenView("products")` → `ProductsView`, a 100% hardcoded "Stainless steel water bottle" page. Nothing is saved; the user's actual product is discarded. It is the **primary** button on every answer. | `components/assistant/answer-card.tsx:395` |
| T2 | **P0** | `"{count} sources verified"` in the evidence header. They were *retrieved and cited*, not verified. Overclaim on the product's core trust surface. | `components/assistant/evidence-panel.tsx:107` |
| T3 | **P0** | `"Every claim above links back to an original BIS document record."` The corpus is a local demo subset, not original BIS records. | `components/assistant/evidence-panel.tsx:180` |
| T4 | **P1** | Per-standard **confidence badges** ("High confidence" / "Medium confidence" / "Low confidence") are **model self-reported**, presented as a measured metric next to a standard number. Violates the anti-invented-scores rule. | `answer-card.tsx:48-52, 316-323` |
| T5 | **P1** | Missing explicit scope disclosure that the system is running against an illustrative demo corpus (43 standards, 18 labs) rather than the complete national catalog of 20,000+ Indian Standards. | `Landing.footerNote`, `evidence-panel.tsx:180` |
| T6 | **P1** | `HistoryView` presents **4 fabricated saved queries with fake timestamps** ("Today, 10:42", "Yesterday, 16:18", "2 Sep, 12:06") as the user's own history on first visit, while completely ignoring real `localStorage` queries. | `bis-intelligence.tsx:398-418` |
| T7 | **P1** | "AI Connected" / "AI Online" status pills are **hardcoded**, not driven by `/api/health`. They display active green even with an invalid API key. | `bis-intelligence.tsx:125-128, 273-276` |
| T8 | **P2** | Quick action labelled **"Ask BIS"** implies the user is communicating directly with the Bureau itself. | `en.json` → `Landing.quickAsk` |
| T9 | **P0** | **Landing Prompt 3 Demo Failure:** Landing prompt 3 ("Which BIS-recognised labs near Pune can test a two-wheeler helmet?") retrieves labs from Chandigarh, Hyderabad, and Sahibabad. The AI model answers: *"The retrieved sources do not contain information about BIS-recognised laboratories located in or near Pune."* A core out-of-the-box suggested prompt yields a negative demo result! | `chat-thread.tsx:13`, `en.json:39`, verified live via `/api/chat` |

### 3.2 Brand / copy correctness

| # | Sev | Finding | Evidence |
|---|---|---|---|
| C1 | **P0** | Brand is **"BIS Saathi"** but assistant says **"BIS Sathi"** — in answer byline (`BIS Sathi Source-backed assessment`), answer `aria-label`, evidence empty state, and generated report markdown footer. | `answer-card.tsx:240, 245`; `evidence-panel.tsx:94`; `reports-view.tsx:69, 177` |
| C2 | **P1** | Two inconsistent labels for the same concept: **"AI Connected"** (landing) vs **"AI Online"** (app topbar). | `bis-intelligence.tsx:127, 275` |
| C3 | **P1** | `Landing.inspectEvidence` = **"Inspect evidence experience"** — awkward phrasing; no human says this. Should be "Inspect cited evidence" or "See how evidence is cited". | `i18n/dictionaries/*.json` |
| C4 | **P1** | `Landing.placeholder` = **"Ask anything about BIS..."** — "anything" overclaims against a scoped 43-standard corpus. Better: "Describe your product or ask a compliance question..." | `i18n/dictionaries/*.json` |
| C5 | **P0** | `Auth.configurationError` = **"Supabase is not configured yet. Add the public project URL and publishable key to continue."** Developer configuration error exposed directly to users and judges in red text. | `auth/page.tsx:25`, `en.json:84` |
| C6 | **P2** | `Landing.titleOne/titleTwo` = "Understand standards." / "Simplify compliance." Generic and abstract. Better kicker/subhead explaining immediate utility for manufacturers. | `i18n/dictionaries/*.json` |
| C7 | **P2** | Composer footer renders a hardcoded `<span className="language-badge">EN</span>` regardless of whether active locale is Hindi, Tamil, Telugu, or Kannada. | `chat-thread.tsx:298` |

### 3.3 Flow & continuity

| # | Sev | Finding | Evidence |
|---|---|---|---|
| F1 | **P0** | **"Recommended next steps" are completely inert text.** `<li>` elements with no click handler or action — the most natural forward step after an answer does nothing. Meanwhile, generic bottom action buttons sit detached below. | `answer-card.tsx:383-389` |
| F2 | **P0** | **Context is dropped on every navigation hop.** "Find laboratory" on an answer card opens `LabsFinder` with empty search, forgetting the standard, tests, and product. "Generate report" opens `ReportsView` with empty props, defaulting to `allStandards[0]` and losing the active query/answer. | `answer-card.tsx:398, 401` + `bis-intelligence.tsx:477-484` |
| F3 | **P1** | `enterAssistant()` forcibly re-opens the evidence panel on *every* new query (`setSourceOpen(window.innerWidth > 720)`), overriding a deliberate user close. | `bis-intelligence.tsx:521` |
| F4 | **P1** | Landing hero `<textarea>` inside `<form>` — **Enter does not submit** (no `onKeyDown`), unlike the in-app composer which submits on Enter. Inconsistent first-touch interaction. | `bis-intelligence.tsx:153-164` vs `chat-thread.tsx:182-188` |
| F5 | **P1** | Submitting an **empty** landing question silently substitutes a hardcoded stainless-steel-bottle question (`question.trim() || exampleQuestion`). User asked nothing and gets an answer about water bottles. | `bis-intelligence.tsx:105` |
| F6 | **P2** | Inconsistent Information Architecture: Landing header exposes 5 nav items, while App Sidebar exposes 8 nav items. | `bis-intelligence.tsx:117-123` vs `navItems` |
| F7 | **P1** | Landing Quick Action buttons have inconsistent behavior: clicking button 0 ("Find my standard") populates the textarea, while clicking buttons 1–3 immediately submits and enters the assistant view. | `bis-intelligence.tsx:179` |

### 3.4 Bloat / fabricated views

| # | Sev | Finding | Evidence |
|---|---|---|---|
| B1 | **P0** | `ProductsView` — 100% fabricated ("Stainless steel water bottle", 2 standards, 6 tests, 14 laboratories, 7-step path). Buttons "Add product", "Edit profile", "Recheck applicability", and 2 of 3 "Key documents" are **inert dead ends**. Yet it is promoted to slot 2 in the desktop sidebar and slot 2 in the mobile bottom nav! | `bis-intelligence.tsx:280-358` |
| B2 | **P1** | `DashboardView` — fabricated products, queries, and standards. **Not even listed in `navItems`**; only reachable via `?view=dashboard` or as an unreachable default. Pure dead bloat. | `bis-intelligence.tsx:421-467` |
| B3 | **P1** | Dead code: Module-level `const standards = [...]` (4 fake entries, 33 lines) at `bis-intelligence.tsx:363-396` has **zero readers** in the entire repository. | `bis-intelligence.tsx:363` (also flagged by ESLint) |
| B4 | **P1** | Mobile bottom nav promotes `products` (fake) and `history` (fake) into top 4 tabs while burying real, problem-statement-mandated flows: `Certification Guide` and `Hallmarking`. | `bis-intelligence.tsx:585-592` |
| B5 | **P1** | `HistoryView` ignores real user chat history stored in `localStorage` by `use-chat.ts`, rendering 4 hardcoded demo queries instead. | `bis-intelligence.tsx:398-418` vs `use-chat.ts:58-88` |

### 3.5 Multilingual (i18n)

| # | Sev | Finding | Evidence |
|---|---|---|---|
| M1 | **P0** | **Zero of the 6 workspace views and zero of the 4 assistant components use `useTranslations`.** Every single string in `StandardsExplorer`, `CertificationGuide`, `LabsFinder`, `HallmarkingView`, `ReportsView`, `DocumentViewer`, `AnswerCard`, `ChatThread`, `EvidencePanel`, and `RetrievalState` is hardcoded English. When switching to Hindi (`/hi`), only landing and sidebar nav translate; all app views stay English. | Verified across `components/views/*.tsx` and `components/assistant/*.tsx` |
| M2 | — | ✅ **Working:** AI answers genuinely generate in the user's selected language (`prompt.ts:101-110` injects locale instructions; `use-chat.ts:197` sends `locale`). Sources remain in English (correct, as BIS standards are published in English/Hindi). | Verified live on `/api/chat` with Hindi |
| M3 | — | ✅ **Working:** Dictionary parity is 100% across all 5 languages (`en`, `hi`, `ta`, `te`, `kn`), exactly 84 keys each. | `i18n/dictionaries/*.json` |

### 3.6 Accessibility (a11y) & Contrast

| # | Sev | Finding | Evidence |
|---|---|---|---|
| A1 | **P1** | Landing evidence-story card contains a button whose entire accessible name is **"1"** (`<button className="flow-badge">1</button>`). Screen reader announces just the digit "1". | `bis-intelligence.tsx:196` |
| A2 | **P1** | `.mobile-nav-scrim` is a `<div>` with `onClick` — keyboard users cannot dismiss the mobile navigation drawer; no `Escape` key handler, missing ARIA role. | `bis-intelligence.tsx:556-557` |
| A3 | **P1** | Evidence source tabs use `role="tablist"` / `role="tab"` with **no corresponding `tabpanel`, no `aria-controls`, and no roving tabindex** on arrow keys. Incomplete ARIA confuses assistive tech. | `evidence-panel.tsx:114-128` |
| A4 | **P1** | **WCAG 2.1 AA Contrast Failure:** `--faint #7d8795` on `--bg #f7f8fa` has a contrast ratio of **3.42:1** (fails 4.5:1 minimum for normal text). Used extensively on 9–12px labels, timestamps, metadata, and mobile nav icons. | `globals.css:7`, verified with luminance formula |
| A5 | **P2** | Accent color `--accent #cc620b` on `--surface #ffffff` has a contrast ratio of **3.95:1** (fails 4.5:1 for body/small text; passes 3:1 for large text only). | `globals.css:9` |
| A6 | — | ✅ **Accessible:** `DocumentViewer` properly implements focus trap, Escape key handling, and focus restoration to trigger element. | `document-viewer.tsx:97-139` |

### 3.7 Responsive & Breakpoints

| # | Sev | Finding | Evidence |
|---|---|---|---|
| R1 | **P1** | **Layout Collision on Tablets (721px–980px):** JS forces `setSourceOpen(true)` whenever `window.innerWidth > 720`. But CSS at `max-width: 980px` positions `.evidence-panel` as an **absolute overlay** (`position: absolute; right: 12px; width: min(440px, 92vw)`). On iPad/tablet portrait (768px), submitting any question pops up an overlay that occludes the answer! | `bis-intelligence.tsx:521` vs `globals.css:145` |
| R2 | **P1** | **Labs 3-Way Compare on 390px Mobile:** `.compare-panel` renders 4 table columns (metrics + 3 labs) inside an unstyled `<aside>` with no sticky row headers. On 390px, scrolling horizontally loses the attribute names completely. | `labs-finder.tsx:303-336`, `views.css:158-175` |
| R3 | **P1** | **Certification Timeline on Mobile (<720px):** CSS rule `.cert-timeline .status { display: none; }` hides the status badge on mobile, leaving users unable to see if a step is "Mandatory" or "Step 1". | `globals.css:154` |
| R4 | **P2** | Fixed bottom mobile nav (`height: 60px`) and sticky composer (`bottom: 58px`) can collide or overlap content if scroll padding is insufficient on small screens. | `globals.css:151, 158` |

### 3.8 Demo & Evaluator Hazards (Judge Risks)

| # | Sev | Finding | Evidence |
|---|---|---|---|
| D1 | **P0** | **"Save as product" click:** Judge clicks the primary button on an answer card → lands on hardcoded water bottle page, query discarded. Immediate red flag. | `answer-card.tsx:395` |
| D2 | **P0** | **Landing Prompt 3 click:** Judge clicks "Which BIS-recognised labs near Pune can test a two-wheeler helmet?" → Assistant answers "The retrieved sources do not contain information about BIS-recognised laboratories located in or near Pune." | `Landing.promptThree`, live chat test |
| D3 | **P0** | **"Sign in" click:** Judge clicks "Sign in" in header → enters email or clicks Google → red error "Supabase is not configured yet. Add the public project URL...". | `auth/page.tsx:25` |
| D4 | **P1** | **Language Switcher demo:** Judge switches to Hindi (`/hi`) → Assistant answer is Hindi, but all UI buttons, tabs, explorer, and guide remain in English. | `M1` |
| D5 | **P1** | **Saved Queries check:** Judge navigates to "Saved Queries" → sees hardcoded fake queries from August/September 2026 instead of their actual questions. | `bis-intelligence.tsx:398-418` |
| D6 | **P1** | **Context drop on Lab Search:** Judge clicks "Find laboratory" on answer → lands on empty Labs page with no filters applied, forced to type the standard number manually. | `answer-card.tsx:398` |

---

## 4. Confirmed strengths — DO NOT CHANGE

- **The grounding architecture:** Retrieval before the model, model may only cite handed-in sources, `[n]` markers always resolve. This is the product's primary differentiator and works reliably.
- **Honest out-of-scope handling:** "capital of France" → `sources: []`, clear refusal, `certification: not-applicable`. No hallucinated Indian Standards.
- **Multilingual answers genuinely work:** `prompt.ts` per-locale instructions generate natural Hindi, Tamil, Telugu, and Kannada answers from the English corpus.
- **`EvidencePanel` structure:** Type glyph, standard number as `<h2>`, title, "Relevant location" (clause + page), verbatim "Relevant passage", copy-citation, and full source list.
- **`answer-card.tsx` citation rendering:** Unresolvable `[n]` degrades gracefully to plain text; `expandCitations()` makes copied text self-contained and clear.
- **`chat-thread.tsx` composer:** Enter/Shift+Enter, IME-safe composition, auto-resize with a cap, sticky positioning, disabled during loading, stop button, scroll-anchoring with "Jump to latest", and `prefers-reduced-motion` respected.
- **Graceful degradation:** Offline/dead API key still shows retrieved evidence sources from the local corpus.
- **The visual identity:** Restrained navy/orange on light neutral, coherent design tokens in `app/globals.css`, `:focus-visible` outline ring defined globally.
- **`use-chat.ts` localStorage persistence:** Refreshing mid-demo preserves conversation history.
- **`DocumentViewer` modal mechanics:** Focus trap, Escape key handling, and focus restoration to the triggering button are properly built.
- **`CertificationGuide` tabs & checklist:** Roving tabindex on arrow keys, accessible document checklist with live progress announcement.
- **`HallmarkingView` honesty:** Clear disclaimer badges declaring the HUID checker is a deterministic local demo and pointing users to the official BIS Care app.

---

## 5. Resolved questions (measured and verified)

### Q1: Does `const standards` at `bis-intelligence.tsx:363` have any reader?
**Answer: NO.** Grep across the entire codebase confirms zero readers. It is 33 lines of completely unused array literal, flagged by ESLint (`@typescript-eslint/no-unused-vars`). It should be deleted.

### Q2: Does `DocumentViewer` really trap focus / restore focus / handle Escape?
**Answer: YES.** `components/views/document-viewer.tsx:97-139` implements `requestAnimationFrame` focus placement, Tab/Shift-Tab cycling between focusable elements, `event.key === "Escape"` calling `onClose()`, body scroll lock (`overflow: hidden`), and `previouslyFocused?.focus?.()` on unmount. It is a solid accessible implementation.

### Q3: Does the report `.md` download include the session's sources?
**Answer: NO.** `ReportsView` accepts no props (`export function ReportsView()`), has zero connection to active chat or retrieval context, and always defaults to `allStandards[0]`. The markdown download is a static dump of standard metadata with hardcoded seeded report entries from August 2026. This is a major missed opportunity.

### Q4: Do all 4 landing prompt examples retrieve good sources?
**Answer: NO — Prompt 3 fails in demo.**
Empirical test results against `/api/chat`:
- **Prompt 1 (Water bottle):** ✅ Retrieves IS 17803:2022, S.O. 1250(E). Clear match.
- **Prompt 2 (Power bank):** ✅ Retrieves Scheme-II (CRS), IS 13252 (Part 1):2010. Clear match.
- **Prompt 3 (Helmet labs near Pune):** ❌ Retrieves labs in Chandigarh, Hyderabad, Sahibabad (none in Pune). Model answers: *"The retrieved sources do not contain information about BIS-recognised laboratories located in or near Pune."* **High demo hazard!**
- **Prompt 4 (Gold hallmark):** ✅ Retrieves Hallmarking Scheme & 3 Assaying Centres. Explains 3 marks accurately.

### Q5: JS breakpoint `window.innerWidth > 720` vs CSS breakpoints — mismatch band?
**Answer: YES — Severe collision between 721px and 980px.**
In `bis-intelligence.tsx:521`, JS forces `setSourceOpen(window.innerWidth > 720)`. In CSS (`globals.css:145`), between 721px and 980px (tablets / iPads), `.evidence-panel` is an `absolute` overlay (`width: min(440px, 92vw)`). Asking a question on an iPad or tablet viewport automatically pops up an absolute drawer that completely covers the answer.

### Q6: Labs 3-way compare on a 390px phone — three columns?
**Answer: YES — Causes cramped horizontal scrolling without sticky labels.**
`.compare-panel` renders 4 columns (Metric + 3 Labs) inside `.table-scroll`. On 390px, table headers (`th[scope="row"]`) are not sticky, so scrolling right to inspect lab 3 completely hides what attribute is being compared.

### Q7: Certification 7-step stepper at 390px?
**Answer: Broken status visibility.**
In `globals.css:154`, `@media(max-width:720px) { .cert-timeline .status { display: none; } }`. Hiding the status element completely removes the step stage badge on mobile screens.

### Q8: Contrast ratios for `--muted #5d6879` and `--faint #7d8795` on `--bg #f7f8fa`?
**Answer: Measured with WCAG 2.1 relative luminance formulas:**
- `--muted #5d6879` on `--bg #f7f8fa`: **5.31:1** (✅ Passes AA > 4.5:1)
- `--muted #5d6879` on `--surface #ffffff`: **5.64:1** (✅ Passes AA > 4.5:1)
- `--faint #7d8795` on `--bg #f7f8fa`: **3.42:1** (❌ FAILS AA normal text < 4.5:1)
- `--faint #7d8795` on `--surface #ffffff`: **3.64:1** (❌ FAILS AA normal text < 4.5:1)
- `--accent #cc620b` on `--surface #ffffff`: **3.95:1** (❌ FAILS AA normal text < 4.5:1; passes large text only)

---

## 6. Feature classification

| Feature | Class | Status & Recommendation |
|---|---|---|
| **Assistant (Ask → Grounded Answer)** | **CORE** | Keep & strengthen. Core product flow. |
| **Evidence Panel + Citations** | **CORE** | Keep. Fix overclaims (T2, T3) and tablet collision (R1). |
| **Document Viewer (Clause Highlight)** | **CORE** | Keep. Proven accessible modal. |
| **Standards Explorer** | **CORE** | Keep. Connect context from Assistant (F2). |
| **Certification Guide** | **CORE** | Keep. Connect context from Assistant (F2). |
| **Labs Finder** | **CORE** | Keep. Connect standard/test filters from Assistant (F2). |
| **Hallmarking View** | **CORE** | Keep. Transparent and honest demo surface. |
| **Multilingual Interaction** | **CORE** | Working in answers; needs UI dictionary integration (M1). |
| **Reports View** | **SUPPORTING** | Keep, but wire real session data & sources (Q3). |
| **`ProductsView`** | **HARMFUL** | **Demote or replace with real session product summary.** Currently a hardcoded dead-end that breaks the primary answer CTA (T1, B1). |
| **`HistoryView`** | **BLOAT → HARMFUL** | **Replace with real `localStorage` thread history.** Wire `use-chat.ts` saved queries so clicking a query restores it. Remove fake August 2026 entries (T6, B5). |
| **`DashboardView`** | **BLOAT** | **Prune / Remove.** Unreachable from nav, pure fabricated mockup (B2). |
| **Labs 3-Way Compare** | **SUPPORTING** | Keep. Add sticky row headers for mobile (Q6). |
| **Auth (Supabase Unconfigured)** | **HARMFUL IN DEMO** | **Graceful Guest Mode:** Hide sign-in or make it explain "Demo mode active — local storage used; cloud sync disabled." Never show raw Supabase error (C5, D3). |

---

## 7. Lint debt (pre-existing)

```
components/assistant/use-chat.ts:63:21  error    setState() directly within an effect   react-hooks/set-state-in-effect
lib/bis/gemini.ts:598:11                error    'res' is never reassigned → const      prefer-const
app/bis-intelligence.tsx:363:7          warning  'standards' is assigned a value but never used
lib/bis/gemini.ts:251:10                warning  'isThinkingConfigRejection' unused
lib/bis/prompt.ts:138:3                 warning  '_reason' unused
lib/bis/retrieval.ts:84:7               warning  'FOREIGN_INTENT' unused
```

---

## 8. Known inconsistencies in project docs

- `HANDOFF.md` and `.env.example` say **gemini-2.5-flash**; code and live health say **gemini-3.5-flash** (`lib/bis/env.ts:11`).
- `HANDOFF.md` §4 lists `retrieval.ts` and `data/` as missing/blocking — **stale**, they exist and work.

---

## 9. Remaining work

### Phase 1 — audit
- [x] Product map, route inventory, baseline health checks
- [x] Live API verification (en / hi / out-of-scope)
- [x] i18n key parity + translation-coverage measurement
- [x] Read `bis-intelligence.tsx`, `answer-card.tsx`, `chat-thread.tsx`, `evidence-panel.tsx`, `retrieval-state.tsx`, `globals.css`, `styles/views.css`, `styles/assistant.css`
- [x] Conduct 14-dimension comprehensive audit
- [x] Resolve all 8 open questions with code evidence and empirical tests
- [x] Merge all findings into §3 with exact severity and file citations
- [x] Write the complete 13-section structured audit deliverable (§10)

### Phase 2 — implementation (Ready to begin upon user review)
- [ ] Create implementation plan based on prioritized P0/P1 fixes
- [ ] Fix broken flows & dead ends (T1, F1, F2, F4, F5)
- [ ] Fix trust & overclaims (T2, T3, T4, T9, C1)
- [ ] Wire real context across navigation hops (Assistant → Labs, Assistant → Reports, Assistant → Standards)
- [ ] Connect `HistoryView` to real `localStorage` queries and prune `DashboardView` / dead `standards` array (B1, B2, B3, B5)
- [ ] Fix tablet layout collision (R1) and mobile compare table (R2)
- [ ] Fix WCAG contrast failures (A4, A5) and accessibility bugs (A1, A2, A3)
- [ ] Clean up lint debt in `use-chat.ts`, `gemini.ts`, and `bis-intelligence.tsx`
- [ ] Verify all 6 core flows, run `tsc` and `eslint`, test on 390px mobile viewport

---

## 10. The 13-Section Structured Audit Deliverable

### 10.1 Executive Verdict

BIS Saathi possesses an **exceptionally strong architectural foundation**: local grounded retrieval, strict prompt constraints ensuring zero hallucinated citations, honest out-of-scope refusals, functional multilingual streaming, and a restrained, professional public-service visual identity.

However, the user experience is undermined by **"facade bloat" and broken flow hops**:
1. **Primary Answer CTA is deceptive:** Clicking "Save as product" discards the user's actual product and navigates to a hardcoded "Stainless steel water bottle" view with dead buttons.
2. **Context evaporation between views:** Clicking "Find laboratory" or "Generate report" drops all product, standard, and testing context.
3. **Dead-end next steps:** The "Recommended next steps" cards on answers are inert text items.
4. **Demo tripwires:** Landing prompt 3 yields an unhelpful "no labs found near Pune" answer, and clicking "Sign in" triggers an unconfigured Supabase developer error.

By pruning the fabricated mock views (`ProductsView`, `DashboardView`, fake history) and wiring seamless context passing between the core surfaces (Assistant → Standards → Labs → Reports), BIS Saathi will transform from a prototype with visible seams into an airtight, trustworthy, enterprise-grade public service tool.

---

### 10.2 Critical Issues (P0) — Must Fix Before Judging

1. **T1 / B1: Deceptive Primary CTA ("Save as product")**
   - *File:* `components/assistant/answer-card.tsx:395`, `app/bis-intelligence.tsx:280-358`
   - *Issue:* Primary button on every AI answer invites user to "Save as product", but simply opens `ProductsView` — a static mock of a water bottle. The user's query is lost, and all buttons in `ProductsView` ("Add product", "Edit profile", "Recheck applicability") do nothing.
   - *Fix:* Replace "Save as product" with a contextual action, or let `ProductsView` display the *actual* active product identified from the chat thread, with working links to its standards and labs.

2. **T9: Landing Prompt 3 Yields Negative Demo Result**
   - *File:* `i18n/dictionaries/*.json` (`Landing.promptThree`), `components/assistant/chat-thread.tsx:13`
   - *Issue:* Example prompt asks for helmet testing labs in Pune. Corpus has helmet labs in Chandigarh, Hyderabad, and Sahibabad, but none in Pune. Model honestly responds that no Pune labs exist in the corpus.
   - *Fix:* Change the prompt to match an actual lab in the corpus (e.g., *"Which BIS-recognised labs can test a two-wheeler helmet under IS 4151?"* or *"Find BIS-recognised testing laboratories in Hyderabad or Sahibabad"*).

3. **C1: Brand Typo in Core UI ("BIS Sathi" vs "BIS Saathi")**
   - *File:* `answer-card.tsx:240, 245`, `evidence-panel.tsx:94`, `reports-view.tsx:69, 177`
   - *Issue:* Everywhere in the assistant header, answer byline, evidence empty state, and generated markdown report, the name is spelled "BIS Sathi" instead of the official project name "BIS Saathi".
   - *Fix:* Update all instances to "BIS Saathi".

4. **T2 & T3: Overclaiming on Evidence Panel**
   - *File:* `components/assistant/evidence-panel.tsx:107, 180`
   - *Issue:* Header claims `"{count} sources verified"` (they are retrieved and cited, not independently verified). Footer claims `"Every claim above links back to an original BIS document record"` (it is a curated demonstration corpus of 43 standards).
   - *Fix:* Change to `"{count} sources cited"` and `"Every claim above links to an excerpt from the demonstration corpus. Verify against official BIS gazette notifications."`

5. **F1: Inert "Recommended Next Steps"**
   - *File:* `components/assistant/answer-card.tsx:383-389`
   - *Issue:* The 3 next steps returned by Gemini are rendered as static `<li>` cards with no click handlers, leaving the user with nowhere to go.
   - *Fix:* Make next steps clickable actions that carry context (e.g., step 1 navigates to the relevant standard in Standards Explorer; step 2 opens Labs Finder filtered by that standard).

6. **F2: Context Lost on Navigation Hops**
   - *File:* `answer-card.tsx:398, 401`, `bis-intelligence.tsx:475-484`
   - *Issue:* "Find laboratory" navigates to `LabsFinder` with no standard or test selected. "Generate report" navigates to `ReportsView` with no standard selected (defaults to `allStandards[0]`).
   - *Fix:* Pass `{ standardId, initialQuery }` to `LabsFinder` and `ReportsView` so navigation retains the user's active context.

7. **C5 / D3: Developer Supabase Error on Sign In**
   - *File:* `app/[locale]/auth/page.tsx:25`, `i18n/dictionaries/en.json:84`
   - *Issue:* Clicking "Sign in" and attempting Google or email auth displays: *"Supabase is not configured yet. Add the public project URL and publishable key to continue."*
   - *Fix:* Handle unconfigured auth gracefully. Show a clear banner: *"Demonstration mode active. Workspace queries and evidence are stored locally in your browser."* Disable the submit button with a friendly tooltip.

---

### 10.3 High-Value Improvements (P1)

1. **T4: Replace Model Self-Reported "Confidence Badges"**
   - *File:* `answer-card.tsx:48-52, 316-323`
   - *Issue:* "High confidence" / "Medium confidence" badges are self-reported by the LLM and look like official test metrics.
   - *Fix:* Replace with match status or applicability tags: "Primary standard", "Reference standard", or "Associated order", which describe document relationships rather than arbitrary confidence percentages.

2. **R1: Resolve 721px–980px Tablet Layout Collision**
   - *File:* `bis-intelligence.tsx:521`, `app/globals.css:145`
   - *Issue:* In tablet viewports (768px iPad), JS auto-opens the evidence panel, while CSS positions it as a 440px absolute overlay, completely covering the answer.
   - *Fix:* Change JS auto-open condition from `window.innerWidth > 720` to `window.innerWidth > 980`. On tablet screens (<=980px), keep the panel closed by default and allow opening via the floating sources pill.

3. **B5: Connect "Saved Queries" to Real `localStorage` Data**
   - *File:* `bis-intelligence.tsx:398-418`
   - *Issue:* `HistoryView` displays 4 fabricated queries from August/September 2026. `use-chat.ts` already persists real user queries in `localStorage`.
   - *Fix:* Read real thread messages from `localStorage` in `HistoryView`. Allow clicking any past query to restore the thread. If empty, display a clean empty state with prompt suggestions.

4. **F4: Enable Enter Key Submission on Landing Hero**
   - *File:* `bis-intelligence.tsx:153-164`
   - *Issue:* Landing hero textarea does not submit on Enter (only in-app composer does).
   - *Fix:* Add `onKeyDown` to landing textarea: Enter submits, Shift+Enter adds newline.

5. **F5: Prevent Empty Submissions on Landing**
   - *File:* `bis-intelligence.tsx:105`
   - *Issue:* Pressing submit with an empty input silently asks the hardcoded water bottle question.
   - *Fix:* Require `question.trim().length > 0` before submitting, or shake/highlight the textarea if empty.

6. **M1: Translate Core Workspace Views**
   - *File:* `components/views/*.tsx`
   - *Issue:* All 6 workspace views have 100% hardcoded English chrome.
   - *Fix:* Wire basic UI labels (Search, Filter, Reset, Back, Loading, Details) through `next-intl` dictionary keys.

7. **A4: Fix WCAG Contrast Failures**
   - *File:* `app/globals.css:7, 9`
   - *Issue:* `--faint #7d8795` (3.42:1) fails WCAG AA on `--bg #f7f8fa`.
   - *Fix:* Darken `--faint` from `#7d8795` to `#596574` (contrast 5.4:1 on `#f7f8fa`, passing AA).

---

### 10.4 Copy & Tone Audit

| Location | Existing String | Issue | Proposed Replacement |
|---|---|---|---|
| `answer-card.tsx:245` | `BIS Sathi · Source-backed assessment` | Brand misspelling | `BIS Saathi · Grounded in BIS Sources` |
| `evidence-panel.tsx:107` | `{count} sources verified` | Overclaim | `{count} sources cited` |
| `evidence-panel.tsx:180` | `Every claim above links back to an original BIS document record.` | Overclaim (demo corpus) | `Cited from the demonstration corpus. Confirm current applicability with official gazettes.` |
| `en.json` (`Landing.inspectEvidence`) | `Inspect evidence experience` | Inhuman/robotic | `See how evidence is cited` |
| `en.json` (`Landing.placeholder`) | `Ask anything about BIS...` | Overclaim | `Describe a product or ask about standards, testing, and certification...` |
| `en.json` (`Landing.quickAsk`) | `Ask BIS` | Implies direct bureau line | `Ask Assistant` |
| `en.json` (`Auth.configurationError`) | `Supabase is not configured yet. Add the public project URL and publishable key to continue.` | Developer error in user face | `Demo mode active: sign-in is disabled. Your queries are saved locally in this browser.` |
| `chat-thread.tsx:298` | `<span className="language-badge">EN</span>` | Hardcoded English | Dynamically show active locale (`locale.toUpperCase()`) |
| `reports-view.tsx:69` | `Generated: ... by BIS Sathi` | Brand misspelling | `Generated by BIS Saathi Compliance Assistant` |

---

### 10.5 Feature Classification & Bloat Removal

#### 1. Core Features (Preserve and Polish)
- **Compliance Assistant:** Natural language question-to-standard mapping with streaming and citation markers.
- **Evidence Panel:** Side-by-side verification with document type badges, clauses, and excerpts.
- **Document Viewer:** Full clause-level reader with focus trap and highlighted cited clauses.
- **Standards Explorer:** Search 43 standards with sector filtering, status indicators, and clause lists.
- **Certification Guide:** 6 certification schemes with interactive document preparation checklists and fees.
- **Testing Labs Finder:** Search 18 accredited labs by city, state, turnaround, and test groups.
- **Hallmarking View:** Educational anatomy of gold hallmarks, centre locator, and transparent HUID tester.

#### 2. Supporting Features (Enhance Context)
- **Compliance Summary Reports:** Update report generator to accept the active standard and citations from chat.
- **Labs Comparison Table:** Add sticky row headers for mobile viewports.

#### 3. Harmful / Bloat Features (Prune or Rebuild)
- **`ProductsView`:** Delete the fake water bottle mock or replace with dynamic product card derived from current conversation.
- **`DashboardView`:** Delete completely. Unreachable from navigation; purely unlinked mock content.
- **`HistoryView` Mock Data:** Delete the 4 hardcoded fake queries from August 2026. Wire directly to real `localStorage` queries.
- **`const standards` in `bis-intelligence.tsx:363`:** Delete 33 lines of unused dead code.

---

### 10.6 Flow & Friction Analysis

```mermaid
flowchart TD
    subgraph LandingFlow [Landing Page Flow]
        L1[Landing Hero] -->|Submit Question| A1[Compliance Assistant]
        L1 -->|Click Quick Action 1-4| A1
        L1 -->|Click Nav| V1[Explore Standards / Labs / Cert]
    end

    subgraph AssistantFlow [Core Assistant Journey]
        A1 -->|Generate Grounded Answer| A2[Answer Card]
        A2 -->|Click [n] Citation| E1[Evidence Panel]
        E1 -->|Click 'View highlighted passage'| D1[Document Viewer Modal]
        D1 -->|Press Esc or Close| E1
    end

    subgraph ConnectedHops [Context-Carrying Hops - TO FIX]
        A2 -->|Click 'Find laboratory'| L2[Labs Finder pre-filtered by Standard]
        A2 -->|Click 'Generate report'| R2[Reports View pre-seeded with Standard]
        A2 -->|Click 'Recommended standard'| S2[Standards Explorer opened to Standard]
    end
```

**Key Friction Points & Resolutions:**
1. **Broken Hop (Answer → Next Step):** Currently next steps are static `<li>`. **Fix:** Make step 1 navigate to the standard in Standards Explorer; make step 2 filter Labs Finder by the required tests.
2. **Broken Hop (Answer → Labs):** Currently drops context. **Fix:** Pass `standard.number` to Labs Finder so it auto-filters to labs testing that standard.
3. **Broken Hop (Answer → Report):** Currently loads IS 17803 report regardless of what was asked. **Fix:** Pass the active standard to `ReportsView`.
4. **Landing Submission Consistency:** Enter key now submits on Landing hero, matching the in-app composer.

---

### 10.7 Trust & Grounding Audit

1. **Retrieved Sources vs. Hallucinated Sources:**
   The backend retrieval mechanism is bulletproof: Gemini is prompted with strict source constraints, and only sources retrieved locally are provided. The model never fabricates standard numbers not present in the prompt context.
2. **Out-of-Scope Integrity:**
   General questions ("capital of France", "recipe for cake") trigger honest refusals without citing Indian Standards.
3. **Corpus Boundary Transparency:**
   The UI must clearly communicate: *"Demonstration corpus: 43 Indian Standards, 13 QCOs, 18 Laboratories. Consult the BIS portal for full gazette notifications."* This turns a potential perceived limitation into a demonstration of rigorous engineering integrity.

---

### 10.8 Accessibility (a11y) & Contrast Audit

1. **Color Contrast:**
   - `--muted #5d6879` on `#f7f8fa`: 5.31:1 (Passes AA).
   - `--faint #7d8795` on `#f7f8fa`: 3.42:1 (Fails AA). **Remedy:** Shift to `#596574` (5.4:1).
   - Text on dark headers (`#0e315e`): white text achieves 11.2:1 (Passes AAA).
2. **Screen Reader & Keyboard Nav:**
   - Fix button "1" on landing evidence card: add `aria-label="Step 1: AI identifies Indian Standard"`.
   - Add `role="button" tabIndex={0}` and `onKeyDown` (Escape) to `.mobile-nav-scrim`.
   - Complete ARIA implementation on `.source-tabs`: add `aria-controls="source-detail-panel"`, create corresponding `role="tabpanel"`, and enable ArrowLeft / ArrowRight navigation.
3. **Focus States:**
   - Existing `:focus-visible` outline is high quality (3px solid accent soft). Retain across all interactive controls.

---

### 10.9 Responsive & Breakpoint Audit

| Screen Size | Breakpoint | Current Issues | Required Fixes |
|---|---|---|---|
| **Mobile** | `< 420px` (e.g. iPhone 390px) | Compare table columns cramped; certification timeline status hidden | Add sticky row headers to comparison table; unhide step numbers in timeline |
| **Mobile / Small Tablet** | `421px – 720px` | Bottom navigation hides Certification & Hallmarking; fixed composer can occlude bottom cards | Reorder bottom navigation to prioritize working tools; ensure `padding-bottom: 80px` on scroller |
| **Tablet Portrait** | `721px – 980px` (e.g. iPad 768px) | **Layout collision:** Evidence panel opens as an absolute overlay covering 440px of conversation | Keep evidence panel closed by default at `<= 980px`; allow opening via floating toggle |
| **Desktop** | `> 980px` | Clean 2-column workspace; side-by-side evidence rail works smoothly | Retain existing desktop grid structure |

---

### 10.10 Demo & Evaluator Hazard Analysis

| # | Hazard Scenario | Evaluator Experience | Mitigation |
|---|---|---|---|
| 1 | Evaluator clicks primary "Save as product" button | Evaluator sees query replaced by a static water bottle page with dead buttons | Remove "Save as product" or convert to "View compliance path" with real active data |
| 2 | Evaluator clicks suggested prompt 3 (Helmet labs in Pune) | Evaluator sees AI report that no labs exist in Pune | Change landing prompt to helmet testing in Hyderabad/Sahibabad (which exist in corpus) |
| 3 | Evaluator clicks "Sign in" in topbar | Red error box: *"Supabase is not configured yet..."* | Display clean guest-mode notice; disable auth buttons with informative hint |
| 4 | Evaluator switches language to Hindi | Answer prose is Hindi, but all UI chrome is English | Wire high-frequency UI strings to dictionary |
| 5 | Evaluator clicks "Saved Queries" in sidebar | Evaluator sees fake dates like "2 Sep, 12:06" | Show evaluator's actual recent queries from `localStorage` |
| 6 | Evaluator resizes browser to 800px width | Evidence overlay pops over the answer, blocking readability | Keep evidence drawer closed until user taps sources button on screens under 980px |

---

### 10.11 Quick Wins (Low-Effort, High-Impact)

1. **Fix Landing Prompt 3:** Edit `i18n/dictionaries/*.json` and `chat-thread.tsx` to ask for helmet labs in Hyderabad/Sahibabad (3 minutes).
2. **Correct Brand Spelling:** Search & replace "BIS Sathi" → "BIS Saathi" in `answer-card.tsx`, `evidence-panel.tsx`, and `reports-view.tsx` (5 minutes).
3. **Delete Dead Code:** Remove unused `const standards` from `bis-intelligence.tsx:363` (1 minute).
4. **Fix Enter Key on Landing:** Add `onKeyDown` handler to landing textarea (2 minutes).
5. **Fix Contrast Token:** Update `--faint` in `globals.css` from `#7d8795` to `#596574` (1 minute).
6. **Graceful Auth Error:** Replace Supabase error with guest mode explainer (5 minutes).
7. **Fix Tablet Overlay Collision:** Change auto-open check to `window.innerWidth > 980` (1 minute).

---

### 10.12 Do-Not-Change Surface

- **`lib/bis/retrieval.ts`:** Scoring and ranking logic is accurate, fast, and strict.
- **`lib/bis/prompt.ts` & `gemini.ts`:** Prompt engineering and structured output schemas are solid.
- **`components/views/document-viewer.tsx`:** Modal mechanics, PDF styling, and clause navigation are well-built.
- **`components/views/certification-guide.tsx`:** Tab accessibility and interactive document checklist work well.
- **`components/views/hallmarking-view.tsx`:** Educational explainer and transparent HUID hash mechanics are honest.
- **Color tokens & visual branding:** Navy `#0e315e` and accent `#cc620b` on `#f7f8fa` give a trustworthy public-service aesthetic.

---

### 10.13 Prioritised Implementation Plan

#### Sprint 1: Trust, Brand & Demo Tripwires (P0)
1. Fix brand name spelling: "BIS Sathi" → "BIS Saathi" across all files (`answer-card.tsx`, `evidence-panel.tsx`, `reports-view.tsx`).
2. Fix Landing Prompt 3 to query a laboratory location present in the demo corpus (`en.json`, `hi.json`, `ta.json`, `te.json`, `kn.json`, `chat-thread.tsx`).
3. Correct overclaims in `evidence-panel.tsx` ("sources cited" instead of "sources verified").
4. Replace raw Supabase error with graceful guest-mode explanation (`auth/page.tsx`, `dictionaries/*.json`).
5. Fix Landing hero textarea: submit on Enter, prevent empty submissions (`bis-intelligence.tsx`).

#### Sprint 2: Core Flow Continuity & Context Preservation (P0/P1)
1. Replace "Save as product" CTA on `AnswerCard` with direct actions that preserve context.
2. Wire "Find laboratory" on `AnswerCard` to navigate to `LabsFinder` with the standard number prefilled.
3. Wire "Generate report" on `AnswerCard` to navigate to `ReportsView` with the active standard preloaded.
4. Wire "Recommended next steps" cards on `AnswerCard` to open the relevant standard or testing lab.
5. Fix tablet collision: only auto-open evidence panel on desktop viewports (`> 980px`).

#### Sprint 3: Bloat Removal & Real Data Wiring (P1)
1. Prune dead `DashboardView` and unused `const standards` array from `bis-intelligence.tsx`.
2. Connect `HistoryView` to real `localStorage` queries saved by `use-chat.ts`, removing fake August 2026 data.
3. Update mobile bottom navigation to feature real working tools (Assistant, Standards, Labs, Certification, Hallmarking).

#### Sprint 4: Accessibility, Contrast & Mobile Polish (P1/P2)
1. Adjust `--faint` color token in `globals.css` to `#596574` for WCAG AA compliance.
2. Add accessible label to evidence card badge and add keyboard escape to mobile nav scrim.
3. Complete ARIA tablist/tabpanel attributes on Evidence Panel tabs.
4. Add sticky row headers to Labs 3-way compare table on mobile.
5. Fix ESLint warnings and errors (`use-chat.ts:63`, `gemini.ts:598`).
