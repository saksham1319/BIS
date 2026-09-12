"use client";

import { ArrowLeft, Check, Lock, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link, useRouter } from "@/i18n/navigation";
import { signInWithEmail, signInWithGoogle } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage() {
  const t = useTranslations("Auth");
  const common = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState("");

  function getConfiguredClient() {
    const client = createClient();
    if (!client) setError(t("configurationError"));
    return client;
  }

  async function continueWithGoogle() {
    setError("");
    const client = getConfiguredClient();
    if (!client) return;
    setPending("google");
    const { error: authError } = await signInWithGoogle(client, locale);
    if (authError) {
      setError(t("genericError"));
      setPending(null);
    }
  }

  async function continueWithEmail(event: FormEvent) {
    event.preventDefault();
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setError(t("invalidEmail"));
      return;
    }

    const client = getConfiguredClient();
    if (!client) return;
    setPending("email");
    const { error: authError } = await signInWithEmail(normalizedEmail, client);
    if (authError) {
      setError(t("genericError"));
      setPending(null);
      return;
    }

    sessionStorage.setItem("bis-auth-attempt", JSON.stringify({
      email: normalizedEmail,
      expiresAt: Date.now() + 10 * 60 * 1000,
    }));
    router.push("/auth/verify");
  }

  return (
    <main className="auth-page">
      <header className="auth-header">
        <Link href="/" className="brand-link"><Brand /></Link>
        <LanguageSwitcher />
      </header>

      <div className="auth-layout">
        <aside className="auth-context" aria-label="Account benefits">
          <div className="auth-context-mark"><Lock size={23} /></div>
          <h2>{t("description")}</h2>
          <ul>
            {["benefitOne", "benefitTwo", "benefitThree"].map((key) => (
              <li key={key}><Check size={17} /> {t(key)}</li>
            ))}
          </ul>
          <p>{t("officialNote")}</p>
        </aside>

        <section className="auth-card" aria-labelledby="auth-title">
          <Link href="/" className="auth-back"><ArrowLeft size={16} /> {common("back")}</Link>
          <div className="auth-card-heading">
            <h1 id="auth-title">{t("title")}</h1>
            <p>{t("guestNote")}</p>
          </div>

          <div className="status neutral" style={{marginBottom: 20, padding: "10px 12px", borderRadius: 8, display: "flex", gap: 8, alignItems: "flex-start", textAlign: "left"}}>
            <Lock size={18} style={{flexShrink: 0, marginTop: 2}} />
            <p style={{margin: 0, fontSize: 11.5, lineHeight: 1.5, color: "var(--muted)"}}>{t("configurationError")}</p>
          </div>

          <button type="button" className="auth-provider" onClick={continueWithGoogle} disabled={pending !== null}>
            {pending === "google" ? <span className="auth-spinner" /> : <GoogleIcon size={20} />}
            {t("google")}
          </button>

          <div className="auth-divider"><span>{t("orEmail")}</span></div>

          <form className="auth-form" onSubmit={continueWithEmail} noValidate>
            <label htmlFor="auth-email">{t("emailLabel")}</label>
            <div className={`auth-input ${error ? "has-error" : ""}`}>
              <Mail size={19} />
              <input
                id="auth-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(event) => { setEmail(event.target.value); setError(""); }}
                aria-describedby={error ? "auth-error" : undefined}
                aria-invalid={Boolean(error)}
              />
            </div>
            {error && <p id="auth-error" className="auth-error" role="alert">{error}</p>}
            <button type="submit" className="button primary full auth-submit" disabled={pending !== null}>
              {pending === "email" && <span className="auth-spinner light" />}
              {pending === "email" ? t("sending") : t("continueOtp")}
            </button>
          </form>
          <p className="auth-terms">{t("terms")}</p>
        </section>
      </div>
    </main>
  );
}
