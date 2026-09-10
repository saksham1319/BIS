"use client";

import {
    ArrowLeft,
    ArrowRight,
    ArrowSquareOut,
    ArrowUp,
    ArrowsDownUp,
    BookmarkSimple,
    Books,
    Buildings,
    CaretDown,
    CaretRight,
    Certificate,
    ChatTeardropDots,
    Check,
    CheckCircle,
    ClipboardText,
    ClockCounterClockwise,
    Copy,
    DiamondsFour,
    DownloadSimple,
    FilePdf,
    Files,
    Flask,
    IdentificationBadge,
    Info,
    List,
    MagnifyingGlass,
    MapPin,
    MapTrifold,
    Microphone,
    NavigationArrow,
    Package,
    Paperclip,
    Phone,
    Plus,
    Question,
    SealCheck,
    ShareNetwork,
    ShieldCheck,
    SidebarSimple,
    SlidersHorizontal,
    UserCircle,
    Warning,
    WarningCircle,
    X,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { createContext, FormEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useRouter } from "@/i18n/navigation";
import { isLocale, LOCALE_NAMES } from "@/i18n/locales";

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

type PreviewActions = { notify: (message: string) => void; preview: () => void; downloadReport: () => void };
const PreviewContext = createContext<PreviewActions>({ notify: () => {}, preview: () => {}, downloadReport: () => {} });

function useSessionDraft(storageKey: string) {
  const [value, setValue] = useState("");
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try { setValue(window.sessionStorage.getItem(storageKey) ?? ""); } catch { /* Optional draft recovery. */ }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [storageKey]);
  function updateValue(nextValue: string) {
    setValue(nextValue);
    try {
      if (nextValue) window.sessionStorage.setItem(storageKey, nextValue);
      else window.sessionStorage.removeItem(storageKey);
    } catch { /* Editing remains available without storage. */ }
  }
  return [value, updateValue] as const;
}

function updateWorkspaceLocation(view?: View) {
  const url = new URL(window.location.href);
  if (view) url.searchParams.set("view", view);
  else url.searchParams.delete("view");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}


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

function useSources() {
  const ws = useTranslations("Workspace");
  return [
  {
    id: "standard",
    number: "IS 17803:2022",
    type: ws("indianStandard"),
    location: ws("clauses41And6"),
    title: ws("stainlessSteelVacuumFlaskAndBottle"),
    excerpt:
      ws("theStandardSpecifiesMaterialConstructionPerformanceAndMarking"),
  },
  {
    id: "qco",
    number: ws("qCOReference"),
    type: ws("qualityControlOrder"),
    location: ws("applicabilityCheck"),
    title: ws("domesticStainlessSteelProducts"),
    excerpt:
      ws("certificationApplicabilityDependsOnTheExactProductConstruction"),
  },
  {
    id: "manual",
    number: "PM/IS 17803/1",
    type: ws("productManual"),
    location: ws("page12"),
    title: ws("schemeOfInspectionAndTesting"),
    excerpt:
      ws("theProductManualDescribesGroupingSamplingTestingFacilities"),
  },
];
}

function IconButton({ label, children, onClick, className = "" }: { label: string; children: React.ReactNode; onClick?: () => void; className?: string }) {
  const { preview } = useContext(PreviewContext);
  return <button type="button" className={`icon-button ${className}`} aria-label={label} title={label} onClick={onClick ?? preview}>{children}</button>;
}

function Landing({ onEnter, onNavigate, onSignIn, onTheme, dark }: { onEnter: (question: string) => void; onNavigate: (view: View) => void; onSignIn: () => void; onTheme: () => void; dark: boolean }) {
  const ws = useTranslations("Workspace");
  const t = useTranslations("Landing");
  const navigation = useTranslations("Navigation");
  const common = useTranslations("Common");
  const [question, setQuestion] = useSessionDraft("bis-landing-draft");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const promptExamples = [t("promptOne"), t("promptTwo"), t("promptThree"), t("promptFour")];
  const quickActions = [
    { label: t("quickStandard"), icon: MagnifyingGlass },
    { label: t("quickCertification"), icon: ShieldCheck },
    { label: t("quickLab"), icon: Flask },
    { label: t("quickAsk"), icon: ChatTeardropDots },
  ];

  function submit(event: FormEvent) {
    event.preventDefault();
    onEnter(question.trim() || ws("exampleQuestion"));
    setQuestion("");
  }

  function choosePrompt(prompt: string) {
    setQuestion(prompt);
    inputRef.current?.focus();
  }

  return (
    <div className="landing-shell">
      <header className="landing-header">
        <Brand />
        <nav className="landing-nav" aria-label={ws("primaryNavigation")}>
          <button onClick={() => onNavigate("assistant")}>{navigation("assistant")}</button>
          <button onClick={() => onNavigate("standards")}>{navigation("standards")}</button>
          <button onClick={() => onNavigate("certification")}>{navigation("certification")}</button>
          <button onClick={() => onNavigate("labs")}>{navigation("labs")}</button>
          <button onClick={() => onNavigate("hallmarking")}>{navigation("hallmarking")}</button>
        </nav>
        <div className="header-actions">
          <LanguageSwitcher />
          <IconButton label={dark ? ws("useLightTheme") : ws("useDarkTheme")} onClick={onTheme}>{dark ? <Sun size={19} /> : <Moon size={19} />}</IconButton>
          <button type="button" className="button secondary sign-in-top" onClick={onSignIn}>{common("signIn")}</button>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <p className="preview-notice"><Info size={17} aria-hidden="true" />{ws("previewNotice")}</p>
        <section className="hero-section">
          <div className="hero-copy">
            <div className="trust-line"><ShieldCheck size={18} weight="fill" /><span>{t("trust")}</span></div>
            <h1><span>{t("titleOne")}</span><span>{t("titleTwo")}</span></h1>
            <p>{t("description")}</p>
            <div className="hero-note"><div className="hero-note-line" /><span>{t("guestAccess")}</span></div>
          </div>

          <div className="hero-workbench" aria-label={ws("askBISIntelligence")}>
            <div className="workbench-header">
              <div><strong>{t("workbenchTitle")}</strong></div>
              <span className="verified-chip"><SealCheck size={15} weight="fill" /> {t("sourceAware")}</span>
            </div>
            <form className="hero-composer" onSubmit={submit}>
              <label htmlFor="landing-question" className="sr-only">{ws("askAnythingAboutBIS")}</label>
              <textarea ref={inputRef} id="landing-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t("placeholder")} rows={3} />
              <div className="composer-footer">
                <div className="composer-tools"><IconButton label={ws("attachAProductDocument")}><Paperclip size={20} /></IconButton><span className="composer-hint">{t("describeProduct")}</span></div>
                <button type="submit" className="send-button" aria-label={ws("askBISIntelligence")}><ArrowUp size={20} weight="bold" /></button>
              </div>
            </form>
            <div className="prompt-list" aria-label={ws("exampleQuestions")}>
              {promptExamples.slice(0, 3).map((prompt) => <button type="button" key={prompt} onClick={() => choosePrompt(prompt)}><span>{prompt}</span><ArrowRight size={16} /></button>)}
            </div>
          </div>
        </section>

        <section className="quick-action-band" aria-label={ws("commonTasks")}>
          <div className="band-intro"><span>{t("quickTitle")}</span><p>{t("quickDescription")}</p></div>
          <div className="quick-action-grid">
            {quickActions.map((action, index) => { const ActionIcon = action.icon; return <button type="button" key={action.label} onClick={() => index === 0 ? choosePrompt(promptExamples[0]) : index === 1 ? onEnter(promptExamples[1]) : onNavigate(index === 2 ? "labs" : "assistant")}><ActionIcon size={22} /><span>{action.label}</span><CaretRight size={15} className="action-arrow" /></button>; })}
          </div>
        </section>

        <section className="evidence-story">
          <div className="evidence-story-copy">
            <h2>{t("evidenceTitle")}</h2>
            <p>{t("evidenceDescription")}</p>
            <button type="button" className="text-link" onClick={() => onEnter(ws("exampleQuestion"))}>{t("inspectEvidence")} <ArrowRight size={17} /></button>
          </div>
          <div className="source-flow" aria-label={ws("answerToEvidenceFlow")}>
            <div className="flow-answer"><span>{t("directAnswer")}</span><strong>{t("certificationMayApply")}</strong><p>{t("confirmScope")}</p><button type="button" onClick={() => onEnter(ws("exampleQuestion"))}>1</button></div>
            <ArrowRight size={22} className="flow-arrow" />
            <div className="flow-source"><FilePdf size={26} weight="duotone" /><div><span>{t("originalSource")}</span><strong>IS 17803:2022</strong><p>{ws("clause41")}</p></div><SealCheck size={20} weight="fill" /></div>
          </div>
        </section>
      </main>
      <footer className="landing-footer"><Brand /><p>{t("footerNote")}</p><button type="button" onClick={() => onNavigate("assistant")}>{t("openAssistant")} <ArrowRight size={16} /></button></footer>
    </div>
  );
}

function AppSidebar({ active, onChange, collapsed, onCollapse, onHome, onSignIn }: { active: View; onChange: (view: View) => void; collapsed: boolean; onCollapse: () => void; onHome: () => void; onSignIn: () => void }) {
  const ws = useTranslations("Workspace");
  const t = useTranslations("Navigation");
  const common = useTranslations("Common");
  return (
    <aside className={`app-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="sidebar-brand-row"><button type="button" className="brand-button" onClick={onHome} aria-label={ws("goToLandingPage")}><Brand compact={collapsed} /></button>{!collapsed && <IconButton label={ws("collapseSidebar")} onClick={onCollapse}><SidebarSimple size={19} /></IconButton>}</div>
      {collapsed && <IconButton label={ws("expandSidebar")} onClick={onCollapse} className="collapsed-toggle"><SidebarSimple size={19} /></IconButton>}
      <button type="button" className={`new-query-button ${collapsed ? "compact" : ""}`} aria-label={t("newQuery")} onClick={() => onChange("assistant")}><Plus size={18} weight="bold" />{!collapsed && <span>{t("newQuery")}</span>}</button>
      <nav className="sidebar-nav" aria-label={ws("workspaceNavigation")}>
        {navItems.map((item) => { const ItemIcon = item.icon; const label = t(item.labelKey); return <button type="button" key={item.id} className={active === item.id ? "active" : ""} onClick={() => onChange(item.id)} aria-current={active === item.id ? "page" : undefined} title={collapsed ? label : undefined}><ItemIcon size={19} weight={active === item.id ? "fill" : "regular"} />{!collapsed && <span>{label}</span>}</button>; })}
      </nav>
      <div className="sidebar-bottom"><button type="button" className="profile-button" aria-label={common("signIn")} onClick={onSignIn}><span className="profile-avatar"><UserCircle size={22} /></span>{!collapsed && <span className="profile-copy"><strong>{common("signIn")}</strong><small>{t("saveWork")}</small></span>}</button></div>
    </aside>
  );
}

function AppTopbar({ title, onMenu, onTheme, dark, onSignIn }: { title: string; onMenu: () => void; onTheme: () => void; dark: boolean; onSignIn: () => void }) {
  const ws = useTranslations("Workspace");
  const t = useTranslations("Navigation");
  const common = useTranslations("Common");
  return <header className="app-topbar"><div className="topbar-left"><IconButton label={ws("openNavigation")} onClick={onMenu} className="mobile-menu-button"><List size={21} /></IconButton><span className="breadcrumb">{t("workspace")}</span><CaretRight size={13} /><strong>{title}</strong></div><div className="topbar-actions"><LanguageSwitcher className="app-language" /><IconButton label={dark ? ws("useLightTheme") : ws("useDarkTheme")} onClick={onTheme}>{dark ? <Sun size={18} /> : <Moon size={18} />}</IconButton><button type="button" className="button compact secondary" onClick={onSignIn}>{common("signIn")}</button></div></header>;
}

function Citation({ index, onClick }: { index: number; onClick: () => void }) {
  const ws = useTranslations("Workspace");
  const format = useFormatter();
  return <button type="button" className="citation" onClick={onClick} aria-label={ws("openSource", { index })}>{format.number(index)}</button>;
}

function RetrievalState() {
  const ws = useTranslations("Workspace");
  const steps = [ws("previewStepStandards"), ws("previewStepCertification"), ws("previewStepSources")];
  return <div className="retrieval-state" role="status" aria-live="polite"><div className="retrieval-mark"><MagnifyingGlass size={21} /></div><div><strong>{ws("loadingPreview")}</strong><div className="retrieval-steps">{steps.map((step, index) => <span key={step} style={{ animationDelay: `${index * 260}ms` }}><CheckCircle size={15} weight={index === 0 ? "fill" : "regular"} /> {step}</span>)}</div></div></div>;
}

function AnswerCard({ onCitation, onOpenView }: { onCitation: (id: string) => void; onOpenView: (view: View) => void }) {
  const { downloadReport, notify } = useContext(PreviewContext);
  const ws = useTranslations("Workspace");
  return (
    <article className="answer" aria-label={ws("bISIntelligenceAnswer")}>
      <div className="answer-intro"><div className="assistant-emblem"><SealCheck size={21} weight="fill" /></div><div><div className="answer-byline">BIS Intelligence <span>{ws("illustrativeAssessment")}</span></div><p>{ws.rich("answerSummary", { standard: (chunks) => <strong>{chunks}</strong> })} <Citation index={1} onClick={() => onCitation("standard")} /> <Citation index={2} onClick={() => onCitation("qco")} /></p></div></div>
      <div className="decision-grid">
        <section className="decision-block product-block"><span className="decision-label">{ws("productIdentified")}</span><div className="decision-with-icon"><Package size={22} /><div><strong>{ws("stainlessSteelWaterBottle")}</strong><small>{ws("domesticDrinkware")}</small></div></div></section>
        <section className="decision-block standard-block"><span className="decision-label">{ws("recommendedStandard")}</span><strong className="standard-number">IS 17803:2022</strong><button type="button" className="inline-action" onClick={() => onCitation("standard")}>{ws("viewStandard")} <ArrowSquareOut size={15} /></button></section>
        <section className="decision-block certification-block"><span className="decision-label">{ws("certification")}</span><span className="status attention"><Warning size={15} weight="fill" /> {ws("applicabilityCheckRequired")}</span><p>{ws("confirmConstructionAndNotifiedScopeBeforeProceeding")}</p></section>
        <section className="decision-block scheme-block"><span className="decision-label">{ws("applicableScheme")}</span><div className="scheme-line"><span className="scheme-badge">Scheme-I</span><button type="button" className="help-dot" aria-label={ws("whatIsSchemeI")} onClick={() => notify(ws("schemeExplanation"))}><Question size={14} /></button></div><p>{ws("productCertificationWithTestingAndConformityAssessment")}</p></section>
      </div>
      <section className="answer-section"><div className="section-title-row"><div><h3>{ws("testingRequirements")}</h3><p>{ws("likelyTestGroupsUnderTheProductStandardAnd")}</p></div><Citation index={3} onClick={() => onCitation("manual")} /></div><div className="test-list">{[ws("materialAndWorkmanship"), ws("capacityAndThermalPerformance"), ws("leakageAndImpactResistance")].map((test) => <span key={test}><Check size={15} weight="bold" /> {test}</span>)}</div></section>
      <section className="caveat"><Info size={20} weight="fill" /><div><strong>{ws("oneDetailCanChangeThisResult")}</strong><p>{ws("isTheBottleVacuumInsulatedSingleWallOr")}</p></div><button type="button" onClick={() => { const input = document.getElementById("follow-up") as HTMLTextAreaElement | null; input?.focus(); notify(ws("additionalDetail")); }}>{ws("addDetail")}</button></section>
      <section className="next-steps"><div className="section-title-row"><div><h3>{ws("recommendedNextSteps")}</h3><p>{ws("moveFromIdentificationToAVerifiedCompliancePath")}</p></div></div><ol><li><span>1</span><div><strong>{ws("confirmProductConstruction")}</strong><small>{ws("addInsulationTypeCapacityAndIntendedUse")}</small></div></li><li><span>2</span><div><strong>{ws("verifyTheCurrentQCO")}</strong><small>{ws("checkWhetherMandatoryCertificationApplies")}</small></div></li><li><span>3</span><div><strong>{ws("planTesting")}</strong><small>{ws("matchTheRequiredTestsWithARecognisedLab")}</small></div></li></ol></section>
      <div className="answer-actions"><button type="button" className="button primary" onClick={() => onOpenView("products")}>{ws("saveAsProduct")}</button><button type="button" className="button secondary" onClick={() => onOpenView("labs")}>{ws("findLaboratory")}</button><button type="button" className="button ghost" onClick={downloadReport}><DownloadSimple size={17} /> {ws("generateReport")}</button><div className="answer-icon-actions"><IconButton label={ws("saveAnswer")}><BookmarkSimple size={18} /></IconButton><IconButton label={ws("shareAnswer")}><ShareNetwork size={18} /></IconButton></div></div>
    </article>
  );
}

function AssistantView({ initialQuestion, loading, onAsk, onCitation, onOpenView }: { initialQuestion: string; loading: boolean; onAsk: (query: string) => void; onCitation: (id: string) => void; onOpenView: (view: View) => void }) {
  const ws = useTranslations("Workspace");
  const locale = useLocale();
  const [query, setQuery] = useSessionDraft("bis-followup-draft");
  function submit(event: FormEvent) { event.preventDefault(); if (!query.trim()) return; onAsk(query.trim()); setQuery(""); }
  return (
    <div className="conversation-scroll">
      <div className="conversation"><div className="conversation-heading"><div><h1>{ws("complianceAssistant")}</h1><p>{ws("askAProductOrBISServiceQuestionImportant")}</p></div><span className="context-chip"><Package size={15} /> {ws("productContextActive")}</span></div><div className="user-message"><span className="message-author">{ws("you")}</span><p>{initialQuestion}</p></div>{loading ? <RetrievalState /> : <AnswerCard onCitation={onCitation} onOpenView={onOpenView} />}</div>
      <div className="sticky-composer-wrap"><form className="app-composer" onSubmit={submit}><label htmlFor="follow-up" className="sr-only">{ws("askAFollowUpQuestion")}</label><textarea id="follow-up" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={ws("askAFollowUpOrDescribeAnotherProduct")} rows={2} /><div className="composer-footer"><div className="composer-tools"><IconButton label={ws("attachDocument")}><Paperclip size={19} /></IconButton><IconButton label={ws("useMicrophone")}><Microphone size={19} /></IconButton><span className="language-badge">{isLocale(locale) ? LOCALE_NAMES[locale] : locale}</span></div><button type="submit" className="send-button" aria-label={ws("sendQuestion")} disabled={!query.trim() || loading}><ArrowUp size={19} weight="bold" /></button></div></form><p className="ai-note">{ws("verifyFinalComplianceDecisionsWithTheCitedOfficial")}</p></div>
    </div>
  );
}

function EvidencePanel({ selected, onSelect, onClose, onOpenDocument }: { selected: string; onSelect: (id: string) => void; onClose: () => void; onOpenDocument: () => void }) {
  const ws = useTranslations("Workspace");
  const sources = useSources();
  const activeSource = sources.find((source) => source.id === selected) ?? sources[0];
  const copyCitation = useCopyCitation(activeSource);
  return (
    <aside className="evidence-panel" aria-label={ws("sourcesAndEvidence")}>
      <div className="evidence-header"><div><strong>{ws("sources")}</strong><span>{ws("illustrativeSourcesCount", { count: sources.length })}</span></div><IconButton label={ws("closeSources")} onClick={onClose}><X size={18} /></IconButton></div>
      <div className="source-tabs" role="group" aria-label={ws("answerSources")}>{sources.map((source, index) => <button type="button" aria-pressed={selected === source.id} aria-label={ws("openSource", { index: index + 1 })} className={selected === source.id ? "active" : ""} key={source.id} onClick={() => onSelect(source.id)}>{index + 1}</button>)}</div>
      <div className="active-source"><div className="source-document-icon"><FilePdf size={23} weight="duotone" /></div><span className="source-type">{activeSource.type}</span><h2>{activeSource.number}</h2><p className="source-title">{activeSource.title}</p><div className="source-location"><IdentificationBadge size={17} /><div><span>{ws("relevantLocation")}</span><strong>{activeSource.location}</strong></div></div><div className="passage"><span>{ws("relevantPassage")}</span><p>{activeSource.excerpt}</p></div><button type="button" className="button primary full" onClick={onOpenDocument}>{ws("viewHighlightedPassage")} <ArrowSquareOut size={17} /></button><button type="button" className="button secondary full" onClick={copyCitation}><Copy size={17} /> {ws("copyCitation")}</button></div>
      <div className="source-list"><span>{ws("allEvidence")}</span>{sources.map((source, index) => <button type="button" key={source.id} onClick={() => onSelect(source.id)} className={selected === source.id ? "active" : ""}><span className="source-index">{index + 1}</span><span><strong>{source.number}</strong><small>{source.location}</small></span><CaretRight size={15} /></button>)}</div>
      <div className="source-provenance"><SealCheck size={17} weight="fill" /><p><strong>{ws("sourceProvenance")}</strong><span>{ws("sampleEvidence")}</span></p></div>
    </aside>
  );
}

function useCopyCitation(source: ReturnType<typeof useSources>[number]) {
  const ws = useTranslations("Workspace");
  const { notify } = useContext(PreviewContext);
  return async () => {
    try {
      await navigator.clipboard.writeText([source.number, source.title, source.location, source.excerpt, ws("sampleEvidence")].join("\n"));
      notify(ws("copySuccess"));
    } catch { notify(ws("copyError")); }
  };
}

function PageHeading({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function ProductsView({ onNavigate }: { onNavigate: (view: View) => void }) {
  const { preview } = useContext(PreviewContext);
  const ws = useTranslations("Workspace");
  const steps = [
    { label: ws("product"), detail: ws("bottleProfile"), state: "done", icon: Package },
    { label: ws("indianStandard"), detail: ws("relevantCount", { count: 2 }), state: "done", icon: Books },
    { label: ws("qCOCheck"), detail: ws("reviewRequired"), state: "current", icon: ShieldCheck },
    { label: ws("certification"), detail: "Scheme-I", state: "upcoming", icon: Certificate },
    { label: ws("testing"), detail: ws("testsCount", { count: 6 }), state: "upcoming", icon: Flask },
    { label: ws("laboratory"), detail: ws("matchingCount", { count: 3 }), state: "upcoming", icon: Buildings },
    { label: ws("licence"), detail: ws("finalOutcome"), state: "upcoming", icon: IdentificationBadge },
  ];
  return (
    <div className="workspace-page products-page">
      <PageHeading title={ws("productCompliance")} description={ws("turnAProductDescriptionIntoATraceableCompliance")} action={<button type="button" className="button primary" onClick={preview}><Plus size={17} /> {ws("addProduct")}</button>} />
      <div className="product-overview"><div className="product-identity"><span className="product-icon"><Package size={28} weight="duotone" /></span><div><span>{ws("productProfile")}</span><h2>{ws("stainlessSteelWaterBottle")}</h2><p>{ws("vacuumInsulatedDomesticDrinkware")}</p></div><button type="button" className="button ghost" onClick={preview}>{ws("editProfile")}</button></div><div className="product-metrics"><div><span>{ws("standards")}</span><strong>2</strong><small>{ws("relevant")}</small></div><div><span>{ws("certification")}</span><strong className="metric-alert">{ws("review")}</strong><small>{ws("qCOCheck")}</small></div><div><span>{ws("tests")}</span><strong>6</strong><small>{ws("identified")}</small></div><div><span>{ws("laboratories")}</span><strong>3</strong><small>{ws("matching")}</small></div></div></div>
      <section className="compliance-path-section"><div className="section-title-row"><div><h2>{ws("compliancePath")}</h2><p>{ws("eachCompletedDecisionUnlocksTheNextPartOf")}</p></div><span className="status attention"><Warning size={15} weight="fill" /> {ws("reviewCount", { count: 1 })}</span></div><div className="compliance-path">{steps.map((step, index) => { const StepIcon = step.icon; return <div className={`path-step ${step.state}`} key={step.label}><div className="path-node">{step.state === "done" ? <Check size={17} weight="bold" /> : <StepIcon size={18} />}</div><div><strong>{step.label}</strong><span>{step.detail}</span></div>{index < steps.length - 1 && <div className="path-connector" />}</div>; })}</div></section>
      <div className="product-detail-layout"><section className="review-panel"><div className="review-panel-heading"><ShieldCheck size={24} /><div><h3>{ws("qCOApplicabilityNeedsVerification")}</h3><p>{ws("theResultDependsOnInsulationTypeAndThe")}</p></div></div><div className="clarification-form"><label htmlFor="construction">{ws("bottleConstruction")}</label><select id="construction" defaultValue="vacuum"><option value="vacuum">{ws("vacuumInsulatedDoubleWall")}</option><option value="single">{ws("singleWall")}</option><option value="other">{ws("otherConstruction")}</option></select><small>{ws("thisDetailIsUsedOnlyToNarrowThe")}</small></div><button type="button" className="button primary" onClick={preview}>{ws("recheckApplicability")}</button></section><section className="key-documents"><h3>{ws("keyDocuments")}</h3><button type="button" onClick={() => onNavigate("standards")}><FilePdf size={20} /><span><strong>IS 17803:2022</strong><small>{ws("recommendedStandard")}</small></span><ArrowSquareOut size={15} /></button><button type="button" onClick={preview}><ClipboardText size={20} /><span><strong>{ws("productManual2")}</strong><small>{ws("inspectionAndTesting")}</small></span><ArrowSquareOut size={15} /></button><button type="button" onClick={preview}><ShieldCheck size={20} /><span><strong>{ws("qualityControlOrder")}</strong><small>{ws("applicabilitySource")}</small></span><ArrowSquareOut size={15} /></button></section></div>
    </div>
  );
}

function useStandards() {
  const ws = useTranslations("Workspace");
  return [
  { number: "IS 17803:2022", title: ws("stainlessSteelVacuumFlaskAndBottle"), area: ws("domesticProducts"), status: ws("active"), revised: ws("reaffirmed2025"), match: ws("bestMatch") },
  { number: "IS 14756:2022", title: ws("stainlessSteelUtensils"), area: ws("consumerGoods"), status: ws("active"), revised: ws("revised2022"), match: ws("related") },
  { number: "IS 10500:2012", title: ws("drinkingWaterSpecification"), area: ws("waterQuality"), status: ws("active"), revised: ws("amendment4"), match: ws("reference") },
  { number: "IS 9845:1998", title: ws("foodContactMigrationTesting"), area: ws("foodSafety"), status: ws("active"), revised: ws("reaffirmed2021"), match: ws("related") },
];
}

function StandardsView() {
  const { preview } = useContext(PreviewContext);
  const ws = useTranslations("Workspace");
  const standards = useStandards();
  const [search, setSearch] = useState("");
  const filtered = standards.filter((standard) => `${standard.number} ${standard.title} ${standard.area}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="workspace-page"><PageHeading title={ws("standardsExplorer")} description={ws("searchByISNumberProductKeywordIndustryOr")} /><div className="explorer-search"><MagnifyingGlass size={21} /><label htmlFor="standard-search" className="sr-only">{ws("searchIndianStandards")}</label><input id="standard-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={ws("searchIndianStandardsProductsOrTopics")} /></div><div className="filter-bar"><button type="button" className="active" onClick={preview}>{ws("allStandards")}</button><button type="button" onClick={preview}>{ws("products")}</button><button type="button" onClick={preview}>{ws("industry")}</button><button type="button" onClick={preview}>{ws("topic")}</button><span className="filter-spacer" /><button type="button" onClick={preview}><SlidersHorizontal size={16} /> {ws("filters")}</button><button type="button" onClick={preview}><ArrowsDownUp size={16} /> {ws("relevance")}</button></div><div className="results-summary"><strong>{ws("standardsCount", { count: filtered.length })}</strong><span>{ws("illustrativeSearchResults")}</span></div><div className="standards-results">{filtered.length ? filtered.map((standard) => <article className="standard-result" key={standard.number}><div className="standard-file"><FilePdf size={24} weight="duotone" /></div><div className="standard-result-main"><div className="standard-result-meta"><span>{standard.match}</span><span>{standard.area}</span></div><h2>{standard.number}</h2><p>{standard.title}</p><div className="standard-submeta"><span><CheckCircle size={15} weight="fill" /> {standard.status}</span><span>{standard.revised}</span><span>{ws("relatedStandardsCount", { count: 3 })}</span></div></div><div className="standard-result-actions"><IconButton label={ws("saveStandard", { standard: standard.number })}><BookmarkSimple size={18} /></IconButton><button type="button" className="button secondary" onClick={preview}>{ws("viewStandard")}</button></div></article>) : <div className="empty-state"><MagnifyingGlass size={28} /><h2>{ws("noMatchingStandards")}</h2><p>{ws("tryAProductNameIndustryTermOrA")}</p><button type="button" className="button secondary" onClick={() => setSearch("")}>{ws("clearSearch")}</button></div>}</div></div>
  );
}

function CertificationView() {
  const { preview } = useContext(PreviewContext);
  const ws = useTranslations("Workspace");
  const [ready, setReady] = useState([true, true, false, false, false, false]);
  const steps = [
    { name: ws("confirmApplicability"), description: ws("matchTheProductToTheStandardAndCurrent"), state: "complete" },
    { name: ws("prepareProductDetails"), description: ws("confirmConstructionVariantsAndManufacturingLocation"), state: "current" },
    { name: ws("completeTesting"), description: ws("testRequiredSamplesAtARecognisedLaboratory"), state: "upcoming" },
    { name: ws("submitApplication"), description: ws("uploadTheApplicationDocumentsAndTestReports"), state: "upcoming" },
    { name: ws("factoryAssessment"), description: ws("demonstrateManufacturingAndTestingControls"), state: "upcoming" },
    { name: ws("licenceDecision"), description: ws("addressObservationsAndReceiveTheCertificationDecision"), state: "upcoming" },
  ];
  return <div className="workspace-page certification-page"><PageHeading title={ws("certificationGuidance")} description={ws("aClearRouteThroughProductCertificationFromScope")} action={<button type="button" className="button secondary" onClick={preview}><DownloadSimple size={17} /> {ws("checklist")}</button>} /><div className="cert-summary"><div><span>{ws("likelyScheme")}</span><strong>Scheme-I</strong><p>{ws("productCertificationBasedOnConformityToAnIndian")}</p></div><div><span>{ws("currentPosition")}</span><strong>{ws("prepareProductDetails")}</strong><p>{ws("oneProductClarificationIsNeededBeforeTesting")}</p></div><div><span>{ws("attention")}</span><strong className="attention-text">{ws("qCOScope")}</strong><p>{ws("verifyTheCurrentlyEffectiveOrderBeforeApplying")}</p></div></div><div className="cert-layout"><section className="timeline-section"><div className="section-title-row"><div><h2>{ws("yourCertificationPath")}</h2><p>{ws("statusUpdatesAsTheProductMovesThroughEach")}</p></div></div><ol className="cert-timeline">{steps.map((step) => <li className={step.state} key={step.name}><span className="timeline-marker">{step.state === "complete" ? <Check size={16} weight="bold" /> : step.state === "current" ? <span /> : null}</span><div><strong>{step.name}</strong><p>{step.description}</p>{step.state === "current" && <button type="button" className="inline-action" onClick={preview}>{ws("continueThisStep")} <ArrowRight size={15} /></button>}</div><span className={`status ${step.state}`}>{step.state === "complete" ? ws("completed") : step.state === "current" ? ws("current") : ws("upcoming")}</span></li>)}</ol></section><aside className="requirements-panel"><h3>{ws("prepareTheseDocuments")}</h3><div className="requirement-progress"><strong>{ws("documentsReady", { ready: ready.filter(Boolean).length, total: ready.length })}</strong><span>{ws("basedOnYourSavedProduct")}</span></div>{[ws("manufacturingProcessFlow"), ws("factoryLayout"), ws("machineryDetails"), ws("testEquipmentList"), ws("qualityControlPlan"), ws("authorisationDocuments")].map((item, index) => <label key={item}><input type="checkbox" checked={ready[index]} onChange={(event) => setReady((items) => items.map((item, itemIndex) => itemIndex === index ? event.target.checked : item))} /><span>{item}</span></label>)}<button type="button" className="button secondary full" onClick={preview}>{ws("viewDocumentGuide")}</button></aside></div></div>;
}

function useLabs() {
  const ws = useTranslations("Workspace");
  return [
  { name: ws("nationalTestHouse"), location: ws("ghaziabadUttarPradesh"), distance: ws("distanceKm", { distance: 24 }), standards: ["IS 17803", "IS 14756"], tests: [ws("thermalPerformance"), ws("leakage"), ws("impact")], verified: ws("recognisedScopeChecked") },
  { name: ws("shriramInstituteForIndustrialResearch"), location: ws("delhi"), distance: ws("distanceKm", { distance: 31 }), standards: ["IS 17803", "IS 9845"], tests: [ws("materialAnalysis"), ws("migration"), ws("performance")], verified: ws("recognitionRecordAvailable") },
  { name: ws("centralTestingLaboratory"), location: ws("noidaUttarPradesh"), distance: ws("distanceKm", { distance: 38 }), standards: ["IS 14756"], tests: [ws("chemicalAnalysis"), ws("construction")], verified: ws("scopeRequiresConfirmation") },
];
}

function LabsView() {
  const { preview } = useContext(PreviewContext);
  const ws = useTranslations("Workspace");
  const format = useFormatter();
  const labs = useLabs();
  return <div className="workspace-page labs-page"><PageHeading title={ws("testingLaboratories")} description={ws("findRecognisedLaboratoriesByProductStandardTestAnd")} /><div className="lab-search-panel"><label htmlFor="lab-search">{ws("whatProductDoYouNeedTested")}</label><div className="lab-search-row"><MagnifyingGlass size={21} /><input id="lab-search" defaultValue={ws("stainlessSteelWaterBottle")} /><button type="button" className="button primary" onClick={preview}>{ws("findLaboratories")}</button></div><div className="lab-filters"><button type="button" onClick={preview}><MapPin size={16} /> {ws("delhiNCR")} <CaretDown size={13} /></button><button type="button" onClick={preview}><Books size={16} /> IS 17803 <CaretDown size={13} /></button><button type="button" onClick={preview}><Flask size={16} /> {ws("allTests")} <CaretDown size={13} /></button><button type="button" onClick={preview}><SlidersHorizontal size={16} /> {ws("moreFilters")}</button></div></div><div className="lab-result-layout"><div className="lab-list"><div className="results-summary"><strong>{ws("matchingLabsCount", { count: labs.length })}</strong><span>{ws("sortedByCapabilityMatch")}</span></div>{labs.map((lab, index) => <article className="lab-result" key={lab.name}><div className="lab-heading"><span className="lab-logo"><Buildings size={22} /></span><div><h2>{lab.name}</h2><p><MapPin size={15} /> {lab.location} <span>{lab.distance}</span></p></div><label className="compare-check"><input type="checkbox" /> {ws("compare")}</label></div><div className="lab-capabilities"><div><span>{ws("recognisedStandards")}</span><p>{lab.standards.map((item) => <strong key={item}>{item}</strong>)}</p></div><div><span>{ws("availableTests")}</span><p>{lab.tests.length > 2 ? ws("moreTests", { tests: format.list(lab.tests.slice(0, 2)), count: lab.tests.length - 2 }) : format.list(lab.tests)}</p></div></div><div className={`verification-line ${index === 2 ? "caution" : ""}`}>{index === 2 ? <WarningCircle size={16} /> : <SealCheck size={16} weight="fill" />} {lab.verified}</div><div className="lab-actions"><button type="button" className="button secondary" onClick={preview}>{ws("viewLab")}</button><button type="button" className="button ghost" onClick={preview}><Phone size={16} /> {ws("contact")}</button><button type="button" className="button ghost" onClick={preview}><NavigationArrow size={16} /> {ws("directions")}</button></div></article>)}</div><div className="lab-map" aria-label={ws("mapPreview")}><MapTrifold size={40} weight="duotone" /><strong>{ws("mapView")}</strong><p>{ws("threeMatchingLaboratoriesAreVisibleInDelhiNCR")}</p><div className="map-pin pin-one"><span>1</span></div><div className="map-pin pin-two"><span>2</span></div><div className="map-pin pin-three"><span>3</span></div></div></div></div>;
}

function HallmarkingView() {
  const { preview, notify } = useContext(PreviewContext);
  const ws = useTranslations("Workspace");
  const entries = [
    { title: ws("verifyHallmarkInformation"), description: ws("understandTheMarksOnAHallmarkedArticleAnd"), icon: SealCheck, action: ws("verifyHallmark") },
    { title: ws("understandHallmarking"), description: ws("learnWhatHallmarkingCoversAndWhatEachMark"), icon: Info, action: ws("readTheGuide") },
    { title: ws("findAHallmarkingCentre"), description: ws("locateARecognisedAssayingAndHallmarkingCentreNear"), icon: MapPin, action: ws("findACentre") },
    { title: ws("consumerGuidance"), description: ws("knowWhatToCheckBeforeBuyingAndHow"), icon: ShieldCheck, action: ws("viewGuidance") },
  ];
  return <div className="workspace-page hallmarking-page"><PageHeading title={ws("hallmarkingMadeClearer")} description={ws("simpleGuidanceForConsumersJewellersAndHallmarkingServices")} /><section className="hallmark-verify"><div><DiamondsFour size={34} weight="duotone" /><h2>{ws("checkAHallmarkedArticle")}</h2><p>{ws("enterTheSixCharacterHUIDPrintedOnThe")}</p></div><form onSubmit={(event) => { event.preventDefault(); notify(ws("useTheBISCareAppOrOfficialService")); }}><label htmlFor="huid">{ws("hUIDNumber")}</label><div><input id="huid" placeholder={ws("forExampleAB12CD")} maxLength={6} autoComplete="off" autoCapitalize="characters" /><button type="submit" className="button primary">{ws("verifyHUID")}</button></div><small>{ws("useTheBISCareAppOrOfficialService")}</small></form></section><div className="hallmark-entry-grid">{entries.map((entry) => { const EntryIcon = entry.icon; return <button type="button" key={entry.title} onClick={preview}><span className="entry-icon"><EntryIcon size={25} /></span><span><strong>{entry.title}</strong><small>{entry.description}</small><em>{entry.action} <ArrowRight size={15} /></em></span></button>; })}</div><section className="hallmark-anatomy"><div><h2>{ws("whatAHallmarkTellsYou")}</h2><p>{ws("threeMarksHelpIdentifyPurityTheBISSystem")}</p></div><div className="hallmark-marks"><span><SealCheck size={24} weight="fill" /><strong>{ws("bISMark")}</strong><small>{ws("standardsConformitySystem")}</small></span><span><strong className="purity-mark">22K916</strong><small>{ws("purityAndFineness")}</small></span><span><IdentificationBadge size={24} /><strong>HUID</strong><small>{ws("uniqueArticleIdentifier")}</small></span></div></section></div>;
}

function HistoryView() {
  const { preview } = useContext(PreviewContext);
  const ws = useTranslations("Workspace");
  const format = useFormatter();
  const dateOptions = { day: "numeric", month: "short", timeZone: "Asia/Kolkata" } as const;
  const timeOptions = { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" } as const;
  const items = [
    { question: ws("exampleQuestion"), date: ws("todayAt", { time: format.dateTime(new Date("2026-09-10T10:42:00+05:30"), timeOptions) }), type: ws("productCompliance") },
    { question: ws("whichTestsApplyToDomesticElectricAdapters"), date: ws("yesterdayAt", { time: format.dateTime(new Date("2026-09-09T16:18:00+05:30"), timeOptions) }), type: ws("testing") },
    { question: ws("findLaboratoriesRecognisedForIS302TestingIn"), date: ws("datedAt", { date: format.dateTime(new Date("2026-09-02T12:06:00+05:30"), dateOptions), time: format.dateTime(new Date("2026-09-02T12:06:00+05:30"), timeOptions) }), type: ws("laboratories") },
    { question: ws("whatDoesA22K916HallmarkMean"), date: ws("datedAt", { date: format.dateTime(new Date("2026-08-29T09:34:00+05:30"), dateOptions), time: format.dateTime(new Date("2026-08-29T09:34:00+05:30"), timeOptions) }), type: ws("hallmarking") },
  ];
  return <div className="workspace-page"><PageHeading title={ws("savedQueries")} description={ws("returnToQuestionsEvidenceAndComplianceDecisionsYou")} action={<button type="button" className="button secondary" onClick={preview}><MagnifyingGlass size={16} /> {ws("searchSaved")}</button>} /><div className="saved-list">{items.map((item, index) => <button type="button" key={item.question} onClick={preview}><span className="saved-icon">{index === 0 ? <BookmarkSimple size={19} weight="fill" /> : <ChatTeardropDots size={19} />}</span><span className="saved-copy"><strong>{item.question}</strong><small>{item.type} <span>•</span> {item.date}</small></span><CaretRight size={17} /></button>)}</div></div>;
}

function ReportsView() {
  const { downloadReport } = useContext(PreviewContext);
  const ws = useTranslations("Workspace");
  return <div className="workspace-page"><PageHeading title={ws("documentsAndReports")} description={ws("exportEvidenceBackedComplianceSummariesForYourTeam")} action={<button type="button" className="button primary" onClick={downloadReport}><Plus size={17} /> {ws("newReport")}</button>} /><div className="report-feature"><div className="report-preview"><FilePdf size={38} weight="duotone" /><span>BIS Intelligence</span><strong>{ws("productComplianceBrief")}</strong><p>{ws("stainlessSteelWaterBottle")}</p><div className="report-lines"><i /><i /><i /></div></div><div className="report-copy"><h2>{ws("generateAReviewReadyComplianceBrief")}</h2><p>{ws("combineTheProductProfileRecommendedStandardsSourceCitations")}</p><div className="report-includes"><span><Check size={15} /> {ws("clauseLevelCitations")}</span><span><Check size={15} /> {ws("compliancePath")}</span><span><Check size={15} /> {ws("openDecisionLog")}</span><span><Check size={15} /> {ws("laboratoryShortlist")}</span></div><button type="button" className="button primary" onClick={downloadReport}><DownloadSimple size={17} /> {ws("generateReport")}</button></div></div><section className="recent-reports"><h2>{ws("recentReports")}</h2><div className="empty-state compact-empty"><Files size={26} /><h3>{ws("noReportsYet")}</h3><p>{ws("createAReportFromASavedProductOr")}</p></div></section></div>;
}

function DashboardView({ onNavigate }: { onNavigate: (view: View) => void }) {
  const { preview } = useContext(PreviewContext);
  const ws = useTranslations("Workspace");
  const format = useFormatter();
  return <div className="workspace-page dashboard-page"><PageHeading title={ws("yourComplianceWorkspace")} description={ws("continueRecentProductReviewsAndKeepImportantStandards")} action={<button type="button" className="button primary" onClick={() => onNavigate("products")}><Plus size={17} /> {ws("addProduct")}</button>} /><section className="dashboard-products"><div className="section-title-row"><div><h2>{ws("myProducts")}</h2><p>{ws("productsWithRecentComplianceActivity")}</p></div><button type="button" className="text-link" onClick={() => onNavigate("products")}>{ws("viewAll")} <ArrowRight size={15} /></button></div><div className="dashboard-product-list"><button type="button" onClick={() => onNavigate("products")}><span className="product-monogram"><Package size={22} aria-hidden="true" /></span><span><strong>{ws("stainlessSteelBottle")}</strong><small>{ws("certificationReviewRequired")}</small></span><span className="status attention">{ws("needsReview")}</span><CaretRight size={16} /></button><button type="button" onClick={preview}><span className="product-monogram alt"><Package size={22} aria-hidden="true" /></span><span><strong>{ws("electricalAdapter")}</strong><small>{ws("standardsIdentifiedCount", { count: 3 })}</small></span><span className="status complete">{ws("onTrack")}</span><CaretRight size={16} /></button></div></section><div className="dashboard-columns"><section><div className="section-title-row"><div><h2>{ws("recentQueries")}</h2></div></div><div className="mini-list"><button type="button" onClick={preview}>{ws("doINeedCertificationForAVacuumBottle")}<span>{ws("today")}</span></button><button type="button" onClick={preview}>{ws("testingForElectricalAdapters")}<span>{ws("yesterday")}</span></button><button type="button" onClick={preview}>{ws("hallmarkHUIDExplanation")}<span>{format.dateTime(new Date("2026-08-29T12:00:00+05:30"), { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })}</span></button></div></section><section><div className="section-title-row"><div><h2>{ws("savedStandards")}</h2></div></div><div className="mini-list standards-mini"><button type="button" onClick={preview}><strong>IS 17803:2022</strong><span>{ws("vacuumFlasksAndBottles")}</span></button><button type="button" onClick={preview}><strong>IS 14756:2022</strong><span>{ws("stainlessSteelUtensils")}</span></button><button type="button" onClick={preview}><strong>IS 302-1:2008</strong><span>{ws("electricalApplianceSafety")}</span></button></div></section></div></div>;
}

function GenericContent({view, onNavigate}: { view: View; onNavigate: (view: View) => void }) {
    if (view === "products") return <ProductsView onNavigate={onNavigate}/>;
    if (view === "standards") return <StandardsView/>;
    if (view === "certification") return <CertificationView/>;
    if (view === "labs") return <LabsView/>;
    if (view === "hallmarking") return <HallmarkingView/>;
    if (view === "history") return <HistoryView/>;
    if (view === "reports") return <ReportsView/>;
    return <DashboardView onNavigate={onNavigate}/>;
}

function DocumentViewer({ sourceId, onClose }: { sourceId: string; onClose: () => void }) {
  const { preview } = useContext(PreviewContext);
  const ws = useTranslations("Workspace");
  const sources = useSources();
  const source = sources.find((item) => item.id === sourceId) ?? sources[0];
  const copyCitation = useCopyCitation(source);
  const dialogRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab" || !dialog) return;
      const controls = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, select, textarea, [tabindex="0"]')].filter((element) => element.getClientRects().length > 0);
      const first = controls[0], last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, [onClose]);
  return <div className="modal-backdrop document-backdrop" role="presentation" onMouseDown={onClose}><section className="document-viewer" ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={ws("documentViewer", { standard: source.number })} onMouseDown={(event) => event.stopPropagation()}><header className="document-toolbar"><div><IconButton label={ws("closeDocument")} onClick={onClose}><ArrowLeft size={20} /></IconButton><div><strong>{source.number}</strong><span>{source.title}</span></div></div><div className="document-tools"><button type="button" onClick={preview}><MagnifyingGlass size={17} /> {ws("search")}</button><button type="button" onClick={preview}>100% <CaretDown size={12} /></button><button type="button" onClick={copyCitation}><Copy size={17} /> {ws("copyCitation")}</button><button type="button" onClick={preview}><ArrowSquareOut size={17} /> {ws("originalSource")}</button><IconButton label={ws("closeDocument")} onClick={onClose}><X size={19} /></IconButton></div></header><div className="document-body"><aside className="document-pages"><span>{ws("pages")}</span>{[10, 11, 12, 13].map((page) => <button type="button" className={page === 12 ? "active" : ""} key={page} onClick={preview}><span className="page-thumb"><i /><i /><i /><i /></span><small>{page}</small></button>)}</aside><main className="document-canvas"><div className="pdf-page">{sourceId === "standard" ? <><div className="pdf-page-header"><span>IS 17803:2022</span><span>{ws("indianStandard")}</span></div><h2>{ws("stainlessSteelVacuumFlaskAndBottle")}</h2><p className="pdf-intro">{ws("requirementsAndMethodsOfTest")}</p><h3>{ws("count4MaterialsAndConstruction")}</h3><p><strong>4.1</strong> {ws("theBodyAndComponentsInContactWithFood")}</p><div className="highlighted-clause"><span className="highlight-tag">{ws("citedInAnswer")}</span><p><strong>4.2</strong> {ws("stainlessSteelVacuumFlasksAndBottlesShallMeet")}</p></div><p><strong>4.3</strong> {ws("allComponentsShallBeFreeFromDefectsThat")}</p><h3>{ws("count6PerformanceRequirements")}</h3><p>{ws("productsShallBeTestedForCapacityThermalPerformance")}</p><div className="pdf-page-footer"><span>{ws("illustrativeDocumentContent")}</span><span>12</span></div></> : <><div className="pdf-page-header"><span>{source.number}</span><span>{source.type}</span></div><h2>{source.title}</h2><p className="pdf-intro">{source.location}</p><div className="highlighted-clause"><span className="highlight-tag">{ws("citedInAnswer")}</span><p>{source.excerpt}</p></div><p>{ws("sampleEvidence")}</p><div className="pdf-page-footer"><span>{ws("illustrativeDocumentContent")}</span></div></>}</div></main><aside className="document-context"><span>{ws("evidenceContext")}</span><h3>{ws("whyThisPassageMatters")}</h3><p>{sourceId === "standard" ? ws("thisClauseNarrowsTheStandardToTheConstruction") : source.excerpt}</p><div><small>{ws("usedForClaim")}</small><strong>{sourceId === "standard" ? ws("iS178032022MayApply") : ws("applicabilityCheckRequired")}</strong></div><button type="button" className="button secondary full" onClick={copyCitation}><Copy size={16} /> {ws("copyCitation")}</button></aside></div></section></div>;
}

export function BISIntelligence() {
  const ws = useTranslations("Workspace");
  const common = useTranslations("Common");
  const locale = useLocale();
  const sources = useSources();
  const router = useRouter();
  const navigation = useTranslations("Navigation");
  const [screen, setScreen] = useState<"landing" | "app">("landing");
  const [view, setView] = useState<View>("assistant");
  const [question, setQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(true);
  const [selectedSource, setSelectedSource] = useState("standard");
  const [documentOpen, setDocumentOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [notice, setNotice] = useState("");
  const closeDocument = useCallback(() => setDocumentOpen(false), []);

  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setQuestion(window.sessionStorage.getItem("bis-question"));
        setDark(window.localStorage.getItem("bis-theme") === "dark");
      } catch { /* Storage can be unavailable in private browsing. */ }
      const requestedView = new URLSearchParams(window.location.search).get("view") as View | null;
      if (requestedView && [...navItems.map((item) => item.id), "dashboard"].includes(requestedView)) {
        setScreen("app");
        setView(requestedView);
        setSourceOpen(requestedView === "assistant" && window.innerWidth > 720);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => { if (!loading) return; const timer = window.setTimeout(() => setLoading(false), 1750); return () => window.clearTimeout(timer); }, [loading, question]);

  function enterAssistant(nextQuestion: string) {
    const customQuestion = nextQuestion === ws("exampleQuestion") ? null : nextQuestion;
    setQuestion(customQuestion);
    try {
      if (customQuestion) window.sessionStorage.setItem("bis-question", customQuestion);
      else window.sessionStorage.removeItem("bis-question");
    } catch { /* The question still works without browser storage. */ }
    updateWorkspaceLocation("assistant");
    setScreen("app"); setView("assistant"); setSourceOpen(window.innerWidth > 720); setLoading(true);
  }
  function navigate(nextView: View) { updateWorkspaceLocation(nextView); setScreen("app"); setView(nextView); setMobileNavOpen(false); if (nextView !== "assistant") setSourceOpen(false); }
  function goHome() { updateWorkspaceLocation(); setScreen("landing"); setMobileNavOpen(false); }
  function toggleTheme() {
    setDark((value) => {
      const next = !value;
      try { window.localStorage.setItem("bis-theme", next ? "dark" : "light"); } catch { /* Optional persistence. */ }
      return next;
    });
  }
  function preview() { setNotice(ws("previewAction")); }
  function downloadReport() {
    try {
      const content = ["BIS Intelligence", ws("productComplianceBrief"), ws("reportNotice"), "", ws("productProfile"), ws("stainlessSteelWaterBottle"), ws("vacuumInsulatedDomesticDrinkware"), "", ws("recommendedStandard"), "IS 17803:2022", ws("applicabilityCheckRequired"), ws("confirmConstructionAndNotifiedScopeBeforeProceeding"), "", ws("testingRequirements"), ws("materialAndWorkmanship"), ws("capacityAndThermalPerformance"), ws("leakageAndImpactResistance"), "", ws("recommendedNextSteps"), ws("confirmProductConstruction"), ws("addInsulationTypeCapacityAndIntendedUse"), ws("verifyTheCurrentQCO"), ws("checkWhetherMandatoryCertificationApplies"), ws("planTesting"), ws("matchTheRequiredTestsWithARecognisedLab"), "", ws("sources"), ...sources.flatMap((source) => [source.number, source.title, source.location, source.excerpt, ""]), ws("sampleEvidence")].join("\n");
      const url = URL.createObjectURL(new Blob(["\uFEFF", content], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url; link.download = `bis-compliance-${locale}.txt`; document.body.append(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice(ws("reportDownloaded"));
    } catch { setNotice(ws("downloadError")); }
  }
  function openCitation(id: string) { setSelectedSource(id); setSourceOpen(true); }
  function openAuth() { router.push("/auth"); }

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
    <PreviewContext.Provider value={{ notify: setNotice, preview, downloadReport }}>
      <a href="#main-content" className="skip-link">{common("skipToContent")}</a>
      {screen === "landing" ? <Landing onEnter={enterAssistant} onNavigate={navigate} onSignIn={openAuth} onTheme={toggleTheme} dark={dark} /> : <div className="app-shell"><div className={`mobile-nav-scrim ${mobileNavOpen ? "open" : ""}`} onClick={() => setMobileNavOpen(false)} /><div className={`sidebar-wrap ${mobileNavOpen ? "mobile-open" : ""}`}><AppSidebar active={view} onChange={navigate} collapsed={sidebarCollapsed} onCollapse={() => setSidebarCollapsed((value) => !value)} onHome={goHome} onSignIn={openAuth} /></div><div className="app-main"><AppTopbar title={viewTitle} onMenu={() => setMobileNavOpen(true)} onTheme={toggleTheme} dark={dark} onSignIn={openAuth} /><div className={`workspace ${view === "assistant" && sourceOpen ? "with-evidence" : ""}`}><main id="main-content" tabIndex={-1} className="workspace-main"><p className="preview-notice"><Info size={17} aria-hidden="true" />{ws("previewNotice")}</p>{view === "assistant" ? <AssistantView initialQuestion={question ?? ws("exampleQuestion")} loading={loading} onAsk={enterAssistant} onCitation={openCitation} onOpenView={navigate} /> : <GenericContent view={view} onNavigate={navigate} />}</main>{view === "assistant" && sourceOpen && <EvidencePanel selected={selectedSource} onSelect={setSelectedSource} onClose={() => setSourceOpen(false)} onOpenDocument={() => setDocumentOpen(true)} />}{view === "assistant" && !sourceOpen && !loading && <button type="button" className="floating-sources-button" onClick={() => setSourceOpen(true)}><Files size={17} /> {ws("sourcesCount", { count: 3 })}</button>}</div></div><nav className="mobile-bottom-nav" aria-label={ws("mobileNavigation")}>{[navItems[0], navItems[1], navItems[2], navItems[4]].map((item) => { const ItemIcon = item.icon; return <button type="button" key={item.id} className={view === item.id ? "active" : ""} onClick={() => navigate(item.id)}><ItemIcon size={20} weight={view === item.id ? "fill" : "regular"} /><span>{navigation(`${item.labelKey}Short`)}</span></button>; })}<button type="button" onClick={() => setMobileNavOpen(true)}><List size={20} /><span>{navigation("more")}</span></button></nav></div>}
      {documentOpen && <DocumentViewer sourceId={selectedSource} onClose={closeDocument} />}
      {notice && <div className="preview-toast" role="status"><span>{notice}</span><IconButton label={ws("closeNotification")} onClick={() => setNotice("")}><X size={18} /></IconButton></div>}
    </PreviewContext.Provider>
  );
}
