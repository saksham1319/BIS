"use client";

import {
    ArrowUpDown,
    BookOpen,
    Building2,
    CheckCircle2,
    FlaskConical,
    Mail,
    MapPin,
    Phone,
    Search,
    Timer,
    X,
} from "lucide-react";
import {useCallback, useMemo, useState} from "react";
import {labStates, labs as allLabs} from "@/lib/bis/data";
import type {Laboratory} from "@/lib/bis/types";

type SortKey = "relevance" | "turnaround" | "alphabetical";

export interface LabsFinderProps {
    /** Seeds the search box on mount. */
    initialQuery?: string;
}

const MAX_COMPARE = 3;

const sortOptions: { value: SortKey; label: string }[] = [
    {value: "relevance", label: "Relevance"},
    {value: "turnaround", label: "Fastest turnaround"},
    {value: "alphabetical", label: "Alphabetical"},
];

function telHref(contact: string): string {
    const cleaned = contact.replace(/[^\d+]/g, "");
    return `tel:${cleaned}`;
}

function scoreLab(lab: Laboratory, terms: string[]): number {
    if (terms.length === 0) return 0;
    let score = 0;
    const name = lab.name.toLowerCase();
    const city = lab.city.toLowerCase();
    const state = lab.state.toLowerCase();
    const groups = lab.testGroups.join(" ").toLowerCase();
    const recognised = lab.recognisedFor.join(" ").toLowerCase();
    const accreditation = lab.accreditation.toLowerCase();

    for (const term of terms) {
        if (name.includes(term)) score += name.startsWith(term) ? 6 : 4;
        if (recognised.includes(term)) score += 5;
        if (groups.includes(term)) score += 3;
        if (city.includes(term)) score += 3;
        if (state.includes(term)) score += 2;
        if (accreditation.includes(term)) score += 1;
    }
    return score;
}

export function LabsFinder({initialQuery = ""}: LabsFinderProps) {
    const [query, setQuery] = useState(initialQuery);
    const [prevInitialQuery, setPrevInitialQuery] = useState(initialQuery);
    if (initialQuery !== prevInitialQuery) {
        setPrevInitialQuery(initialQuery);
        setQuery(initialQuery);
    }
    const [state, setState] = useState("all");
    const [testGroup, setTestGroup] = useState("all");
    const [sort, setSort] = useState<SortKey>("relevance");
    const [compareIds, setCompareIds] = useState<string[]>([]);

    const testGroups = useMemo(() => {
        const set = new Set<string>();
        for (const lab of allLabs) for (const group of lab.testGroups) set.add(group);
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, []);

    const terms = useMemo(
        () => query.trim().toLowerCase().split(/\s+/).filter(Boolean),
        [query],
    );

    const results = useMemo(() => {
        const matched = allLabs.filter((lab) => {
            if (state !== "all" && lab.state !== state) return false;
            if (testGroup !== "all" && !lab.testGroups.includes(testGroup)) return false;
            if (terms.length === 0) return true;
            const haystack = [
                lab.name,
                lab.city,
                lab.state,
                lab.accreditation,
                lab.testGroups.join(" "),
                lab.recognisedFor.join(" "),
            ].join(" ").toLowerCase();
            return terms.every((term) => haystack.includes(term));
        });

        const sorted = [...matched];
        if (sort === "turnaround") {
            sorted.sort((a, b) => a.turnaroundDays - b.turnaroundDays || a.name.localeCompare(b.name));
        } else if (sort === "alphabetical") {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            sorted.sort((a, b) =>
                scoreLab(b, terms) - scoreLab(a, terms)
                || a.turnaroundDays - b.turnaroundDays
                || a.name.localeCompare(b.name));
        }
        return sorted;
    }, [terms, state, testGroup, sort]);

    const filtersActive = query.trim().length > 0 || state !== "all" || testGroup !== "all";

    const activeFilterLabels = useMemo(() => {
        const labels: string[] = [];
        if (query.trim()) labels.push(`“${query.trim()}”`);
        if (state !== "all") labels.push(state);
        if (testGroup !== "all") labels.push(testGroup);
        return labels;
    }, [query, state, testGroup]);

    const clearFilters = useCallback(() => {
        setQuery("");
        setState("all");
        setTestGroup("all");
    }, []);

    const compared = useMemo(
        () => compareIds
            .map((id) => allLabs.find((lab) => lab.id === id))
            .filter((lab): lab is Laboratory => Boolean(lab)),
        [compareIds],
    );

    const sharedGroups = useMemo(() => {
        if (compared.length < 2) return [];
        const [first, ...rest] = compared;
        return first.testGroups.filter((group) => rest.every((lab) => lab.testGroups.includes(group)));
    }, [compared]);

    const toggleCompare = useCallback((id: string) => {
        setCompareIds((current) => {
            if (current.includes(id)) return current.filter((item) => item !== id);
            if (current.length >= MAX_COMPARE) return current;
            return [...current, id];
        });
    }, []);

    return (
        <div className="workspace-page labs-page">
            <div className="page-heading">
                <div>
                    <h1>Testing laboratories</h1>
                    <p>Find recognised laboratories by name, city, state, Indian Standard or test group.</p>
                </div>
            </div>

            <section className="lab-search-panel">
                <label htmlFor="lab-search">Which laboratory capability do you need?</label>
                <div className="lab-search-row">
                    <Search size={21}/>
                    <input
                        id="lab-search"
                        type="search"
                        value={query}
                        autoComplete="off"
                        placeholder="Lab name, city, state, IS number or test group"
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    {query && (
                        <button
                            type="button"
                            className="button ghost compact"
                            onClick={() => setQuery("")}
                        >
                            <X size={15}/> Clear
                        </button>
                    )}
                </div>

                <div className="lab-filters">
                    <label className="lab-filter-field">
                        <MapPin size={15}/>
                        <span className="sr-only">Filter by state</span>
                        <select value={state} onChange={(event) => setState(event.target.value)}>
                            <option value="all">All states</option>
                            {labStates.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </label>

                    <label className="lab-filter-field">
                        <FlaskConical size={15}/>
                        <span className="sr-only">Filter by test group</span>
                        <select value={testGroup} onChange={(event) => setTestGroup(event.target.value)}>
                            <option value="all">All test groups</option>
                            {testGroups.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </label>

                    <label className="lab-filter-field">
                        <ArrowUpDown size={15}/>
                        <span className="sr-only">Sort laboratories</span>
                        <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
                            {sortOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                        </select>
                    </label>
                </div>
            </section>

            <div className="lab-result-layout">
                <div className="lab-list">
                    <div className="results-summary" aria-live="polite">
                        <strong>{results.length} {results.length === 1 ? "laboratory" : "laboratories"}</strong>
                        {filtersActive
                            ? <span>Filtered by {activeFilterLabels.join(" · ")}</span>
                            : <span>Sorted by {sortOptions.find((item) => item.value === sort)?.label.toLowerCase()}</span>}
                    </div>

                    {results.length === 0 ? (
                        <div className="empty-state">
                            <Building2 size={28}/>
                            <h2>{filtersActive ? "No laboratories match these filters" : "No laboratories loaded"}</h2>
                            <p>
                                {filtersActive
                                    ? `Nothing in the corpus matches ${activeFilterLabels.join(" and ")}. Widen the state or test-group filter, or search for an IS number instead.`
                                    : "The demonstration corpus does not contain any recognised laboratories yet."}
                            </p>
                            {filtersActive && (
                                <button type="button" className="button secondary" onClick={clearFilters}>
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : results.map((lab) => {
                        const checked = compareIds.includes(lab.id);
                        const disabled = !checked && compareIds.length >= MAX_COMPARE;
                        return (
                            <article className="lab-result" key={lab.id}>
                                <div className="lab-heading">
                                    <span className="lab-logo"><Building2 size={22}/></span>
                                    <div>
                                        <h2>{lab.name}</h2>
                                        <p><MapPin size={15}/> {lab.city} <span>{lab.state}</span></p>
                                    </div>
                                    <label className="compare-check">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            disabled={disabled}
                                            aria-label={`Compare ${lab.name}`}
                                            onChange={() => toggleCompare(lab.id)}
                                        />
                                        Compare
                                    </label>
                                </div>

                                <div className="lab-chips">
                                    <div>
                                        <span>Test groups</span>
                                        <div className="chip-row">
                                            {lab.testGroups.map((group) => (
                                                <span className="chip" key={group}><FlaskConical size={11}/> {group}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <span>Recognised for</span>
                                        <div className="chip-row">
                                            {lab.recognisedFor.map((number) => (
                                                <span className="chip navy" key={number}><BookOpen size={11}/> {number}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="verification-line">
                                    <CheckCircle2 size={16}/> {lab.accreditation}
                                    <span className="lab-turnaround">
                                        <Timer size={14}/> {lab.turnaroundDays} day turnaround
                                    </span>
                                </div>

                                <div className="lab-contact-row">
                                    <a className="contact-link" href={telHref(lab.contact)}>
                                        <Phone size={14}/> {lab.contact}
                                    </a>
                                    <a className="contact-link" href={`mailto:${lab.email}`}>
                                        <Mail size={14}/> {lab.email}
                                    </a>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <aside className="compare-panel" aria-label="Laboratory comparison">
                    <h2>Compare laboratories</h2>
                    <p>
                        {compared.length === 0
                            ? `Tick up to ${MAX_COMPARE} laboratories to compare turnaround, accreditation and test coverage side by side.`
                            : `${compared.length} of ${MAX_COMPARE} selected.`}
                    </p>

                    {compared.length > 0 && (
                        <>
                            <div className="table-scroll">
                                <table className="data-table">
                                    <thead>
                                    <tr>
                                        <th scope="col">Attribute</th>
                                        {compared.map((lab) => <th scope="col" key={lab.id}>{lab.name}</th>)}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <th scope="row">Turnaround</th>
                                        {compared.map((lab) => (
                                            <td key={lab.id}>{lab.turnaroundDays} days</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <th scope="row">Accreditation</th>
                                        {compared.map((lab) => <td key={lab.id}>{lab.accreditation}</td>)}
                                    </tr>
                                    <tr>
                                        <th scope="row">State</th>
                                        {compared.map((lab) => <td key={lab.id}>{lab.city}, {lab.state}</td>)}
                                    </tr>
                                    <tr>
                                        <th scope="row">Test groups</th>
                                        {compared.map((lab) => <td key={lab.id}>{lab.testGroups.length}</td>)}
                                    </tr>
                                    <tr>
                                        <th scope="row">IS recognitions</th>
                                        {compared.map((lab) => <td key={lab.id}>{lab.recognisedFor.length}</td>)}
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            {compared.length > 1 && (
                                <p className="view-note">
                                    {sharedGroups.length > 0
                                        ? <>Shared test groups: <span className="compare-overlap">{sharedGroups.join(", ")}</span></>
                                        : "No test group is common to every selected laboratory."}
                                </p>
                            )}

                            <button
                                type="button"
                                className="button secondary full"
                                onClick={() => setCompareIds([])}
                            >
                                <X size={15}/> Clear comparison
                            </button>
                        </>
                    )}
                </aside>
            </div>
        </div>
    );
}
