import type {
  CertificationScheme,
  Clause,
  EvidenceSource,
  HallmarkingCentre,
  Laboratory,
  QualityControlOrder,
  RetrievalResult,
  Standard,
} from "@/lib/bis/types";

import {
  getQcoById,
  getSchemeById,
  hallmarkingCentres,
  labs,
  qcos,
  schemes,
  standards,
} from "@/lib/bis/data";

/* -------------------------------------------------------------------------- */
/* Tuning                                                                      */
/* -------------------------------------------------------------------------- */

const W = {
  keywordExact: 8,
  keywordPartial: 3,
  title: 5,
  scope: 2,
  sector: 2,
  clause: 1,
  activeBonus: 1.5,
  supersededPenalty: -1,
  /** An explicit "IS 1786" in the query pins that standard to rank 1. */
  explicitNumber: 1000,
} as const;

const LIMITS = {
  standards: 4,
  qcos: 3,
  labs: 4,
  schemes: 2,
  centres: 3,
  sources: 4,
} as const;

/** Keep the prompt block small enough to leave room for the conversation. */
const MAX_CONTEXT_CHARS = 3400;

const STOPWORDS = new Set([
  "a", "about", "all", "am", "an", "and", "any", "are", "as", "at", "be",
  "been", "but", "by", "can", "did", "do", "does", "for", "from", "get",
  "has", "have", "how", "i", "if", "in", "into", "is", "it", "its", "me",
  "my", "need", "of", "on", "or", "our", "please", "should", "so", "some",
  "tell", "that", "the", "their", "them", "there", "these", "they", "this",
  "to", "was", "we", "were", "what", "when", "which", "will", "with", "would",
  "you", "your", "who", "won", "whose", "where", "why",
]);

const LAB_INTENT = [
  "lab", "labs", "laboratory", "laboratories", "testing", "test", "tested",
  "nabl", "accredited", "accreditation", "sample", "samples", "turnaround",
];

const HALLMARK_INTENT = [
  "hallmark", "hallmarking", "hallmarked", "gold", "jewellery", "jewelry",
  "jeweller", "jeweler", "silver", "purity", "huid", "karat", "carat",
  "ornament", "assaying", "bullion",
];

const SCHEME_INTENT = [
  "licence", "license", "licensing", "apply", "application", "certificate",
  "certification", "certified", "registration", "register", "cost", "fee",
  "fees", "charge", "charges", "price", "procedure", "process", "steps",
  "documents", "isi", "crs", "fmcs", "renewal", "mark",
];

/**
 * FMCS only applies to manufacturers located outside India. Without one of
 * these signals in the query it is almost never the right scheme, yet the word
 * "manufacture" alone matches its name strongly — so it is gated.
 */
const FOREIGN_INTENT = [
  "foreign", "import", "imported", "importer", "importing", "overseas",
  "abroad", "offshore", "outside", "fmcs", "china", "vietnam", "customs",
];

const SCHEME_CODES: Record<string, string> = {
  "scheme-i": "Scheme-I",
  "scheme-ii": "Scheme-II (CRS)",
  "scheme-hallmarking": "Hallmarking Registration",
  "scheme-fmcs": "FMCS",
  "scheme-ecomark": "ECO Mark",
  "scheme-msc": "MSC",
};

/* -------------------------------------------------------------------------- */
/* Text helpers                                                                */
/* -------------------------------------------------------------------------- */

function singular(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (
    word.length > 4 &&
    (word.endsWith("sses") ||
      word.endsWith("ches") ||
      word.endsWith("shes") ||
      word.endsWith("xes") ||
      word.endsWith("zes"))
  ) {
    return word.slice(0, -2);
  }
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) {
    return word.slice(0, -1);
  }
  return word;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface Token {
  /** Raw lowercase token as typed. */
  raw: string;
  /** Naive singular form used for keyword equality. */
  stem: string;
  /** Word-boundary matcher used against free text. */
  re: RegExp;
}

function tokenise(query: string): Token[] {
  const cleaned = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const seen = new Set<string>();
  const tokens: Token[] = [];
  for (const word of cleaned) {
    if (word.length < 2) continue;
    if (STOPWORDS.has(word)) continue;
    if (seen.has(word)) continue;
    seen.add(word);
    const stem = singular(word);
    tokens.push({
      raw: word,
      stem,
      re: new RegExp(`\\b${escapeRegExp(stem)}`, "i"),
    });
  }
  return tokens;
}

/** Best score any single token earns against one free-text field. */
function scoreText(tokens: Token[], text: string, weight: number): number {
  if (!text) return 0;
  let total = 0;
  for (const token of tokens) {
    if (token.re.test(text)) total += weight;
  }
  return total;
}

function scoreList(tokens: Token[], list: string[], weight: number): number {
  return scoreList0(tokens, list.join(" · "), weight);
}

function scoreList0(tokens: Token[], joined: string, weight: number): number {
  return scoreText(tokens, joined, weight);
}

/** Keywords get exact-match priority, then a smaller partial-match credit. */
function scoreKeywords(tokens: Token[], keywords: string[]): number {
  let total = 0;
  for (const token of tokens) {
    let best = 0;
    for (const keyword of keywords) {
      if (keyword === token.raw || keyword === token.stem) {
        best = Math.max(best, W.keywordExact);
        continue;
      }
      if (token.stem.length >= 4 && keyword.includes(token.stem)) {
        best = Math.max(best, W.keywordPartial);
        continue;
      }
      if (keyword.length >= 4 && token.stem.includes(keyword)) {
        best = Math.max(best, W.keywordPartial);
      }
    }
    total += best;
  }
  return total;
}

function hasIntent(tokens: Token[], vocabulary: string[]): boolean {
  return tokens.some(
    (token) =>
      vocabulary.includes(token.raw) || vocabulary.includes(token.stem),
  );
}

function clamp(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

/* -------------------------------------------------------------------------- */
/* Explicit IS number detection                                                */
/* -------------------------------------------------------------------------- */

const IS_NUMBER_RE = /\bIS\s*[:\-]?\s*(\d{3,5})\b/gi;

function explicitStandardNumbers(query: string): string[] {
  const found: string[] = [];
  IS_NUMBER_RE.lastIndex = 0;
  let match: RegExpExecArray | null = IS_NUMBER_RE.exec(query);
  while (match !== null) {
    if (match[1]) found.push(match[1]);
    match = IS_NUMBER_RE.exec(query);
  }
  return found;
}

function matchesExplicitNumber(standard: Standard, digits: string): boolean {
  const numeric = standard.number.match(/\d{3,5}/);
  return numeric !== null && numeric[0] === digits;
}

/* -------------------------------------------------------------------------- */
/* Scoring                                                                     */
/* -------------------------------------------------------------------------- */

interface Scored<T> {
  item: T;
  score: number;
}

function byScoreDesc<T>(a: Scored<T>, b: Scored<T>): number {
  return b.score - a.score;
}

function scoreStandard(tokens: Token[], standard: Standard): number {
  let score = 0;
  score += scoreKeywords(tokens, standard.keywords);
  score += scoreText(tokens, standard.title, W.title);
  score += scoreText(tokens, standard.scope, W.scope);
  score += scoreText(tokens, standard.sector, W.sector);
  score += scoreList(tokens, standard.tests, W.clause);

  const clauseText = standard.clauses
    .map((clause) => `${clause.title} ${clause.text}`)
    .join(" ");
  score += scoreText(tokens, clauseText, W.clause);

  if (score > 0) {
    score += standard.status === "active" ? W.activeBonus : W.supersededPenalty;
  }
  return score;
}

function scoreQco(tokens: Token[], qco: QualityControlOrder): number {
  let score = 0;
  score += scoreText(tokens, qco.name, 5);
  score += scoreText(tokens, qco.summary, 2);
  score += scoreList(tokens, qco.coverage, 3);
  score += scoreList(tokens, qco.exemptions, 1);
  score += scoreText(tokens, qco.ministry, 1);
  return score;
}

function scoreLab(tokens: Token[], lab: Laboratory): number {
  let score = 0;
  score += scoreText(tokens, lab.name, 4);
  score += scoreText(tokens, lab.city, 6);
  score += scoreText(tokens, lab.state, 5);
  score += scoreList(tokens, lab.testGroups, 4);
  score += scoreList(tokens, lab.recognisedFor, 2);
  score += scoreText(tokens, lab.accreditation, 1);
  return score;
}

function scoreScheme(tokens: Token[], scheme: CertificationScheme): number {
  let score = 0;
  score += scoreText(tokens, scheme.name, 6);
  score += scoreText(tokens, scheme.summary, 2);
  score += scoreText(tokens, scheme.applicability, 3);
  score += scoreList(
    tokens,
    scheme.steps.map((step) => step.title),
    2,
  );
  score += scoreList(tokens, scheme.documents, 1);
  return score;
}

function scoreCentre(tokens: Token[], centre: HallmarkingCentre): number {
  let score = 0;
  score += scoreText(tokens, centre.name, 4);
  score += scoreText(tokens, centre.city, 6);
  score += scoreText(tokens, centre.state, 5);
  score += scoreList(tokens, centre.purities, 3);
  score += scoreText(tokens, centre.registration, 2);
  return score;
}

/** The clause a human would point at to justify the answer. */
function bestClause(tokens: Token[], standard: Standard): Clause {
  let best = standard.clauses[0];
  let bestScore = -1;
  for (const clause of standard.clauses) {
    const score =
      scoreText(tokens, clause.title, 3) + scoreText(tokens, clause.text, 1);
    if (score > bestScore) {
      bestScore = score;
      best = clause;
    }
  }
  return best;
}

/* -------------------------------------------------------------------------- */
/* Evidence sources                                                            */
/* -------------------------------------------------------------------------- */

function standardSource(standard: Standard, clause: Clause): EvidenceSource {
  return {
    id: `s-${standard.id}`,
    number: standard.number,
    type: "Indian Standard",
    title: standard.title,
    location: `Clause ${clause.number} — ${clause.title}`,
    excerpt: clause.text,
    page: clause.page,
    docId: standard.id,
  };
}

function qcoSource(qco: QualityControlOrder): EvidenceSource {
  return {
    id: `q-${qco.id}`,
    number: qco.notification,
    type: "Quality Control Order",
    title: qco.name,
    location: "Applicability and coverage",
    excerpt: `${qco.summary} Coverage includes: ${qco.coverage
      .slice(0, 3)
      .join("; ")}.`,
    docId: qco.id,
  };
}

function schemeSource(scheme: CertificationScheme): EvidenceSource {
  const firstStep = scheme.steps[0];
  return {
    id: `sch-${scheme.id}`,
    number: SCHEME_CODES[scheme.id] ?? scheme.name,
    type: "Certification Scheme",
    title: scheme.name,
    location: "Scope, process and fees",
    excerpt: `${scheme.summary} Applies to: ${scheme.applicability}${
      firstStep ? ` First step: ${firstStep.title}.` : ""
    }`,
    docId: scheme.id,
  };
}

function labSource(lab: Laboratory): EvidenceSource {
  return {
    id: `l-${lab.id}`,
    number: `LAB/${lab.id.replace(/^lab-/, "").toUpperCase()}`,
    type: "Laboratory Record",
    title: lab.name,
    location: `${lab.city}, ${lab.state}`,
    excerpt: `${lab.accreditation}. Recognised for ${lab.recognisedFor
      .slice(0, 4)
      .join(", ")}. Test groups: ${lab.testGroups.join(
      ", ",
    )}. Typical turnaround ${lab.turnaroundDays} working days. Contact ${
      lab.contact
    } / ${lab.email}.`,
    docId: lab.id,
  };
}

function centreSource(centre: HallmarkingCentre): EvidenceSource {
  return {
    id: `h-${centre.id}`,
    number: centre.registration,
    type: "Hallmarking Guidance",
    title: centre.name,
    location: `${centre.city}, ${centre.state}`,
    excerpt: `BIS-recognised Assaying and Hallmarking Centre ${centre.registration} at ${centre.city}, ${centre.state}. Hallmarks articles of ${centre.purities.join(
      ", ",
    )} purity and applies the six-digit HUID. Contact ${centre.contact}.`,
    docId: centre.id,
  };
}

/* -------------------------------------------------------------------------- */
/* Context block                                                               */
/* -------------------------------------------------------------------------- */

const CONTEXT_HEADER = [
  "BIS SATHI RETRIEVED CONTEXT",
  "Sources are numbered below. Cite them in your answer as [1], [2], … using exactly these numbers;",
  "the numbering matches the sources array returned to the UI, so a wrong number points the user at the wrong document.",
  "Do not cite a number that does not appear below.",
].join("\n");

const EMPTY_CONTEXT = [
  CONTEXT_HEADER,
  "",
  "No matching source was found in the BIS Sathi corpus for this query.",
  "Do not invent an IS number, clause, Quality Control Order or laboratory.",
  "Say plainly that you could not find a matching standard and ask the user for the product name, its material and its intended use.",
].join("\n");

function contextBlockFor(
  source: EvidenceSource,
  index: number,
): string {
  const lines: string[] = [];
  lines.push(`[SOURCE ${index}] ${source.number} — ${source.title} (${source.type})`);

  if (source.type === "Indian Standard" && source.docId) {
    const standard = standards.find((s) => s.id === source.docId);
    if (standard) {
      const meta = [
        `Sector: ${standard.sector}`,
        `Status: ${standard.status}`,
        standard.schemeId
          ? `Scheme: ${SCHEME_CODES[standard.schemeId] ?? standard.schemeId}`
          : null,
        standard.qcoId ? `QCO: ${getQcoById(standard.qcoId)?.name ?? standard.qcoId}` : null,
        standard.supersededBy ? `Superseded by: ${standard.supersededBy}` : null,
      ]
        .filter((part): part is string => part !== null)
        .join(" | ");
      lines.push(meta);
      lines.push(`Scope: ${clamp(standard.scope, 260)}`);
      lines.push(
        `${source.location}${
          source.page ? ` (p.${source.page})` : ""
        }: ${clamp(source.excerpt, 420)}`,
      );
      lines.push(`Tests: ${clamp(standard.tests.slice(0, 4).join("; "), 220)}`);
      return lines.join("\n");
    }
  }

  if (source.type === "Quality Control Order" && source.docId) {
    const qco = getQcoById(source.docId);
    if (qco) {
      lines.push(
        `Ministry: ${qco.ministry} | Effective from: ${qco.effectiveFrom} | Status: ${qco.status}`,
      );
      lines.push(`${source.location}: ${clamp(source.excerpt, 380)}`);
      lines.push(`Exemptions: ${clamp(qco.exemptions.slice(0, 3).join("; "), 220)}`);
      return lines.join("\n");
    }
  }

  if (source.type === "Certification Scheme" && source.docId) {
    const scheme = getSchemeById(source.docId);
    if (scheme) {
      lines.push(`${source.location}: ${clamp(source.excerpt, 340)}`);
      lines.push(
        `Steps: ${clamp(
          scheme.steps.map((step, i) => `${i + 1}. ${step.title}`).join("; "),
          260,
        )}`,
      );
      lines.push(
        `Fees: ${scheme.fees
          .slice(0, 3)
          .map((fee) => `${fee.label} ${fee.amount}`)
          .join("; ")} | Timeline: ${clamp(scheme.timeline, 140)}`,
      );
      return lines.join("\n");
    }
  }

  lines.push(`${source.location}: ${clamp(source.excerpt, 360)}`);
  return lines.join("\n");
}

function buildContext(sources: EvidenceSource[]): string {
  if (sources.length === 0) return EMPTY_CONTEXT;

  const parts: string[] = [CONTEXT_HEADER, ""];
  let used = CONTEXT_HEADER.length + 2;

  sources.forEach((source, index) => {
    const block = contextBlockFor(source, index + 1);
    if (used + block.length + 2 > MAX_CONTEXT_CHARS) return;
    parts.push(block, "");
    used += block.length + 2;
  });

  return parts.join("\n").trimEnd();
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                  */
/* -------------------------------------------------------------------------- */

function emptyResult(context = EMPTY_CONTEXT): RetrievalResult {
  return {
    sources: [],
    standards: [],
    qcos: [],
    labs: [],
    schemes: [],
    centres: [],
    context,
  };
}

/**
 * Transparent keyword retrieval over the BIS Sathi corpus.
 *
 * Additive scoring, no embeddings, no network. Always returns a valid
 * RetrievalResult — it never throws.
 */
export function retrieve(
  query: string,
  options?: { limit?: number },
): RetrievalResult {
  try {
    const limit = Math.max(1, options?.limit ?? LIMITS.standards);
    const tokens = tokenise(query ?? "");
    const explicitNumbers = explicitStandardNumbers(query ?? "");

    if (tokens.length === 0 && explicitNumbers.length === 0) {
      return emptyResult();
    }

    const labIntent = hasIntent(tokens, LAB_INTENT);
    const hallmarkIntent = hasIntent(tokens, HALLMARK_INTENT);
    const schemeIntent = hasIntent(tokens, SCHEME_INTENT);

    /* ---------------------------------------------------------------- */
    /* Standards                                                        */
    /* ---------------------------------------------------------------- */

    const scoredStandards: Scored<Standard>[] = standards
      .map((standard) => {
        let score = scoreStandard(tokens, standard);
        for (const digits of explicitNumbers) {
          if (matchesExplicitNumber(standard, digits)) {
            score += W.explicitNumber;
          }
        }
        return { item: standard, score };
      })
      .filter((entry) => entry.score > 0)
      .sort(byScoreDesc);

    const topStandards = scoredStandards.slice(0, limit).map((e) => e.item);
    const topScore = scoredStandards[0]?.score ?? 0;

    // Reject out-of-domain / non-BIS queries that have no meaningful match
    if (
      topScore < 4 &&
      !labIntent &&
      !hallmarkIntent &&
      !schemeIntent &&
      explicitNumbers.length === 0
    ) {
      return emptyResult();
    }

    /* ---------------------------------------------------------------- */
    /* QCOs — matched directly, or linked from a top-ranked standard    */
    /* ---------------------------------------------------------------- */

    const qcoScores = new Map<string, number>();
    for (const qco of qcos) {
      const score = scoreQco(tokens, qco);
      if (score > 0) qcoScores.set(qco.id, score);
    }
    // "Connect the dots": the order that governs a matched standard is
    // relevant even when the user never named it.
    scoredStandards.slice(0, limit).forEach((entry, rank) => {
      const qcoId = entry.item.qcoId;
      if (!qcoId) return;
      const linked = entry.score * (rank === 0 ? 0.55 : 0.3);
      qcoScores.set(qcoId, Math.max(qcoScores.get(qcoId) ?? 0, linked));
    });

    const topQcos = Array.from(qcoScores.entries())
      .map(([id, score]) => ({ item: getQcoById(id), score }))
      .filter((entry): entry is Scored<QualityControlOrder> =>
        entry.item !== undefined,
      )
      .sort(byScoreDesc);

    /* ---------------------------------------------------------------- */
    /* Schemes                                                          */
    /* ---------------------------------------------------------------- */

    const schemeScores = new Map<string, number>();
    for (const scheme of schemes) {
      const score = scoreScheme(tokens, scheme) + (schemeIntent ? 5 : 0);
      if (score > 0) schemeScores.set(scheme.id, score);
    }
    if (hallmarkIntent) {
      schemeScores.set(
        "scheme-hallmarking",
        Math.max(schemeScores.get("scheme-hallmarking") ?? 0, 14),
      );
    }
    scoredStandards.slice(0, limit).forEach((entry, rank) => {
      const schemeId = entry.item.schemeId;
      if (!schemeId) return;
      const linked = entry.score * (rank === 0 ? 0.4 : 0.2);
      schemeScores.set(schemeId, Math.max(schemeScores.get(schemeId) ?? 0, linked));
    });

    const topSchemes = Array.from(schemeScores.entries())
      .map(([id, score]) => ({ item: getSchemeById(id), score }))
      .filter((entry): entry is Scored<CertificationScheme> =>
        entry.item !== undefined,
      )
      .sort(byScoreDesc);

    /* ---------------------------------------------------------------- */
    /* Labs                                                             */
    /* ---------------------------------------------------------------- */

    const relevantNumbers = new Set(topStandards.map((s) => s.number));
    const scoredLabs: Scored<Laboratory>[] = labs
      .map((lab) => {
        let score = scoreLab(tokens, lab);
        // A lab that can actually test the matched standard is the useful one.
        const covers = lab.recognisedFor.filter((n) =>
          relevantNumbers.has(n),
        ).length;
        if (covers > 0) score += 6 + covers * 2;
        if (labIntent && score > 0) score += 6;
        else if (labIntent) score += 1;
        return { item: lab, score };
      })
      .filter((entry) => entry.score > 0)
      .sort(byScoreDesc);

    /* ---------------------------------------------------------------- */
    /* Hallmarking centres                                              */
    /* ---------------------------------------------------------------- */

    const scoredCentres: Scored<HallmarkingCentre>[] = hallmarkingCentres
      .map((centre) => {
        let score = scoreCentre(tokens, centre);
        if (hallmarkIntent) score += score > 0 ? 8 : 4;
        return { item: centre, score };
      })
      .filter((entry) => entry.score > 0)
      .sort(byScoreDesc);

    /* ---------------------------------------------------------------- */
    /* Evidence sources — the inspectable list, max 4                   */
    /* ---------------------------------------------------------------- */

    const candidates: Scored<EvidenceSource>[] = [];

    for (const entry of scoredStandards.slice(0, limit)) {
      candidates.push({
        item: standardSource(entry.item, bestClause(tokens, entry.item)),
        score: entry.score,
      });
    }
    for (const entry of topQcos.slice(0, LIMITS.qcos)) {
      candidates.push({ item: qcoSource(entry.item), score: entry.score });
    }
    for (const entry of topSchemes.slice(0, LIMITS.schemes)) {
      candidates.push({ item: schemeSource(entry.item), score: entry.score });
    }
    if (labIntent) {
      for (const entry of scoredLabs.slice(0, LIMITS.labs)) {
        candidates.push({
          item: labSource(entry.item),
          // Labs are supporting evidence; keep them below the governing text.
          score: entry.score + Math.min(topScore * 0.25, 12),
        });
      }
    }
    if (hallmarkIntent) {
      for (const entry of scoredCentres.slice(0, LIMITS.centres)) {
        candidates.push({ item: centreSource(entry.item), score: entry.score });
      }
    }

    const seenSourceIds = new Set<string>();
    const sources: EvidenceSource[] = [];
    for (const entry of candidates.sort(byScoreDesc)) {
      if (sources.length >= LIMITS.sources) break;
      if (seenSourceIds.has(entry.item.id)) continue;
      seenSourceIds.add(entry.item.id);
      sources.push(entry.item);
    }

    const result: RetrievalResult = {
      sources,
      standards: topStandards,
      qcos: topQcos.slice(0, LIMITS.qcos).map((e) => e.item),
      labs: scoredLabs.slice(0, LIMITS.labs).map((e) => e.item),
      schemes: topSchemes.slice(0, LIMITS.schemes).map((e) => e.item),
      centres: scoredCentres.slice(0, LIMITS.centres).map((e) => e.item),
      context: "",
    };
    result.context = buildContext(sources);
    return result;
  } catch {
    return emptyResult();
  }
}

/**
 * Rebuild an evidence source from its stable id, so the UI can re-open a
 * citation from a stored answer. Standards resolve to their first clause.
 */
export function retrieveById(sourceId: string): EvidenceSource | undefined {
  if (!sourceId) return undefined;

  if (sourceId.startsWith("s-")) {
    const standard = standards.find((s) => s.id === sourceId.slice(2));
    if (!standard) return undefined;
    return standardSource(standard, standard.clauses[0]);
  }
  if (sourceId.startsWith("q-")) {
    const qco = getQcoById(sourceId.slice(2));
    return qco ? qcoSource(qco) : undefined;
  }
  if (sourceId.startsWith("sch-")) {
    const scheme = getSchemeById(sourceId.slice(4));
    return scheme ? schemeSource(scheme) : undefined;
  }
  if (sourceId.startsWith("l-")) {
    const lab = labs.find((entry) => entry.id === sourceId.slice(2));
    return lab ? labSource(lab) : undefined;
  }
  if (sourceId.startsWith("h-")) {
    const centre = hallmarkingCentres.find(
      (entry) => entry.id === sourceId.slice(2),
    );
    return centre ? centreSource(centre) : undefined;
  }
  return undefined;
}

/**
 * Plain scored search over the standards corpus for the Standards Explorer.
 * Returns every match (not truncated). An empty query returns the filtered
 * corpus sorted by IS number.
 */
export function searchStandards(
  query: string,
  filters?: { sector?: string; status?: string },
): Standard[] {
  const sector = filters?.sector;
  const status = filters?.status;

  const pool = standards.filter((standard) => {
    if (sector && sector !== "all" && standard.sector !== sector) return false;
    if (status && status !== "all" && standard.status !== status) return false;
    return true;
  });

  const tokens = tokenise(query ?? "");
  const explicitNumbers = explicitStandardNumbers(query ?? "");

  if (tokens.length === 0 && explicitNumbers.length === 0) {
    return [...pool].sort((a, b) => a.number.localeCompare(b.number));
  }

  return pool
    .map((standard) => {
      let score = scoreStandard(tokens, standard);
      // Let a raw "17803" or "1786" find the standard too.
      for (const token of tokens) {
        if (/^\d{3,5}$/.test(token.raw) && matchesExplicitNumber(standard, token.raw)) {
          score += W.explicitNumber;
        }
      }
      for (const digits of explicitNumbers) {
        if (matchesExplicitNumber(standard, digits)) score += W.explicitNumber;
      }
      return { item: standard, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) =>
      b.score === a.score
        ? a.item.number.localeCompare(b.item.number)
        : b.score - a.score,
    )
    .map((entry) => entry.item);
}
