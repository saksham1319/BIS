"use client";

import {
    ArrowLeft,
    CaretLeft,
    CaretRight,
    Copy,
    FileText,
    WarningCircle,
    X,
} from "@phosphor-icons/react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {getStandardById, getStandardByNumber} from "@/lib/bis/data";
import {retrieveById} from "@/lib/bis/retrieval";
import type {Clause, EvidenceSource, Standard} from "@/lib/bis/types";

export interface DocumentViewerProps {
    /** Standard id (or IS number) to open. */
    standardId?: string;
    /** Clause to select and highlight. */
    clauseId?: string;
    /** Evidence source id — resolves the standard and clause on its own. */
    sourceId?: string;
    onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function resolveStandard(standardId?: string, source?: EvidenceSource): Standard | undefined {
    if (standardId) {
        const direct = getStandardById(standardId) ?? getStandardByNumber(standardId);
        if (direct) return direct;
    }
    if (source) {
        if (source.docId) {
            const byDoc = getStandardById(source.docId) ?? getStandardByNumber(source.docId);
            if (byDoc) return byDoc;
        }
        if (source.number) {
            const byNumber = getStandardByNumber(source.number) ?? getStandardById(source.number);
            if (byNumber) return byNumber;
        }
    }
    return undefined;
}

function pickClauseIndex(clauses: Clause[], clauseId?: string, source?: EvidenceSource): number {
    if (clauses.length === 0) return -1;
    if (clauseId) {
        const byId = clauses.findIndex((clause) => clause.id === clauseId);
        if (byId >= 0) return byId;
        const byNumber = clauses.findIndex((clause) => clause.number === clauseId);
        if (byNumber >= 0) return byNumber;
    }
    if (source) {
        // Evidence locations read "Clause 4.1 — Material of the inner vessel".
        const exact = /clause\s+([\d.]+[a-z]?)/i.exec(source.location ?? "");
        if (exact) {
            const byExact = clauses.findIndex((clause) => clause.number.toLowerCase() === exact[1].toLowerCase());
            if (byExact >= 0) return byExact;
        }
        if (typeof source.page === "number") {
            const byPage = clauses.findIndex((clause) => clause.page === source.page);
            if (byPage >= 0) return byPage;
        }
        const location = source.location?.toLowerCase() ?? "";
        const byLocation = clauses.findIndex((clause) => location.includes(clause.number.toLowerCase()));
        if (byLocation >= 0) return byLocation;
    }
    return 0;
}

export function DocumentViewer({standardId, clauseId, sourceId, onClose}: DocumentViewerProps) {
    const dialogRef = useRef<HTMLElement | null>(null);
    const closeRef = useRef(onClose);

    useEffect(() => {
        closeRef.current = onClose;
    });

    const source = useMemo(() => (sourceId ? retrieveById(sourceId) : undefined), [sourceId]);
    const standard = useMemo(() => resolveStandard(standardId, source), [standardId, source]);
    const clauses = useMemo(() => standard?.clauses ?? [], [standard]);

    const [index, setIndex] = useState(() => pickClauseIndex(clauses, clauseId, source));

    // Adjusting state during render (the documented React pattern) rather than in an effect:
    // a new citation target re-selects the clause without an extra commit.
    const target = `${standard?.id ?? ""}|${clauseId ?? ""}|${sourceId ?? ""}`;
    const [lastTarget, setLastTarget] = useState(target);
    if (lastTarget !== target) {
        setLastTarget(target);
        setIndex(pickClauseIndex(clauses, clauseId, source));
    }

    // Escape, backdrop close, focus trap and focus restoration.
    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const focusables = () => Array.from(
            dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
        ).filter((element) => element.offsetWidth > 0 || element.offsetHeight > 0);

        const frame = window.requestAnimationFrame(() => {
            const items = focusables();
            (items[0] ?? dialogRef.current)?.focus();
        });

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeRef.current();
                return;
            }
            if (event.key !== "Tab") return;
            const items = focusables();
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;
            if (event.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown, true);
        return () => {
            window.cancelAnimationFrame(frame);
            document.removeEventListener("keydown", onKeyDown, true);
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.();
        };
    }, []);

    const copyCitation = useCallback(() => {
        const clause = clauses[index];
        if (!standard || !clause) return;
        const citation = `${standard.number}, clause ${clause.number} — ${clause.title} (page ${clause.page})`;
        void navigator.clipboard?.writeText(citation);
    }, [clauses, index, standard]);

    // A citation that resolves to evidence outside the standards corpus (a QCO, a
    // scheme, a laboratory record) still gets a real reading surface.
    if ((!standard || clauses.length === 0 || index < 0) && source) {
        return (
            <div className="modal-backdrop document-backdrop" role="presentation" onMouseDown={() => onClose()}>
                <section
                    className="document-viewer"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="document-viewer-title"
                    ref={dialogRef}
                    tabIndex={-1}
                    onMouseDown={(event) => event.stopPropagation()}
                >
                    <header className="document-toolbar">
                        <div>
                            <button type="button" className="icon-button" aria-label="Close document" onClick={onClose}>
                                <ArrowLeft size={20}/>
                            </button>
                            <div>
                                <strong id="document-viewer-title">{source.number}</strong>
                                <span>{source.title}</span>
                            </div>
                        </div>
                        <div className="document-tools">
                            {typeof source.page === "number" &&
                                <span className="doc-page-indicator">Page {source.page}</span>}
                            <button
                                type="button"
                                onClick={() => void navigator.clipboard?.writeText(
                                    `${source.number} — ${source.title} (${source.location})`,
                                )}
                            >
                                <Copy size={16}/> Copy citation
                            </button>
                            <button type="button" className="icon-button" aria-label="Close document" onClick={onClose}>
                                <X size={19}/>
                            </button>
                        </div>
                    </header>

                    <div className="document-body source-only">
                        <main className="document-canvas">
                            <article className="pdf-page">
                                <div className="pdf-page-header">
                                    <span>{source.number}</span>
                                    <span>{source.type}</span>
                                </div>
                                <h2>{source.title}</h2>
                                <p className="pdf-intro">{source.location}</p>
                                <div className="highlighted-clause clause-focus">
                                    <span className="highlight-tag">Cited passage</span>
                                    <p>{source.excerpt}</p>
                                </div>
                                <div className="pdf-page-footer">
                                    <span>Illustrative demo data — verify against official BIS sources</span>
                                    <span>{source.page ?? ""}</span>
                                </div>
                            </article>
                        </main>

                        <aside className="document-context">
                            <span>Evidence context</span>
                            <h3>{source.location}</h3>
                            <p>
                                This passage comes from a {source.type.toLowerCase()} in the demonstration corpus. It is
                                not indexed as a clause of an Indian Standard, so there is no clause-by-clause
                                navigation for it.
                            </p>
                            <p className="view-note">
                                <FileText size={12}/> {source.number}
                            </p>
                        </aside>
                    </div>
                </section>
            </div>
        );
    }

    if (!standard || clauses.length === 0 || index < 0) {
        return (
            <div className="modal-backdrop document-backdrop" role="presentation" onMouseDown={() => onClose()}>
                <section
                    className="document-unavailable"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="document-unavailable-title"
                    ref={dialogRef}
                    tabIndex={-1}
                    onMouseDown={(event) => event.stopPropagation()}
                >
                    <WarningCircle size={30} weight="duotone"/>
                    <h2 id="document-unavailable-title">Source unavailable</h2>
                    <p>
                        {source
                            ? `“${source.title}” could not be matched to a document in the demonstration corpus.`
                            : "This citation does not resolve to a document in the demonstration corpus."}
                    </p>
                    <button type="button" className="button secondary" onClick={onClose}>Close</button>
                </section>
            </div>
        );
    }

    const clause = clauses[index];
    const totalPages = clauses.reduce((max, item) => Math.max(max, item.page), 1);
    const pageClauses = clauses.filter((item) => item.page === clause.page);

    return (
        <div className="modal-backdrop document-backdrop" role="presentation" onMouseDown={() => onClose()}>
            <section
                className="document-viewer"
                role="dialog"
                aria-modal="true"
                aria-labelledby="document-viewer-title"
                ref={dialogRef}
                tabIndex={-1}
                onMouseDown={(event) => event.stopPropagation()}
            >
                <header className="document-toolbar">
                    <div>
                        <button type="button" className="icon-button" aria-label="Close document" onClick={onClose}>
                            <ArrowLeft size={20}/>
                        </button>
                        <div>
                            <strong id="document-viewer-title">{standard.number}</strong>
                            <span>{standard.title}</span>
                        </div>
                    </div>
                    <div className="document-tools">
                        <button
                            type="button"
                            className="doc-nav"
                            onClick={() => setIndex((current) => Math.max(0, current - 1))}
                            disabled={index === 0}
                            aria-label="Previous clause"
                        >
                            <CaretLeft size={15}/> <span className="doc-nav-label">Previous</span>
                        </button>
                        <span className="doc-page-indicator">Page {clause.page} of {totalPages}</span>
                        <button
                            type="button"
                            className="doc-nav"
                            onClick={() => setIndex((current) => Math.min(clauses.length - 1, current + 1))}
                            disabled={index === clauses.length - 1}
                            aria-label="Next clause"
                        >
                            <span className="doc-nav-label">Next</span> <CaretRight size={15}/>
                        </button>
                        <button type="button" onClick={copyCitation}>
                            <Copy size={16}/> Copy citation
                        </button>
                        <button type="button" className="icon-button" aria-label="Close document" onClick={onClose}>
                            <X size={19}/>
                        </button>
                    </div>
                </header>

                <div className="document-body with-clause-rail">
                    <nav className="clause-rail" aria-label="Clauses in this standard">
                        <span>Clauses</span>
                        {clauses.map((item, itemIndex) => (
                            <button
                                key={item.id}
                                type="button"
                                className={itemIndex === index ? "active" : ""}
                                aria-current={itemIndex === index ? "true" : undefined}
                                onClick={() => setIndex(itemIndex)}
                            >
                                <strong>{item.number} {item.title}</strong>
                                <small>Page {item.page}</small>
                            </button>
                        ))}
                    </nav>

                    <main className="document-canvas">
                        <article className="pdf-page">
                            <div className="pdf-page-header">
                                <span>{standard.number}</span>
                                <span>Indian Standard</span>
                            </div>
                            <h2>{standard.title}</h2>
                            <p className="pdf-intro">{standard.sector} · {standard.year}</p>

                            {pageClauses.map((item) => (
                                item.id === clause.id ? (
                                    <div className="highlighted-clause clause-focus" key={item.id}>
                                        <span className="highlight-tag">Cited clause</span>
                                        <strong className="pdf-clause-title">{item.number} {item.title}</strong>
                                        <p>{item.text}</p>
                                    </div>
                                ) : (
                                    <div key={item.id}>
                                        <h3>{item.number} {item.title}</h3>
                                        <p>{item.text}</p>
                                    </div>
                                )
                            ))}

                            <div className="pdf-page-footer">
                                <span>Illustrative demo data — verify against official BIS sources</span>
                                <span>{clause.page}</span>
                            </div>
                        </article>
                    </main>

                    <aside className="document-context">
                        <span>Evidence context</span>
                        <h3>{clause.number} {clause.title}</h3>
                        <p>{standard.scope}</p>
                        {source && (
                            <div>
                                <small>{source.type} · {source.location}</small>
                                <strong>{source.excerpt}</strong>
                            </div>
                        )}
                        <button type="button" className="button secondary full" onClick={copyCitation}>
                            <Copy size={16}/> Copy citation
                        </button>
                        <p className="view-note">
                            <FileText size={12}/> {standard.number} · page {clause.page} of {totalPages}
                        </p>
                    </aside>
                </div>
            </section>
        </div>
    );
}
