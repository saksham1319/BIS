"use client";

import {useEffect, useRef, useState} from "react";
import {
    ArrowSquareOut,
    Books,
    CaretRight,
    Certificate,
    ClipboardText,
    Copy,
    Check,
    DiamondsFour,
    FilePdf,
    Files,
    Flask,
    IdentificationBadge,
    SealCheck,
    X,
} from "@phosphor-icons/react";
import type {EvidenceSource, SourceType} from "@/lib/bis/types";

export interface EvidencePanelProps {
    sources: EvidenceSource[];
    /** Id of the source being shown. Falls back to the first source when unmatched. */
    selected: string | null;
    onSelect: (sourceId: string) => void;
    onClose: () => void;
    /** Opens the full document viewer for a source. */
    onOpenDocument?: (source: EvidenceSource) => void;
}

/** One glyph per document family, so the panel reads as a filing cabinet rather than a list. */
function SourceIcon({type}: {type: SourceType}) {
    switch (type) {
        case "Quality Control Order":
            return <ClipboardText size={23} weight="duotone"/>;
        case "Product Manual":
            return <Books size={23} weight="duotone"/>;
        case "Certification Scheme":
            return <Certificate size={23} weight="duotone"/>;
        case "Laboratory Record":
            return <Flask size={23} weight="duotone"/>;
        case "Hallmarking Guidance":
            return <DiamondsFour size={23} weight="duotone"/>;
        case "Indian Standard":
        default:
            return <FilePdf size={23} weight="duotone"/>;
    }
}

/** `IS 17803:2022 — Stainless steel vacuum flask and bottle, Clause 4.1, p.7` */
export function formatCitation(source: EvidenceSource): string {
    const parts = [source.title, source.location].filter((part) => Boolean(part && part.trim()));
    const page = typeof source.page === "number" ? `, p.${source.page}` : "";
    return `${source.number}${parts.length ? ` — ${parts.join(", ")}` : ""}${page}`;
}

export function EvidencePanel({sources, selected, onSelect, onClose, onOpenDocument}: EvidencePanelProps) {
    // Keyed by source id so switching sources clears the confirmation without an effect.
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (copyTimer.current) clearTimeout(copyTimer.current);
    }, []);

    const active = sources.find((source) => source.id === selected) ?? sources[0];
    const copied = copiedId !== null && copiedId === active?.id;

    async function copyCitation() {
        if (!active) return;
        try {
            await navigator.clipboard.writeText(formatCitation(active));
            setCopiedId(active.id);
            if (copyTimer.current) clearTimeout(copyTimer.current);
            copyTimer.current = setTimeout(() => setCopiedId(null), 2000);
        } catch {
            setCopiedId(null);
        }
    }

    if (!active) {
        return (
            <aside className="evidence-panel" aria-label="Sources and evidence">
                <div className="evidence-header">
                    <div><strong>Sources</strong><span className="is-muted">Nothing retrieved yet</span></div>
                    <button type="button" className="icon-button" aria-label="Close sources" title="Close sources" onClick={onClose}>
                        <X size={18}/>
                    </button>
                </div>
                <div className="evidence-empty">
                    <Files size={26}/>
                    <strong>Evidence appears here</strong>
                    <p>Ask a question and BIS Saathi will list the standards, orders and manuals behind every claim, with the exact clause it relied on.</p>
                </div>
            </aside>
        );
    }

    const count = sources.length;

    return (
        <aside className="evidence-panel" aria-label="Sources and evidence">
            <div className="evidence-header">
                <div>
                    <strong>Sources</strong>
                    <span>{count} {count === 1 ? "source" : "sources"} cited</span>
                </div>
                <button type="button" className="icon-button" aria-label="Close sources" title="Close sources" onClick={onClose}>
                    <X size={18}/>
                </button>
            </div>

            <div className="source-tabs" role="tablist" aria-label="Answer sources">
                {sources.map((source, index) => (
                    <button
                        type="button"
                        role="tab"
                        id={`source-tab-${source.id}`}
                        key={source.id}
                        aria-selected={active.id === source.id}
                        aria-controls={`source-panel-${source.id}`}
                        aria-label={`Source ${index + 1}: ${source.number}`}
                        className={active.id === source.id ? "active" : ""}
                        onClick={() => onSelect(source.id)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            <div
                className="active-source"
                id={`source-panel-${active.id}`}
                role="tabpanel"
                aria-labelledby={`source-tab-${active.id}`}
            >
                <div className="source-document-icon"><SourceIcon type={active.type}/></div>
                <span className="source-type">{active.type}</span>
                <h2>{active.number}</h2>
                <p className="source-title">{active.title}</p>

                <div className="source-location">
                    <IdentificationBadge size={17}/>
                    <div>
                        <span>Relevant location</span>
                        <strong>{active.location}{typeof active.page === "number" ? ` · p.${active.page}` : ""}</strong>
                    </div>
                </div>

                <div className="passage">
                    <span>Relevant passage</span>
                    <p>{active.excerpt}</p>
                </div>

                {onOpenDocument ? (
                    <button type="button" className="button primary full" onClick={() => onOpenDocument(active)}>
                        View highlighted passage <ArrowSquareOut size={17}/>
                    </button>
                ) : null}
                <button type="button" className="button secondary full" onClick={copyCitation} aria-live="polite">
                    {copied ? <Check size={17} weight="bold"/> : <Copy size={17}/>}
                    {copied ? "Citation copied" : "Copy citation"}
                </button>
            </div>

            <div className="source-list">
                <span>All evidence</span>
                {sources.map((source, index) => (
                    <button
                        type="button"
                        key={source.id}
                        onClick={() => onSelect(source.id)}
                        className={active.id === source.id ? "active" : ""}
                    >
                        <span className="source-index">{index + 1}</span>
                        <span><strong>{source.number}</strong><small>{source.location}</small></span>
                        <CaretRight size={15}/>
                    </button>
                ))}
            </div>

            <div className="source-provenance">
                <SealCheck size={17} weight="fill"/>
                <p>
                    <strong>Source provenance</strong>
                    <span>Every claim above links to an excerpt from the demonstration corpus. Verify against official BIS gazette notifications.</span>
                </p>
            </div>
        </aside>
    );
}

export default EvidencePanel;
