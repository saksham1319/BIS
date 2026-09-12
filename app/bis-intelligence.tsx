"use client";

import {
    AlertCircle,
    ArrowRight,
    ArrowUp,
    Award,
    BookOpen,
    ChevronRight,
    FileText,
    Files,
    FlaskConical,
    Gem,
    History,
    Menu,
    Mic,
    PanelLeft,
    Plus,
    Search,
    ShieldCheck,
    Sparkles,
    User,
    X,
} from "lucide-react";
import type {LucideIcon} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {FormEvent, useEffect, useRef, useState} from "react";
import type {Locale} from "@/i18n/locales";
import {Brand} from "@/components/brand";
import {LanguageSwitcher} from "@/components/language-switcher";
import {useRouter} from "@/i18n/navigation";
import {ChatThread, EvidencePanel, STORAGE_KEY, useChat, useSpeechRecognition} from "@/components/assistant";
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
type NavItem = { id: View; labelKey: NavKey; icon: LucideIcon };

const exampleQuestion =
    "I manufacture stainless steel water bottles. Which Indian Standard applies and do I need BIS certification?";

const navItems: NavItem[] = [
    {id: "assistant", labelKey: "assistant", icon: Sparkles},
    {id: "standards", labelKey: "standards", icon: BookOpen},
    {id: "certification", labelKey: "certification", icon: Award},
    {id: "labs", labelKey: "labs", icon: FlaskConical},
    {id: "hallmarking", labelKey: "hallmarking", icon: Gem},
    {id: "history", labelKey: "history", icon: History},
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
    const locale = useLocale() as Locale;
    const [question, setQuestion] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const promptExamples = [t("promptOne"), t("promptTwo"), t("promptThree"), t("promptFour")];
    const quickActions = [
        {label: t("quickStandard"), icon: Search},
        {label: t("quickCertification"), icon: ShieldCheck},
        {label: t("quickLab"), icon: FlaskConical},
        {label: t("quickAsk"), icon: Sparkles},
    ];

    const {
        isSupported,
        isListening,
        error: speechError,
        toggleListening,
        stopListening,
        clearError: clearSpeechError,
    } = useSpeechRecognition({
        locale,
        onTranscript: (updatedDraft) => {
            setQuestion(updatedDraft);
        },
    });

    const prevListeningRef = useRef(false);
    useEffect(() => {
        if (prevListeningRef.current && !isListening) {
            inputRef.current?.focus();
        }
        prevListeningRef.current = isListening;
    }, [isListening]);

    function submit(event: FormEvent) {
        event.preventDefault();
        const trimmed = question.trim();
        if (!trimmed) {
            inputRef.current?.focus();
            return;
        }
        if (isListening) {
            stopListening();
        }
        onEnter(trimmed);
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

                    <LanguageSwitcher/>
                    <button type="button" className="button secondary sign-in-top"
                            onClick={onSignIn}>{common("signIn")}</button>
                </div>
            </header>

            <main>
                <section className="hero-section">
                    <div className="hero-copy">
                        <div className="trust-line"><ShieldCheck size={18}/><span>{t("trust")}</span>
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
                            <span className="verified-chip"><ShieldCheck size={15}/> {t("sourceAware")}</span>
                        </div>
                        {speechError ? (
                            <div className="assistant-error" role="alert" style={{marginBottom: 12}}>
                                <AlertCircle size={18} />
                                <p>{speechError}</p>
                                <button
                                    type="button"
                                    className="icon-button"
                                    aria-label="Dismiss error"
                                    title="Dismiss error"
                                    onClick={clearSpeechError}
                                >
                                    <X size={15}/>
                                </button>
                            </div>
                        ) : null}
                        <form className="hero-composer" onSubmit={submit}>
                            <label htmlFor="landing-question" className="sr-only">Ask anything about BIS</label>
                            <textarea
                                ref={inputRef}
                                id="landing-question"
                                value={question}
                                onChange={(event) => setQuestion(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" && !event.shiftKey) {
                                        if (event.nativeEvent.isComposing) return;
                                        event.preventDefault();
                                        submit(event);
                                    }
                                }}
                                placeholder={t("placeholder")}
                                rows={3}
                            />
                            <div className="composer-footer">
                                <div className="composer-tools">
                                    {isListening ? (
                                        <span className="composer-listening-status" aria-live="polite">
                                            <span className="mic-listening-dot" aria-hidden="true"/>
                                            Listening…
                                        </span>
                                    ) : (
                                        <span className="composer-hint">{t("describeProduct")}</span>
                                    )}
                                </div>
                                <div className="composer-actions">
                                    <button
                                        type="button"
                                        className={`mic-button ${isListening ? "is-listening" : ""}`}
                                        onClick={() => {
                                            clearSpeechError();
                                            toggleListening(question);
                                        }}
                                        disabled={!isSupported}
                                        aria-label={
                                            !isSupported
                                                ? "Voice input isn't supported in this browser"
                                                : isListening
                                                  ? "Stop listening"
                                                  : "Start voice input"
                                        }
                                        aria-pressed={isListening}
                                        title={
                                            !isSupported
                                                ? "Voice input isn't supported in this browser."
                                                : isListening
                                                  ? "Listening… Click to stop"
                                                  : "Voice input (speak to type)"
                                        }
                                    >
                                        <Mic size={18} aria-hidden="true"/>
                                        {isListening ? <span className="mic-label">Listening…</span> : null}
                                    </button>
                                    <button
                                        type="submit"
                                        className="send-button"
                                        aria-label="Ask BIS Saathi"
                                        disabled={!question.trim() || isListening}
                                    >
                                        <ArrowUp size={19} />
                                    </button>
                                </div>
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
                                           onClick={() => onEnter(promptExamples[index])}>
                                <ActionIcon size={20}/><span>{action.label}</span><ChevronRight size={15}
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
                            <button type="button" aria-label="Step 1: Inspect cited clause in Indian Standard" onClick={() => onEnter(exampleQuestion)}>1</button>
                        </div>
                        <ArrowRight size={22} className="flow-arrow"/>
                        <div className="flow-source"><FileText size={24} />
                            <div><span>{t("originalSource")}</span><strong>IS 17803:2022</strong><p>Clause 4.1</p></div>
                            <ShieldCheck size={20} /></div>
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
                    <IconButton label="Collapse sidebar" onClick={onCollapse}><PanelLeft size={19}/></IconButton>}
            </div>
            {collapsed &&
                <IconButton label="Expand sidebar" onClick={onCollapse} className="collapsed-toggle"><PanelLeft
                    size={19}/></IconButton>}
            <button type="button" className={`new-query-button ${collapsed ? "compact" : ""}`}
                    onClick={() => onChange("assistant")}><Plus size={18} />{!collapsed &&
                <span>{t("newQuery")}</span>}</button>
            <nav className="sidebar-nav" aria-label="Workspace navigation">
                {navItems.map((item) => {
                    const ItemIcon = item.icon;
                    const label = t(item.labelKey);
                    return <button type="button" key={item.id} className={active === item.id ? "active" : ""}
                                   onClick={() => onChange(item.id)}
                                   aria-current={active === item.id ? "page" : undefined}
                                   title={collapsed ? label : undefined}><ItemIcon size={18} />{!collapsed &&
                        <span>{label}</span>}</button>;
                })}
            </nav>
            <div className="sidebar-bottom">
                <button type="button" className="profile-button" onClick={onSignIn}><span
                    className="profile-avatar"><User size={20}/></span>{!collapsed && <span
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
                                                 className="mobile-menu-button"><Menu size={20}/></IconButton><span
            className="breadcrumb">{t("workspace")}</span><ChevronRight size={13}/><strong>{title}</strong>
            <span className="status complete" style={{marginLeft: 8}} title="Grounded with Gemini 3.5 Flash">
                <span style={{width: 6, height: 6, borderRadius: "50%", background: "currentColor"}}/>
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

function getInitialStoredQueries(): string[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                const userQueries = parsed
                    .filter((m: { role: string; content?: string }) => m.role === "user" && m.content)
                    .map((m: { content: string }) => m.content.trim())
                    .filter(Boolean);
                return Array.from(new Set(userQueries));
            }
        }
    } catch {
        /* ignore storage parse errors */
    }
    return [];
}

function HistoryView({onSelectQuery}: { onSelectQuery: (query: string) => void }) {
    const [queries, setQueries] = useState<string[]>(getInitialStoredQueries);

    const handleClear = () => {
        try {
            if (typeof window !== "undefined") {
                localStorage.removeItem(STORAGE_KEY);
            }
            setQueries([]);
        } catch {
            /* ignore */
        }
    };

    return (
        <div className="workspace-page">
            <PageHeading
                title="Saved queries"
                description="Return to questions, evidence and compliance decisions from your current and past sessions."
                action={queries.length > 0 ? (
                    <button type="button" className="button secondary" onClick={handleClear}>
                        Clear history
                    </button>
                ) : undefined}
            />
            {queries.length > 0 ? (
                <div className="saved-list">
                    {queries.map((q, index) => (
                        <button
                            type="button"
                            key={`${index}-${q.slice(0, 30)}`}
                            onClick={() => onSelectQuery(q)}
                        >
                            <span className="saved-icon">
                                <Sparkles size={17} />
                            </span>
                            <span className="saved-copy">
                                <strong>{q}</strong>
                                <small>Query #{queries.length - index} <span>•</span> Click to open in Assistant</small>
                            </span>
                            <ChevronRight size={16} />
                        </button>
                    ))}
                </div>
            ) : (
                <div className="empty-state" style={{padding: "48px 16px", textAlign: "center", color: "var(--muted)"}}>
                    <History size={40} style={{margin: "0 auto 16px", display: "block"}} />
                    <h3 style={{fontSize: "1.1rem", marginBottom: 8, color: "var(--foreground)"}}>No saved queries yet</h3>
                    <p style={{maxWidth: 420, margin: "0 auto 24px", fontSize: "0.9rem", lineHeight: 1.5}}>
                        Queries asked in the Assistant are saved locally in your browser so you can revisit them anytime.
                    </p>
                    <button
                        type="button"
                        className="button primary"
                        onClick={() => onSelectQuery(exampleQuestion)}
                    >
                        Try example query
                    </button>
                </div>
            )}
        </div>
    );
}

type NavPayload = { standardId?: string; query?: string } | null;
type DocumentTarget = { sourceId?: string; standardId?: string; clauseId?: string };

function GenericContent({
    view,
    navPayload,
    onOpenDocument,
    onSelectQuery,
}: {
    view: View;
    navPayload: NavPayload;
    onOpenDocument: (target: DocumentTarget) => void;
    onSelectQuery: (query: string) => void;
}) {
    if (view === "standards") {
        return (
            <StandardsExplorer
                initialStandardId={navPayload?.standardId}
                initialQuery={navPayload?.query}
                onOpenDocument={(standardId, clauseId) => onOpenDocument({standardId, clauseId})}
            />
        );
    }
    if (view === "certification") return <CertificationGuide/>;
    if (view === "labs") {
        return <LabsFinder initialQuery={navPayload?.query || navPayload?.standardId}/>;
    }
    if (view === "hallmarking") return <HallmarkingView/>;
    if (view === "history") return <HistoryView onSelectQuery={onSelectQuery}/>;
    if (view === "reports") {
        return <ReportsView initialStandardId={navPayload?.standardId}/>;
    }
    return (
        <StandardsExplorer
            initialStandardId={navPayload?.standardId}
            initialQuery={navPayload?.query}
            onOpenDocument={(standardId, clauseId) => onOpenDocument({standardId, clauseId})}
        />
    );
}

export function BISIntelligence() {
    const router = useRouter();
    const navigation = useTranslations("Navigation");
    const [screen, setScreen] = useState<"landing" | "app">("landing");
    const [view, setView] = useState<View>("assistant");
    const [navPayload, setNavPayload] = useState<NavPayload>(null);
    const [documentTarget, setDocumentTarget] = useState<DocumentTarget | null>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [sourceOpen, setSourceOpen] = useState(false);
    const [activeSource, setActiveSource] = useState<string | null>(null);

    const {
        messages,
        status,
        streamingText,
        isLoading,
        error,
        sources = [],
        ask,
        stop,
    } = useChat();

    // Auto-open sources when sources arrive on large desktop screens (> 980px)
    useEffect(() => {
        let frameId: number | null = null;
        if ((sources?.length ?? 0) > 0 && typeof window !== "undefined" && window.innerWidth > 980) {
            frameId = window.requestAnimationFrame(() => {
                setSourceOpen(true);
            });
        }
        return () => {
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }
        };
    }, [sources?.length]);

    function enterAssistant(question?: string) {
        setScreen("app");
        setView("assistant");
        setMobileNavOpen(false);
        if (typeof window !== "undefined" && window.innerWidth > 980) {
            setSourceOpen(true);
        }
        if (question) {
            ask(question);
        }
    }

    function navigate(nextView: View, payload?: { standardId?: string; query?: string }) {
        setView(nextView);
        setNavPayload(payload ?? null);
        setMobileNavOpen(false);
    }

    function openCitation(sourceId: string) {
        setActiveSource(sourceId);
        setSourceOpen(true);
    }

    function openAuth() {
        router.push("/auth");
    }

    const viewTitle = navigation(view as NavKey);

    return (
        <>
            {screen === "landing" ? <Landing onEnter={enterAssistant} onNavigate={navigate} onSignIn={openAuth}/> :
                <div className="app-shell">
                    <div
                        className={`mobile-nav-scrim ${mobileNavOpen ? "open" : ""}`}
                        role="button"
                        tabIndex={0}
                        aria-label="Close navigation menu"
                        onClick={() => setMobileNavOpen(false)}
                        onKeyDown={(e) => {
                            if (e.key === "Escape" || e.key === "Enter") setMobileNavOpen(false);
                        }}
                    />
                    <div className={`sidebar-wrap ${mobileNavOpen ? "mobile-open" : ""}`}><AppSidebar active={view}
                                                                                                      onChange={navigate}
                                                                                                      collapsed={sidebarCollapsed}
                                                                                                      onCollapse={() => setSidebarCollapsed((value) => !value)}
                                                                                                      onHome={() => setScreen("landing")}
                                                                                                      onSignIn={openAuth}/>
                    </div>
                    <div className="app-main"><AppTopbar title={viewTitle} onMenu={() => setMobileNavOpen(true)}
                                                         onSignIn={openAuth}/>
                        <div className={`workspace ${view === "assistant" && sourceOpen && (sources?.length ?? 0) > 0 ? "with-evidence" : ""}`}>
                            <main className={`workspace-main ${view === "assistant" ? "is-assistant" : ""}`}>{view === "assistant" ?
                                <ChatThread messages={messages} status={status} streamingText={streamingText}
                                            isLoading={isLoading} error={error} onAsk={enterAssistant} onStop={stop}
                                            onCitation={openCitation}
                                            onOpenView={(nextView, payload) => navigate(nextView as View, payload)}/> :
                                <GenericContent view={view} navPayload={navPayload}
                                                onOpenDocument={setDocumentTarget}
                                                onSelectQuery={enterAssistant}/>}</main>
                            {view === "assistant" && sourceOpen && (sources?.length ?? 0) > 0 &&
                                <EvidencePanel sources={sources} selected={activeSource} onSelect={setActiveSource}
                                               onClose={() => setSourceOpen(false)}
                                               onOpenDocument={(source) => setDocumentTarget({sourceId: source.id})}/>}
                            {view === "assistant" && !sourceOpen && (sources?.length ?? 0) > 0 &&
                                <button type="button" className="floating-sources-button"
                                        onClick={() => setSourceOpen(true)}><Files
                                    size={17}/> {sources.length} {sources.length === 1 ? "source" : "sources"}
                                </button>}</div>
                    </div>
                    <nav className="mobile-bottom-nav"
                         aria-label="Mobile navigation">{[navItems[0], navItems[1], navItems[2], navItems[3]].map((item) => {
                        const ItemIcon = item.icon;
                        return <button type="button" key={item.id} className={view === item.id ? "active" : ""}
                                       onClick={() => navigate(item.id)}><ItemIcon size={20} /><span>{navigation(item.labelKey)}</span>
                        </button>;
                    })}
                        <button type="button" onClick={() => setMobileNavOpen(true)}><Menu
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

