"use client";

import {
    ArrowRight,
    ArrowSquareOut,
    ArrowUp,
    BookmarkSimple,
    Books,
    Buildings,
    CaretRight,
    Certificate,
    ChatTeardropDots,
    Check,
    ClipboardText,
    ClockCounterClockwise,
    DiamondsFour,
    FilePdf,
    Files,
    Flask,
    IdentificationBadge,
    List,
    MagnifyingGlass,
    Package,
    Plus,
    SealCheck,
    ShieldCheck,
    SidebarSimple,
    UserCircle,
    Warning,
} from "@phosphor-icons/react";
import type {Icon} from "@phosphor-icons/react";
import {useLocale, useTranslations} from "next-intl";
import {FormEvent, useEffect, useRef, useState} from "react";
import {Brand} from "@/components/brand";
import {LanguageSwitcher} from "@/components/language-switcher";
import {useRouter} from "@/i18n/navigation";
import {ChatThread, EvidencePanel, useChat} from "@/components/assistant";
import {
    CertificationGuide,
    DocumentViewer,
    HallmarkingView,
    LabsFinder,
    ReportsView,
    StandardsExplorer,
} from "@/components/views";

type View =
    | "assistant"
    | "products"
    | "standards"
    | "certification"
    | "labs"
    | "hallmarking"
    | "history"
    | "reports"
    | "dashboard";

type NavKey = "assistant" | "products" | "standards" | "certification" | "labs" | "hallmarking" | "history" | "reports";
type NavItem = { id: View; labelKey: NavKey; icon: Icon };

const exampleQuestion =
    "I manufacture stainless steel water bottles. Which Indian Standard applies and do I need BIS certification?";

const navItems: NavItem[] = [
    {id: "assistant", labelKey: "assistant", icon: ChatTeardropDots},
    {id: "products", labelKey: "products", icon: Package},
    {id: "standards", labelKey: "standards", icon: Books},
    {id: "certification", labelKey: "certification", icon: Certificate},
    {id: "labs", labelKey: "labs", icon: Flask},
    {id: "hallmarking", labelKey: "hallmarking", icon: DiamondsFour},
    {id: "history", labelKey: "history", icon: ClockCounterClockwise},
    {id: "reports", labelKey: "reports", icon: Files},
];

function IconButton({label, children, onClick, className = ""}: {
    label: string;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string
}) {
    return <button type="button" className={`icon-button ${className}`} aria-label={label} title={label}
                   onClick={onClick}>{children}</button>;
}

function Landing({onEnter, onNavigate, onSignIn}: {
    onEnter: (question: string) => void;
    onNavigate: (view: View) => void;
    onSignIn: () => void;
}) {
    const t = useTranslations("Landing");
    const navigation = useTranslations("Navigation");
    const common = useTranslations("Common");
    const [question, setQuestion] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const promptExamples = [t("promptOne"), t("promptTwo"), t("promptThree"), t("promptFour")];
    const quickActions = [
        {label: t("quickStandard"), icon: MagnifyingGlass},
        {label: t("quickCertification"), icon: ShieldCheck},
        {label: t("quickLab"), icon: Flask},
        {label: t("quickAsk"), icon: ChatTeardropDots},
    ];

    function submit(event: FormEvent) {
        event.preventDefault();
        onEnter(question.trim() || exampleQuestion);
    }

    function choosePrompt(prompt: string) {
        setQuestion(prompt);
        inputRef.current?.focus();
    }

    return (
        <div className="landing-shell">
            <header className="landing-header">
                <Brand/>
                <nav className="landing-nav" aria-label="Primary navigation">
                    <button onClick={() => onNavigate("assistant")}>{navigation("assistant")}</button>
                    <button onClick={() => onNavigate("standards")}>{navigation("standards")}</button>
                    <button onClick={() => onNavigate("certification")}>{navigation("certification")}</button>
                    <button onClick={() => onNavigate("labs")}>{navigation("labs")}</button>
                    <button onClick={() => onNavigate("hallmarking")}>{navigation("hallmarking")}</button>
                </nav>
                <div className="header-actions">
                    <span className="status complete" title="Grounded with Gemini 3.5 Flash">
                        <span style={{width: 6, height: 6, borderRadius: "50%", background: "currentColor"}} />
                        AI Connected
                    </span>
                    <LanguageSwitcher/>
                    <button type="button" className="button secondary sign-in-top"
                            onClick={onSignIn}>{common("signIn")}</button>
                </div>
            </header>

            <main>
                <section className="hero-section">
                    <div className="hero-copy">
                        <div className="trust-line"><ShieldCheck size={18} weight="fill"/><span>{t("trust")}</span>
                        </div>
                        <h1><span>{t("titleOne")}</span><span>{t("titleTwo")}</span></h1>
                        <p>{t("description")}</p>
                        <div className="hero-note">
                            <div className="hero-note-line"/>
                            <span>{t("guestAccess")}</span></div>
                    </div>

                    <div className="hero-workbench" aria-label="Ask BIS Saathi">
                        <div className="workbench-header">
                            <div><strong>{t("workbenchTitle")}</strong></div>
                            <span className="verified-chip"><SealCheck size={15}
                                                                       weight="fill"/> {t("sourceAware")}</span>
                        </div>
                        <form className="hero-composer" onSubmit={submit}>
                            <label htmlFor="landing-question" className="sr-only">Ask anything about BIS</label>
                            <textarea ref={inputRef} id="landing-question" value={question}
                                      onChange={(event) => setQuestion(event.target.value)}
                                      placeholder={t("placeholder")} rows={3}/>
                            <div className="composer-footer">
                                <div className="composer-tools"><span
                                    className="composer-hint">{t("describeProduct")}</span></div>
                                <button type="submit" className="send-button" aria-label="Ask BIS Saathi"><ArrowUp
                                    size={20} weight="bold"/></button>
                            </div>
                        </form>
                        <div className="prompt-list" aria-label="Example questions">
                            {promptExamples.slice(0, 3).map((prompt) => <button type="button" key={prompt}
                                                                                onClick={() => choosePrompt(prompt)}>
                                <span>{prompt}</span><ArrowRight size={16}/></button>)}
                        </div>
                    </div>
                </section>

                <section className="quick-action-band" aria-label="Common tasks">
                    <div className="band-intro"><span>{t("quickTitle")}</span><p>{t("quickDescription")}</p></div>
                    <div className="quick-action-grid">
                        {quickActions.map((action, index) => {
                            const ActionIcon = action.icon;
                            return <button type="button" key={action.label}
                                           onClick={() => index === 0 ? choosePrompt(promptExamples[0]) : onEnter(promptExamples[index])}>
                                <ActionIcon size={22}/><span>{action.label}</span><CaretRight size={15}
                                                                                              className="action-arrow"/>
                            </button>;
                        })}
                    </div>
                </section>

                <section className="evidence-story">
                    <div className="evidence-story-copy">
                        <h2>{t("evidenceTitle")}</h2>
                        <p>{t("evidenceDescription")}</p>
                        <button type="button" className="text-link"
                                onClick={() => onEnter(exampleQuestion)}>{t("inspectEvidence")} <ArrowRight size={17}/>
                        </button>
                    </div>
                    <div className="source-flow" aria-label="Answer to evidence flow">
                        <div className="flow-answer">
                            <span>{t("directAnswer")}</span><strong>{t("certificationMayApply")}</strong>
                            <p>{t("confirmScope")}</p>
                            <button type="button" onClick={() => onEnter(exampleQuestion)}>1</button>
                        </div>
                        <ArrowRight size={22} className="flow-arrow"/>
                        <div className="flow-source"><FilePdf size={26} weight="duotone"/>
                            <div><span>{t("originalSource")}</span><strong>IS 17803:2022</strong><p>Clause 4.1</p></div>
                            <SealCheck size={20} weight="fill"/></div>
                    </div>
                </section>
            </main>
            <footer className="landing-footer"><Brand/><p>{t("footerNote")}</p>
                <button type="button" onClick={() => onNavigate("assistant")}>{t("openAssistant")} <ArrowRight
                    size={16}/></button>
            </footer>
        </div>
    );
}

function AppSidebar({active, onChange, collapsed, onCollapse, onHome, onSignIn}: {
    active: View;
    onChange: (view: View) => void;
    collapsed: boolean;
    onCollapse: () => void;
    onHome: () => void;
    onSignIn: () => void
}) {
    const t = useTranslations("Navigation");
    const common = useTranslations("Common");
    return (
        <aside className={`app-sidebar ${collapsed ? "is-collapsed" : ""}`}>
            <div className="sidebar-brand-row">
                <button type="button" className="brand-button" onClick={onHome} aria-label="Go to landing page"><Brand
                    compact={collapsed}/></button>
                {!collapsed &&
                    <IconButton label="Collapse sidebar" onClick={onCollapse}><SidebarSimple size={19}/></IconButton>}
            </div>
            {collapsed &&
                <IconButton label="Expand sidebar" onClick={onCollapse} className="collapsed-toggle"><SidebarSimple
                    size={19}/></IconButton>}
            <button type="button" className={`new-query-button ${collapsed ? "compact" : ""}`}
                    onClick={() => onChange("assistant")}><Plus size={18} weight="bold"/>{!collapsed &&
                <span>{t("newQuery")}</span>}</button>
            <nav className="sidebar-nav" aria-label="Workspace navigation">
                {navItems.map((item) => {
                    const ItemIcon = item.icon;
                    const label = t(item.labelKey);
                    return <button type="button" key={item.id} className={active === item.id ? "active" : ""}
                                   onClick={() => onChange(item.id)}
                                   aria-current={active === item.id ? "page" : undefined}
                                   title={collapsed ? label : undefined}><ItemIcon size={19}
                                                                                   weight={active === item.id ? "fill" : "regular"}/>{!collapsed &&
                        <span>{label}</span>}</button>;
                })}
            </nav>
            <div className="sidebar-bottom">
                <button type="button" className="profile-button" onClick={onSignIn}><span
                    className="profile-avatar"><UserCircle size={22}/></span>{!collapsed && <span
                    className="profile-copy"><strong>{common("signIn")}</strong><small>{t("saveWork")}</small></span>}
                </button>
            </div>
        </aside>
    );
}

function AppTopbar({title, onMenu, onSignIn}: {
    title: string;
    onMenu: () => void;
    onSignIn: () => void
}) {
    const t = useTranslations("Navigation");
    const common = useTranslations("Common");
    return <header className="app-topbar">
        <div className="topbar-left"><IconButton label="Open navigation" onClick={onMenu}
                                                 className="mobile-menu-button"><List size={21}/></IconButton><span
            className="breadcrumb">{t("workspace")}</span><CaretRight size={13}/><strong>{title}</strong>
            <span className="status complete" style={{marginLeft: 8}} title="Grounded with Gemini 3.5 Flash">
                <span style={{width: 6, height: 6, borderRadius: "50%", background: "currentColor"}} />
                AI Online
            </span>
        </div>
        <div className="topbar-actions"><LanguageSwitcher className="app-language"/>
            <button type="button" className="button compact secondary" onClick={onSignIn}>{common("signIn")}</button>
        </div>
    </header>;
}

function PageHeading({title, description, action}: { title: string; description: string; action?: React.ReactNode }) {
    return <div className="page-heading">
        <div><h1>{title}</h1><p>{description}</p></div>
        {action}</div>;
}

function ProductsView({onNavigate}: { onNavigate: (view: View) => void }) {
    const steps = [
        {label: "Product", detail: "Bottle profile", state: "done", icon: Package},
        {label: "Indian Standard", detail: "2 relevant", state: "done", icon: Books},
        {label: "QCO check", detail: "Review required", state: "current", icon: ShieldCheck},
        {label: "Certification", detail: "Scheme-I", state: "upcoming", icon: Certificate},
        {label: "Testing", detail: "6 tests", state: "upcoming", icon: Flask},
        {label: "Laboratory", detail: "14 matching", state: "upcoming", icon: Buildings},
        {label: "Licence", detail: "Final outcome", state: "upcoming", icon: IdentificationBadge},
    ];
    return (
        <div className="workspace-page products-page">
            <PageHeading title="Product compliance"
                         description="Turn a product description into a traceable compliance path."
                         action={<button type="button" className="button primary"><Plus size={17}/> Add product
                         </button>}/>
            <div className="product-overview">
                <div className="product-identity"><span className="product-icon"><Package size={28}
                                                                                          weight="duotone"/></span>
                    <div><span>Product profile</span><h2>Stainless steel water bottle</h2><p>Vacuum-insulated domestic
                        drinkware</p></div>
                    <button type="button" className="button ghost">Edit profile</button>
                </div>
                <div className="product-metrics">
                    <div><span>Standards</span><strong>2</strong><small>relevant</small></div>
                    <div><span>Certification</span><strong className="metric-alert">Review</strong><small>QCO
                        check</small></div>
                    <div><span>Tests</span><strong>6</strong><small>identified</small></div>
                    <div><span>Laboratories</span><strong>14</strong><small>matching</small></div>
                </div>
            </div>
            <section className="compliance-path-section">
                <div className="section-title-row">
                    <div><h2>Compliance path</h2><p>Each completed decision unlocks the next part of the process.</p>
                    </div>
                    <span className="status attention"><Warning size={15} weight="fill"/> 1 item needs review</span>
                </div>
                <div className="compliance-path">{steps.map((step, index) => {
                    const StepIcon = step.icon;
                    return <div className={`path-step ${step.state}`} key={step.label}>
                        <div className="path-node">{step.state === "done" ? <Check size={17} weight="bold"/> :
                            <StepIcon size={18}/>}</div>
                        <div><strong>{step.label}</strong><span>{step.detail}</span></div>
                        {index < steps.length - 1 && <div className="path-connector"/>}</div>;
                })}</div>
            </section>
            <div className="product-detail-layout">
                <section className="review-panel">
                    <div className="review-panel-heading"><ShieldCheck size={24}/>
                        <div><h3>QCO applicability needs verification</h3><p>The result depends on insulation type and
                            the currently notified product scope.</p></div>
                    </div>
                    <div className="clarification-form"><label htmlFor="construction">Bottle construction</label><select
                        id="construction" defaultValue="vacuum">
                        <option value="vacuum">Vacuum-insulated, double-wall</option>
                        <option value="single">Single-wall</option>
                        <option value="other">Other construction</option>
                    </select><small>This detail is used only to narrow the relevant standard and order.</small></div>
                    <button type="button" className="button primary">Recheck applicability</button>
                </section>
                <section className="key-documents"><h3>Key documents</h3>
                    <button type="button" onClick={() => onNavigate("standards")}><FilePdf size={20}/><span><strong>IS 17803:2022</strong><small>Recommended standard</small></span><ArrowSquareOut
                        size={15}/></button>
                    <button type="button"><ClipboardText size={20}/><span><strong>Product manual</strong><small>Inspection and testing</small></span><ArrowSquareOut
                        size={15}/></button>
                    <button type="button"><ShieldCheck size={20}/><span><strong>Quality Control Order</strong><small>Applicability source</small></span><ArrowSquareOut
                        size={15}/></button>
                </section>
            </div>
        </div>
    );
}

const standards = [
    {
        number: "IS 17803:2022",
        title: "Stainless steel vacuum flask and bottle",
        area: "Domestic products",
        status: "Active",
        revised: "Reaffirmed 2025",
        match: "Best match"
    },
    {
        number: "IS 14756:2022",
        title: "Stainless steel utensils",
        area: "Consumer goods",
        status: "Active",
        revised: "Revised 2022",
        match: "Related"
    },
    {
        number: "IS 10500:2012",
        title: "Drinking water specification",
        area: "Water quality",
        status: "Active",
        revised: "Amendment 4",
        match: "Reference"
    },
    {
        number: "IS 9845:1998",
        title: "Food-contact migration testing",
        area: "Food safety",
        status: "Active",
        revised: "Reaffirmed 2021",
        match: "Related"
    },
];

function HistoryView() {
    const items = [
        {question: exampleQuestion, date: "Today, 10:42", type: "Product compliance"},
        {question: "Which tests apply to domestic electric adapters?", date: "Yesterday, 16:18", type: "Testing"},
        {
            question: "Find laboratories recognised for IS 302 testing in Pune.",
            date: "2 Sep, 12:06",
            type: "Laboratories"
        },
        {question: "What does a 22K916 hallmark mean?", date: "29 Aug, 09:34", type: "Hallmarking"},
    ];
    return <div className="workspace-page"><PageHeading title="Saved queries"
                                                        description="Return to questions, evidence and compliance decisions you want to keep."
                                                        action={<button type="button" className="button secondary">
                                                            <MagnifyingGlass size={16}/> Search saved</button>}/>
        <div className="saved-list">{items.map((item, index) => <button type="button" key={item.question}><span
            className="saved-icon">{index === 0 ? <BookmarkSimple size={19} weight="fill"/> :
            <ChatTeardropDots size={19}/>}</span><span
            className="saved-copy"><strong>{item.question}</strong><small>{item.type} <span>•</span> {item.date}</small></span><CaretRight
            size={17}/></button>)}</div>
    </div>;
}

function DashboardView({onNavigate}: { onNavigate: (view: View) => void }) {
    return <div className="workspace-page dashboard-page"><PageHeading title="Your compliance workspace"
                                                                       description="Continue recent product reviews and keep important standards close."
                                                                       action={<button type="button"
                                                                                       className="button primary"
                                                                                       onClick={() => onNavigate("products")}>
                                                                           <Plus size={17}/> Add product</button>}/>
        <section className="dashboard-products">
            <div className="section-title-row">
                <div><h2>My products</h2><p>Products with recent compliance activity.</p></div>
                <button type="button" className="text-link" onClick={() => onNavigate("products")}>View all <ArrowRight
                    size={15}/></button>
            </div>
            <div className="dashboard-product-list">
                <button type="button" onClick={() => onNavigate("products")}><span
                    className="product-monogram">SB</span><span><strong>Stainless steel bottle</strong><small>Certification review required</small></span><span
                    className="status attention">Needs review</span><CaretRight size={16}/></button>
                <button type="button"><span
                    className="product-monogram alt">EA</span><span><strong>Electrical adapter</strong><small>3 standards identified</small></span><span
                    className="status complete">On track</span><CaretRight size={16}/></button>
            </div>
        </section>
        <div className="dashboard-columns">
            <section>
                <div className="section-title-row">
                    <div><h2>Recent queries</h2></div>
                </div>
                <div className="mini-list">
                    <button type="button">Do I need certification for a vacuum bottle?<span>Today</span></button>
                    <button type="button">Testing for electrical adapters<span>Yesterday</span></button>
                    <button type="button">Hallmark HUID explanation<span>29 Aug</span></button>
                </div>
            </section>
            <section>
                <div className="section-title-row">
                    <div><h2>Saved standards</h2></div>
                </div>
                <div className="mini-list standards-mini">
                    <button type="button"><strong>IS 17803:2022</strong><span>Vacuum flasks and bottles</span></button>
                    <button type="button"><strong>IS 14756:2022</strong><span>Stainless steel utensils</span></button>
                    <button type="button"><strong>IS 302-1:2008</strong><span>Electrical appliance safety</span>
                    </button>
                </div>
            </section>
        </div>
    </div>;
}

type DocumentTarget = { sourceId?: string; standardId?: string; clauseId?: string };

function GenericContent({view, onNavigate, onOpenDocument}: {
    view: View;
    onNavigate: (view: View) => void;
    onOpenDocument: (target: DocumentTarget) => void;
}) {
    if (view === "products") return <ProductsView onNavigate={onNavigate}/>;
    if (view === "standards") return <StandardsExplorer
        onOpenDocument={(standardId, clauseId) => onOpenDocument({standardId, clauseId})}/>;
    if (view === "certification") return <CertificationGuide/>;
    if (view === "labs") return <LabsFinder/>;
    if (view === "hallmarking") return <HallmarkingView/>;
    if (view === "history") return <HistoryView/>;
    if (view === "reports") return <ReportsView/>;
    return <DashboardView onNavigate={onNavigate}/>;
}

export function BISIntelligence() {
    const router = useRouter();
    const locale = useLocale();
    const navigation = useTranslations("Navigation");
    const {messages, status, streamingText, pendingSources, isLoading, error, ask, stop} = useChat();
    const [screen, setScreen] = useState<"landing" | "app">("landing");
    const [view, setView] = useState<View>("assistant");
    const [sourceOpen, setSourceOpen] = useState(true);
    const [selectedSource, setSelectedSource] = useState<string | null>(null);
    const [documentTarget, setDocumentTarget] = useState<DocumentTarget | null>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    // Derive the active source rather than syncing it in an effect: when a new answer
    // replaces the evidence list, any stale selection falls back to the first source.
    const sources = pendingSources;
    const activeSource = sources.some((source) => source.id === selectedSource)
        ? selectedSource
        : sources[0]?.id ?? null;

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            const requestedView = new URLSearchParams(window.location.search).get("view") as View | null;
            if (requestedView && [...navItems.map((item) => item.id), "dashboard"].includes(requestedView)) {
                setScreen("app");
                setView(requestedView);
                setSourceOpen(requestedView === "assistant" && window.innerWidth > 720);
            }
        });
        return () => window.cancelAnimationFrame(frame);
    }, []);

    function enterAssistant(nextQuestion: string) {
        setScreen("app");
        setView("assistant");
        setSourceOpen(window.innerWidth > 720);
        void ask(nextQuestion.trim() || exampleQuestion, locale);
    }

    function navigate(nextView: View) {
        setScreen("app");
        setView(nextView);
        setMobileNavOpen(false);
        if (nextView !== "assistant") setSourceOpen(false);
    }

    function openCitation(sourceId: string) {
        setSelectedSource(sourceId);
        setSourceOpen(true);
    }

    function openAuth() {
        router.push("/auth");
    }

    const viewTitle = {
        assistant: navigation("assistant"),
        products: navigation("productCompliance"),
        standards: navigation("standardsExplorer"),
        certification: navigation("certification"),
        labs: navigation("testingLabs"),
        hallmarking: navigation("hallmarking"),
        history: navigation("history"),
        reports: navigation("documentsReports"),
        dashboard: navigation("dashboard"),
    }[view];

    return (
        <>
            {screen === "landing" ? <Landing onEnter={enterAssistant} onNavigate={navigate} onSignIn={openAuth}/> :
                <div className="app-shell">
                    <div className={`mobile-nav-scrim ${mobileNavOpen ? "open" : ""}`}
                         onClick={() => setMobileNavOpen(false)}/>
                    <div className={`sidebar-wrap ${mobileNavOpen ? "mobile-open" : ""}`}><AppSidebar active={view}
                                                                                                      onChange={navigate}
                                                                                                      collapsed={sidebarCollapsed}
                                                                                                      onCollapse={() => setSidebarCollapsed((value) => !value)}
                                                                                                      onHome={() => setScreen("landing")}
                                                                                                      onSignIn={openAuth}/>
                    </div>
                    <div className="app-main"><AppTopbar title={viewTitle} onMenu={() => setMobileNavOpen(true)}
                                                         onSignIn={openAuth}/>
                        <div className={`workspace ${view === "assistant" && sourceOpen ? "with-evidence" : ""}`}>
                            <main className="workspace-main">{view === "assistant" ?
                                <ChatThread messages={messages} status={status} streamingText={streamingText}
                                            isLoading={isLoading} error={error} onAsk={enterAssistant} onStop={stop}
                                            onCitation={openCitation}
                                            onOpenView={(nextView) => navigate(nextView as View)}/> :
                                <GenericContent view={view} onNavigate={navigate}
                                                onOpenDocument={setDocumentTarget}/>}</main>
                            {view === "assistant" && sourceOpen &&
                                <EvidencePanel sources={sources} selected={activeSource} onSelect={setSelectedSource}
                                               onClose={() => setSourceOpen(false)}
                                               onOpenDocument={(source) => setDocumentTarget({sourceId: source.id})}/>}
                            {view === "assistant" && !sourceOpen && sources.length > 0 &&
                                <button type="button" className="floating-sources-button"
                                        onClick={() => setSourceOpen(true)}><Files size={17}/> {sources.length} {sources.length === 1 ? "source" : "sources"}
                                </button>}</div>
                    </div>
                    <nav className="mobile-bottom-nav"
                         aria-label="Mobile navigation">{[navItems[0], navItems[1], navItems[2], navItems[4]].map((item) => {
                        const ItemIcon = item.icon;
                        return <button type="button" key={item.id} className={view === item.id ? "active" : ""}
                                       onClick={() => navigate(item.id)}><ItemIcon size={20}
                                                                                   weight={view === item.id ? "fill" : "regular"}/><span>{navigation(item.labelKey)}</span>
                        </button>;
                    })}
                        <button type="button" onClick={() => setMobileNavOpen(true)}><List
                            size={20}/><span>{navigation("more")}</span></button>
                    </nav>
                </div>}
            {documentTarget && <DocumentViewer sourceId={documentTarget.sourceId}
                                               standardId={documentTarget.standardId}
                                               clauseId={documentTarget.clauseId}
                                               onClose={() => setDocumentTarget(null)}/>}
        </>
    );
}
