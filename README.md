This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Interface languages

BIS Intelligence supports English (`/en`), Tamil (`/ta`), Telugu (`/te`), Kannada (`/kn`) and Hindi (`/hi`) using `next-intl`. The language selector uses native names and preserves the workspace route, query string and hash. The `BIS_LOCALE` cookie remembers the choice for one year; browser language detection handles first visits. User question drafts remain in per-tab session storage, and theme preference remains in local storage.

All interface copy lives in `i18n/dictionaries/*.json`, including accessibility labels, metadata, sign-in states, sample evidence and exported sample reports. Keep official identifiers such as IS numbers, HUID and the BIS Intelligence name intact. Translated sample passages are illustrative; future official quotations should preserve their published wording and identify any translated explanation separately.

When adding UI text, add the same key to every dictionary and use `useTranslations` or `getTranslations`. Preserve ICU arguments, plural types and rich-text tags. Use `useFormatter` for numbers, dates and lists. Script-specific Noto Sans fonts are self-hosted by Next.js, with wrapping and line-height adjustments for Indian scripts.

```bash
pnpm test:i18n  # Catalog/ICU parity and hardcoded JSX/accessibility-label checks
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

The interface and static example content are translated independently of any AI provider. The current assistant is an explicitly labelled interactive preview. Live Gemini conversations and retrieval are not connected. A future server-side Gemini integration should receive the selected locale as the preferred response language while preserving the user's input, and should keep API credentials on the server. Supabase sign-in still requires the public environment configuration in `.env.example`.
