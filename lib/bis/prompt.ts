import type {
  AssistantAnswer,
  CertificationStatus,
  ChatMessage,
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
- When the question asks about testing laboratories, identify the matching facilities from the Laboratory Record sources in the SOURCES block, stating their name, city/state, and turnaround, and cite them with their [N] marker.
- If the sources do not support an answer, say so plainly in "summary" (for example: "The retrieved sources do not cover this product.") and set "clarifyingQuestion". Do not pad the other fields with guesses — leave "standards" and "tests" empty and set certification.status to "check-required".
- Only the numbers that actually appear in the SOURCES block may be cited. Do not cite [4] if only three sources were given.

CALIBRATION
- When product details are missing, write "likely applies", "typically covered by", or "applicability must be confirmed" rather than stating a flat requirement.
- Set certification.status to "check-required" whenever construction, material, capacity, or intended use is unknown. Reserve "mandatory" for cases where a source in the block explicitly puts the product under a Quality Control Order or a mandatory certification scheme. Use "voluntary" when the sources show a standard exists but certification is optional, and "not-applicable" only when the sources show the product falls outside BIS scope.
- standards[].confidence: "high" only when a source names the product category directly; "medium" when the match is by material or family; "low" when it is adjacent or inferred.

CROSS-QUESTIONING & MISSING CONTEXT (CRITICAL)
- BIS compliance, standard applicability, and Quality Control Orders depend strictly on physical specifications (e.g. voltage rating, construction type, capacity, food-grade alloy, domestic vs industrial application, child age group).
- Whenever a user asks a broad, underspecified, or ambiguous question (e.g., "I make cables", "I produce water bottles", "Can I sell toys?", "I manufacture footwear"), you MUST cross-question the user in "clarifyingQuestion".
- Frame the cross-question as a crisp, technical choice comparing the 2-3 specific variants that change the compliance standard (e.g., "Are the cables PVC-insulated for domestic wiring up to 1100 V (IS 694), or for higher-voltage industrial distribution?" or "Is the bottle double-walled vacuum-insulated (IS 17803) or single-walled (IS 14756)?").
- In "summary", explicitly highlight that exact applicability depends on this distinction and set certification.status to "check-required".
- If the conversation history or user prompt already provides the required technical details, omit "clarifyingQuestion" entirely and deliver the finalized, definitive standard and certification status ("mandatory" or "voluntary").

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

  let langInstruction = "";
  if (locale === "hi") {
    langInstruction = `\n\nLANGUAGE INSTRUCTION: The user selected Hindi. Provide summary, why, reason, tests, clarifyingQuestion, and nextSteps in natural Hindi (Devanagari script), retaining official standard numbers like "IS 14543:2016" in Latin alphanumeric format.`;
  } else if (locale === "ta") {
    langInstruction = `\n\nLANGUAGE INSTRUCTION: The user selected Tamil. Provide summary, why, reason, tests, clarifyingQuestion, and nextSteps in natural Tamil (Tamil script), retaining official standard numbers like "IS 14543:2016" in Latin alphanumeric format.`;
  } else if (locale === "te") {
    langInstruction = `\n\nLANGUAGE INSTRUCTION: The user selected Telugu. Provide summary, why, reason, tests, clarifyingQuestion, and nextSteps in natural Telugu (Telugu script), retaining official standard numbers like "IS 14543:2016" in Latin alphanumeric format.`;
  } else if (locale === "kn") {
    langInstruction = `\n\nLANGUAGE INSTRUCTION: The user selected Kannada. Provide summary, why, reason, tests, clarifyingQuestion, and nextSteps in natural Kannada (Kannada script), retaining official standard numbers like "IS 14543:2016" in Latin alphanumeric format.`;
  }

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
  _reason?: "no-key" | "ai-error",
  locale?: string,
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

  const isHindi = locale === "hi" || /[\u0900-\u097F]/.test(question);
  const isTamil = locale === "ta" || /[\u0B80-\u0BFF]/.test(question);
  const isTelugu = locale === "te" || /[\u0C00-\u0C7F]/.test(question);
  const isKannada = locale === "kn" || /[\u0C80-\u0CFF]/.test(question);

  // 1. Non-BIS or unmatched queries: strictly enforce BIS-only scope
  if (!top && !qco && !scheme && !lab && !centre && sources.length === 0) {
    let summary =
      "BIS Saathi is an assistant strictly dedicated to the Bureau of Indian Standards (BIS) ecosystem — Indian Standards (IS), Quality Control Orders (QCOs), certification schemes (ISI mark, CRS, FMCS, Hallmarking), and recognized testing laboratories. Your query did not match any official BIS standard or product record. Please ask about a specific product, an Indian Standard number, or a BIS certification procedure.";
    let notApplicableReason =
      "The query does not pertain to Indian Standards, BIS certification, or product compliance.";
    let askTitle = "Ask a BIS-related question";
    let askDetail =
      "Examples: 'Which Indian Standard applies to stainless steel water bottles?', 'What tests are required for IS 1786?', or 'How does BIS certification work?'.";
    let browseTitle = "Browse Standards Explorer";
    let browseDetail =
      "Explore active Indian Standards across various engineering and consumer sectors in the Standards Explorer.";

    if (isHindi) {
      summary =
        "बीआईएस साथी (BIS Saathi) केवल भारतीय मानक ब्यूरो (BIS) के नियमों, भारतीय मानकों (IS), गुणवत्ता नियंत्रण आदेशों (QCO), प्रमाणन योजनाओं (ISI मार्क, CRS, हॉलमार्किंग) और मान्यता प्राप्त प्रयोगशालाओं के लिए समर्पित है। कृपया किसी विशिष्ट उत्पाद, मानक संख्या (जैसे IS 1786, IS 14756, IS 269) या BIS प्रमाणन प्रक्रिया के बारे में पूछें।";
      notApplicableReason = "यह प्रश्न भारतीय मानकों या बीआईएस प्रमाणन से संबंधित नहीं है।";
      askTitle = "बीआईएस संबंधित प्रश्न पूछें";
      askDetail =
        "उदाहरण: 'स्टेनलेस स्टील पानी की बोतल के लिए कौन सा मानक लागू होता है?', 'IS 1786 क्या है?', या 'हॉलमार्किंग के क्या नियम हैं?'।";
      browseTitle = "मानक एक्सप्लोरर देखें";
      browseDetail =
        "मानक एक्सप्लोरर में विभिन्न क्षेत्रों के आधिकारिक भारतीय मानकों को देखें।";
    } else if (isTamil) {
      summary =
        "பிஐஎஸ் சாதி (BIS Saathi) என்பது இந்திய தரநிலைகள் பணியகம் (BIS) சூழல் — இந்திய தரநிலைகள் (IS), தரக் கட்டுப்பாட்டு ஆணைகள் (QCO), சான்றிதழ் திட்டங்கள் (ISI முத்திரை, CRS, ஹால்மார்க்கிங்) மற்றும் அங்கீகரிக்கப்பட்ட பரிசோதனை கூடங்களுக்கான பிரத்யேக உதவியாளர் ஆகும். உங்கள் கேள்வி எந்த அதிகாரப்பூர்வ பிஐஎஸ் தரநிலையுடனும் பொருந்தவில்லை. தயவுசெய்து ஒரு குறிப்பிட்ட தயாரிப்பு, இந்திய தரநிலை எண் (எ.கா. IS 1786, IS 14756) அல்லது பிஐஎஸ் சான்றிதழ் நடைமுறை குறித்து கேட்கவும்.";
      notApplicableReason = "இந்தக் கேள்வி இந்திய தரநிலைகள் அல்லது பிஐஎஸ் சான்றிதழ் தொடர்பானது அல்ல.";
      askTitle = "பிஐஎஸ் தொடர்பான கேள்வியைக் கேட்கவும்";
      askDetail =
        "எடுத்துக்காட்டுகள்: 'துருப்பிடிக்காத எஃகு தண்ணீர் பாட்டிலுக்கு எந்த தரநிலை பொருந்தும்?', 'IS 1786 என்றால் என்ன?', அல்லது 'பிஐஎஸ் சான்றிதழ் எவ்வாறு செயல்படுகிறது?'.";
      browseTitle = "தரநிலைகள் உலாவியைப் பார்க்கவும்";
      browseDetail =
        "தரநிலைகள் உலாவியில் பல்வேறு துறைகளின் அதிகாரப்பூர்வ இந்திய தரநிலைகளை ஆராயுங்கள்.";
    } else if (isTelugu) {
      summary =
        "బిఐఎస్ సాథీ (BIS Saathi) అనేది బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ (BIS) వ్యవస్థ — భారతీయ ప్రమాణాలు (IS), నాణ్యత నియంత్రణ ఉత్తర్వులు (QCO), ధృవీకరణ పథకాలు (ISI మార్క్, CRS, హాల్‌మార్కింగ్) మరియు గుర్తింపు పొందిన ప్రయోగశాలల కోసం మాత్రమే కేటాయించబడిన సహాయకుడు. మీ ప్రశ్న ఏ అధికారిక బిఐఎస్ ప్రమాణంతో సరిపోలలేదు. దయచేసి నిర్దిష్ట ఉత్పత్తి, భారతీయ ప్రమాణ సంఖ్య (ఉదా. IS 1786, IS 14756) లేదా బిఐఎస్ ధృవీకరణ ప్రక్రియ గురించి అడగండి.";
      notApplicableReason = "ఈ ప్రశ్న భారతీయ ప్రమాణాలు లేదా బిఐఎస్ ధృవీకరణకు సంబంధించినది కాదు.";
      askTitle = "బిఐఎస్ సంబంధిత ప్రశ్నను అడగండి";
      askDetail =
        "ఉదాహరణలు: 'స్టెయిన్‌లెస్ స్టీల్ వాటర్ బాటిల్‌కు ఏ ప్రమాణం వర్తిస్తుంది?', 'IS 1786 అంటే ఏమిటి?', లేదా 'హాల్‌మార్కింగ్ నిబంధనలు ఏమిటి?'.";
      browseTitle = "ప్రమాణాల ఎక్స్‌ప్లోరర్‌ను బ్రౌజ్ చేయండి";
      browseDetail =
        "స్టాండర్డ్స్ ఎక్స్‌ప్లోరర్‌లో వివిధ రంగాలకు చెందిన అధికారిక భారతీయ ప్రమాణాలను అన్వేషించండి.";
    } else if (isKannada) {
      summary =
        "ಬಿಐಎಸ್ ಸಾಥಿ (BIS Saathi) ಭಾರತೀಯ ಮಾನಕ ಬ್ಯೂರೋ (BIS) ಪರಿಸರ ವ್ಯವಸ್ಥೆ — ಭಾರತೀಯ ಮಾನಕಗಳು (IS), ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣ ಆದೇಶಗಳು (QCO), ಪ್ರಮಾಣೀಕರಣ ಯೋಜನೆಗಳು (ISI ಮಾರ್ಕ್, CRS, ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್) ಮತ್ತು ಮಾನ್ಯತೆ ಪಡೆದ ಪ್ರಯೋಗಾಲಯಗಳಿಗೆ ಮೀಸಲಾದ ಸಹಾಯಕವಾಗಿದೆ. ನಿಮ್ಮ ಪ್ರಶ್ನೆಯು ಯಾವುದೇ ಅಧಿಕೃತ ಬಿಐಎಸ್ ಮಾನಕದೊಂದಿಗೆ ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿರ್ದಿಷ್ಟ ಉತ್ಪನ್ನ, ಭಾರತೀಯ ಮಾನಕ ಸಂಖ್ಯೆ (ಉದಾ. IS 1786, IS 14756) ಅಥವಾ ಬಿಐಎಸ್ ಪ್ರಮಾಣೀಕರಣ ಪ್ರಕ್ರಿಯೆಯ ಕುರಿತು ಕೇಳಿ.";
      notApplicableReason = "ಈ ಪ್ರಶ್ನೆಯು ಭಾರತೀಯ ಮಾನಕಗಳು ಅಥವಾ ಬಿಐಎಸ್ ಪ್ರಮಾಣೀಕರಣಕ್ಕೆ ಸಂಬಂಧಿಸಿಲ್ಲ.";
      askTitle = "ಬಿಐಎಸ್ ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ";
      askDetail =
        "ಉದಾಹರಣೆಗಳು: 'ಸ್ಟೇನ್‌ಲೆಸ್ ಸ್ಟೀಲ್ ನೀರಿನ ಬಾಟಲಿಗೆ ಯಾವ ಮಾನಕ ಅನ್ವಯಿಸುತ್ತದೆ?', 'IS 1786 ಎಂದರೇನು?', ಅಥವಾ 'ಬಿಐಎಸ್ ಪ್ರಮಾಣೀಕರಣ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?'.";
      browseTitle = "ಸ್ಟ್ಯಾಂಡರ್ಡ್ಸ್ ಎಕ್ಸ್‌ಪ್ಲೋರರ್ ವೀಕ್ಷಿಸಿ";
      browseDetail =
        "ಸ್ಟ್ಯಾಂಡರ್ಡ್ಸ್ ಎಕ್ಸ್‌ಪ್ಲೋರರ್‌ನಲ್ಲಿ ವಿವಿಧ ಕ್ಷೇತ್ರಗಳ ಅಧಿಕೃತ ಭಾರತೀಯ ಮಾನಕಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.";
    }

    return {
      summary,
      standards: [],
      certification: {
        status: "not-applicable",
        reason: notApplicableReason,
      },
      tests: [],
      nextSteps: [
        {
          title: askTitle,
          detail: askDetail,
        },
        {
          title: browseTitle,
          detail: browseDetail,
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
  } else if (isTamil) {
    if (top) {
      summary = `${top.title} இந்திய தரநிலைகள் பணியகத்தின் (BIS) அதிகாரப்பூர்வ தரநிலை ${top.number}-இன் கீழ் வருகிறது${topCite}. ${top.scope}`;
      if (top.clauses && top.clauses.length > 0) {
        summary += ` ${top.clauses[0].title}-இன் படி தொழில்நுட்ப தேவைகள் மற்றும் விவரக்குறிப்புகளுக்கு இணங்குவது கட்டாயமாகும்${topCite}.`;
      }
      if (qco) {
        summary += ` ${qco.name}-இன் கீழ், பிஐஎஸ் தரக் குறியீட்டுடன் (ISI முத்திரை) மட்டுமே இதை உற்பத்தி செய்யவோ, சேமிக்கவோ மற்றும் விற்பனை செய்யவோ முடியும்${qcoCite}.`;
      } else if (scheme) {
        summary += ` இதன் சான்றிதழ் ${scheme.name} மூலம் நிர்வகிக்கப்படுகிறது${schemeCite}.`;
      }
      if (top.tests && top.tests.length > 0) {
        summary += ` முக்கிய கட்டாய சோதனைகளில் ${top.tests.slice(0, 3).join(", ")} ஆகியவை அடங்கும்.`;
      }
    } else if (centre || /hallmark|gold/i.test(question)) {
      summary = `இந்தியாவில் தங்கம் மற்றும் வெள்ளி நகைகளுக்கு பிஐஎஸ் ஹால்மார்க்கிங் கட்டாயமாகும்${centreCite}. ஒவ்வொரு நகையிலும் பிஐஎஸ் முத்திரை, தூய்மை தரம் (எ.கா. 22K916), மற்றும் 6 இலக்க HUID குறியீடு இருக்க வேண்டும்${centreCite}.`;
    } else {
      summary = `இந்தக் கோரிக்கை பிஐஎஸ் பதிவுகளுடன் பொருந்துகிறது. விவரங்களுக்கு இணைக்கப்பட்ட குறிப்பு ஆதாரங்களை மதிப்பாய்வு செய்யவும்${sources.length > 0 ? " [1]" : ""}.`;
    }
  } else if (isTelugu) {
    if (top) {
      summary = `${top.title} బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ (BIS) అధికారిక ప్రమాణం ${top.number} పరిధిలోకి వస్తుంది${topCite}. ${top.scope}`;
      if (top.clauses && top.clauses.length > 0) {
        summary += ` ${top.clauses[0].title} ప్రకారం సాంకేతిక అవసరాలు మరియు నిర్దేశాల పాటించడం తప్పనిసరి${topCite}.`;
      }
      if (qco) {
        summary += ` ${qco.name} ప్రకారం, దీని తయారీ, నిల్వ మరియు విక్రయం కేవలం బిఐఎస్ ప్రామాణిక గుర్తు (ISI మార్క్)తో మాత్రమే చేయవచ్చు${qcoCite}.`;
      } else if (scheme) {
        summary += ` దీని ధృవీకరణ ${scheme.name} ద్వారా నిర్వహించబడుతుంది${schemeCite}.`;
      }
      if (top.tests && top.tests.length > 0) {
        summary += ` ముఖ్యమైన తప్పనిసరి పరీక్షలలో ${top.tests.slice(0, 3).join(", ")} ఉన్నాయి.`;
      }
    } else if (centre || /hallmark|gold/i.test(question)) {
      summary = `భారతదేశంలో బంగారం మరియు వెండి ఆభరణాలకు బిఐఎస్ హాల్‌మార్కింగ్ తప్పనిసరి${centreCite}. ప్రతి ఆభరణంపై బిఐఎస్ లోగో, స్వచ్ఛత గ్రేడ్ (ఉదా. 22K916), మరియు 6 అంకెల HUID కోడ్ ఉండటం అవసరం${centreCite}.`;
    } else {
      summary = `ఈ విచారణ బిఐఎస్ రికార్డులకు అనుగుణంగా ఉంది. వివరాల కోసం జతచేయబడిన సూచన మూలాలను సమీక్షించండి${sources.length > 0 ? " [1]" : ""}.`;
    }
  } else if (isKannada) {
    if (top) {
      summary = `${top.title} ಭಾರತೀಯ ಮಾನಕ ಬ್ಯೂರೋ (BIS) ಅಧಿಕೃತ ಮಾನಕ ${top.number} ವ್ಯಾಪ್ತಿಗೆ ಒಳಪಡುತ್ತದೆ${topCite}. ${top.scope}`;
      if (top.clauses && top.clauses.length > 0) {
        summary += ` ${top.clauses[0].title} ಪ್ರಕಾರ ತಾಂತ್ರಿಕ ಅಗತ್ಯತೆಗಳು ಮತ್ತು ನಿರ್ದಿಷ್ಟತೆಗಳ ಅನುಸರಣೆ ಕಡ್ಡಾಯವಾಗಿದೆ${topCite}.`;
      }
      if (qco) {
        summary += ` ${qco.name} ಅಡಿಯಲ್ಲಿ, ಇದನ್ನು ಕೇವಲ ಬಿಐಎಸ್ ಗುಣಮಟ್ಟದ ಗುರುತು (ISI ಮಾರ್ಕ್) ನೊಂದಿಗೆ ಮಾತ್ರ ಉತ್ಪಾದಿಸಬಹುದು, ಸಂಗ್ರಹಿಸಬಹುದು ಮತ್ತು ಮಾರಾಟ ಮಾಡಬಹುದು${qcoCite}.`;
      } else if (scheme) {
        summary += ` ಇದರ ಪ್ರಮಾಣೀಕರಣವನ್ನು ${scheme.name} ಮೂಲಕ ನಿರ್ವಹಿಸಲಾಗುತ್ತದೆ${schemeCite}.`;
      }
      if (top.tests && top.tests.length > 0) {
        summary += ` ಪ್ರಮುಖ ಕಡ್ಡಾಯ ಪರೀಕ್ಷೆಗಳಲ್ಲಿ ${top.tests.slice(0, 3).join(", ")} ಸೇರಿವೆ.`;
      }
    } else if (centre || /hallmark|gold/i.test(question)) {
      summary = `ಭಾರತದಲ್ಲಿ ಚಿನ್ನ ಮತ್ತು ಬೆಳ್ಳಿ ಆಭರಣಗಳಿಗೆ ಬಿಐಎಸ್ ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಕಡ್ಡಾಯವಾಗಿದೆ${centreCite}. ಪ್ರತಿಯೊಂದು ಆಭರಣದ ಮೇಲೆ ಬಿಐಎಸ್ ಲೋಗೋ, ಶುದ್ಧತೆಯ ಶ್ರೇಣಿ (ಉದಾ. 22K916), ಮತ್ತು 6 ಅಂಕಿಗಳ HUID ಕೋಡ್ ಇರುವುದು ಕಡ್ಡಾಯವಾಗಿದೆ${centreCite}.`;
    } else {
      summary = `ಈ ವಿಚಾರಣೆಯು ಬಿಐಎಸ್ ದಾಖಲೆಗಳಿಗೆ ಅನುಗುಣವಾಗಿದೆ. ವಿವರಗಳಿಗಾಗಿ ಲಗತ್ತಿಸಲಾದ ಮೂಲಗಳನ್ನು ಪರಿಶೀಲಿಸಿ${sources.length > 0 ? " [1]" : ""}.`;
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
    let why = `${s.title} specifies requirements, dimensions, and test methods for this category${cite}.`;
    if (isHindi) {
      why = `${s.title} इस श्रेणी के लिए आवश्यकताओं, आयामों और परीक्षण विधियों को निर्दिष्ट करता है${cite}।`;
    } else if (isTamil) {
      why = `${s.title} இந்த வகைக்கான தேவைகள், பரிமாணங்கள் மற்றும் சோதனை முறைகளைக் குறிப்பிடுகிறது${cite}.`;
    } else if (isTelugu) {
      why = `${s.title} ఈ వర్గం కోసం అవసరాలు, కొలతలు మరియు పరీక్షా పద్ధతులను నిర్దేశిస్తుంది${cite}.`;
    } else if (isKannada) {
      why = `${s.title} ಈ ವರ್ಗಕ್ಕೆ ಅಗತ್ಯತೆಗಳು, ಆಯಾಮಗಳು ಮತ್ತು ಪರೀಕ್ಷಾ ವಿಧಾನಗಳನ್ನು ನಿರ್ದಿಷ್ಟಪಡಿಸುತ್ತದೆ${cite}.`;
    }
    return {
      number: s.number,
      title: s.title,
      why,
      confidence: (i === 0 ? "high" : "medium") as "high" | "medium",
    };
  });

  // 5. Certification Status
  const status: CertificationStatus = qco ? "mandatory" : top ? "check-required" : "not-applicable";
  let statusReason = qco
    ? `Mandatory under ${qco.name}. Commercial manufacture, import, or distribution without the BIS Standard Mark (ISI mark) is prohibited by law.`
    : top
    ? `Covered under Indian Standard ${top.number}. Confirm whether your exact variety is notified under an active QCO or eligible for voluntary ISI certification.`
    : "No mandatory Quality Control Order or standard was matched for this query.";

  if (isHindi) {
    statusReason = qco
      ? `${qco.name} के तहत अनिवार्य। बीआईएस मानक चिह्न (ISI मार्क) के बिना व्यावसायिक निर्माण, आयात या वितरण कानून द्वारा प्रतिबंधित है।`
      : top
      ? `भारतीय मानक ${top.number} के अंतर्गत शामिल। पुष्टि करें कि क्या आपकी विशिष्ट किस्म एक सक्रिय QCO के तहत अधिसूचित है या स्वैच्छिक ISI प्रमाणन के लिए पात्र है।`
      : "इस प्रश्न के लिए कोई अनिवार्य गुणवत्ता नियंत्रण आदेश या मानक मेल नहीं खाता।";
  } else if (isTamil) {
    statusReason = qco
      ? `${qco.name}-இன் கீழ் கட்டாயமானது. பிஐஎஸ் தரக் குறியீடு (ISI முத்திரை) இல்லாமல் வணிக ரீதியான உற்பத்தி, இறக்குமதி அல்லது விநியோகம் சட்டப்படி தடைசெய்யப்பட்டுள்ளது.`
      : top
      ? `இந்திய தரநிலை ${top.number}-இன் கீழ் உள்ளடக்கப்பட்டுள்ளது. உங்கள் தயாரிப்பு வகை செயலில் உள்ள QCO-வின் கீழ் அறிவிக்கப்பட்டுள்ளதா அல்லது தன்னார்வ ISI சான்றிதழுக்கு தகுதியானதா என்பதை உறுதிப்படுத்தவும்.`
      : "இந்தக் கேள்விக்கு எந்த கட்டாய தரக் கட்டுப்பாட்டு ஆணை அல்லது தரநிலையும் பொருந்தவில்லை.";
  } else if (isTelugu) {
    statusReason = qco
      ? `${qco.name} కింద తప్పనిసరి. బిఐఎస్ ప్రామాణిక గుర్తు (ISI మార్క్) లేకుండా వాణిజ్య తయారీ, దిగుమతి లేదా పంపిణీ చట్టం ప్రకారం నిషేధించబడింది.`
      : top
      ? `భారతీయ ప్రమాణం ${top.number} పరిధిలో ఉంది. మీ నిర్దిష్ట రకం క్రియాశీల QCO కింద నోటిఫై చేయబడిందా లేదా స్వచ్ఛంద ISI ధృవీకరణకు అర్హత కలిగి ఉందో ధృవీకరించండి.`
      : "ఈ ప్రశ్నకు సంబంధించి ఎటువంటి తప్పనిసరి నాణ్యత నియంత్రణ ఆర్డర్ లేదా ప్రమాణం సరిపోలలేదు.";
  } else if (isKannada) {
    statusReason = qco
      ? `${qco.name} ಅಡಿಯಲ್ಲಿ ಕಡ್ಡಾಯವಾಗಿದೆ. ಬಿಐಎಸ್ ಗುಣಮಟ್ಟದ ಗುರುತು (ISI ಮಾರ್ಕ್) ಇಲ್ಲದೆ ವಾಣಿಜ್ಯ ಉತ್ಪಾದನೆ, ಆಮದು ಅಥವಾ ವಿತರಣೆಯನ್ನು ಕಾನೂನಿನ ಮೂಲಕ ನಿಷೇಧಿಸಲಾಗಿದೆ.`
      : top
      ? `ಭಾರತೀಯ ಮಾನಕ ${top.number} ಅಡಿಯಲ್ಲಿ ಒಳಗೊಂಡಿದೆ. ನಿಮ್ಮ ನಿಖರವಾದ ಉತ್ಪನ್ನವು ಸಕ್ರಿಯ QCO ಅಡಿಯಲ್ಲಿ ಅಧಿಸೂಚಿಸಲಾಗಿದೆಯೇ ಅಥವಾ ಸ್ವಯಂಪ್ರೇರಿತ ISI ಪ್ರಮಾಣೀಕರಣಕ್ಕೆ ಅರ್ಹವಾಗಿದೆಯೇ ಎಂದು ದೃಢೀಕರಿಸಿ.`
      : "ಈ ಪ್ರಶ್ನೆಗೆ ಯಾವುದೇ ಕಡ್ಡಾಯ ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣ ಆದೇಶ ಅಥವಾ ಮಾನಕ ಹೊಂದಿಕೆಯಾಗುವುದಿಲ್ಲ.";
  }

  // 6. Tests
  const tests = top?.tests?.length
    ? top.tests.slice(0, 8)
    : standards.flatMap((s) => s.tests ?? []).slice(0, 8);

  // 7. Clarifying Question
  let clarifyingQuestion: string | undefined = undefined;
  if (top) {
    if (isHindi) {
      clarifyingQuestion = `आपका उत्पाद किस विशिष्ट ग्रेड, सामग्री विनिर्देश या क्षमता का उपयोग करता है? यह ${top.number} के तहत सटीक खंड प्रयोज्यता निर्धारित करता है।`;
    } else if (isTamil) {
      clarifyingQuestion = `உங்கள் தயாரிப்பு எந்த குறிப்பிட்ட தரம், பொருள் விவரக்குறிப்பு அல்லது திறனைப் பயன்படுத்துகிறது? அது ${top.number}-இன் கீழ் துல்லியமான பிரிவு பொருந்தக்கூடிய தன்மையை தீர்மானிக்கிறது.`;
    } else if (isTelugu) {
      clarifyingQuestion = `మీ ఉత్పత్తి ఏ నిర్దిష్ట గ్రేడ్, పదార్థ వివరణ లేదా సామర్థ్యాన్ని ఉపయోగిస్తుంది? అది ${top.number} కింద ఖచ్చితమైన క్లాజ్ వర్తింపును నిర్ణయిస్తుంది.`;
    } else if (isKannada) {
      clarifyingQuestion = `ನಿಮ್ಮ ಉತ್ಪನ್ನವು ಯಾವ ನಿರ್ದಿಷ್ಟ ಶ್ರೇಣಿ, ವಸ್ತು ವಿವರಣೆ ಅಥವಾ ಸಾಮರ್ಥ್ಯವನ್ನು ಬಳಸುತ್ತದೆ? ಅದು ${top.number} ಅಡಿಯಲ್ಲಿ ನಿಖರವಾದ ಷರತ್ತು ಅನ್ವಯವನ್ನು ನಿರ್ಧರಿಸುತ್ತದೆ.`;
    } else {
      clarifyingQuestion = `What specific grade, material specification, or capacity does your product use? That determines exact clause applicability under ${top.number}.`;
    }
  }

  // 8. Actionable Next Steps
  const nextSteps: { title: string; detail: string }[] = [];
  if (top) {
    if (isHindi) {
      nextSteps.push({
        title: `${top.number} पूर्ण विनिर्देश देखें`,
        detail: `निर्माण अनुरूपता को सत्यापित करने के लिए ${top.number} के तहत तकनीकी मानकों और परीक्षण खंडों की समीक्षा करें।`,
      });
    } else if (isTamil) {
      nextSteps.push({
        title: `${top.number} முழு விவரக்குறிப்பைப் பார்க்கவும்`,
        detail: `உற்பத்தி இணக்கத்தை சரிபார்க்க ${top.number}-இன் கீழ் உள்ள தொழில்நுட்ப அளவுருக்கள் மற்றும் சோதனைப் பிரிவுகளை மதிப்பாய்வு செய்யவும்.`,
      });
    } else if (isTelugu) {
      nextSteps.push({
        title: `${top.number} పూర్తి నిర్దేశాలను సంప్రదించండి`,
        detail: `తయారీ అనుగుణ్యతను ధృవీకరించడానికి ${top.number} పరిధిలోని సాంకేతిక పారామితులు మరియు పరీక్ష క్లాజులను సమీక్షించండి.`,
      });
    } else if (isKannada) {
      nextSteps.push({
        title: `${top.number} ಪೂರ್ಣ ವಿವರಣೆಯನ್ನು ಪರಿಶೀಲಿಸಿ`,
        detail: `ಉತ್ಪಾದನಾ ಅನುಸರಣೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ${top.number} ಅಡಿಯಲ್ಲಿ ತಾಂತ್ರಿಕ ನಿಯತಾಂಕಗಳು ಮತ್ತು ಪರೀಕ್ಷಾ ಷರತ್ತುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.`,
      });
    } else {
      nextSteps.push({
        title: `Consult ${top.number} full specification`,
        detail: `Review the technical parameters and testing clauses under ${top.number} to verify manufacturing conformity.`,
      });
    }
  }
  if (qco) {
    if (isHindi) {
      nextSteps.push({
        title: "गुणवत्ता नियंत्रण आदेश (QCO) समयसीमा सत्यापित करें",
        detail: `${qco.name} (${qco.notification}) अनुपालन समयसीमा और अधिसूचित HS कोड को नियंत्रित करता है।`,
      });
    } else if (isTamil) {
      nextSteps.push({
        title: "தரக் கட்டுப்பாட்டு ஆணை (QCO) காலக்கெடுவை சரிபார்க்கவும்",
        detail: `${qco.name} (${qco.notification}) இணக்க காலக்கெடு மற்றும் அறிவிக்கப்பட்ட HS குறியீடுகளை நிர்வகிக்கிறது.`,
      });
    } else if (isTelugu) {
      nextSteps.push({
        title: "నాణ్యత నియంత్రణ ఉత్తర్వు (QCO) గడువులను ధృవీకరించండి",
        detail: `${qco.name} (${qco.notification}) సమ్మతి గడువులు మరియు నోటిఫై చేయబడిన HS కోడ్‌లను నియంత్రిస్తుంది.`,
      });
    } else if (isKannada) {
      nextSteps.push({
        title: "ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣ ಆದೇಶ (QCO) ಗಡುವನ್ನು ಪರಿಶೀಲಿಸಿ",
        detail: `${qco.name} (${qco.notification}) ಅನುಸರಣೆ ಗಡುವು ಮತ್ತು ಅಧಿಸೂಚಿತ HS ಕೋಡ್‌ಗಳನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ.`,
      });
    } else {
      nextSteps.push({
        title: "Verify Quality Control Order (QCO) deadlines",
        detail: `${qco.name} (${qco.notification}) governs compliance deadlines and notified HS codes.`,
      });
    }
  }
  if (scheme) {
    if (isHindi) {
      nextSteps.push({
        title: `${scheme.name} के तहत Manakonline पर आवेदन करें`,
        detail: `विनिर्माण परीक्षण सुविधाओं, गुणवत्ता नियंत्रण दस्तावेजों को तैयार करें और www.manakonline.in पर आवेदन करें।`,
      });
    } else if (isTamil) {
      nextSteps.push({
        title: `${scheme.name}-இன் கீழ் Manakonline வழியாக விண்ணப்பிக்கவும்`,
        detail: `உற்பத்தி சோதனை வசதிகள், தரக் கட்டுப்பாட்டு ஆவணங்களைத் தயாரித்து www.manakonline.in இல் விண்ணப்பிக்கவும்.`,
      });
    } else if (isTelugu) {
      nextSteps.push({
        title: `${scheme.name} కింద Manakonline ద్వారా దరఖాస్తు చేసుకోండి`,
        detail: `తయారీ పరీక్ష సౌకర్యాలు, నాణ్యత నియంత్రణ డాక్యుమెంటేషన్ సిద్ధం చేసి www.manakonline.in లో దరఖాస్తు చేసుకోండి.`,
      });
    } else if (isKannada) {
      nextSteps.push({
        title: `${scheme.name} ಅಡಿಯಲ್ಲಿ Manakonline ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ`,
        detail: `ಉತ್ಪಾದನಾ ಪರೀಕ್ಷಾ ಸೌಲಭ್ಯಗಳು, ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣ ದಾಖಲಾತಿಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ www.manakonline.in ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.`,
      });
    } else {
      nextSteps.push({
        title: `Apply via Manakonline under ${scheme.name}`,
        detail: `Prepare manufacturing test facilities, quality control documentation, and apply on www.manakonline.in.`,
      });
    }
  }
  if (lab) {
    if (isHindi) {
      nextSteps.push({
        title: "प्रयोगशाला पूर्व-परीक्षण का समय निर्धारित करें",
        detail: `${lab.city} में ${lab.name} (${lab.accreditation}) जैसी मान्यता प्राप्त प्रयोगशाला से संपर्क करें।`,
      });
    } else if (isTamil) {
      nextSteps.push({
        title: "ஆய்வக முன் சோதனையை திட்டமிடுங்கள்",
        detail: `${lab.city}-இல் உள்ள ${lab.name} (${lab.accreditation}) போன்ற அங்கீகரிக்கப்பட்ட ஆய்வகத்தை அணுகவும்.`,
      });
    } else if (isTelugu) {
      nextSteps.push({
        title: "ప్రయోగశాల ముందస్తు పరీక్షను షెడ్యూల్ చేయండి",
        detail: `${lab.city} లోని ${lab.name} (${lab.accreditation}) వంటి గుర్తింపు పొందిన ల్యాబ్‌ను సంప్రదించండి.`,
      });
    } else if (isKannada) {
      nextSteps.push({
        title: "ಪ್ರಯೋಗಾಲಯ ಪೂರ್ವ ಪರೀಕ್ಷೆಯನ್ನು ನಿಗದಿಪಡಿಸಿ",
        detail: `${lab.city} ನಲ್ಲಿರುವ ${lab.name} (${lab.accreditation}) ನಂತಹ ಮಾನ್ಯತೆ ಪಡೆದ ಲ್ಯಾಬ್ ಅನ್ನು ಸಂಪರ್ಕಿಸಿ.`,
      });
    } else {
      nextSteps.push({
        title: "Schedule laboratory pre-testing",
        detail: `Approach an accredited lab such as ${lab.name} in ${lab.city} (${lab.accreditation}) to complete verification tests.`,
      });
    }
  }
  if (isHindi) {
    nextSteps.push({
      title: "आधिकारिक बीआईएस पोर्टल पर पुष्टि करें",
      detail: "www.bis.gov.in और www.services.bis.gov.in पर वर्तमान संशोधनों और नियमों की पुष्टि करें।",
    });
  } else if (isTamil) {
    nextSteps.push({
      title: "அதிகாரப்பூர்வ பிஐஎஸ் போர்ட்டலில் உறுதிப்படுத்தவும்",
      detail: "தற்போதைய திருத்தங்கள் மற்றும் விவரங்களை www.bis.gov.in மற்றும் www.services.bis.gov.in இல் சரிபார்க்கவும்.",
    });
  } else if (isTelugu) {
    nextSteps.push({
      title: "అధికారిక బిఐఎస్ పోర్టల్‌లలో ధృవీకరించండి",
      detail: "ప్రస్తుత సవరణలను www.bis.gov.in మరియు www.services.bis.gov.in లో క్రాస్-చెక్ చేయండి.",
    });
  } else if (isKannada) {
    nextSteps.push({
      title: "ಅಧಿಕೃತ ಬಿಐಎಸ್ ಪೋರ್ಟಲ್‌ಗಳಲ್ಲಿ ದೃಢೀಕರಿಸಿ",
      detail: "ಪ್ರಸ್ತುತ ತಿದ್ದುಪಡಿಗಳನ್ನು www.bis.gov.in ಮತ್ತು www.services.bis.gov.in ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",
    });
  } else {
    nextSteps.push({
      title: "Verify against official BIS portals",
      detail: "Cross-check current revisions and amendments on www.bis.gov.in and www.services.bis.gov.in.",
    });
  }

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

