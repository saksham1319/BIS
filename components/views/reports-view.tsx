"use client";

import {
    Check,
    ClipboardList,
    Download,
    FileText,
    Files,
    Pencil,
} from "lucide-react";
import {useCallback, useMemo, useState} from "react";
import {
    getLabsForStandard,
    getQcoById,
    getSchemeById,
    labs as allLabs,
    standards as allStandards,
} from "@/lib/bis/data";
import type {Laboratory, Standard} from "@/lib/bis/types";

type ReportStatus = "ready" | "draft" | "archived";

interface ReportEntry {
    id: string;
    product: string;
    standardNumber: string;
    date: string;
    status: ReportStatus;
}

const statusPill: Record<ReportStatus, { className: string; label: string }> = {
    ready: {className: "status complete", label: "Ready"},
    draft: {className: "status current", label: "Draft"},
    archived: {className: "status neutral", label: "Archived"},
};

const seedDates = ["8 September 2026", "2 September 2026", "27 August 2026"];
const seedStatuses: ReportStatus[] = ["ready", "draft", "archived"];

function baseNumber(number: string): string {
    return number.split(":")[0].trim().toLowerCase();
}

function recommendedLabs(standard: Standard): Laboratory[] {
    const direct = getLabsForStandard(standard.number);
    if (direct.length > 0) {
        return [...direct].sort((a, b) => a.turnaroundDays - b.turnaroundDays).slice(0, 4);
    }
    // Fall back to labs whose test groups overlap the tests this standard requires.
    const tests = standard.tests.map((test) => test.toLowerCase());
    const overlapping = allLabs.filter((lab) =>
        lab.testGroups.some((group) => tests.some((test) =>
            test.includes(group.toLowerCase()) || group.toLowerCase().includes(test))));
    return [...overlapping].sort((a, b) => a.turnaroundDays - b.turnaroundDays).slice(0, 3);
}

function buildReport(standard: Standard, generatedOn: string): string {
    const qco = standard.qcoId ? getQcoById(standard.qcoId) : undefined;
    const scheme = standard.schemeId ? getSchemeById(standard.schemeId) : undefined;
    const labsForStandard = recommendedLabs(standard);
    const lines: string[] = [];

    lines.push(`# BIS compliance summary`);
    lines.push("");
    lines.push(`**Product / standard:** ${standard.number} — ${standard.title}`);
    lines.push(`**Sector:** ${standard.sector}`);
    lines.push(`**Year:** ${standard.year}`);
    lines.push(`**Standard status:** ${standard.status}`);
    lines.push(`**Generated:** ${generatedOn} by BIS Saathi`);
    if (standard.supersedes) lines.push(`**Supersedes:** ${standard.supersedes}`);
    if (standard.supersededBy) lines.push(`**Superseded by:** ${standard.supersededBy}`);
    lines.push("");

    lines.push(`## 1. Scope`);
    lines.push("");
    lines.push(standard.scope);
    if (standard.keywords.length > 0) {
        lines.push("");
        lines.push(`Keywords: ${standard.keywords.join(", ")}`);
    }
    lines.push("");

    lines.push(`## 2. Applicable Quality Control Order`);
    lines.push("");
    if (qco) {
        lines.push(`- Order: ${qco.name}`);
        lines.push(`- Ministry: ${qco.ministry}`);
        lines.push(`- Notification: ${qco.notification}`);
        lines.push(`- Effective from: ${qco.effectiveFrom}`);
        lines.push(`- Status: ${qco.status}`);
        lines.push("");
        lines.push(qco.summary);
        if (qco.coverage.length > 0) {
            lines.push("");
            lines.push(`Coverage:`);
            for (const item of qco.coverage) lines.push(`  - ${item}`);
        }
        if (qco.exemptions.length > 0) {
            lines.push("");
            lines.push(`Exemptions:`);
            for (const item of qco.exemptions) lines.push(`  - ${item}`);
        }
    } else {
        lines.push(`No Quality Control Order is linked to this standard in the demonstration corpus. Confirm applicability against the currently notified orders before relying on this summary.`);
    }
    lines.push("");

    lines.push(`## 3. Certification scheme`);
    lines.push("");
    if (scheme) {
        lines.push(`- Scheme: ${scheme.name}`);
        lines.push(`- Applies to: ${scheme.applicability}`);
        lines.push(`- Indicative timeline: ${scheme.timeline}`);
        lines.push("");
        lines.push(scheme.summary);
        lines.push("");
        lines.push(`Process:`);
        scheme.steps.forEach((step, index) => {
            lines.push(`  ${index + 1}. ${step.title} — ${step.detail}`);
        });
        lines.push("");
        lines.push(`Documents to prepare:`);
        for (const document of scheme.documents) lines.push(`  - [ ] ${document}`);
        if (scheme.fees.length > 0) {
            lines.push("");
            lines.push(`Fees:`);
            for (const fee of scheme.fees) lines.push(`  - ${fee.label}: ${fee.amount}`);
        }
    } else {
        lines.push(`No certification scheme is mapped to this standard in the demonstration corpus.`);
    }
    lines.push("");

    lines.push(`## 4. Required tests`);
    lines.push("");
    if (standard.tests.length > 0) {
        for (const test of standard.tests) lines.push(`- ${test}`);
    } else {
        lines.push(`No tests are listed against this standard in the demonstration corpus.`);
    }
    lines.push("");

    lines.push(`## 5. Key clauses`);
    lines.push("");
    if (standard.clauses.length > 0) {
        for (const clause of standard.clauses) {
            lines.push(`### ${clause.number} ${clause.title} (page ${clause.page})`);
            lines.push("");
            lines.push(clause.text);
            lines.push("");
        }
    } else {
        lines.push(`No clauses are indexed for this standard.`);
        lines.push("");
    }

    lines.push(`## 6. Recommended laboratories`);
    lines.push("");
    if (labsForStandard.length > 0) {
        for (const lab of labsForStandard) {
            lines.push(`### ${lab.name}`);
            lines.push(`- Location: ${lab.city}, ${lab.state}`);
            lines.push(`- Accreditation: ${lab.accreditation}`);
            lines.push(`- Turnaround: ${lab.turnaroundDays} days`);
            lines.push(`- Test groups: ${lab.testGroups.join(", ")}`);
            lines.push(`- Recognised for: ${lab.recognisedFor.join(", ")}`);
            lines.push(`- Contact: ${lab.contact} · ${lab.email}`);
            lines.push("");
        }
    } else {
        lines.push(`No laboratory in the demonstration corpus lists recognition for this standard.`);
        lines.push("");
    }

    lines.push(`---`);
    lines.push("");
    lines.push(`Illustrative demo data — verify against official BIS sources before making a compliance decision. This document was generated by BIS Saathi, a demonstration assistant, and is not a BIS publication.`);
    lines.push("");

    return lines.join("\n");
}

export interface ReportsViewProps {
    initialStandardId?: string;
}

export function ReportsView({initialStandardId}: ReportsViewProps = {}) {
    const defaultStandard = useMemo(() => {
        if (initialStandardId) {
            const found = allStandards.find((s) => s.id === initialStandardId || s.number === initialStandardId);
            if (found) return found;
        }
        return allStandards[0];
    }, [initialStandardId]);

    const [selectedId, setSelectedId] = useState(defaultStandard?.id ?? "");
    const [prevInitialStandardId, setPrevInitialStandardId] = useState(initialStandardId);
    if (initialStandardId !== prevInitialStandardId) {
        setPrevInitialStandardId(initialStandardId);
        if (initialStandardId) {
            const found = allStandards.find((s) => s.id === initialStandardId || s.number === initialStandardId);
            if (found) setSelectedId(found.id);
        }
    }
    const [generated, setGenerated] = useState<ReportEntry[]>([]);
    const [notice, setNotice] = useState<string | null>(null);

    const seeded = useMemo<ReportEntry[]>(
        () => allStandards.slice(0, 3).map((standard, index) => ({
            id: `seed-${standard.id}`,
            product: standard.title,
            standardNumber: standard.number,
            date: seedDates[index] ?? seedDates[seedDates.length - 1],
            status: seedStatuses[index] ?? "archived",
        })),
        [],
    );

    const reports = useMemo(() => [...generated, ...seeded], [generated, seeded]);

    const selected = useMemo(
        () => allStandards.find((standard) => standard.id === selectedId) ?? allStandards[0],
        [selectedId],
    );

    const download = useCallback((standard: Standard) => {
        const generatedOn = new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        const body = buildReport(standard, generatedOn);
        const blob = new Blob([body], {type: "text/markdown;charset=utf-8"});
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `bis-compliance-${baseNumber(standard.number).replace(/[^a-z0-9]+/g, "-")}.md`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);

        setGenerated((current) => [
            {
                id: `generated-${standard.id}-${current.length}-${generatedOn}`,
                product: standard.title,
                standardNumber: standard.number,
                date: generatedOn,
                status: "ready",
            },
            ...current.filter((entry) => entry.standardNumber !== standard.number),
        ]);
        setNotice(`Downloaded a compliance summary for ${standard.number}.`);
    }, []);

    const generate = useCallback(() => {
        if (selected) download(selected);
    }, [selected, download]);

    const regenerate = useCallback((standardNumber: string) => {
        const standard = allStandards.find((item) => item.number === standardNumber);
        if (!standard) return;
        setSelectedId(standard.id);
        download(standard);
    }, [download]);

    return (
        <div className="workspace-page reports-page">
            <div className="page-heading">
                <div>
                    <h1>Documents and reports</h1>
                    <p>Export an evidence-backed compliance summary built from the standards corpus.</p>
                </div>
            </div>

            <div className="report-feature">
                <div className="report-preview">
                    <FileText size={38}/>
                    <span>BIS Saathi</span>
                    <strong>Compliance summary</strong>
                    <p>{selected ? selected.number : "No standard selected"}</p>
                    <div className="report-lines"><i/><i/><i/></div>
                </div>

                <div className="report-copy">
                    <h2>Generate a review-ready compliance brief</h2>
                    <p>
                        Pick a standard and BIS Saathi assembles its scope, the applicable Quality Control Order, the
                        certification scheme, the required tests, the indexed clauses and matching laboratories into one
                        Markdown document you can share with your team.
                    </p>

                    <div className="report-includes">
                        <span><Check size={15}/> Scope and clause extracts</span>
                        <span><Check size={15}/> QCO applicability</span>
                        <span><Check size={15}/> Scheme, documents and fees</span>
                        <span><Check size={15}/> Laboratory shortlist</span>
                    </div>

                    <div className="report-generator">
                        <label htmlFor="report-standard">
                            Standard
                            <select
                                id="report-standard"
                                value={selected?.id ?? ""}
                                onChange={(event) => {
                                    setSelectedId(event.target.value);
                                    setNotice(null);
                                }}
                            >
                                {allStandards.map((standard) => (
                                    <option key={standard.id} value={standard.id}>
                                        {standard.number} — {standard.title}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button
                            type="button"
                            className="button primary"
                            onClick={generate}
                            disabled={!selected}
                        >
                            <Download size={17}/> Generate report
                        </button>
                    </div>

                    {notice && (
                        <p className="report-status" role="status">
                            <Check size={14}/> {notice}
                        </p>
                    )}
                </div>
            </div>

            <section className="recent-reports">
                <div className="section-title-row">
                    <div>
                        <h2>Recent reports</h2>
                        <p>Generated summaries stay in this browser session only.</p>
                    </div>
                </div>

                {reports.length === 0 ? (
                    <div className="empty-state compact-empty">
                        <Files size={26}/>
                        <h3>No reports yet</h3>
                        <p>Select a standard above and generate your first compliance summary.</p>
                    </div>
                ) : (
                    <div className="saved-list">
                        {reports.map((report) => (
                            <button
                                type="button"
                                key={report.id}
                                title={`Download ${report.standardNumber} summary`}
                                onClick={() => regenerate(report.standardNumber)}
                            >
                                <span className="saved-icon">
                                    {report.status === "ready"
                                        ? <ClipboardList size={19}/>
                                        : <Pencil size={19}/>}
                                </span>
                                <span className="saved-copy">
                                    <strong>{report.product}</strong>
                                    <small>
                                        {report.standardNumber} <span>•</span> {report.date}
                                    </small>
                                </span>
                                <span className={statusPill[report.status].className}>
                                    {statusPill[report.status].label}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                <p className="view-note">
                    Illustrative demo data — verify against official BIS sources.
                </p>
            </section>
        </div>
    );
}
