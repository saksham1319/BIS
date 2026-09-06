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
  Moon,
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
  Sun,
  UserCircle,
  Warning,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useRouter } from "@/i18n/navigation";

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
  { id: "assistant", labelKey: "assistant", icon: ChatTeardropDots },
  { id: "products", labelKey: "products", icon: Package },
  { id: "standards", labelKey: "standards", icon: Books },
  { id: "certification", labelKey: "certification", icon: Certificate },
  { id: "labs", labelKey: "labs", icon: Flask },
  { id: "hallmarking", labelKey: "hallmarking", icon: DiamondsFour },
  { id: "history", labelKey: "history", icon: ClockCounterClockwise },
  { id: "reports", labelKey: "reports", icon: Files },
];

const sources = [
  {
    id: "standard",
    number: "IS 17803:2022",
    type: "Indian Standard",
    location: "Clauses 4.1 and 6",
    title: "Stainless steel vacuum flask and bottle",
    excerpt:
      "The standard specifies material, construction, performance and marking requirements for domestic stainless steel vacuum flasks and bottles.",
  },
  {
    id: "qco",
    number: "QCO reference",
    type: "Quality Control Order",
    location: "Applicability check",
    title: "Domestic stainless steel products",
    excerpt:
      "Certification applicability depends on the exact product construction, notified scope and the currently effective Quality Control Order.",
  },
  {
    id: "manual",
    number: "PM/IS 17803/1",
    type: "Product Manual",
    location: "Page 12",
    title: "Scheme of inspection and testing",
    excerpt:
      "The product manual describes grouping, sampling, testing facilities and the records expected during conformity assessment.",
  },
];

function IconButton({ label, children, onClick, className = "" }: { label: string; children: React.ReactNode; onClick?: () => void; className?: string }) {
  return <button type="button" className={`icon-button ${className}`} aria-label={label} title={label} onClick={onClick}>{children}</button>;
}

function Landing({ onEnter, onNavigate, onSignIn, onTheme, dark }: { onEnter: (question: string) => void; onNavigate: (view: View) => void; onSignIn: () => void; onTheme: () => void; dark: boolean }) {
  const t = useTranslations("Landing");
  const navigation = useTranslations("Navigation");
  const common = useTranslations("Common");
  const [question, setQuestion] = useState("");
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
    onEnter(question.trim() || exampleQuestion);
  }

  function choosePrompt(prompt: string) {
    setQuestion(prompt);
    inputRef.current?.focus();
  }

  return (
    <div className="landing-shell">
      <header className="landing-header">
        <Brand />
        <nav className="landing-nav" aria-label="Primary navigation">
          <button onClick={() => onNavigate("assistant")}>{navigation("assistant")}</button>
          <button onClick={() => onNavigate("standards")}>{navigation("standards")}</button>
          <button onClick={() => onNavigate("certification")}>{navigation("certification")}</button>
          <button onClick={() => onNavigate("labs")}>{navigation("labs")}</button>
          <button onClick={() => onNavigate("hallmarking")}>{navigation("hallmarking")}</button>
        </nav>
        <div className="header-actions">
          <LanguageSwitcher />
          <IconButton label={dark ? "Use light theme" : "Use dark theme"} onClick={onTheme}>{dark ? <Sun size={19} /> : <Moon size={19} />}</IconButton>
          <button type="button" className="button secondary sign-in-top" onClick={onSignIn}>{common("signIn")}</button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <div className="trust-line"><ShieldCheck size={18} weight="fill" /><span>{t("trust")}</span></div>
            <h1><span>{t("titleOne")}</span><span>{t("titleTwo")}</span></h1>
            <p>{t("description")}</p>
            <div className="hero-note"><div className="hero-note-line" /><span>{t("guestAccess")}</span></div>
          </div>

          <div className="hero-workbench" aria-label="Ask BIS Intelligence">
            <div className="workbench-header">
              <div><strong>{t("workbenchTitle")}</strong></div>
              <span className="verified-chip"><SealCheck size={15} weight="fill" /> {t("sourceAware")}</span>
            </div>
            <form className="hero-composer" onSubmit={submit}>
              <label htmlFor="landing-question" className="sr-only">Ask anything about BIS</label>
              <textarea ref={inputRef} id="landing-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t("placeholder")} rows={3} />
              <div className="composer-footer">
                <div className="composer-tools"><IconButton label="Attach a product document"><Paperclip size={20} /></IconButton><span className="composer-hint">{t("describeProduct")}</span></div>
                <button type="submit" className="send-button" aria-label="Ask BIS Intelligence"><ArrowUp size={20} weight="bold" /></button>
              </div>
            </form>
            <div className="prompt-list" aria-label="Example questions">
              {promptExamples.slice(0, 3).map((prompt) => <button type="button" key={prompt} onClick={() => choosePrompt(prompt)}><span>{prompt}</span><ArrowRight size={16} /></button>)}
            </div>
          </div>
        </section>

        <section className="quick-action-band" aria-label="Common tasks">
          <div className="band-intro"><span>{t("quickTitle")}</span><p>{t("quickDescription")}</p></div>
          <div className="quick-action-grid">
            {quickActions.map((action, index) => { const ActionIcon = action.icon; return <button type="button" key={action.label} onClick={() => index === 0 ? choosePrompt(promptExamples[0]) : onEnter(promptExamples[index])}><ActionIcon size={22} /><span>{action.label}</span><CaretRight size={15} className="action-arrow" /></button>; })}
          </div>
        </section>

        <section className="evidence-story">
          <div className="evidence-story-copy">
            <h2>{t("evidenceTitle")}</h2>
            <p>{t("evidenceDescription")}</p>
            <button type="button" className="text-link" onClick={() => onEnter(exampleQuestion)}>{t("inspectEvidence")} <ArrowRight size={17} /></button>
          </div>
          <div className="source-flow" aria-label="Answer to evidence flow">
            <div className="flow-answer"><span>{t("directAnswer")}</span><strong>{t("certificationMayApply")}</strong><p>{t("confirmScope")}</p><button type="button" onClick={() => onEnter(exampleQuestion)}>1</button></div>
            <ArrowRight size={22} className="flow-arrow" />
            <div className="flow-source"><FilePdf size={26} weight="duotone" /><div><span>{t("originalSource")}</span><strong>IS 17803:2022</strong><p>Clause 4.1</p></div><SealCheck size={20} weight="fill" /></div>
          </div>
        </section>
      </main>
      <footer className="landing-footer"><Brand /><p>{t("footerNote")}</p><button type="button" onClick={() => onNavigate("assistant")}>{t("openAssistant")} <ArrowRight size={16} /></button></footer>
    </div>
  );
}

function AppSidebar({ active, onChange, collapsed, onCollapse, onHome, onSignIn }: { active: View; onChange: (view: View) => void; collapsed: boolean; onCollapse: () => void; onHome: () => void; onSignIn: () => void }) {
  const t = useTranslations("Navigation");
  const common = useTranslations("Common");
  return (
    <aside className={`app-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="sidebar-brand-row"><button type="button" className="brand-button" onClick={onHome} aria-label="Go to landing page"><Brand compact={collapsed} /></button>{!collapsed && <IconButton label="Collapse sidebar" onClick={onCollapse}><SidebarSimple size={19} /></IconButton>}</div>
      {collapsed && <IconButton label="Expand sidebar" onClick={onCollapse} className="collapsed-toggle"><SidebarSimple size={19} /></IconButton>}
      <button type="button" className={`new-query-button ${collapsed ? "compact" : ""}`} onClick={() => onChange("assistant")}><Plus size={18} weight="bold" />{!collapsed && <span>{t("newQuery")}</span>}</button>
      <nav className="sidebar-nav" aria-label="Workspace navigation">
        {navItems.map((item) => { const ItemIcon = item.icon; const label = t(item.labelKey); return <button type="button" key={item.id} className={active === item.id ? "active" : ""} onClick={() => onChange(item.id)} aria-current={active === item.id ? "page" : undefined} title={collapsed ? label : undefined}><ItemIcon size={19} weight={active === item.id ? "fill" : "regular"} />{!collapsed && <span>{label}</span>}</button>; })}
      </nav>
      <div className="sidebar-bottom"><button type="button" className="profile-button" onClick={onSignIn}><span className="profile-avatar"><UserCircle size={22} /></span>{!collapsed && <span className="profile-copy"><strong>{common("signIn")}</strong><small>{t("saveWork")}</small></span>}</button></div>
    </aside>
  );
}

function AppTopbar({ title, onMenu, onTheme, dark, onSignIn }: { title: string; onMenu: () => void; onTheme: () => void; dark: boolean; onSignIn: () => void }) {
  const t = useTranslations("Navigation");
  const common = useTranslations("Common");
  return <header className="app-topbar"><div className="topbar-left"><IconButton label="Open navigation" onClick={onMenu} className="mobile-menu-button"><List size={21} /></IconButton><span className="breadcrumb">{t("workspace")}</span><CaretRight size={13} /><strong>{title}</strong></div><div className="topbar-actions"><LanguageSwitcher className="app-language" /><IconButton label={dark ? "Use light theme" : "Use dark theme"} onClick={onTheme}>{dark ? <Sun size={18} /> : <Moon size={18} />}</IconButton><button type="button" className="button compact secondary" onClick={onSignIn}>{common("signIn")}</button></div></header>;
}

function Citation({ index, onClick }: { index: number; onClick: () => void }) {
  return <button type="button" className="citation" onClick={onClick} aria-label={`Open source ${index}`}>{index}</button>;
}

function RetrievalState() {
  const steps = ["Searching Indian Standards...", "Checking certification requirements...", "Verifying against BIS sources..."];
  return <div className="retrieval-state" role="status" aria-live="polite"><div className="retrieval-mark"><MagnifyingGlass size={21} /></div><div><strong>Building a source-backed answer</strong><div className="retrieval-steps">{steps.map((step, index) => <span key={step} style={{ animationDelay: `${index * 260}ms` }}><CheckCircle size={15} weight={index === 0 ? "fill" : "regular"} /> {step}</span>)}</div></div></div>;
}

function AnswerCard({ onCitation, onOpenView }: { onCitation: (id: string) => void; onOpenView: (view: View) => void }) {
  return (
    <article className="answer" aria-label="BIS Intelligence answer">
      <div className="answer-intro"><div className="assistant-emblem"><SealCheck size={21} weight="fill" /></div><div><div className="answer-byline">BIS Intelligence <span>Illustrative assessment</span></div><p>A stainless steel water bottle may fall under <strong>IS 17803:2022</strong>, depending on whether it is a vacuum-insulated domestic bottle. Certification should be checked against the exact product construction and current QCO scope. <Citation index={1} onClick={() => onCitation("standard")} /> <Citation index={2} onClick={() => onCitation("qco")} /></p></div></div>
      <div className="decision-grid">
        <section className="decision-block product-block"><span className="decision-label">Product identified</span><div className="decision-with-icon"><Package size={22} /><div><strong>Stainless steel water bottle</strong><small>Domestic drinkware</small></div></div></section>
        <section className="decision-block standard-block"><span className="decision-label">Recommended standard</span><strong className="standard-number">IS 17803:2022</strong><button type="button" className="inline-action" onClick={() => onCitation("standard")}>View standard <ArrowSquareOut size={15} /></button></section>
        <section className="decision-block certification-block"><span className="decision-label">Certification</span><span className="status attention"><Warning size={15} weight="fill" /> Applicability check required</span><p>Confirm construction and notified scope before proceeding.</p></section>
        <section className="decision-block scheme-block"><span className="decision-label">Applicable scheme</span><div className="scheme-line"><span className="scheme-badge">Scheme-I</span><button type="button" className="help-dot" aria-label="What is Scheme-I?"><Question size={14} /></button></div><p>Product certification with testing and conformity assessment.</p></section>
      </div>
      <section className="answer-section"><div className="section-title-row"><div><h3>Testing requirements</h3><p>Likely test groups under the product standard and manual.</p></div><Citation index={3} onClick={() => onCitation("manual")} /></div><div className="test-list">{["Material and workmanship", "Capacity and thermal performance", "Leakage and impact resistance"].map((test) => <span key={test}><Check size={15} weight="bold" /> {test}</span>)}</div></section>
      <section className="caveat"><Info size={20} weight="fill" /><div><strong>One detail can change this result</strong><p>Is the bottle vacuum-insulated, single-wall, or intended for a specific industrial use?</p></div><button type="button">Add detail</button></section>
      <section className="next-steps"><div className="section-title-row"><div><h3>Recommended next steps</h3><p>Move from identification to a verified compliance path.</p></div></div><ol><li><span>1</span><div><strong>Confirm product construction</strong><small>Add insulation type, capacity and intended use.</small></div></li><li><span>2</span><div><strong>Verify the current QCO</strong><small>Check whether mandatory certification applies.</small></div></li><li><span>3</span><div><strong>Plan testing</strong><small>Match the required tests with a recognised lab.</small></div></li></ol></section>
      <div className="answer-actions"><button type="button" className="button primary" onClick={() => onOpenView("products")}>Save as product</button><button type="button" className="button secondary" onClick={() => onOpenView("labs")}>Find laboratory</button><button type="button" className="button ghost"><DownloadSimple size={17} /> Generate report</button><div className="answer-icon-actions"><IconButton label="Save answer"><BookmarkSimple size={18} /></IconButton><IconButton label="Share answer"><ShareNetwork size={18} /></IconButton></div></div>
    </article>
  );
}

function AssistantView({ initialQuestion, loading, onAsk, onCitation, onOpenView }: { initialQuestion: string; loading: boolean; onAsk: (query: string) => void; onCitation: (id: string) => void; onOpenView: (view: View) => void }) {
  const [query, setQuery] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); if (!query.trim()) return; onAsk(query.trim()); setQuery(""); }
  return (
    <div className="conversation-scroll">
      <div className="conversation"><div className="conversation-heading"><div><h1>Compliance assistant</h1><p>Ask a product or BIS service question. Important claims include inspectable sources.</p></div><span className="context-chip"><Package size={15} /> Product context active</span></div><div className="user-message"><span className="message-author">You</span><p>{initialQuestion}</p></div>{loading ? <RetrievalState /> : <AnswerCard onCitation={onCitation} onOpenView={onOpenView} />}</div>
      <div className="sticky-composer-wrap"><form className="app-composer" onSubmit={submit}><label htmlFor="follow-up" className="sr-only">Ask a follow-up question</label><textarea id="follow-up" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask a follow-up or describe another product..." rows={2} /><div className="composer-footer"><div className="composer-tools"><IconButton label="Attach document"><Paperclip size={19} /></IconButton><IconButton label="Use microphone"><Microphone size={19} /></IconButton><span className="language-badge">EN</span></div><button type="submit" className="send-button" aria-label="Send question"><ArrowUp size={19} weight="bold" /></button></div></form><p className="ai-note">Verify final compliance decisions with the cited official documents.</p></div>
    </div>
  );
}

function EvidencePanel({ selected, onSelect, onClose, onOpenDocument }: { selected: string; onSelect: (id: string) => void; onClose: () => void; onOpenDocument: () => void }) {
  const activeSource = sources.find((source) => source.id === selected) ?? sources[0];
  return (
    <aside className="evidence-panel" aria-label="Sources and evidence">
      <div className="evidence-header"><div><strong>Sources</strong><span>3 sources verified</span></div><IconButton label="Close sources" onClick={onClose}><X size={18} /></IconButton></div>
      <div className="source-tabs" role="tablist" aria-label="Answer sources">{sources.map((source, index) => <button type="button" role="tab" aria-selected={selected === source.id} className={selected === source.id ? "active" : ""} key={source.id} onClick={() => onSelect(source.id)}>{index + 1}</button>)}</div>
      <div className="active-source"><div className="source-document-icon"><FilePdf size={23} weight="duotone" /></div><span className="source-type">{activeSource.type}</span><h2>{activeSource.number}</h2><p className="source-title">{activeSource.title}</p><div className="source-location"><IdentificationBadge size={17} /><div><span>Relevant location</span><strong>{activeSource.location}</strong></div></div><div className="passage"><span>Relevant passage</span><p>{activeSource.excerpt}</p></div><button type="button" className="button primary full" onClick={onOpenDocument}>View highlighted passage <ArrowSquareOut size={17} /></button><button type="button" className="button secondary full"><Copy size={17} /> Copy citation</button></div>
      <div className="source-list"><span>All evidence</span>{sources.map((source, index) => <button type="button" key={source.id} onClick={() => onSelect(source.id)} className={selected === source.id ? "active" : ""}><span className="source-index">{index + 1}</span><span><strong>{source.number}</strong><small>{source.location}</small></span><CaretRight size={15} /></button>)}</div>
      <div className="source-provenance"><SealCheck size={17} weight="fill" /><p><strong>Source provenance</strong><span>Linked to an original BIS document record.</span></p></div>
    </aside>
  );
}

function PageHeading({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function ProductsView({ onNavigate }: { onNavigate: (view: View) => void }) {
  const steps = [
    { label: "Product", detail: "Bottle profile", state: "done", icon: Package },
    { label: "Indian Standard", detail: "2 relevant", state: "done", icon: Books },
    { label: "QCO check", detail: "Review required", state: "current", icon: ShieldCheck },
    { label: "Certification", detail: "Scheme-I", state: "upcoming", icon: Certificate },
    { label: "Testing", detail: "6 tests", state: "upcoming", icon: Flask },
    { label: "Laboratory", detail: "14 matching", state: "upcoming", icon: Buildings },
    { label: "Licence", detail: "Final outcome", state: "upcoming", icon: IdentificationBadge },
  ];
  return (
    <div className="workspace-page products-page">
      <PageHeading title="Product compliance" description="Turn a product description into a traceable compliance path." action={<button type="button" className="button primary"><Plus size={17} /> Add product</button>} />
      <div className="product-overview"><div className="product-identity"><span className="product-icon"><Package size={28} weight="duotone" /></span><div><span>Product profile</span><h2>Stainless steel water bottle</h2><p>Vacuum-insulated domestic drinkware</p></div><button type="button" className="button ghost">Edit profile</button></div><div className="product-metrics"><div><span>Standards</span><strong>2</strong><small>relevant</small></div><div><span>Certification</span><strong className="metric-alert">Review</strong><small>QCO check</small></div><div><span>Tests</span><strong>6</strong><small>identified</small></div><div><span>Laboratories</span><strong>14</strong><small>matching</small></div></div></div>
      <section className="compliance-path-section"><div className="section-title-row"><div><h2>Compliance path</h2><p>Each completed decision unlocks the next part of the process.</p></div><span className="status attention"><Warning size={15} weight="fill" /> 1 item needs review</span></div><div className="compliance-path">{steps.map((step, index) => { const StepIcon = step.icon; return <div className={`path-step ${step.state}`} key={step.label}><div className="path-node">{step.state === "done" ? <Check size={17} weight="bold" /> : <StepIcon size={18} />}</div><div><strong>{step.label}</strong><span>{step.detail}</span></div>{index < steps.length - 1 && <div className="path-connector" />}</div>; })}</div></section>
      <div className="product-detail-layout"><section className="review-panel"><div className="review-panel-heading"><ShieldCheck size={24} /><div><h3>QCO applicability needs verification</h3><p>The result depends on insulation type and the currently notified product scope.</p></div></div><div className="clarification-form"><label htmlFor="construction">Bottle construction</label><select id="construction" defaultValue="vacuum"><option value="vacuum">Vacuum-insulated, double-wall</option><option value="single">Single-wall</option><option value="other">Other construction</option></select><small>This detail is used only to narrow the relevant standard and order.</small></div><button type="button" className="button primary">Recheck applicability</button></section><section className="key-documents"><h3>Key documents</h3><button type="button" onClick={() => onNavigate("standards")}><FilePdf size={20} /><span><strong>IS 17803:2022</strong><small>Recommended standard</small></span><ArrowSquareOut size={15} /></button><button type="button"><ClipboardText size={20} /><span><strong>Product manual</strong><small>Inspection and testing</small></span><ArrowSquareOut size={15} /></button><button type="button"><ShieldCheck size={20} /><span><strong>Quality Control Order</strong><small>Applicability source</small></span><ArrowSquareOut size={15} /></button></section></div>
    </div>
  );
}

const standards = [
  { number: "IS 17803:2022", title: "Stainless steel vacuum flask and bottle", area: "Domestic products", status: "Active", revised: "Reaffirmed 2025", match: "Best match" },
  { number: "IS 14756:2022", title: "Stainless steel utensils", area: "Consumer goods", status: "Active", revised: "Revised 2022", match: "Related" },
  { number: "IS 10500:2012", title: "Drinking water specification", area: "Water quality", status: "Active", revised: "Amendment 4", match: "Reference" },
  { number: "IS 9845:1998", title: "Food-contact migration testing", area: "Food safety", status: "Active", revised: "Reaffirmed 2021", match: "Related" },
];

function StandardsView() {
  const [search, setSearch] = useState("");
  const filtered = standards.filter((standard) => `${standard.number} ${standard.title} ${standard.area}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="workspace-page"><PageHeading title="Standards explorer" description="Search by IS number, product, keyword, industry or topic." /><div className="explorer-search"><MagnifyingGlass size={21} /><label htmlFor="standard-search" className="sr-only">Search Indian Standards</label><input id="standard-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Indian Standards, products or topics" /><kbd>⌘ K</kbd></div><div className="filter-bar"><button type="button" className="active">All standards</button><button type="button">Products</button><button type="button">Industry</button><button type="button">Topic</button><span className="filter-spacer" /><button type="button"><SlidersHorizontal size={16} /> Filters</button><button type="button"><ArrowsDownUp size={16} /> Relevance</button></div><div className="results-summary"><strong>{filtered.length} standards</strong><span>Illustrative search results</span></div><div className="standards-results">{filtered.length ? filtered.map((standard) => <article className="standard-result" key={standard.number}><div className="standard-file"><FilePdf size={24} weight="duotone" /></div><div className="standard-result-main"><div className="standard-result-meta"><span>{standard.match}</span><span>{standard.area}</span></div><h2>{standard.number}</h2><p>{standard.title}</p><div className="standard-submeta"><span><CheckCircle size={15} weight="fill" /> {standard.status}</span><span>{standard.revised}</span><span>3 related standards</span></div></div><div className="standard-result-actions"><IconButton label={`Save ${standard.number}`}><BookmarkSimple size={18} /></IconButton><button type="button" className="button secondary">View standard</button></div></article>) : <div className="empty-state"><MagnifyingGlass size={28} /><h2>No matching standards</h2><p>Try a product name, industry term or a shorter keyword.</p><button type="button" className="button secondary" onClick={() => setSearch("")}>Clear search</button></div>}</div></div>
  );
}

function CertificationView() {
  const steps = [
    { name: "Confirm applicability", description: "Match the product to the standard and current QCO.", state: "complete" },
    { name: "Prepare product details", description: "Confirm construction, variants and manufacturing location.", state: "current" },
    { name: "Complete testing", description: "Test required samples at a recognised laboratory.", state: "upcoming" },
    { name: "Submit application", description: "Upload the application, documents and test reports.", state: "upcoming" },
    { name: "Factory assessment", description: "Demonstrate manufacturing and testing controls.", state: "upcoming" },
    { name: "Licence decision", description: "Address observations and receive the certification decision.", state: "upcoming" },
  ];
  return <div className="workspace-page certification-page"><PageHeading title="Certification guidance" description="A clear route through product certification, from scope check to licence." action={<button type="button" className="button secondary"><DownloadSimple size={17} /> Checklist</button>} /><div className="cert-summary"><div><span>Likely scheme</span><strong>Scheme-I</strong><p>Product certification based on conformity to an Indian Standard.</p></div><div><span>Current position</span><strong>Prepare product details</strong><p>One product clarification is needed before testing.</p></div><div><span>Attention</span><strong className="attention-text">QCO scope</strong><p>Verify the currently effective order before applying.</p></div></div><div className="cert-layout"><section className="timeline-section"><div className="section-title-row"><div><h2>Your certification path</h2><p>Status updates as the product moves through each requirement.</p></div></div><ol className="cert-timeline">{steps.map((step) => <li className={step.state} key={step.name}><span className="timeline-marker">{step.state === "complete" ? <Check size={16} weight="bold" /> : step.state === "current" ? <span /> : null}</span><div><strong>{step.name}</strong><p>{step.description}</p>{step.state === "current" && <button type="button" className="inline-action">Continue this step <ArrowRight size={15} /></button>}</div><span className={`status ${step.state}`}>{step.state === "complete" ? "Completed" : step.state === "current" ? "Current" : "Upcoming"}</span></li>)}</ol></section><aside className="requirements-panel"><h3>Prepare these documents</h3><div className="requirement-progress"><strong>2 of 6 ready</strong><span>Based on your saved product</span></div>{["Manufacturing process flow", "Factory layout", "Machinery details", "Test equipment list", "Quality control plan", "Authorisation documents"].map((item, index) => <label key={item}><input type="checkbox" defaultChecked={index < 2} /><span>{item}</span></label>)}<button type="button" className="button secondary full">View document guide</button></aside></div></div>;
}

const labs = [
  { name: "National Test House", location: "Ghaziabad, Uttar Pradesh", distance: "24 km", standards: ["IS 17803", "IS 14756"], tests: ["Thermal performance", "Leakage", "Impact"], verified: "Recognised scope checked" },
  { name: "Shriram Institute for Industrial Research", location: "Delhi", distance: "31 km", standards: ["IS 17803", "IS 9845"], tests: ["Material analysis", "Migration", "Performance"], verified: "Recognition record available" },
  { name: "Central Testing Laboratory", location: "Noida, Uttar Pradesh", distance: "38 km", standards: ["IS 14756"], tests: ["Chemical analysis", "Construction"], verified: "Scope requires confirmation" },
];

function LabsView() {
  return <div className="workspace-page labs-page"><PageHeading title="Testing laboratories" description="Find recognised laboratories by product, standard, test and location." /><div className="lab-search-panel"><label htmlFor="lab-search">What product do you need tested?</label><div className="lab-search-row"><MagnifyingGlass size={21} /><input id="lab-search" defaultValue="Stainless steel water bottle" /><button type="button" className="button primary">Find laboratories</button></div><div className="lab-filters"><button type="button"><MapPin size={16} /> Delhi NCR <CaretDown size={13} /></button><button type="button"><Books size={16} /> IS 17803 <CaretDown size={13} /></button><button type="button"><Flask size={16} /> All tests <CaretDown size={13} /></button><button type="button"><SlidersHorizontal size={16} /> More filters</button></div></div><div className="lab-result-layout"><div className="lab-list"><div className="results-summary"><strong>14 matching laboratories</strong><span>Sorted by capability match</span></div>{labs.map((lab, index) => <article className="lab-result" key={lab.name}><div className="lab-heading"><span className="lab-logo"><Buildings size={22} /></span><div><h2>{lab.name}</h2><p><MapPin size={15} /> {lab.location} <span>{lab.distance}</span></p></div><label className="compare-check"><input type="checkbox" /> Compare</label></div><div className="lab-capabilities"><div><span>Recognised standards</span><p>{lab.standards.map((item) => <strong key={item}>{item}</strong>)}</p></div><div><span>Available tests</span><p>{lab.tests.slice(0, 2).join(", ")}{lab.tests.length > 2 ? ` +${lab.tests.length - 2}` : ""}</p></div></div><div className={`verification-line ${index === 2 ? "caution" : ""}`}>{index === 2 ? <WarningCircle size={16} /> : <SealCheck size={16} weight="fill" />} {lab.verified}</div><div className="lab-actions"><button type="button" className="button secondary">View lab</button><button type="button" className="button ghost"><Phone size={16} /> Contact</button><button type="button" className="button ghost"><NavigationArrow size={16} /> Directions</button></div></article>)}</div><div className="lab-map" aria-label="Map preview"><MapTrifold size={40} weight="duotone" /><strong>Map view</strong><p>Three matching laboratories are visible in Delhi NCR.</p><div className="map-pin pin-one"><span>1</span></div><div className="map-pin pin-two"><span>2</span></div><div className="map-pin pin-three"><span>3</span></div></div></div></div>;
}

function HallmarkingView() {
  const entries = [
    { title: "Verify hallmark information", description: "Understand the marks on a hallmarked article and check its HUID details.", icon: SealCheck, action: "Verify hallmark" },
    { title: "Understand hallmarking", description: "Learn what hallmarking covers and what each mark means.", icon: Info, action: "Read the guide" },
    { title: "Find a hallmarking centre", description: "Locate a recognised Assaying and Hallmarking Centre near you.", icon: MapPin, action: "Find a centre" },
    { title: "Consumer guidance", description: "Know what to check before buying and how to raise a concern.", icon: ShieldCheck, action: "View guidance" },
  ];
  return <div className="workspace-page hallmarking-page"><PageHeading title="Hallmarking, made clearer" description="Simple guidance for consumers, jewellers and hallmarking services." /><section className="hallmark-verify"><div><DiamondsFour size={34} weight="duotone" /><h2>Check a hallmarked article</h2><p>Enter the six-character HUID printed on the article.</p></div><form onSubmit={(event) => event.preventDefault()}><label htmlFor="huid">HUID number</label><div><input id="huid" placeholder="For example, AB12CD" maxLength={6} /><button type="submit" className="button primary">Verify HUID</button></div><small>Use the BIS Care app or official service for a final verification.</small></form></section><div className="hallmark-entry-grid">{entries.map((entry) => { const EntryIcon = entry.icon; return <button type="button" key={entry.title}><span className="entry-icon"><EntryIcon size={25} /></span><span><strong>{entry.title}</strong><small>{entry.description}</small><em>{entry.action} <ArrowRight size={15} /></em></span></button>; })}</div><section className="hallmark-anatomy"><div><h2>What a hallmark tells you</h2><p>Three marks help identify purity, the BIS system and the article record.</p></div><div className="hallmark-marks"><span><SealCheck size={24} weight="fill" /><strong>BIS mark</strong><small>Standards conformity system</small></span><span><strong className="purity-mark">22K916</strong><small>Purity and fineness</small></span><span><IdentificationBadge size={24} /><strong>HUID</strong><small>Unique article identifier</small></span></div></section></div>;
}

function HistoryView() {
  const items = [
    { question: exampleQuestion, date: "Today, 10:42", type: "Product compliance" },
    { question: "Which tests apply to domestic electric adapters?", date: "Yesterday, 16:18", type: "Testing" },
    { question: "Find laboratories recognised for IS 302 testing in Pune.", date: "2 Sep, 12:06", type: "Laboratories" },
    { question: "What does a 22K916 hallmark mean?", date: "29 Aug, 09:34", type: "Hallmarking" },
  ];
  return <div className="workspace-page"><PageHeading title="Saved queries" description="Return to questions, evidence and compliance decisions you want to keep." action={<button type="button" className="button secondary"><MagnifyingGlass size={16} /> Search saved</button>} /><div className="saved-list">{items.map((item, index) => <button type="button" key={item.question}><span className="saved-icon">{index === 0 ? <BookmarkSimple size={19} weight="fill" /> : <ChatTeardropDots size={19} />}</span><span className="saved-copy"><strong>{item.question}</strong><small>{item.type} <span>•</span> {item.date}</small></span><CaretRight size={17} /></button>)}</div></div>;
}

function ReportsView() {
  return <div className="workspace-page"><PageHeading title="Documents and reports" description="Export evidence-backed compliance summaries for your team." action={<button type="button" className="button primary"><Plus size={17} /> New report</button>} /><div className="report-feature"><div className="report-preview"><FilePdf size={38} weight="duotone" /><span>BIS Intelligence</span><strong>Product compliance brief</strong><p>Stainless steel water bottle</p><div className="report-lines"><i /><i /><i /></div></div><div className="report-copy"><h2>Generate a review-ready compliance brief</h2><p>Combine the product profile, recommended standards, source citations, open questions and next steps in one document.</p><div className="report-includes"><span><Check size={15} /> Clause-level citations</span><span><Check size={15} /> Compliance path</span><span><Check size={15} /> Open decision log</span><span><Check size={15} /> Laboratory shortlist</span></div><button type="button" className="button primary"><DownloadSimple size={17} /> Generate report</button></div></div><section className="recent-reports"><h2>Recent reports</h2><div className="empty-state compact-empty"><Files size={26} /><h3>No reports yet</h3><p>Create a report from a saved product or assistant answer.</p></div></section></div>;
}

function DashboardView({ onNavigate }: { onNavigate: (view: View) => void }) {
  return <div className="workspace-page dashboard-page"><PageHeading title="Your compliance workspace" description="Continue recent product reviews and keep important standards close." action={<button type="button" className="button primary" onClick={() => onNavigate("products")}><Plus size={17} /> Add product</button>} /><section className="dashboard-products"><div className="section-title-row"><div><h2>My products</h2><p>Products with recent compliance activity.</p></div><button type="button" className="text-link" onClick={() => onNavigate("products")}>View all <ArrowRight size={15} /></button></div><div className="dashboard-product-list"><button type="button" onClick={() => onNavigate("products")}><span className="product-monogram">SB</span><span><strong>Stainless steel bottle</strong><small>Certification review required</small></span><span className="status attention">Needs review</span><CaretRight size={16} /></button><button type="button"><span className="product-monogram alt">EA</span><span><strong>Electrical adapter</strong><small>3 standards identified</small></span><span className="status complete">On track</span><CaretRight size={16} /></button></div></section><div className="dashboard-columns"><section><div className="section-title-row"><div><h2>Recent queries</h2></div></div><div className="mini-list"><button type="button">Do I need certification for a vacuum bottle?<span>Today</span></button><button type="button">Testing for electrical adapters<span>Yesterday</span></button><button type="button">Hallmark HUID explanation<span>29 Aug</span></button></div></section><section><div className="section-title-row"><div><h2>Saved standards</h2></div></div><div className="mini-list standards-mini"><button type="button"><strong>IS 17803:2022</strong><span>Vacuum flasks and bottles</span></button><button type="button"><strong>IS 14756:2022</strong><span>Stainless steel utensils</span></button><button type="button"><strong>IS 302-1:2008</strong><span>Electrical appliance safety</span></button></div></section></div></div>;
}

function GenericContent({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  if (view === "products") return <ProductsView onNavigate={onNavigate} />;
  if (view === "standards") return <StandardsView />;
  if (view === "certification") return <CertificationView />;
  if (view === "labs") return <LabsView />;
  if (view === "hallmarking") return <HallmarkingView />;
  if (view === "history") return <HistoryView />;
  if (view === "reports") return <ReportsView />;
  return <DashboardView onNavigate={onNavigate} />;
}

function DocumentViewer({ sourceId, onClose }: { sourceId: string; onClose: () => void }) {
  const source = sources.find((item) => item.id === sourceId) ?? sources[0];
  return <div className="modal-backdrop document-backdrop" role="presentation" onMouseDown={onClose}><section className="document-viewer" role="dialog" aria-modal="true" aria-label={`${source.number} document viewer`} onMouseDown={(event) => event.stopPropagation()}><header className="document-toolbar"><div><IconButton label="Close document" onClick={onClose}><ArrowLeft size={20} /></IconButton><div><strong>{source.number}</strong><span>{source.title}</span></div></div><div className="document-tools"><button type="button"><MagnifyingGlass size={17} /> Search</button><button type="button">100% <CaretDown size={12} /></button><button type="button"><Copy size={17} /> Copy citation</button><button type="button"><ArrowSquareOut size={17} /> Original source</button><IconButton label="Close document" onClick={onClose}><X size={19} /></IconButton></div></header><div className="document-body"><aside className="document-pages"><span>Pages</span>{[10, 11, 12, 13].map((page) => <button type="button" className={page === 12 ? "active" : ""} key={page}><span className="page-thumb"><i /><i /><i /><i /></span><small>{page}</small></button>)}</aside><main className="document-canvas"><div className="pdf-page"><div className="pdf-page-header"><span>IS 17803:2022</span><span>Indian Standard</span></div><h2>Stainless steel vacuum flask and bottle</h2><p className="pdf-intro">Requirements and methods of test</p><h3>4 Materials and construction</h3><p><strong>4.1</strong> The body and components in contact with food or beverages shall be made from material suitable for the declared use.</p><div className="highlighted-clause"><span className="highlight-tag">Cited in answer</span><p><strong>4.2</strong> Stainless steel vacuum flasks and bottles shall meet the specified construction, performance and marking requirements for the applicable product type.</p></div><p><strong>4.3</strong> All components shall be free from defects that can affect safe use or serviceability.</p><h3>6 Performance requirements</h3><p>Products shall be tested for capacity, thermal performance, leakage and resistance as specified in the relevant test methods.</p><div className="pdf-page-footer"><span>Illustrative document content</span><span>12</span></div></div></main><aside className="document-context"><span>Evidence context</span><h3>Why this passage matters</h3><p>This clause narrows the standard to the construction and intended use of the bottle described in the question.</p><div><small>Used for claim</small><strong>“IS 17803:2022 may apply.”</strong></div><button type="button" className="button secondary full"><Copy size={16} /> Copy citation</button></aside></div></section></div>;
}

export function BISIntelligence() {
  const router = useRouter();
  const navigation = useTranslations("Navigation");
  const [screen, setScreen] = useState<"landing" | "app">("landing");
  const [view, setView] = useState<View>("assistant");
  const [question, setQuestion] = useState(exampleQuestion);
  const [loading, setLoading] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(true);
  const [selectedSource, setSelectedSource] = useState("standard");
  const [documentOpen, setDocumentOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
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
  useEffect(() => { if (!loading) return; const timer = window.setTimeout(() => setLoading(false), 1750); return () => window.clearTimeout(timer); }, [loading, question]);

  function enterAssistant(nextQuestion: string) { setQuestion(nextQuestion); setScreen("app"); setView("assistant"); setSourceOpen(window.innerWidth > 720); setLoading(true); }
  function navigate(nextView: View) { setScreen("app"); setView(nextView); setMobileNavOpen(false); if (nextView !== "assistant") setSourceOpen(false); }
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
    <>
      {screen === "landing" ? <Landing onEnter={enterAssistant} onNavigate={navigate} onSignIn={openAuth} onTheme={() => setDark((value) => !value)} dark={dark} /> : <div className="app-shell"><div className={`mobile-nav-scrim ${mobileNavOpen ? "open" : ""}`} onClick={() => setMobileNavOpen(false)} /><div className={`sidebar-wrap ${mobileNavOpen ? "mobile-open" : ""}`}><AppSidebar active={view} onChange={navigate} collapsed={sidebarCollapsed} onCollapse={() => setSidebarCollapsed((value) => !value)} onHome={() => setScreen("landing")} onSignIn={openAuth} /></div><div className="app-main"><AppTopbar title={viewTitle} onMenu={() => setMobileNavOpen(true)} onTheme={() => setDark((value) => !value)} dark={dark} onSignIn={openAuth} /><div className={`workspace ${view === "assistant" && sourceOpen ? "with-evidence" : ""}`}><main className="workspace-main">{view === "assistant" ? <AssistantView initialQuestion={question} loading={loading} onAsk={enterAssistant} onCitation={openCitation} onOpenView={navigate} /> : <GenericContent view={view} onNavigate={navigate} />}</main>{view === "assistant" && sourceOpen && <EvidencePanel selected={selectedSource} onSelect={setSelectedSource} onClose={() => setSourceOpen(false)} onOpenDocument={() => setDocumentOpen(true)} />}{view === "assistant" && !sourceOpen && !loading && <button type="button" className="floating-sources-button" onClick={() => setSourceOpen(true)}><Files size={17} /> 3 sources</button>}</div></div><nav className="mobile-bottom-nav" aria-label="Mobile navigation">{[navItems[0], navItems[1], navItems[2], navItems[4]].map((item) => { const ItemIcon = item.icon; return <button type="button" key={item.id} className={view === item.id ? "active" : ""} onClick={() => navigate(item.id)}><ItemIcon size={20} weight={view === item.id ? "fill" : "regular"} /><span>{navigation(item.labelKey)}</span></button>; })}<button type="button" onClick={() => setMobileNavOpen(true)}><List size={20} /><span>{navigation("more")}</span></button></nav></div>}
      {documentOpen && <DocumentViewer sourceId={selectedSource} onClose={() => setDocumentOpen(false)} />}
    </>
  );
}
