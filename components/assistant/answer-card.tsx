"use client";

import {Fragment, useEffect, useRef, useState} from "react";
import type {ReactNode} from "react";
import {
    ArrowSquareOut,
    Check,
    Copy,
    DownloadSimple,
    Info,
    Package,
    Question,
    SealCheck,
    Warning,
} from "@phosphor-icons/react";
import type {Icon} from "@phosphor-icons/react";
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
    /** Called by the clarifying-question "Add detail" button so the parent can prefill the composer. */
    onClarify?: (question: string) => void;
}

const CERTIFICATION_META: Record<CertificationStatus, {label: string; tone: string; icon: Icon}> = {
    mandatory: {label: "Mandatory certification", tone: "attention", icon: Warning},
    voluntary: {label: "Voluntary", tone: "navy", icon: Info},
    "check-required": {label: "Applicability check required", tone: "attention", icon: Warning},
    "not-applicable": {label: "Not applicable", tone: "complete", icon: Check},
};

const FALLBACK_CERTIFICATION = CERTIFICATION_META["check-required"];

const CONFIDENCE_META: Record<Confidence, {label: string; tone: string}> = {
    high: {label: "Primary match", tone: "complete"},
    medium: {label: "Related standard", tone: "navy"},
    low: {label: "Reference standard", tone: "attention"},
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
 * Splits a line on `[n]` markers, turning resolvable ones into citation buttons.
 * Markers past the end of `sources` fall back to plain text.
 */
function renderLine(line: string, sources: EvidenceSource[], onCitation: (id: string) => void, keyBase: string): ReactNode[] {
    const nodes: ReactNode[] = [];
    const pattern = new RegExp(CITATION_PATTERN.source, "g");
    let cursor = 0;
    let match = pattern.exec(line);

    while (match !== null) {
        if (match.index > cursor) nodes.push(line.slice(cursor, match.index));
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
        match = pattern.exec(line);
    }

    if (cursor < line.length) nodes.push(line.slice(cursor));
    return nodes;
}

function renderSummary(
    text: string,
    sources: EvidenceSource[],
    onCitation: (id: string) => void,
    caret: boolean,
): ReactNode {
    const paragraphs = text.split(/\n{2,}/).filter((paragraph) => paragraph.trim().length > 0);
    if (paragraphs.length === 0) paragraphs.push("");

    return paragraphs.map((paragraph, pIndex) => {
        const lines = paragraph.split("\n");
        const isLast = pIndex === paragraphs.length - 1;
        return (
            <p key={`p${pIndex}`}>
                {lines.map((line, lIndex) => (
                    <Fragment key={`p${pIndex}l${lIndex}`}>
                        {lIndex > 0 ? <br/> : null}
                        {renderLine(line, sources, onCitation, `p${pIndex}l${lIndex}`)}
                    </Fragment>
                ))}
                {caret && isLast ? <span className="stream-caret" aria-hidden="true"/> : null}
            </p>
        );
    });
}

/** Expands `[n]` markers into the source number so copied text stands on its own. */
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
        blocks.push(`One detail can change this result\n${answer.clarifyingQuestion}`);
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

function StatusPill({tone, icon: PillIcon, label, filled}: {tone: string; icon?: Icon; label: string; filled?: boolean}) {
    return (
        <span className={`status ${tone}`}>
            {PillIcon ? <PillIcon size={15} weight={filled ? "fill" : "bold"}/> : null}
            {label}
        </span>
    );
}

/**
 * Extracts 2 clean options from a clarifying question when formatted as "A or B?".
 * Used to render quick-reply chips for the user.
 */
function extractClarifyOptions(question: string): string[] {
    if (!question) return [];
    const firstSentence = question.split("?")[0].trim();
    const orIdx = firstSentence.toLowerCase().indexOf(" or ");
    if (orIdx === -1) return [];

    const left = firstSentence.slice(0, orIdx).trim();
    const right = firstSentence.slice(orIdx + 4).trim();

    const cleanLeft = left
        .replace(/^(do\s+you\s+(make|manufacture|produce|import|sell)|is\s+this|are\s+these)\s+([a-z0-9-]+\s+)?(for\s+)?/i, "")
        .replace(/^(is|are|do|does|can|will|would)\s+(your|the|this|these|those|they|it)\s+([a-z0-9-]+\s+)?(intended\s+for|designed\s+for|used\s+for|made\s+of|insulated\s+with|rated\s+for|for)?\s*/i, "")
        .replace(/^(is|are|do|does|can|will|would)\s+/i, "")
        .replace(/,\s*$/, "")
        .trim();

    const cleanRight = right
        .replace(/^(do\s+they\s+use|do\s+you\s+use|is\s+it|are\s+they|are\s+these|for)\s+/i, "")
        .replace(/,\s*$/, "")
        .trim();

    if (cleanLeft.length >= 3 && cleanLeft.length <= 100 && cleanRight.length >= 3 && cleanRight.length <= 100) {
        return [
            cleanLeft.charAt(0).toUpperCase() + cleanLeft.slice(1),
            cleanRight.charAt(0).toUpperCase() + cleanRight.slice(1),
        ];
    }
    return [];
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

    const blockCount =
        (product ? 1 : 0) + (primaryStandard ? 1 : 0) + (certificationMeta ? 1 : 0) + (certification?.scheme ? 1 : 0);

    return (
        <article className="answer" aria-label="BIS Saathi answer">
            <div className="answer-intro">
                <div className="assistant-emblem"><SealCheck size={21} weight="fill"/></div>
                <div>
                    <div className="answer-byline">
                        BIS Saathi <span>{showCaret ? "Generating answer" : "Source-backed assessment"}</span>
                    </div>
                    <div className="answer-summary" aria-live={showCaret ? "polite" : "off"}>
                        {summaryText || showCaret
                            ? renderSummary(summaryText, sources, onCitation, showCaret)
                            : null}
                    </div>
                </div>
            </div>

            {isFinal && blockCount > 0 ? (
                <div className={`decision-grid has-${blockCount}`}>
                    {product ? (
                        <section className="decision-block product-block">
                            <span className="decision-label">Product identified</span>
                            <div className="decision-with-icon">
                                <Package size={22}/>
                                <div><strong>{product.name}</strong><small>{product.category}</small></div>
                            </div>
                            {product.attributes?.length ? (
                                <div className="attribute-chips">
                                    {product.attributes.map((attribute) => (
                                        <span className="attribute-chip" key={attribute}>{attribute}</span>
                                    ))}
                                </div>
                            ) : null}
                        </section>
                    ) : null}

                    {primaryStandard ? (
                        <section className="decision-block standard-block">
                            <span className="decision-label">Recommended standard</span>
                            <strong className="standard-number">{primaryStandard.number}</strong>
                            {primarySource ? (
                                <button type="button" className="inline-action" onClick={() => onCitation(primarySource.id)}>
                                    View standard <ArrowSquareOut size={15}/>
                                </button>
                            ) : (
                                <span className="decision-note">{primaryStandard.title}</span>
                            )}
                        </section>
                    ) : null}

                    {certificationMeta && certification ? (
                        <section className="decision-block certification-block">
                            <span className="decision-label">Certification</span>
                            <StatusPill tone={certificationMeta.tone} icon={certificationMeta.icon} label={certificationMeta.label} filled/>
                            {certification.reason ? <p>{certification.reason}</p> : null}
                        </section>
                    ) : null}

                    {certification?.scheme ? (
                        <section className="decision-block scheme-block">
                            <span className="decision-label">Applicable scheme</span>
                            <div className="scheme-line"><span className="scheme-badge">{certification.scheme}</span></div>
                            <p>Product certification with testing and conformity assessment.</p>
                        </section>
                    ) : null}
                </div>
            ) : null}

            {isFinal && standards.length > 0 ? (
                <section className="answer-section">
                    <div className="section-title-row">
                        <div>
                            <h3>Relevant Indian Standards</h3>
                            <p>Matched against the product description and the current notified scope.</p>
                        </div>
                    </div>
                    <div className="standard-list">
                        {standards.map((standard, index) => {
                            const confidence = CONFIDENCE_META[standard.confidence] ?? FALLBACK_CONFIDENCE;
                            const source = sourceForStandard(sources, standard);
                            const body = (
                                <>
                                    <span className="standard-row-head">
                                        <strong>{standard.number}</strong>
                                        <StatusPill tone={confidence.tone} label={confidence.label}/>
                                    </span>
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
                                    <ArrowSquareOut className="standard-row-open" size={15}/>
                                </button>
                            ) : (
                                <div className="standard-row is-static" key={`${standard.number}-${index}`}>{body}</div>
                            );
                        })}
                    </div>
                </section>
            ) : null}

            {isFinal && tests.length > 0 ? (
                <section className="answer-section">
                    <div className="section-title-row">
                        <div>
                            <h3>Testing requirements</h3>
                            <p>Likely test groups under the product standard and scheme manual.</p>
                        </div>
                    </div>
                    <div className="test-list">
                        {tests.map((test) => (
                            <span key={test}><Check size={15} weight="bold"/> {test}</span>
                        ))}
                    </div>
                </section>
            ) : null}

            {isFinal && clarifyingQuestion ? (
                <section className="caveat cross-examination" aria-label="Cross-examination question">
                    <Question size={20} weight="bold"/>
                    <div>
                        <strong>Cross-Question: Specific detail required to confirm standard</strong>
                        <p>{clarifyingQuestion}</p>
                        {(() => {
                            const options = extractClarifyOptions(clarifyingQuestion);
                            if (options.length === 0) return null;
                            return (
                                <div className="clarify-options">
                                    <span className="clarify-options-label">Quick select:</span>
                                    {options.map((opt) => (
                                        <button
                                            type="button"
                                            key={opt}
                                            className="clarify-option-btn"
                                            onClick={() => onClarify?.(opt)}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                    <button type="button" onClick={() => onClarify?.("")}>Answer question</button>
                </section>
            ) : null}

            {isFinal && nextSteps.length > 0 ? (
                <section className="next-steps">
                    <div className="section-title-row">
                        <div>
                            <h3>Recommended next steps</h3>
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
                                stepAction = () => onOpenView("labs", { standardId: primaryStandard?.number, query: primaryStandard?.number });
                                actionLabel = "Find labs";
                            } else if (index === 2) {
                                stepAction = () => onOpenView("certification");
                                actionLabel = "Check scheme";
                            }
                            return (
                                <li key={`${step.title}-${index}`}>
                                    <span>{index + 1}</span>
                                    <div>
                                        <strong>{step.title}</strong>
                                        <small>{step.detail}</small>
                                        {stepAction && (
                                            <button
                                                type="button"
                                                className="inline-action"
                                                style={{marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer"}}
                                                onClick={stepAction}
                                            >
                                                {actionLabel} <ArrowSquareOut size={13}/>
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </section>
            ) : null}

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
                        onClick={() => onOpenView("labs", { standardId: primaryStandard?.number, query: primaryStandard?.number })}
                    >
                        Find laboratory
                    </button>
                    <button
                        type="button"
                        className="button ghost"
                        onClick={() => onOpenView("reports", { standardId: primaryStandard?.number })}
                    >
                        <DownloadSimple size={17}/> Generate report
                    </button>
                    <button
                        type="button"
                        className={`button ghost copy-answer${copied ? " is-copied" : ""}`}
                        onClick={copyAnswer}
                        aria-live="polite"
                    >
                        {copied ? <Check size={17} weight="bold"/> : <Copy size={17}/>}
                        {copied ? "Copied" : "Copy answer"}
                    </button>
                </div>
            ) : null}
        </article>
    );
}

export default AnswerCard;
