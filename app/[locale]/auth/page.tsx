"use client";

import { ArrowLeft, Check, EnvelopeSimple, GoogleLogo, LockKey } from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link, useRouter } from "@/i18n/navigation";
import { signInWithEmail, signInWithGoogle } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";

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
          <div className="auth-context-mark"><LockKey size={23} weight="duotone" /></div>
          <h2>{t("description")}</h2>
          <ul>
            {["benefitOne", "benefitTwo", "benefitThree"].map((key) => (
              <li key={key}><Check size={17} weight="bold" /> {t(key)}</li>
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

          <button type="button" className="auth-provider" onClick={continueWithGoogle} disabled={pending !== null}>
            {pending === "google" ? <span className="auth-spinner" /> : <GoogleLogo size={20} weight="bold" />}
            {t("google")}
          </button>

          <div className="auth-divider"><span>{t("orEmail")}</span></div>

          <form className="auth-form" onSubmit={continueWithEmail} noValidate>
            <label htmlFor="auth-email">{t("emailLabel")}</label>
            <div className={`auth-input ${error ? "has-error" : ""}`}>
              <EnvelopeSimple size={19} />
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
