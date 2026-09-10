import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Devanagari } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const devanagari = Noto_Sans_Devanagari({ variable: "--font-devanagari", subsets: ["devanagari"], weight: "variable" });

export const metadata: Metadata = {
  title: "BIS Sathi | Understand Standards. Simplify Compliance.",
  description: "An AI-powered assistant for Indian Standards, BIS certification, testing laboratories, hallmarking and product compliance.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} ${devanagari.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <template
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: BIS Sathi is a verification dossier where every compliance answer visibly connects to official evidence.
OWN-WORLD: Warm white paper, deep navy ink, saffron action signals, crisp document edges, restrained 12px panels, and clause-level source markers.
STORY: Ask in plain language, understand the decision, inspect its basis, then continue through a clear compliance path.
FIRST VIEWPORT: A concise promise occupies the left while a working source-aware query desk anchors the right and holds the primary action.
FORM: Standards dossier, assigned direction 7, seed d3cb1a0d.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`,
          }}
        />
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
