import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/i18n/navigation";

export default async function AuthErrorPage() {
  const t = await getTranslations("AuthError");
  return (
    <main className="auth-page verify-page">
      <header className="auth-header">
        <Link href="/" className="brand-link"><Brand /></Link>
        <LanguageSwitcher />
      </header>
      <section className="verify-card verify-expired">
        <span><WarningCircle size={28} weight="duotone" /></span>
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
        <Link href="/auth" className="button primary">{t("action")}</Link>
      </section>
    </main>
  );
}
