"use client";

import { AlertCircle, ArrowLeft, Clock, MailOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link, useRouter } from "@/i18n/navigation";
import { signInWithEmail, verifyEmailOtp } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";

type AuthAttempt = { email: string; expiresAt: number };

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

export default function VerifyPage() {
  const t = useTranslations("Verify");
  const common = useTranslations("Common");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [resendIn, setResendIn] = useState(45);
  const [pending, setPending] = useState<"verify" | "resend" | null>(null);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = sessionStorage.getItem("bis-auth-attempt");
      if (!stored) {
        setExpired(true);
        return;
      }
      try {
        const attempt = JSON.parse(stored) as AuthAttempt;
        const remaining = Math.max(0, Math.floor((attempt.expiresAt - Date.now()) / 1000));
        setEmail(attempt.email);
        setSecondsLeft(remaining);
        setExpired(remaining === 0);
      } catch {
        setExpired(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (expired || !email) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return current - 1;
      });
      setResendIn((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [email, expired]);

  async function verify(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError(t("invalidCode"));
      return;
    }
    const client = createClient();
    if (!client) {
      setError(t("verificationError"));
      return;
    }
    setPending("verify");
    const { error: verifyError } = await verifyEmailOtp(email, code, client);
    if (verifyError) {
      setError(t("verificationError"));
      setPending(null);
      return;
    }
    sessionStorage.removeItem("bis-auth-attempt");
    router.replace("/?view=dashboard");
  }

  async function resend() {
    if (resendIn > 0 || !email) return;
    const client = createClient();
    if (!client) {
      setError(t("verificationError"));
      return;
    }
    setPending("resend");
    setError("");
    const { error: resendError } = await signInWithEmail(email, client);
    setPending(null);
    if (resendError) {
      setError(t("verificationError"));
      return;
    }
    setResendIn(45);
  }

  return (
    <main className="auth-page verify-page">
      <header className="auth-header">
        <Link href="/" className="brand-link"><Brand /></Link>
        <LanguageSwitcher />
      </header>
      <section className="verify-card" aria-labelledby="verify-title">
        <Link href="/auth" className="auth-back"><ArrowLeft size={16} /> {common("back")}</Link>
        {expired ? (
          <div className="verify-expired">
            <span><AlertCircle size={26} /></span>
            <h1 id="verify-title">{t("expired")}</h1>
            <Link href="/auth" className="button primary">{t("startAgain")}</Link>
          </div>
        ) : (
          <>
            <div className="verify-icon"><MailOpen size={28} /></div>
            <h1 id="verify-title">{t("title")}</h1>
            <p>{t("description", { email: email || "..." })}</p>
            <div className="verify-timer"><Clock size={16} /> {t("expires", { time: formatTime(secondsLeft) })}</div>
            <form className="auth-form" onSubmit={verify}>
              <label htmlFor="verification-code">{t("code")}</label>
              <input
                id="verification-code"
                className={`auth-otp-input ${error ? "has-error" : ""}`}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(event) => { setCode(event.target.value.replace(/\D/g, "")); setError(""); }}
                aria-invalid={Boolean(error)}
              />
              {error && <p className="auth-error" role="alert">{error}</p>}
              <button type="submit" className="button primary full auth-submit" disabled={pending !== null || !email}>
                {pending === "verify" && <span className="auth-spinner light" />}
                {pending === "verify" ? t("verifying") : t("verify")}
              </button>
            </form>
            <button type="button" className="verify-resend" onClick={resend} disabled={pending !== null || resendIn > 0}>
              {pending === "resend" ? t("resending") : resendIn > 0 ? t("resendWait", { seconds: resendIn }) : t("resend")}
            </button>
          </>
        )}
      </section>
    </main>
  );
}
