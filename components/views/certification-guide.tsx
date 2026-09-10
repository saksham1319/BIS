"use client";

import {
    CalendarBlank,
    Certificate,
    Check,
    CurrencyInr,
    ListChecks,
    Storefront,
} from "@phosphor-icons/react";
import {KeyboardEvent, useMemo, useRef, useState} from "react";
import {schemes} from "@/lib/bis/data";
import type {CertificationScheme} from "@/lib/bis/types";

export interface CertificationGuideProps {
    /** Opens the guide on a specific scheme. */
    initialSchemeId?: string;
}

export function CertificationGuide({initialSchemeId}: CertificationGuideProps) {
    const firstId = schemes[0]?.id ?? "";
    const [schemeId, setSchemeId] = useState(initialSchemeId ?? firstId);
    const [checked, setChecked] = useState<string[]>([]);
    const [lastInitialSchemeId, setLastInitialSchemeId] = useState(initialSchemeId);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Adjusting state during render (the documented React pattern) rather than in an effect:
    // a new initialSchemeId prop switches scheme and clears the per-scheme checklist.
    if (lastInitialSchemeId !== initialSchemeId) {
        setLastInitialSchemeId(initialSchemeId);
        if (initialSchemeId && initialSchemeId !== schemeId) {
            setSchemeId(initialSchemeId);
            setChecked([]);
        }
    }

    const selectScheme = (nextId: string) => {
        if (nextId === schemeId) return;
        setSchemeId(nextId);
        // The document checklist is per scheme — it resets whenever the scheme changes.
        setChecked([]);
    };

    const scheme: CertificationScheme | undefined = useMemo(
        () => schemes.find((item) => item.id === schemeId) ?? schemes[0],
        [schemeId],
    );

    if (!scheme) {
        return (
            <div className="workspace-page">
                <div className="page-heading">
                    <div>
                        <h1>Certification guidance</h1>
                        <p>A clear route through product certification, from scope check to licence.</p>
                    </div>
                </div>
                <div className="empty-state">
                    <Certificate size={28}/>
                    <h2>No certification schemes loaded</h2>
                    <p>The demonstration corpus does not contain any certification schemes.</p>
                </div>
            </div>
        );
    }

    const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const current = schemes.findIndex((item) => item.id === scheme.id);
        let next = -1;
        if (event.key === "ArrowRight") next = (current + 1) % schemes.length;
        else if (event.key === "ArrowLeft") next = (current - 1 + schemes.length) % schemes.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = schemes.length - 1;
        if (next < 0) return;
        event.preventDefault();
        selectScheme(schemes[next].id);
        tabRefs.current[next]?.focus();
    };

    const readyCount = checked.length;
    const totalDocuments = scheme.documents.length;
    const percent = totalDocuments === 0 ? 0 : Math.round((readyCount / totalDocuments) * 100);

    const toggleDocument = (document: string) => {
        setChecked((current) => current.includes(document)
            ? current.filter((item) => item !== document)
            : [...current, document]);
    };

    return (
        <div className="workspace-page certification-page">
            <div className="page-heading">
                <div>
                    <h1>Certification guidance</h1>
                    <p>Pick a scheme to see who it applies to, the steps involved, what you need to prepare, and what
                        it costs.</p>
                </div>
            </div>

            <div
                className="scheme-tabs"
                role="tablist"
                aria-label="Certification schemes"
                onKeyDown={onTabKeyDown}
            >
                {schemes.map((item, index) => (
                    <button
                        key={item.id}
                        type="button"
                        role="tab"
                        id={`scheme-tab-${item.id}`}
                        ref={(node) => {
                            tabRefs.current[index] = node;
                        }}
                        aria-selected={item.id === scheme.id}
                        aria-controls={`scheme-panel-${item.id}`}
                        tabIndex={item.id === scheme.id ? 0 : -1}
                        onClick={() => selectScheme(item.id)}
                    >
                        {item.name}
                    </button>
                ))}
            </div>

            <div
                role="tabpanel"
                id={`scheme-panel-${scheme.id}`}
                aria-labelledby={`scheme-tab-${scheme.id}`}
                tabIndex={-1}
            >
                <section className="scheme-panel first">
                    <h2>{scheme.name}</h2>
                    <p>{scheme.summary}</p>
                </section>

                <div className="cert-summary">
                    <div>
                        <span>Applies to</span>
                        <strong>
                            <Storefront size={15}/> Applicability
                        </strong>
                        <p>{scheme.applicability}</p>
                    </div>
                    <div>
                        <span>Indicative timeline</span>
                        <strong><CalendarBlank size={15}/> {scheme.timeline}</strong>
                        <p>End-to-end estimate once a complete application is submitted.</p>
                    </div>
                    <div>
                        <span>Preparation</span>
                        <strong>{totalDocuments} documents</strong>
                        <p>{scheme.steps.length} process steps before a licence decision.</p>
                    </div>
                </div>

                <div className="cert-layout">
                    <section className="timeline-section">
                        <div className="section-title-row">
                            <div>
                                <h2>Process steps</h2>
                                <p>Each step must be completed before the next one can be assessed.</p>
                            </div>
                            <span className="status neutral"><ListChecks size={13}/> {scheme.steps.length} steps</span>
                        </div>
                        <ol className="cert-timeline">
                            {scheme.steps.map((step, index) => (
                                <li key={`${step.title}-${index}`}>
                                    <span className="timeline-marker numbered">{index + 1}</span>
                                    <div>
                                        <strong>{step.title}</strong>
                                        <p>{step.detail}</p>
                                    </div>
                                    <span className="status neutral">Step {index + 1}</span>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <aside className="requirements-panel">
                        <h3>Documents to prepare</h3>
                        <div className="requirement-progress">
                            <strong>{readyCount} of {totalDocuments} ready</strong>
                            <span>Tick each document once you have it on file.</span>
                            <span className="progress-track" aria-hidden="true">
                                <i style={{width: `${percent}%`}}/>
                            </span>
                        </div>
                        <p className="sr-only" aria-live="polite">
                            {readyCount} of {totalDocuments} documents ready.
                        </p>
                        {scheme.documents.map((document) => (
                            <label key={document}>
                                <input
                                    type="checkbox"
                                    checked={checked.includes(document)}
                                    onChange={() => toggleDocument(document)}
                                />
                                <span>{document}</span>
                            </label>
                        ))}
                        <p className="checklist-hint">
                            This checklist is local to your browser session and resets when you change scheme.
                        </p>
                        {readyCount === totalDocuments && totalDocuments > 0 && (
                            <span className="status complete"><Check size={13} weight="bold"/> All documents ready</span>
                        )}
                    </aside>
                </div>

                <section className="fee-section">
                    <h2>Fees</h2>
                    <div className="table-scroll">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th scope="col">Item</th>
                                <th scope="col">Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {scheme.fees.map((fee) => (
                                <tr key={fee.label}>
                                    <th scope="row">{fee.label}</th>
                                    <td className="fee-amount"><CurrencyInr size={12}/> {fee.amount}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="view-note">
                        Illustrative demo data. Confirm current fees against the official BIS fee schedule before
                        applying.
                    </p>
                </section>
            </div>
        </div>
    );
}
