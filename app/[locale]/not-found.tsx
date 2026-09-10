import { getTranslations } from "next-intl/server";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/i18n/navigation";

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound");
  return (
    <main className="auth-page verify-page">
      <header className="auth-header">
        <Link href="/" className="brand-link"><Brand /></Link>
        <LanguageSwitcher />
      </header>
      <section className="verify-card verify-expired">
        <p>404</p>
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
        <Link href="/" className="button primary">{t("action")}</Link>
      </section>
    </main>
  );
}
