"use client";

import {
    AlertCircle,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    FileText,
    FlaskConical,
    Gavel,
    RotateCcw,
    Search,
    ShieldCheck,
    X,
} from "lucide-react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    getQcoById,
    getSchemeById,
    getStandardById,
    getStandardByNumber,
    sectors,
    standards as allStandards,
} from "@/lib/bis/data";
import {searchStandards} from "@/lib/bis/retrieval";
import type {Standard, StandardStatus} from "@/lib/bis/types";

type StatusFilter = "all" | StandardStatus;

export interface StandardsExplorerProps {
    /** Fired when the user asks to open the standard itself as a citable source. */
    onCitation?: (standardId: string) => void;
    /** Fired by the per-clause "View document" action. */
    onOpenDocument?: (standardId: string, clauseId: string) => void;
    /** Seeds the search box on mount. */
    initialQuery?: string;
    /** Opens with this standard already expanded. */
    initialStandardId?: string;
}

const statusOptions: { value: StatusFilter; label: string }[] = [
    {value: "all", label: "All"},
    {value: "active", label: "Active"},
    {value: "superseded", label: "Superseded"},
    {value: "withdrawn", label: "Withdrawn"},
];

const statusPill: Record<StandardStatus, { className: string; label: string }> = {
    active: {className: "status verified", label: "Active"},
    superseded: {className: "status neutral", label: "Superseded"},
    withdrawn: {className: "status danger", label: "Withdrawn"},
};

function StatusPill({status}: { status: StandardStatus }) {
    const pill = statusPill[status];
    const Icon = status === "active" ? CheckCircle2 : status === "superseded" ? RotateCcw : AlertCircle;
    return (
        <span className={pill.className}>
            <Icon size={13}/> {pill.label}
        </span>
    );
}

function resolveReference(reference: string): Standard | undefined {
    return getStandardByNumber(reference) ?? getStandardById(reference);
}

function truncate(text: string, limit: number): string {
    if (text.length <= limit) return text;
    return `${text.slice(0, limit).trimEnd()}…`;
}

export function StandardsExplorer({
                                      onCitation,
                                      onOpenDocument,
                                      initialQuery = "",
                                      initialStandardId,
                                  }: StandardsExplorerProps) {
    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
    const [prevInitialQuery, setPrevInitialQuery] = useState(initialQuery);
    if (initialQuery !== prevInitialQuery) {
        setPrevInitialQuery(initialQuery);
        setQuery(initialQuery ?? "");
        setDebouncedQuery(initialQuery ?? "");
    }
    const [sector, setSector] = useState("all");
    const [status, setStatus] = useState<StatusFilter>("all");
    const [selectedId, setSelectedId] = useState<string | undefined>(initialStandardId);
    const [prevInitialStandardId, setPrevInitialStandardId] = useState(initialStandardId);
    if (initialStandardId !== prevInitialStandardId) {
        setPrevInitialStandardId(initialStandardId);
        setSelectedId(initialStandardId);
    }

    const searchRef = useRef<HTMLInputElement | null>(null);
    const rowRefs = useRef(new Map<string, HTMLElement>());

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedQuery(query), 150);
        return () => window.clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (initialStandardId) {
            window.requestAnimationFrame(() => {
                rowRefs.current.get(initialStandardId)?.scrollIntoView({behavior: "smooth", block: "center"});
            });
        }
    }, [initialStandardId]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
            const target = event.target as HTMLElement | null;
            const tag = target?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) return;
            event.preventDefault();
            searchRef.current?.focus();
            searchRef.current?.select();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const results = useMemo(() => searchStandards(debouncedQuery, {
        sector: sector === "all" ? undefined : sector,
        status: status === "all" ? undefined : status,
    }), [debouncedQuery, sector, status]);

    const filtersActive = debouncedQuery.trim().length > 0 || sector !== "all" || status !== "all";

    const activeFilterLabels = useMemo(() => {
        const labels: string[] = [];
        if (debouncedQuery.trim()) labels.push(`“${debouncedQuery.trim()}”`);
        if (sector !== "all") labels.push(sector);
        if (status !== "all") labels.push(statusPill[status].label.toLowerCase());
        return labels;
    }, [debouncedQuery, sector, status]);

    const clearFilters = useCallback(() => {
        setQuery("");
        setDebouncedQuery("");
        setSector("all");
        setStatus("all");
    }, []);

    const selectStandard = useCallback((id: string) => {
        setSelectedId(id);
        window.requestAnimationFrame(() => {
            rowRefs.current.get(id)?.scrollIntoView({behavior: "smooth", block: "center"});
        });
    }, []);

    const openRelated = useCallback((standard: Standard) => {
        // A related standard may sit outside the current filter set — widen so it can be shown.
        if (!results.some((item) => item.id === standard.id)) {
            setQuery("");
            setDebouncedQuery("");
            setSector("all");
            setStatus("all");
        }
        selectStandard(standard.id);
    }, [results, selectStandard]);

    return (
        <div className="workspace-page standards-explorer">
            <div className="page-heading">
                <div>
                    <h1>Standards explorer</h1>
                    <p>Search {allStandards.length} Indian Standards by number, title, scope, keyword or sector.</p>
                </div>
            </div>

            <div className="explorer-search">
                <Search size={21}/>
                <label htmlFor="standards-search" className="sr-only">Search Indian Standards</label>
                <input
                    id="standards-search"
                    ref={searchRef}
                    type="search"
                    value={query}
                    autoComplete="off"
                    placeholder="Search IS number, product, keyword or sector"
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            event.preventDefault();
                            setQuery("");
                            setDebouncedQuery("");
                        }
                    }}
                />
                {query ? (
                    <button
                        type="button"
                        className="icon-button"
                        aria-label="Clear search"
                        title="Clear search"
                        onClick={() => {
                            setQuery("");
                            setDebouncedQuery("");
                            searchRef.current?.focus();
                        }}
                    >
                        <X size={16}/>
                    </button>
                ) : (
                    <kbd>/</kbd>
                )}
            </div>

            <div className="explorer-filters">
                <div className="select-field">
                    <label className="field-label" htmlFor="standards-sector">Sector</label>
                    <select
                        id="standards-sector"
                        value={sector}
                        onChange={(event) => setSector(event.target.value)}
                    >
                        <option value="all">All sectors</option>
                        {sectors.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>

                <div>
                    <span className="field-label" id="standards-status-label">Status</span>
                    <div className="segmented" role="group" aria-labelledby="standards-status-label">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                aria-pressed={status === option.value}
                                onClick={() => setStatus(option.value)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <span className="filter-spacer"/>

                {filtersActive && (
                    <button type="button" className="button ghost compact" onClick={clearFilters}>
                        <X size={15}/> Clear filters
                    </button>
                )}
            </div>

            <div className="results-summary" aria-live="polite">
                <strong>{results.length} {results.length === 1 ? "standard" : "standards"}</strong>
                {filtersActive
                    ? <span className="active-filter-note">Filtered by {activeFilterLabels.join(" · ")}</span>
                    : <span>Full demonstration corpus</span>}
            </div>

            <div className="standards-results">
                {results.length === 0 ? (
                    <div className="empty-state">
                        <Search size={28}/>
                        <h2>{filtersActive ? "No standards match these filters" : "No standards loaded"}</h2>
                        <p>
                            {filtersActive
                                ? `Nothing in the corpus matches ${activeFilterLabels.join(" and ")}. Try a shorter keyword, a different sector, or reset the filters.`
                                : "The demonstration corpus does not contain any Indian Standards yet."}
                        </p>
                        {filtersActive && (
                            <button type="button" className="button secondary" onClick={clearFilters}>
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : results.map((standard) => {
                    const expanded = selectedId === standard.id;
                    return (
                        <article
                            className="standard-result"
                            key={standard.id}
                            ref={(node) => {
                                if (node) rowRefs.current.set(standard.id, node);
                                else rowRefs.current.delete(standard.id);
                            }}
                        >
                            <div className="standard-file"><FileText size={24}/></div>

                            <button
                                type="button"
                                className="standard-result-main std-trigger"
                                aria-expanded={expanded}
                                aria-controls={`standard-detail-${standard.id}`}
                                onClick={() => setSelectedId(expanded ? undefined : standard.id)}
                            >
                                <div className="standard-result-meta">
                                    <span>{standard.sector}</span>
                                    {standard.clauses.length > 0 &&
                                        <span>{standard.clauses.length} clauses</span>}
                                    {standard.tests.length > 0 && <span>{standard.tests.length} tests</span>}
                                </div>
                                <h2>{standard.number}</h2>
                                <p>{standard.title}</p>
                                <div className="standard-submeta">
                                    <StatusPill status={standard.status}/>
                                    <span className="scope-line">{truncate(standard.scope, 180)}</span>
                                </div>
                            </button>

                            <div className="standard-result-actions">
                                {onCitation && (
                                    <button
                                        type="button"
                                        className="button ghost compact"
                                        onClick={() => onCitation(standard.id)}
                                    >
                                        <ExternalLink size={15}/> View document
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="button secondary compact"
                                    onClick={() => setSelectedId(expanded ? undefined : standard.id)}
                                >
                                    {expanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                                    {expanded ? "Hide detail" : "Detail"}
                                </button>
                            </div>

                            {expanded && (
                                <StandardDetail
                                    standard={standard}
                                    id={`standard-detail-${standard.id}`}
                                    onOpenDocument={onOpenDocument}
                                    onOpenStandard={openRelated}
                                />
                            )}
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

function StandardDetail({
                            standard,
                            id,
                            onOpenDocument,
                            onOpenStandard,
                        }: {
    standard: Standard;
    id: string;
    onOpenDocument?: (standardId: string, clauseId: string) => void;
    onOpenStandard: (standard: Standard) => void;
}) {
    const qco = standard.qcoId ? getQcoById(standard.qcoId) : undefined;
    const scheme = standard.schemeId ? getSchemeById(standard.schemeId) : undefined;
    const supersedes = standard.supersedes ? resolveReference(standard.supersedes) : undefined;
    const supersededBy = standard.supersededBy ? resolveReference(standard.supersededBy) : undefined;
    const related = standard.relatedIds
        .map((relatedId) => getStandardById(relatedId) ?? getStandardByNumber(relatedId))
        .filter((item): item is Standard => Boolean(item));

    return (
        <div className="standard-detail" id={id}>
            <div className="detail-block">
                <span className="field-label">Scope</span>
                <p>{standard.scope}</p>
                {standard.keywords.length > 0 && (
                    <div className="chip-row keyword-chips">
                        {standard.keywords.map((keyword) => <span className="chip" key={keyword}>{keyword}</span>)}
                    </div>
                )}
            </div>

            {(standard.supersedes || standard.supersededBy) && (
                <div className="detail-block">
                    <span className="field-label">Revision history</span>
                    <div className="revision-links">
                        {standard.supersedes && (
                            <span className="active-filter-note">
                                <RotateCcw size={14}/> Supersedes{" "}
                                {supersedes ? (
                                    <button
                                        type="button"
                                        className="inline-action"
                                        onClick={() => onOpenStandard(supersedes)}
                                    >
                                        {supersedes.number} <ChevronRight size={12}/>
                                    </button>
                                ) : <strong>{standard.supersedes}</strong>}
                            </span>
                        )}
                        {standard.supersededBy && (
                            <span className="active-filter-note">
                                <AlertCircle size={14}/> Superseded by{" "}
                                {supersededBy ? (
                                    <button
                                        type="button"
                                        className="inline-action"
                                        onClick={() => onOpenStandard(supersededBy)}
                                    >
                                        {supersededBy.number} <ChevronRight size={12}/>
                                    </button>
                                ) : <strong>{standard.supersededBy}</strong>}
                            </span>
                        )}
                    </div>
                </div>
            )}

            <div className="detail-split">
                <div className="detail-block">
                    <span className="field-label">Quality Control Order</span>
                    {qco ? (
                        <div className="detail-card">
                            <dl className="meta-rows">
                                <div className="meta-row">
                                    <dt>Order</dt>
                                    <dd>{qco.name}</dd>
                                </div>
                                <div className="meta-row">
                                    <dt>Ministry</dt>
                                    <dd>{qco.ministry}</dd>
                                </div>
                                <div className="meta-row">
                                    <dt>Notification</dt>
                                    <dd>{qco.notification}</dd>
                                </div>
                                <div className="meta-row">
                                    <dt>Effective from</dt>
                                    <dd>{qco.effectiveFrom}</dd>
                                </div>
                                <div className="meta-row">
                                    <dt>Status</dt>
                                    <dd>
                                        <span
                                            className={`status ${qco.status === "in-force" ? "verified" : qco.status === "notified" ? "current" : "neutral"}`}>
                                            <Gavel size={12}/> {qco.status.replace("-", " ")}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                            <p className="view-note">{qco.summary}</p>
                        </div>
                    ) : (
                        <div className="detail-card empty">
                            <ShieldCheck size={16}/>&nbsp;No Quality Control Order linked to this standard.
                        </div>
                    )}
                </div>

                <div className="detail-block">
                    <span className="field-label">Certification and testing</span>
                    <div className="detail-card">
                        <dl className="meta-rows">
                            <div className="meta-row">
                                <dt>Scheme</dt>
                                <dd>{scheme ? scheme.name : "Not mapped in this corpus"}</dd>
                            </div>
                            <div className="meta-row">
                                <dt>Sector</dt>
                                <dd>{standard.sector}</dd>
                            </div>
                            <div className="meta-row">
                                <dt>Year</dt>
                                <dd>{standard.year}</dd>
                            </div>
                        </dl>
                        {standard.tests.length > 0 && (
                            <>
                                <span className="field-label spaced">Required tests</span>
                                <div className="chip-row">
                                    {standard.tests.map((test) => (
                                        <span className="chip navy" key={test}><FlaskConical size={12}/> {test}</span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {standard.clauses.length > 0 && (
                <div className="detail-block">
                    <span className="field-label">Clauses ({standard.clauses.length})</span>
                    <div className="clause-list">
                        {standard.clauses.map((clause) => (
                            <div className="clause-item" key={clause.id}>
                                <div className="clause-item-head">
                                    <div>
                                        <span className="clause-number">{clause.number}</span>
                                        <span className="clause-title">{clause.title}</span>
                                    </div>
                                    <span className="clause-page">Page {clause.page}</span>
                                </div>
                                <p>{clause.text}</p>
                                {onOpenDocument && (
                                    <div className="clause-item-actions">
                                        <button
                                            type="button"
                                            className="inline-action"
                                            onClick={() => onOpenDocument(standard.id, clause.id)}
                                        >
                                            <FileText size={14}/> View document
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {related.length > 0 && (
                <div className="detail-block">
                    <span className="field-label">Related standards</span>
                    <div className="chip-row">
                        {related.map((item) => (
                            <button
                                type="button"
                                className="chip navy"
                                key={item.id}
                                onClick={() => onOpenStandard(item)}
                                title={item.title}
                            >
                                <BookOpen size={12}/> {item.number}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
