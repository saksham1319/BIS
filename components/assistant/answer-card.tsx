"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
    AlertTriangle,
    ArrowRight,
    Check,
    CheckCircle2,
    Copy,
    CornerDownLeft,
    Download,
    ExternalLink,
    HelpCircle,
    Info,
    Package,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
    AnswerStandard,
    AssistantAnswer,
    CertificationStatus,
    Confidence,
    EvidenceSource,
} from "@/lib/bis/types";

export interface AnswerCardProps {
    /** The finished answer. While null/undefined the card renders `streamingText` instead. */
    answer?: AssistantAnswer | null;
    /** Partial summary text emitted by `delta` events. */
    streamingText?: string;
    /** True while the answer is still generating: shows a caret, hides structured sections. */
    streaming?: boolean;
    /** Sources used to resolve `[n]` markers before the final answer lands. */
    sources?: EvidenceSource[];
    onCitation: (sourceId: string) => void;
    onOpenView: (view: string, payload?: { standardId?: string; query?: string }) => void;
    /** Called when the user clicks a clarifying option or inputs a clarification detail. */
    onClarify?: (question: string) => void;
}

const CERTIFICATION_META: Record<CertificationStatus, { label: string; tone: string; icon: LucideIcon }> = {
    mandatory: { label: "Mandatory Certification", tone: "attention", icon: AlertTriangle },
    voluntary: { label: "Voluntary Standard", tone: "navy", icon: Info },
    "check-required": { label: "Applicability Check Required", tone: "attention", icon: AlertTriangle },
    "not-applicable": { label: "Not Applicable", tone: "complete", icon: Check },
};

const FALLBACK_CERTIFICATION = CERTIFICATION_META["check-required"];

const CONFIDENCE_META: Record<Confidence, { label: string; tone: string }> = {
    high: { label: "Primary Standard", tone: "complete" },
    medium: { label: "Related Standard", tone: "navy" },
    low: { label: "Reference Standard", tone: "attention" },
};

const FALLBACK_CONFIDENCE = CONFIDENCE_META.medium;

const CITATION_PATTERN = /\[(\d+)\]/g;

function sourceForIndex(sources: EvidenceSource[], marker: number): EvidenceSource | undefined {
    if (!Number.isFinite(marker) || marker < 1) return undefined;
    return sources[marker - 1];
}

function sourceForStandard(sources: EvidenceSource[], standard: AnswerStandard): EvidenceSource | undefined {
    return sources.find((source) => source.number === standard.number);
}

/**
 * Parses markdown bold (**text**) and [n] citations in a text line.
 */
function renderLine(
    line: string,
    sources: EvidenceSource[],
    onCitation: (id: string) => void,
    keyBase: string,
): ReactNode[] {
    const boldParts = line.split(/(\*\*[^*]+\*\*)/g);
    const nodes: ReactNode[] = [];

    boldParts.forEach((part, boldIdx) => {
        if (!part) return;
        const isBold = part.startsWith("**") && part.endsWith("**") && part.length > 4;
        const content = isBold ? part.slice(2, -2) : part;

        const pattern = new RegExp(CITATION_PATTERN.source, "g");
        let cursor = 0;
        let match = pattern.exec(content);

        while (match !== null) {
            if (match.index > cursor) {
                const textChunk = content.slice(cursor, match.index);
                nodes.push(isBold ? <strong key={`${keyBase}-b${boldIdx}-${cursor}`}>{textChunk}</strong> : textChunk);
            }
            const marker = Number.parseInt(match[1], 10);
            const source = sourceForIndex(sources, marker);
            if (source) {
                nodes.push(
                    <button
                        key={`${keyBase}-c${match.index}`}
                        type="button"
                        className="citation"
                        onClick={() => onCitation(source.id)}
                        aria-label={`Open source ${marker}: ${source.number}`}
                        title={`${source.number} — ${source.location}`}
                    >
                        {marker}
                    </button>,
                );
            } else {
                nodes.push(match[0]);
            }
            cursor = match.index + match[0].length;
            match = pattern.exec(content);
        }

        if (cursor < content.length) {
            const remaining = content.slice(cursor);
            nodes.push(isBold ? <strong key={`${keyBase}-b${boldIdx}-${cursor}`}>{remaining}</strong> : remaining);
        }
    });

    return nodes;
}

/**
 * Renders paragraphs and bulleted lists with negative space and clean typography.
 */
function renderSummary(
    text: string,
    sources: EvidenceSource[],
    onCitation: (id: string) => void,
    caret: boolean,
): ReactNode {
    const blocks = text.split(/\n{2,}/).filter((block) => block.trim().length > 0);
    if (blocks.length === 0) blocks.push("");

    return blocks.map((block, bIndex) => {
        const lines = block.split("\n").filter((line) => line.trim().length > 0);
        const isList = lines.length > 0 && lines.every((line) => line.trim().startsWith("- ") || line.trim().startsWith("• ") || line.trim().startsWith("* "));
        const isLastBlock = bIndex === blocks.length - 1;

        if (isList) {
            return (
                <ul key={`b${bIndex}`} className="summary-bullet-list">
                    {lines.map((line, lIndex) => {
                        const cleanLine = line.trim().replace(/^[-•*]\s+/, "");
                        const isLastItem = isLastBlock && lIndex === lines.length - 1;
                        return (
                            <li key={`b${bIndex}l${lIndex}`}>
                                {renderLine(cleanLine, sources, onCitation, `b${bIndex}l${lIndex}`)}
                                {caret && isLastItem ? <span className="stream-caret" aria-hidden="true" /> : null}
                            </li>
                        );
                    })}
                </ul>
            );
        }

        return (
            <p key={`b${bIndex}`} className="summary-paragraph">
                {lines.map((line, lIndex) => (
                    <Fragment key={`b${bIndex}l${lIndex}`}>
                        {lIndex > 0 ? <br /> : null}
                        {renderLine(line, sources, onCitation, `b${bIndex}l${lIndex}`)}
                    </Fragment>
                ))}
                {caret && isLastBlock ? <span className="stream-caret" aria-hidden="true" /> : null}
            </p>
        );
    });
}

/** Expands [n] markers into the source number so copied text stands on its own. */
function expandCitations(text: string, sources: EvidenceSource[]): string {
    return text.replace(CITATION_PATTERN, (whole, digits: string) => {
        const source = sourceForIndex(sources, Number.parseInt(digits, 10));
        return source ? `(${source.number})` : whole;
    });
}

function toPlainText(answer: AssistantAnswer): string {
    const sources = answer.sources ?? [];
    const blocks: string[] = [expandCitations(answer.summary ?? "", sources).trim()];

    if (answer.product) {
        const attributes = answer.product.attributes?.length ? ` — ${answer.product.attributes.join(", ")}` : "";
        blocks.push(`Product\n${answer.product.name} (${answer.product.category})${attributes}`);
    }

    if (answer.standards?.length) {
        const lines = answer.standards.map((standard) => {
            const confidence = CONFIDENCE_META[standard.confidence] ?? FALLBACK_CONFIDENCE;
            return `- ${standard.number} — ${standard.title} [${confidence.label}]\n  ${standard.why}`;
        });
        blocks.push(`Relevant Indian Standards\n${lines.join("\n")}`);
    }

    const certification = CERTIFICATION_META[answer.certification?.status] ?? FALLBACK_CERTIFICATION;
    const scheme = answer.certification?.scheme ? `\nScheme: ${answer.certification.scheme}` : "";
    blocks.push(`Certification: ${certification.label}${scheme}\n${answer.certification?.reason ?? ""}`.trim());

    if (answer.tests?.length) {
        blocks.push(`Testing requirements\n${answer.tests.map((test) => `- ${test}`).join("\n")}`);
    }

    if (answer.clarifyingQuestion) {
        blocks.push(`Precision Diagnostic\n${answer.clarifyingQuestion}`);
    }

    if (answer.nextSteps?.length) {
        const lines = answer.nextSteps.map((step, index) => `${index + 1}. ${step.title} — ${step.detail}`);
        blocks.push(`Recommended next steps\n${lines.join("\n")}`);
    }

    if (sources.length) {
        const lines = sources.map((source, index) => {
            const page = typeof source.page === "number" ? `, p.${source.page}` : "";
            return `[${index + 1}] ${source.number} — ${source.title}, ${source.location}${page}`;
        });
        blocks.push(`Sources\n${lines.join("\n")}`);
    }

    return blocks.filter(Boolean).join("\n\n");
}

function StatusPill({ tone, icon: PillIcon, label }: { tone: string; icon?: LucideIcon; label: string }) {
    return (
        <span className={`status ${tone}`}>
            {PillIcon ? <PillIcon size={14} className="status-icon" /> : null}
            {label}
        </span>
    );
}

/**
 * Intelligent contextual options generator for clarifying questions.
 */
function getSmartClarifyOptions(question: string, product?: { name?: string }, standard?: AnswerStandard): string[] {
    const context = `${question} ${product?.name ?? ""} ${standard?.number ?? ""}`.toLowerCase();

    if (context.includes("bottle") || context.includes("flask") || context.includes("17803") || context.includes("14756")) {
        return [
            "Double-walled vacuum insulated (IS 17803)",
            "Single-walled stainless steel (IS 14756)",
            "Grade SS 304 (Food Contact)",
            "Capacity: 500ml – 1 Litre",
        ];
    }
    if (context.includes("cable") || context.includes("wire") || context.includes("694")) {
        return [
            "Domestic PVC wiring up to 1100V (IS 694)",
            "Industrial power cable (IS 1554)",
            "Flexible copper conductor",
        ];
    }
    if (context.includes("helmet") || context.includes("4151")) {
        return [
            "Full face protective helmet",
            "Open face helmet",
            "Non-metallic shell with EPS liner",
        ];
    }
    if (context.includes("toy") || context.includes("9873")) {
        return [
            "Electric / battery operated toy",
            "Non-electric plastic or plush toy",
            "Children under 36 months",
        ];
    }
    if (context.includes("cement") || context.includes("269")) {
        return [
            "Ordinary Portland Cement (OPC 43/53)",
            "Portland Pozzolana Cement (PPC)",
        ];
    }

    // Try extracting clean 2-choice options if formatted with " or "
    const firstSentence = question.split("?")[0].trim();
    const orIdx = firstSentence.toLowerCase().indexOf(" or ");
    if (orIdx !== -1) {
        const left = firstSentence.slice(0, orIdx).replace(/^(what|which|do\s+you\s+make|is\s+it|are\s+they)\s+/i, "").trim();
        const right = firstSentence.slice(orIdx + 4).trim();
        if (left.length >= 3 && left.length <= 45 && right.length >= 3 && right.length <= 45) {
            return [
                left.charAt(0).toUpperCase() + left.slice(1),
                right.charAt(0).toUpperCase() + right.slice(1),
            ];
        }
    }

    return [
        "Provide material specification",
        "Confirm capacity and usage",
    ];
}

export function AnswerCard({
    answer,
    streamingText = "",
    streaming = false,
    sources: fallbackSources,
    onCitation,
    onOpenView,
    onClarify,
}: AnswerCardProps) {
    const [copied, setCopied] = useState(false);
    const [customDetail, setCustomDetail] = useState("");
    const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (copyTimer.current) clearTimeout(copyTimer.current);
    }, []);

    const sources = answer?.sources ?? fallbackSources ?? [];
    const isFinal = Boolean(answer);
    const summaryText = isFinal ? answer?.summary ?? "" : streamingText;
    const showCaret = streaming && !isFinal;

    async function copyAnswer() {
        if (!answer) return;
        try {
            await navigator.clipboard.writeText(toPlainText(answer));
            setCopied(true);
            if (copyTimer.current) clearTimeout(copyTimer.current);
            copyTimer.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    }

    const product = answer?.product;
    const standards = answer?.standards ?? [];
    const certification = answer?.certification;
    const certificationMeta = certification ? CERTIFICATION_META[certification.status] ?? FALLBACK_CERTIFICATION : null;
    const primaryStandard = standards[0];
    const primarySource = primaryStandard ? sourceForStandard(sources, primaryStandard) : undefined;
    const tests = answer?.tests ?? [];
    const nextSteps = answer?.nextSteps ?? [];
    const clarifyingQuestion = answer?.clarifyingQuestion;

    const smartOptions = clarifyingQuestion
        ? getSmartClarifyOptions(clarifyingQuestion, product, primaryStandard)
        : [];

    return (
        <article className="answer" aria-label="BIS Saathi compliance response">
            {/* Assistant intro with spacious hierarchy */}
            <div className="answer-intro">
                <div className="assistant-emblem">
                    <ShieldCheck size={20} className="emblem-icon" />
                </div>
                <div className="answer-body-wrap">
                    <div className="answer-byline">
                        <strong>BIS Saathi</strong>
                        <span className="byline-divider">·</span>
                        <span className="byline-status">
                            {showCaret ? "Synthesizing compliance analysis..." : "Grounded Assessment"}
                        </span>
                    </div>
                    <div className="answer-summary" aria-live={showCaret ? "polite" : "off"}>
                        {summaryText || showCaret
                            ? renderSummary(summaryText, sources, onCitation, showCaret)
                            : null}
                    </div>
                </div>
            </div>

            {/* Executive Compliance Dossier Summary Bar */}
            {isFinal && (primaryStandard || certificationMeta || product) ? (
                <div className="dossier-meta-card">
                    <div className="dossier-meta-header">
                        <span className="dossier-meta-label">Compliance Dossier</span>
                        {certificationMeta && certification ? (
                            <StatusPill
                                tone={certificationMeta.tone}
                                icon={certificationMeta.icon}
                                label={certificationMeta.label}
                            />
                        ) : null}
                    </div>

                    <div className="dossier-meta-grid">
                        {primaryStandard ? (
                            <div className="dossier-col">
                                <span className="dossier-col-label">Primary Standard</span>
                                <div className="dossier-standard-title">
                                    <strong className="standard-number">{primaryStandard.number}</strong>
                                    {primarySource ? (
                                        <button
                                            type="button"
                                            className="inline-action"
                                            onClick={() => onCitation(primarySource.id)}
                                        >
                                            View clauses <ExternalLink size={13} />
                                        </button>
                                    ) : null}
                                </div>
                                <span className="dossier-subtext">{primaryStandard.title}</span>
                            </div>
                        ) : null}

                        {product ? (
                            <div className="dossier-col">
                                <span className="dossier-col-label">Identified Product</span>
                                <div className="dossier-product-name">
                                    <Package size={17} className="dossier-icon" />
                                    <strong>{product.name}</strong>
                                </div>
                                {product.attributes?.length ? (
                                    <div className="attribute-chips">
                                        {product.attributes.slice(0, 3).map((attribute) => (
                                            <span className="attribute-chip" key={attribute}>
                                                {attribute}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ) : null}

                        {certification?.scheme ? (
                            <div className="dossier-col">
                                <span className="dossier-col-label">Certification Scheme</span>
                                <strong>{certification.scheme}</strong>
                                <span className="dossier-subtext">Factory inspection & conformity testing</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {/* Relevant Indian Standards */}
            {isFinal && standards.length > 0 ? (
                <section className="answer-section">
                    <div className="section-title-row">
                        <div>
                            <h3>Relevant Indian Standards</h3>
                            <p>Matched against product scope and official notifications.</p>
                        </div>
                    </div>
                    <div className="standard-list">
                        {standards.map((standard, index) => {
                            const confidence = CONFIDENCE_META[standard.confidence] ?? FALLBACK_CONFIDENCE;
                            const source = sourceForStandard(sources, standard);
                            const body = (
                                <>
                                    <div className="standard-row-head">
                                        <strong>{standard.number}</strong>
                                        <StatusPill tone={confidence.tone} label={confidence.label} />
                                    </div>
                                    <span className="standard-row-title">{standard.title}</span>
                                    <span className="standard-row-why">{standard.why}</span>
                                </>
                            );
                            return source ? (
                                <button
                                    type="button"
                                    key={`${standard.number}-${index}`}
                                    className="standard-row"
                                    onClick={() => onCitation(source.id)}
                                    aria-label={`Open evidence for ${standard.number}`}
                                >
                                    {body}
                                    <ExternalLink className="standard-row-open" size={15} />
                                </button>
                            ) : (
                                <div className="standard-row is-static" key={`${standard.number}-${index}`}>
                                    {body}
                                </div>
                            );
                        })}
                    </div>
                </section>
            ) : null}

            {/* Testing Requirements Tag Cloud */}
            {isFinal && tests.length > 0 ? (
                <section className="answer-section">
                    <div className="section-title-row">
                        <div>
                            <h3>Testing Requirements</h3>
                            <p>Required test groups under the product standard and scheme manual.</p>
                        </div>
                    </div>
                    <div className="test-tags-wrap">
                        {tests.map((test) => (
                            <div key={test} className="test-tag">
                                <CheckCircle2 size={14} className="test-tag-icon" />
                                <span>{test}</span>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            {/* Interactive Precision Diagnostic (Cross-Question) */}
            {isFinal && clarifyingQuestion ? (
                <section className="precision-diagnostic" aria-label="Precision specification check">
                    <div className="diagnostic-header">
                        <div className="diagnostic-badge">
                            <Sparkles size={15} className="diagnostic-sparkle" />
                            <span>Precision Diagnostic</span>
                        </div>
                        <span className="diagnostic-tag">Clause Applicability</span>
                    </div>

                    <div className="diagnostic-body">
                        <div className="diagnostic-question-row">
                            <HelpCircle size={20} className="diagnostic-q-icon" />
                            <div>
                                <h4 className="diagnostic-question">{clarifyingQuestion}</h4>
                                <p className="diagnostic-note">
                                    Technical specifications determine which specific clauses, testing schedules, and Quality Control Orders apply under Indian Standards.
                                </p>
                            </div>
                        </div>

                        {/* Smart Contextual Options */}
                        {smartOptions.length > 0 ? (
                            <div className="diagnostic-options-wrap">
                                <span className="diagnostic-options-label">Quick select to refine standard:</span>
                                <div className="diagnostic-chips">
                                    {smartOptions.map((opt) => (
                                        <button
                                            type="button"
                                            key={opt}
                                            className="diagnostic-chip-btn"
                                            onClick={() => onClarify?.(opt)}
                                        >
                                            <span>{opt}</span>
                                            <ArrowRight size={13} className="diagnostic-chip-arrow" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {/* Inline Quick Reply composer */}
                        <form
                            className="diagnostic-inline-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (customDetail.trim()) {
                                    onClarify?.(customDetail.trim());
                                    setCustomDetail("");
                                }
                            }}
                        >
                            <input
                                type="text"
                                value={customDetail}
                                onChange={(e) => setCustomDetail(e.target.value)}
                                placeholder="Or type your product grade, capacity, or material..."
                                className="diagnostic-inline-input"
                            />
                            <button
                                type="submit"
                                disabled={!customDetail.trim()}
                                className="diagnostic-inline-submit"
                                title="Submit specification"
                            >
                                <span>Confirm</span>
                                <CornerDownLeft size={14} />
                            </button>
                        </form>
                    </div>
                </section>
            ) : null}

            {/* Recommended Next Steps */}
            {isFinal && nextSteps.length > 0 ? (
                <section className="next-steps">
                    <div className="section-title-row">
                        <div>
                            <h3>Recommended Next Steps</h3>
                            <p>Move from identification to a verified compliance path.</p>
                        </div>
                    </div>
                    <ol className={`steps-${Math.min(nextSteps.length, 3)}`}>
                        {nextSteps.map((step, index) => {
                            let stepAction: (() => void) | undefined;
                            let actionLabel: string | undefined;
                            if (index === 0 && primaryStandard) {
                                stepAction = () => onOpenView("standards", { standardId: primaryStandard.number });
                                actionLabel = "View standard";
                            } else if (index === 1 && (tests.length > 0 || primaryStandard)) {
                                stepAction = () =>
                                    onOpenView("labs", {
                                        standardId: primaryStandard?.number,
                                        query: primaryStandard?.number,
                                    });
                                actionLabel = "Find labs";
                            } else if (index === 2) {
                                stepAction = () => onOpenView("certification");
                                actionLabel = "Check scheme";
                            }
                            return (
                                <li key={`${step.title}-${index}`}>
                                    <span className="step-number">{index + 1}</span>
                                    <div>
                                        <strong>{step.title}</strong>
                                        <small>{step.detail}</small>
                                        {stepAction && (
                                            <button
                                                type="button"
                                                className="inline-action"
                                                style={{
                                                    marginTop: 8,
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 5,
                                                    cursor: "pointer",
                                                }}
                                                onClick={stepAction}
                                            >
                                                {actionLabel} <ExternalLink size={13} />
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </section>
            ) : null}

            {/* Action buttons */}
            {isFinal ? (
                <div className="answer-actions">
                    {primaryStandard ? (
                        <button
                            type="button"
                            className="button primary"
                            onClick={() => onOpenView("standards", { standardId: primaryStandard.number })}
                        >
                            Explore {primaryStandard.number}
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="button primary"
                            onClick={() => onOpenView("standards")}
                        >
                            Explore standards
                        </button>
                    )}
                    <button
                        type="button"
                        className="button secondary"
                        onClick={() =>
                            onOpenView("labs", {
                                standardId: primaryStandard?.number,
                                query: primaryStandard?.number,
                            })
                        }
                    >
                        Find laboratory
                    </button>
                    <button
                        type="button"
                        className="button ghost"
                        onClick={() => onOpenView("reports", { standardId: primaryStandard?.number })}
                    >
                        <Download size={16} /> Generate report
                    </button>
                    <button
                        type="button"
                        className={`button ghost copy-answer${copied ? " is-copied" : ""}`}
                        onClick={copyAnswer}
                        aria-live="polite"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? "Copied" : "Copy assessment"}
                    </button>
                </div>
            ) : null}
        </article>
    );
}

export default AnswerCard;
