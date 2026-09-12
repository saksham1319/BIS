"use client";

import {
    Barcode,
    DiamondsFour,
    Hash,
    MagnifyingGlass,
    MapPin,
    Phone,
    SealCheck,
    ShieldCheck,
    Storefront,
    WarningCircle,
    X,
    XCircle,
} from "@phosphor-icons/react";
import {FormEvent, useCallback, useMemo, useState} from "react";
import {centreStates, hallmarkingCentres} from "@/lib/bis/data";
import type {HallmarkingCentre} from "@/lib/bis/types";

type HuidOutcome =
    | { kind: "format-invalid"; input: string }
    | { kind: "not-found"; input: string }
    | {
    kind: "verified";
    input: string;
    purity: string;
    jeweller: string;
    centre: HallmarkingCentre | undefined;
    markedOn: string;
};

const HUID_PATTERN = /^[A-Za-z0-9]{6}$/;

const demoPurities = ["22K916 (91.6% gold)", "18K750 (75.0% gold)", "14K585 (58.5% gold)", "24K995 (99.5% gold)"];
const demoMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

/** Deterministic 32-bit hash so the same HUID always produces the same demo outcome. */
function hashHuid(value: string): number {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash);
}

function telHref(contact: string): string {
    return `tel:${contact.replace(/[^\d+]/g, "")}`;
}

function evaluateHuid(raw: string): HuidOutcome {
    const input = raw.trim().toUpperCase();
    if (!HUID_PATTERN.test(input)) return {kind: "format-invalid", input};

    const hash = hashHuid(input);
    // Roughly 3 in 10 demo codes resolve to "not found" so the miss path is demonstrable.
    if (hash % 10 >= 7) return {kind: "not-found", input};

    const centre = hallmarkingCentres.length > 0
        ? hallmarkingCentres[hash % hallmarkingCentres.length]
        : undefined;

    return {
        kind: "verified",
        input,
        purity: demoPurities[hash % demoPurities.length],
        jeweller: `RJ-${(hash % 900000 + 100000).toString()}`,
        centre,
        markedOn: `${(hash % 28) + 1} ${demoMonths[hash % 12]} ${2023 + (hash % 3)}`,
    };
}

export function HallmarkingView() {
    const [huid, setHuid] = useState("");
    const [validation, setValidation] = useState<string | null>(null);
    const [outcome, setOutcome] = useState<HuidOutcome | null>(null);

    const [centreQuery, setCentreQuery] = useState("");
    const [centreState, setCentreState] = useState("all");

    const centres = useMemo(() => {
        const term = centreQuery.trim().toLowerCase();
        return hallmarkingCentres.filter((centre) => {
            if (centreState !== "all" && centre.state !== centreState) return false;
            if (!term) return true;
            return `${centre.name} ${centre.city} ${centre.state} ${centre.registration}`.toLowerCase().includes(term);
        });
    }, [centreQuery, centreState]);

    const centreFiltersActive = centreQuery.trim().length > 0 || centreState !== "all";

    const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const value = huid.trim();
        if (!HUID_PATTERN.test(value)) {
            setValidation("Enter exactly 6 letters or digits, as printed on the article.");
        } else {
            setValidation(null);
        }
        setOutcome(evaluateHuid(value));
    }, [huid]);

    return (
        <div className="workspace-page hallmarking-page">
            <div className="page-heading">
                <div>
                    <h1>Hallmarking</h1>
                    <p>Check what the marks on a gold article mean, try the HUID lookup demonstration, and find a
                        recognised Assaying and Hallmarking Centre.</p>
                </div>
            </div>

            <section className="hallmark-verify" aria-labelledby="huid-heading">
                <span className="demo-flag"><WarningCircle size={13} weight="fill"/> Demonstration only — not a BIS registry lookup</span>

                <div>
                    <DiamondsFour size={34} weight="duotone"/>
                    <h2 id="huid-heading">Check a HUID</h2>
                    <p>
                        Enter the six-character HUID printed on a hallmarked article. This demo returns a simulated
                        result generated locally in your browser from the code you type. It does not contact BIS and
                        proves nothing about a real article.
                    </p>
                </div>

                <form onSubmit={onSubmit} noValidate>
                    <label htmlFor="huid-input">HUID number</label>
                    <div>
                        <input
                            id="huid-input"
                            value={huid}
                            maxLength={6}
                            inputMode="text"
                            autoComplete="off"
                            spellCheck={false}
                            placeholder="For example, AB12CD"
                            aria-describedby={validation ? "huid-error" : "huid-hint"}
                            aria-invalid={validation ? true : undefined}
                            onChange={(event) => {
                                setHuid(event.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase());
                                setValidation(null);
                            }}
                        />
                        <button type="submit" className="button primary">Check HUID</button>
                    </div>
                    {validation
                        ? <p className="huid-error" id="huid-error" role="alert">
                            <XCircle size={14} weight="fill"/> {validation}
                        </p>
                        : <small id="huid-hint">Six letters or digits. Use the official BIS Care app for a real
                            verification.</small>}
                </form>

                {outcome && <HuidResult outcome={outcome}/>}
            </section>

            <section className="centre-section" aria-labelledby="centres-heading">
                <div className="section-title-row">
                    <div>
                        <h2 id="centres-heading">Assaying and Hallmarking Centres</h2>
                        <p>Search {hallmarkingCentres.length} centres in the demonstration corpus by name, city or
                            state.</p>
                    </div>
                </div>

                <div className="centre-toolbar">
                    <div className="explorer-search">
                        <MagnifyingGlass size={19}/>
                        <label htmlFor="centre-search" className="sr-only">Search hallmarking centres</label>
                        <input
                            id="centre-search"
                            type="search"
                            value={centreQuery}
                            autoComplete="off"
                            placeholder="Centre name, city or registration"
                            onChange={(event) => setCentreQuery(event.target.value)}
                        />
                    </div>

                    <div className="select-field">
                        <label className="field-label" htmlFor="centre-state">State</label>
                        <select
                            id="centre-state"
                            value={centreState}
                            onChange={(event) => setCentreState(event.target.value)}
                        >
                            <option value="all">All states</option>
                            {centreStates.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </div>

                    {centreFiltersActive && (
                        <button
                            type="button"
                            className="button ghost compact"
                            onClick={() => {
                                setCentreQuery("");
                                setCentreState("all");
                            }}
                        >
                            <X size={15}/> Clear filters
                        </button>
                    )}
                </div>

                <div className="results-summary" aria-live="polite">
                    <strong>{centres.length} {centres.length === 1 ? "centre" : "centres"}</strong>
                    <span>Illustrative demo data</span>
                </div>

                {centres.length === 0 ? (
                    <div className="empty-state">
                        <MapPin size={26}/>
                        <h3>No centres match these filters</h3>
                        <p>
                            Nothing matches
                            {centreQuery.trim() ? ` “${centreQuery.trim()}”` : ""}
                            {centreQuery.trim() && centreState !== "all" ? " in" : ""}
                            {centreState !== "all" ? ` ${centreState}` : ""}. Try a different city or clear the filters.
                        </p>
                        <button
                            type="button"
                            className="button secondary"
                            onClick={() => {
                                setCentreQuery("");
                                setCentreState("all");
                            }}
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="centre-list">
                        {centres.map((centre) => (
                            <article className="centre-card" key={centre.id}>
                                <span className="centre-mark"><Storefront size={20}/></span>
                                <div>
                                    <h3>{centre.name}</h3>
                                    <p className="centre-place"><MapPin size={13}/> {centre.city}, {centre.state}</p>
                                    <div className="chip-row">
                                        {centre.purities.map((purity) => (
                                            <span className="chip navy" key={purity}>{purity}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="centre-side">
                                    <span className="centre-reg">{centre.registration}</span>
                                    <a className="contact-link" href={telHref(centre.contact)}>
                                        <Phone size={14}/> {centre.contact}
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section className="hallmark-explainer">
                <h2>How to check your hallmark</h2>
                <p>
                    On a hallmarked gold article sold in India you should be able to find three marks, usually together
                    and often very small. Use a magnifying glass or your phone camera zoom. If any of the three is
                    missing, ask the jeweller before you buy.
                </p>
                <div className="mark-grid">
                    <div className="mark-card">
                        <span><SealCheck size={20} weight="fill"/></span>
                        <strong>1. The BIS logo</strong>
                        <p>
                            A small triangular mark. It says the article was tested and marked at a recognised
                            Assaying and Hallmarking Centre.
                        </p>
                    </div>
                    <div className="mark-card">
                        <span><Hash size={20}/></span>
                        <strong>2. The purity grade</strong>
                        <p>
                            The karat and fineness, written like <em>22K916</em>. The number is parts of gold per
                            thousand — 916 means 91.6% gold. Higher is purer and costs more.
                        </p>
                    </div>
                    <div className="mark-card">
                        <span><Barcode size={20}/></span>
                        <strong>3. The 6-digit HUID</strong>
                        <p>
                            A unique six-character code of letters and digits, different on every article. It links
                            that single piece to its hallmarking record.
                        </p>
                    </div>
                </div>
                <p className="view-note">
                    <ShieldCheck size={12}/> Verify a real HUID in the official BIS Care app. Illustrative demo data —
                    verify against official BIS sources.
                </p>
            </section>
        </div>
    );
}

function HuidResult({outcome}: { outcome: HuidOutcome }) {
    if (outcome.kind === "format-invalid") {
        return (
            <div className="huid-result is-invalid" role="status">
                <div className="huid-result-head">
                    <XCircle size={22} weight="fill"/>
                    <strong>Format not valid</strong>
                    <span className="demo-flag">Demo result</span>
                </div>
                <p>
                    A HUID is exactly six characters made of letters and digits, for example <strong>AB12CD</strong>.
                    “{outcome.input || "(empty)"}” does not match that shape, so there is nothing to look up.
                </p>
            </div>
        );
    }

    if (outcome.kind === "not-found") {
        return (
            <div className="huid-result is-missing" role="status">
                <div className="huid-result-head">
                    <WarningCircle size={22} weight="fill"/>
                    <strong>No demo record for {outcome.input}</strong>
                    <span className="demo-flag">Demo result</span>
                </div>
                <p>
                    This code is well formed but has no entry in the demonstration dataset. In the real BIS system a
                    missing record would be worth raising with the jeweller. Check the code again, then verify it in
                    the official BIS Care app.
                </p>
            </div>
        );
    }

    return (
        <div className="huid-result is-verified" role="status">
            <div className="huid-result-head">
                <SealCheck size={22} weight="fill"/>
                <strong>Demo record found for {outcome.input}</strong>
                <span className="demo-flag">Demo result</span>
            </div>
            <dl className="meta-rows">
                <div className="meta-row">
                    <dt>Purity</dt>
                    <dd>{outcome.purity}</dd>
                </div>
                <div className="meta-row">
                    <dt>Jeweller registration</dt>
                    <dd>{outcome.jeweller}</dd>
                </div>
                <div className="meta-row">
                    <dt>Hallmarking centre</dt>
                    <dd>{outcome.centre ? `${outcome.centre.name}, ${outcome.centre.city}` : "Not available"}</dd>
                </div>
                <div className="meta-row">
                    <dt>Centre registration</dt>
                    <dd>{outcome.centre ? outcome.centre.registration : "Not available"}</dd>
                </div>
                <div className="meta-row">
                    <dt>Marked on</dt>
                    <dd>{outcome.markedOn}</dd>
                </div>
            </dl>
            <small>
                Generated locally from the characters you typed. No BIS registry was queried and these details do not
                describe a real article.
            </small>
        </div>
    );
}
