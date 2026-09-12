// Shared contracts for BIS Saathi. Every layer (data, retrieval, AI, UI) speaks these types.

export type Confidence = "high" | "medium" | "low";

export type CertificationStatus =
  | "mandatory"
  | "voluntary"
  | "check-required"
  | "not-applicable";

export type StandardStatus = "active" | "superseded" | "withdrawn";

export type SourceType =
  | "Indian Standard"
  | "Quality Control Order"
  | "Product Manual"
  | "Certification Scheme"
  | "Laboratory Record"
  | "Hallmarking Guidance";

/** A single citable clause inside a standard. */
export interface Clause {
  id: string;
  number: string;
  title: string;
  text: string;
  page: number;
}

export interface Standard {
  id: string;
  number: string;
  year: number;
  title: string;
  sector: string;
  scope: string;
  keywords: string[];
  status: StandardStatus;
  supersedes?: string;
  supersededBy?: string;
  qcoId?: string;
  schemeId?: string;
  tests: string[];
  clauses: Clause[];
  relatedIds: string[];
}

export interface QualityControlOrder {
  id: string;
  name: string;
  ministry: string;
  notification: string;
  effectiveFrom: string;
  status: "in-force" | "notified" | "deferred";
  coverage: string[];
  exemptions: string[];
  standardIds: string[];
  summary: string;
}

export interface Laboratory {
  id: string;
  name: string;
  city: string;
  state: string;
  accreditation: string;
  recognisedFor: string[];
  testGroups: string[];
  turnaroundDays: number;
  contact: string;
  email: string;
}

export interface CertificationScheme {
  id: string;
  name: string;
  summary: string;
  applicability: string;
  steps: { title: string; detail: string }[];
  documents: string[];
  fees: { label: string; amount: string }[];
  timeline: string;
}

export interface HallmarkingCentre {
  id: string;
  name: string;
  city: string;
  state: string;
  registration: string;
  purities: string[];
  contact: string;
}

/** A retrieved, inspectable piece of evidence attached to an answer. */
export interface EvidenceSource {
  id: string;
  number: string;
  type: SourceType;
  title: string;
  location: string;
  excerpt: string;
  page?: number;
  docId?: string;
}

export interface RetrievalResult {
  sources: EvidenceSource[];
  standards: Standard[];
  qcos: QualityControlOrder[];
  labs: Laboratory[];
  schemes: CertificationScheme[];
  centres: HallmarkingCentre[];
  /** Compact, token-efficient context block handed to the model. */
  context: string;
}

export interface AnswerStandard {
  number: string;
  title: string;
  why: string;
  confidence: Confidence;
}

export interface AssistantAnswer {
  summary: string;
  product?: { name: string; category: string; attributes: string[] };
  standards: AnswerStandard[];
  certification: {
    status: CertificationStatus;
    scheme?: string;
    reason: string;
  };
  tests: string[];
  clarifyingQuestion?: string;
  nextSteps: { title: string; detail: string }[];
  sources: EvidenceSource[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  answer?: AssistantAnswer;
}

/** NDJSON events streamed from /api/chat. One JSON object per line. */
export type ChatStreamEvent =
  | { type: "status"; label: string }
  | { type: "sources"; sources: EvidenceSource[] }
  | { type: "delta"; text: string }
  | { type: "answer"; answer: AssistantAnswer }
  | { type: "error"; message: string; recoverable: boolean };
