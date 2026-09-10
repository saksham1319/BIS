"use client";

import { Globe } from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { LOCALE_NAMES, SUPPORTED_LOCALES, type Locale } from "@/i18n/locales";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Common");
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function changeLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    const { search, hash } = window.location;
    startTransition(() => {
      router.replace(`${pathname}${search}${hash}`, { locale: nextLocale, scroll: false });
    });
  }

  return (
    <label className={`language-control ${className}`} aria-busy={pending}>
      <Globe size={16} aria-hidden="true" />
      <select
        value={locale}
        disabled={pending}
        onChange={(event) => changeLocale(event.target.value as Locale)}
        aria-label={t("language")}
      >
        {SUPPORTED_LOCALES.map((item) => (
          <option key={item} value={item} lang={item}>{LOCALE_NAMES[item]}</option>
        ))}
      </select>
      <span className="sr-only" role="status">{pending ? t("switchingLanguage") : ""}</span>
    </label>
  );
}
