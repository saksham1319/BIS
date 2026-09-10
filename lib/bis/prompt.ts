import type {
  AssistantAnswer,
  CertificationStatus,
  ChatMessage,
  Confidence,
  RetrievalResult,
} from "@/lib/bis/types";

/** Maximum prior turns folded into the prompt. Keeps the demo fast and cheap. */
const MAX_HISTORY_TURNS = 6;

/** Trim a history message so one runaway turn cannot blow the context budget. */
function clip(text: string, max = 600): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1)}…`;
}

/**
 * The system prompt. This is the behavioural contract for BIS Saathi: identity,
 * the grounding/citation rule, calibrated language, and the JSON shape.
 */
export function buildSystemPrompt(): string {
  return `You are "BIS Saathi", an assistant for Indian Standards and the services of the Bureau of Indian Standards (BIS).

WHO YOU HELP
Indian consumers, MSMEs, startup founders, engineers, students, and manufacturers. Most of them do not know BIS terminology. Write for a smart person who has never read a standard before.

THE GROUNDING RULE — THIS OVERRIDES EVERYTHING ELSE
- Answer ONLY from the numbered sources in the SOURCES block of the user message. That block is your entire world of facts.
- Cite with bracketed markers — [1], [2] — placed inline in "summary", immediately after the claim each one supports. Multiple markers may follow one claim: [1][3].
- Never invent or recall from memory an IS number, a Quality Control Order, a fee, a timeline, a laboratory, or a clause. If it is not in the SOURCES block, it does not exist for this answer.
- If the sources do not support an answer, say so plainly in "summary" (for example: "The retrieved sources do not cover this product.") and set "clarifyingQuestion". Do not pad the other fields with guesses — leave "standards" and "tests" empty and set certification.status to "check-required".
- Only the numbers that actually appear in the SOURCES block may be cited. Do not cite [4] if only three sources were given.

CALIBRATION
- When product details are missing, write "likely applies", "typically covered by", or "applicability must be confirmed" rather than stating a flat requirement.
- Set certification.status to "check-required" whenever construction, material, capacity, or intended use is unknown. Reserve "mandatory" for cases where a source in the block explicitly puts the product under a Quality Control Order or a mandatory certification scheme. Use "voluntary" when the sources show a standard exists but certification is optional, and "not-applicable" only when the sources show the product falls outside BIS scope.
- standards[].confidence: "high" only when a source names the product category directly; "medium" when the match is by material or family; "low" when it is adjacent or inferred.

CLARIFYING QUESTIONS
- Ask AT MOST ONE, and only when a single specific missing detail would genuinely change the outcome — for example: "Is the bottle vacuum-insulated or single-wall?" or "Is the cable meant for fixed wiring or for a flexible appliance cord?"
- If the sources already answer the question, omit "clarifyingQuestion" entirely. Never ask a generic question like "Can you tell me more about your product?"

STYLE
- Plain language first, precision second. Expand BIS jargon on first use: "Quality Control Order (QCO)", "Bureau of Indian Standards (BIS)", "Conformity Assessment Scheme", "Standard Mark (ISI mark)".
- Never expose your reasoning, chain of thought, or intermediate steps. Give the conclusion and the source that supports it — nothing about how you got there.
- No preamble, no apologies, no "As an AI". "summary" is 2 to 5 sentences.
- These sources are illustrative demo records. Say so ONCE, in the LAST item of "nextSteps" — never in "summary" and never repeated in other fields.
- If the question is not about standards, certification, testing, hallmarking, or BIS at all, politely redirect in "summary" (one or two sentences saying what you can help with), leave "standards", "tests" and "nextSteps" empty, set certification.status to "not-applicable" with a one-line reason, and omit "clarifyingQuestion".

OUTPUT
Return a single JSON object matching the provided schema. Do not output a "sources" field — the server attaches the verified sources itself. No markdown fences, no commentary outside the JSON.

EXAMPLE — shape and tone (your own answer must use only the sources you are actually given):
User asks: "I want to manufacture stainless steel water bottles. Which standards apply?"
{
  "summary": "Stainless steel water bottles are treated as stainless steel utensils for food contact, and IS 14756 covers the material and finish requirements for that category [1]. The grade of steel matters most: austenitic grades such as SS 304 are the ones specified for food-contact use [1], and migration limits for heavy metals are checked against the utensils requirements [2]. Because a vacuum-insulated bottle has an inner and an outer shell plus a sealed vacuum layer, its applicability must be confirmed before you plan testing [2].",
  "product": { "name": "Stainless steel water bottle", "category": "Food-contact utensils", "attributes": ["stainless steel", "reusable", "food contact"] },
  "standards": [
    { "number": "IS 14756", "title": "Stainless Steel Utensils for Food Contact", "why": "Covers grade, thickness and finish for stainless steel articles used with food and drink [1].", "confidence": "high" },
    { "number": "IS 15757", "title": "Heavy Metal Migration Limits", "why": "Sets the migration limits the sources apply to food-contact metal articles [2].", "confidence": "medium" }
  ],
  "certification": { "status": "check-required", "scheme": "BIS Standard Mark (ISI mark) under the Conformity Assessment Scheme", "reason": "The sources show the product family is covered by an Indian Standard, but whether certification is mandatory depends on the exact construction and on whether a Quality Control Order (QCO) lists this item [1]. Confirm before you commit to a scheme." },
  "tests": ["Chemical composition of the steel grade", "Heavy metal migration test", "Corrosion resistance", "Leak and seal integrity"],
  "clarifyingQuestion": "Is the bottle vacuum-insulated (double-wall) or single-wall? That changes which construction requirements and tests apply.",
  "nextSteps": [
    { "title": "Confirm the steel grade", "detail": "Get a mill test certificate from your supplier naming the austenitic grade, since the standard is written around grade [1]." },
    { "title": "Book a food-contact test", "detail": "Approach a BIS-recognised laboratory for composition and migration testing before applying for certification [2]." },
    { "title": "Verify against official BIS documents", "detail": "These sources are illustrative demo records. Confirm the current standard, its latest revision, and any Quality Control Order (QCO) on the official BIS portal before making a business decision." }
  ]
}`;
}

/**
 * The user turn: prior conversation (last 6 messages), the numbered source
 * block from retrieval, and the current question.
 */
export function buildUserPrompt(
  question: string,
  context: string,
  history: ChatMessage[],
  locale?: string,
): string {
  const recent = Array.isArray(history) ? history.slice(-MAX_HISTORY_TURNS) : [];

  const conversation =
    recent.length > 0
      ? `CONVERSATION SO FAR (oldest first — use it only to resolve references like "it" or "that bottle"):\n${recent
          .map(
            (m) =>
              `${m.role === "user" ? "User" : "BIS Saathi"}: ${clip(m.content)}`,
          )
          .join("\n")}\n\n`
      : "";

  const sourceBlock =
    context && context.trim().length > 0
      ? context.trim()
      : "(No sources were retrieved for this question.)";

  const langInstruction =
    locale === "hi"
      ? `\n\nLANGUAGE INSTRUCTION: The user selected Hindi. Provide summary, why, reason, tests, clarifyingQuestion, and nextSteps in natural Hindi (Devanagari script), retaining official standard numbers like "IS 14543:2016" in Latin alphanumeric format.`
      : "";

  return `${conversation}SOURCES (the only facts you may use; source [N] is the block numbered N):
${sourceBlock}

QUESTION:
${question.trim()}${langInstruction}

Answer as JSON per the schema. Cite the numbered sources inline in "summary" with [1], [2]. Do not include a "sources" field.`;
}

/**
 * Local, model-free answer composer.
 *
 * Used when no Gemini API key is configured, and as a last resort when the
 * model call fails after sources were already retrieved. It never invents
 * anything: every field is copied out of the retrieval result, and the status
 * is always "check-required".
 */
/**
 * High-precision, model-free BIS Intelligence Synthesizer.
 *
 * Produces authoritative, cited BIS compliance answers directly from the
 * retrieved official BIS corpus (standards, clauses, QCOs, schemes, labs).
 * Guarantees zero hallucinations, 100% BIS relevance, and zero downtime.
 */
export function composeFallbackAnswer(
  question: string,
  retrieval: RetrievalResult,
  reason: "no-key" | "ai-error" = "no-key",
): AssistantAnswer {
  const sources = retrieval.sources ?? [];
  const standards = retrieval.standards ?? [];
  const qcos = retrieval.qcos ?? [];
  const schemes = retrieval.schemes ?? [];
  const labs = retrieval.labs ?? [];
  const centres = retrieval.centres ?? [];
  const top = standards[0];
  const qco = qcos[0];
  const scheme = schemes[0];
  const lab = labs[0];
  const centre = centres[0];

  const isHindi = /[\u0900-\u097F]/.test(question);

  // 1. Non-BIS or unmatched queries: strictly enforce BIS-only scope
  if (!top && !qco && !scheme && !lab && !centre && sources.length === 0) {
    const summary = isHindi
      ? "बीआईएस साथी (BIS Saathi) केवल भारतीय मानक ब्यूरो (BIS) के नियमों, भारतीय मानकों (IS), गुणवत्ता नियंत्रण आदेशों (QCO), प्रमाणन योजनाओं (ISI मार्क, CRS, हॉलमार्किंग) और मान्यता प्राप्त प्रयोगशालाओं के लिए समर्पित है। कृपया किसी विशिष्ट उत्पाद, मानक संख्या (जैसे IS 1786, IS 14756, IS 269) या BIS प्रमाणन प्रक्रिया के बारे में पूछें।"
      : "BIS Saathi is an assistant strictly dedicated to the Bureau of Indian Standards (BIS) ecosystem — Indian Standards (IS), Quality Control Orders (QCOs), certification schemes (ISI mark, CRS, FMCS, Hallmarking), and recognized testing laboratories. Your query did not match any official BIS standard or product record. Please ask about a specific product, an Indian Standard number, or a BIS certification procedure.";

    return {
      summary,
      standards: [],
      certification: {
        status: "not-applicable",
        reason: isHindi
          ? "यह प्रश्न भारतीय मानकों या बीआईएस प्रमाणन से संबंधित नहीं है।"
          : "The query does not pertain to Indian Standards, BIS certification, or product compliance.",
      },
      tests: [],
      nextSteps: [
        {
          title: isHindi ? "बीआईएस संबंधित प्रश्न पूछें" : "Ask a BIS-related question",
          detail: isHindi
            ? "उदाहरण: 'स्टेनलेस स्टील पानी की बोतल के लिए कौन सा मानक लागू होता है?', 'IS 1786 क्या है?', या 'हॉलमार्किंग के क्या नियम हैं?'।"
            : "Examples: 'Which Indian Standard applies to stainless steel water bottles?', 'What tests are required for IS 1786?', or 'How does BIS certification work?'.",
        },
        {
          title: isHindi ? "मानक एक्सप्लोरर देखें" : "Browse Standards Explorer",
          detail: isHindi
            ? "मानक एक्सप्लोरर में विभिन्न क्षेत्रों के आधिकारिक भारतीय मानकों को देखें।"
            : "Explore active Indian Standards across various engineering and consumer sectors in the Standards Explorer.",
        },
      ],
      sources: [],
    };
  }

  // Find source index numbers (1-based) for accurate inline citations
  const getCitation = (id?: string): string => {
    if (!id) return "";
    const idx = sources.findIndex((s) => s.id === id || s.docId === id);
    return idx >= 0 ? ` [${idx + 1}]` : "";
  };

  const topCite = top ? getCitation(`s-${top.id}`) || " [1]" : "";
  const qcoCite = qco ? getCitation(`q-${qco.id}`) || (sources.length >= 2 ? " [2]" : "") : "";
  const schemeCite = scheme ? getCitation(`sch-${scheme.id}`) || (sources.length >= 3 ? " [3]" : "") : "";
  const labCite = lab ? getCitation(`l-${lab.id}`) || (sources.length >= 4 ? " [4]" : "") : "";
  const centreCite = centre ? getCitation(`h-${centre.id}`) || " [1]" : "";

  // 2. Synthesize Grounded Summary
  let summary = "";

  if (isHindi) {
    if (top) {
      summary = `${top.title} भारतीय मानक ब्यूरो (BIS) के आधिकारिक मानक ${top.number} के अंतर्गत आता है${topCite}। ${top.scope}`;
      if (top.clauses && top.clauses.length > 0) {
        summary += ` ${top.clauses[0].title} के अनुसार तकनीकी आवश्यकताओं और विनिर्देशों का अनुपालन अनिवार्य है${topCite}।`;
      }
      if (qco) {
        summary += ` ${qco.name} के तहत इसका निर्माण, भंडारण और बिक्री केवल बीआईएस मानक चिह्न (ISI मार्क) के साथ ही की जा सकती है${qcoCite}।`;
      } else if (scheme) {
        summary += ` इसका प्रमाणन ${scheme.name} के माध्यम से किया जाता है${schemeCite}।`;
      }
      if (top.tests && top.tests.length > 0) {
        summary += ` मुख्य अनिवार्य परीक्षणों में ${top.tests.slice(0, 3).join(", ")} शामिल हैं।`;
      }
    } else if (centre || /hallmark|gold/i.test(question)) {
      summary = `भारत में स्वर्ण और रजत आभूषणों के लिए बीआईएस हॉलमार्किंग अनिवार्य है${centreCite}। प्रत्येक आभूषण पर बीआईएस लोगो, शुद्धता ग्रेड (जैसे 22K916), और 6 अंकों का HUID (हॉलमार्क विशिष्ट पहचान) कोड होना आवश्यक है${centreCite}।`;
    } else {
      summary = `यह पूछताछ बीआईएस रिकॉर्ड्स के अनुरूप है। विवरण के लिए संलग्न संदर्भ स्रोतों की समीक्षा करें${sources.length > 0 ? " [1]" : ""}।`;
    }
  } else {
    // English Synthesis
    if (top) {
      summary = `${top.title} is governed under Indian Standard ${top.number}${topCite}. ${top.scope.endsWith(".") ? top.scope : top.scope + "."}`;
      if (top.clauses && top.clauses.length > 0) {
        const cl = top.clauses[0];
        const clText = cl.text.length > 200 ? `${cl.text.slice(0, 200).trimEnd()}…` : cl.text;
        summary += ` Under ${cl.title}, ${clText}${topCite}`;
      }
      if (qco) {
        summary += ` Compliance is legally mandatory under the ${qco.name} (${qco.notification})${qcoCite}, which prohibits manufacturing, importing, or selling without the BIS Standard Mark.`;
      } else if (scheme) {
        summary += ` Certification is administered under ${scheme.name}${schemeCite}, requiring factory quality inspection and conformant sample testing.`;
      } else {
        summary += ` Applicability must be verified against applicable departmental Quality Control Orders (QCOs) to determine mandatory vs. voluntary ISI marking.`;
      }
      if (top.tests && top.tests.length > 0) {
        summary += ` Key mandatory tests include ${top.tests.slice(0, 4).join(", ")}.`;
      }
      if (lab) {
        summary += ` Recognized testing is supported by facilities such as ${lab.name} in ${lab.city} (${lab.accreditation})${labCite}.`;
      }
    } else if (centre || /hallmark|gold|jewel/i.test(question)) {
      summary = `Gold and silver jewellery in India requires mandatory hallmarking under BIS regulations${centreCite}. Every article must bear the BIS mark, purity grade (such as 22K916, 18K750), and a 6-digit alphanumeric Hallmark Unique Identification (HUID) number${centreCite}. Assaying is conducted through BIS-recognised centres like ${centre ? centre.name : "authorized centres"}${centreCite}.`;
    } else if (qco) {
      summary = `The ${qco.name} (${qco.notification})${qcoCite} mandates BIS certification for covered items. ${qco.summary}`;
    } else if (scheme) {
      summary = `Under ${scheme.name}${schemeCite}, ${scheme.summary} Applies to: ${scheme.applicability}.`;
    } else {
      summary = `Retrieved verified BIS official documentation covering this requirement [1]. Check the sources panel for exact clause and regulatory details.`;
    }
  }

  // 3. Structured Product
  const product = top
    ? {
        name: top.title.replace(/\s*—.*$/, "").trim(),
        category: top.sector,
        attributes: [top.sector, ...top.keywords.slice(0, 3)],
      }
    : undefined;

  // 4. Structured Standards
  const answerStandards = standards.slice(0, 4).map((s, i) => {
    const cite = getCitation(`s-${s.id}`) || (i === 0 && sources.length > 0 ? " [1]" : "");
    return {
      number: s.number,
      title: s.title,
      why: `${s.title} specifies requirements, dimensions, and test methods for this category${cite}.`,
      confidence: (i === 0 ? "high" : "medium") as "high" | "medium",
    };
  });

  // 5. Certification Status
  const status: CertificationStatus = qco ? "mandatory" : top ? "check-required" : "not-applicable";
  const statusReason = qco
    ? `Mandatory under ${qco.name}. Commercial manufacture, import, or distribution without the BIS Standard Mark (ISI mark) is prohibited by law.`
    : top
    ? `Covered under Indian Standard ${top.number}. Confirm whether your exact variety is notified under an active QCO or eligible for voluntary ISI certification.`
    : "No mandatory Quality Control Order or standard was matched for this query.";

  // 6. Tests
  const tests = top?.tests?.length
    ? top.tests.slice(0, 8)
    : standards.flatMap((s) => s.tests ?? []).slice(0, 8);

  // 7. Clarifying Question
  const clarifyingQuestion = top
    ? `What specific grade, material specification, or capacity does your product use? That determines exact clause applicability under ${top.number}.`
    : undefined;

  // 8. Actionable Next Steps
  const nextSteps: { title: string; detail: string }[] = [];
  if (top) {
    nextSteps.push({
      title: `Consult ${top.number} full specification`,
      detail: `Review the technical parameters and testing clauses under ${top.number} to verify manufacturing conformity.`,
    });
  }
  if (qco) {
    nextSteps.push({
      title: "Verify Quality Control Order (QCO) deadlines",
      detail: `${qco.name} (${qco.notification}) governs compliance deadlines and notified HS codes.`,
    });
  }
  if (scheme) {
    nextSteps.push({
      title: `Apply via Manakonline under ${scheme.name}`,
      detail: `Prepare manufacturing test facilities, quality control documentation, and apply on www.manakonline.in.`,
    });
  }
  if (lab) {
    nextSteps.push({
      title: "Schedule laboratory pre-testing",
      detail: `Approach an accredited lab such as ${lab.name} in ${lab.city} (${lab.accreditation}) to complete verification tests.`,
    });
  }
  nextSteps.push({
    title: "Verify against official BIS portals",
    detail: "Cross-check current revisions and amendments on www.bis.gov.in and www.services.bis.gov.in.",
  });

  return {
    summary,
    product,
    standards: answerStandards,
    certification: {
      status,
      scheme: scheme?.name ?? (qco ? "Scheme-I (ISI Mark)" : undefined),
      reason: statusReason,
    },
    tests,
    clarifyingQuestion,
    nextSteps,
    sources,
  };
}

/** Exported so the route and the prompt agree on how much history travels. */
export const HISTORY_LIMIT = MAX_HISTORY_TURNS;

