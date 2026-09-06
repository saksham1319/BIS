import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BIS Intelligence | Understand Standards. Simplify Compliance.",
  description:
    "An AI-powered assistant for Indian Standards, BIS certification, testing laboratories, hallmarking and product compliance.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <template
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: BIS Intelligence is a verification dossier where every compliance answer visibly connects to official evidence.
OWN-WORLD: Warm white paper, deep navy ink, saffron action signals, crisp document edges, restrained 12px panels, and clause-level source markers.
STORY: Ask in plain language, understand the decision, inspect its basis, then continue through a clear compliance path.
FIRST VIEWPORT: A concise promise occupies the left while a working source-aware query desk anchors the right and holds the primary action.
FORM: Standards dossier, assigned direction 7, seed d3cb1a0d.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
