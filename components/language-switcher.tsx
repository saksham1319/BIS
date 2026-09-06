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
    const search = window.location.search;
    startTransition(() => {
      router.replace(`${pathname}${search}`, { locale: nextLocale });
    });
  }

  return (
    <label className={`language-control ${className}`} aria-label={t("language")}>
      <Globe size={16} aria-hidden="true" />
      <select
        value={locale}
        disabled={pending}
        onChange={(event) => changeLocale(event.target.value as Locale)}
        aria-label={t("language")}
      >
        {SUPPORTED_LOCALES.map((item) => (
          <option key={item} value={item}>{LOCALE_NAMES[item]}</option>
        ))}
      </select>
    </label>
  );
}
