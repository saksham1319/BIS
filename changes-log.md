# Changes log

## 2026-09-10 — Complete five-language interface

### Changes

- Enabled English, Tamil, Telugu, Kannada and Hindi locale routes and native-name language selection. A one-year preference cookie preserves the selected language. Switching retains the current workspace, URL query/hash, user question drafts and submitted question; theme preference also persists.
- Completed 456 messages per language across landing, navigation, all nine workspace views, authentication, loading/error/empty states, tooltips, accessibility labels, metadata, evidence/document previews and downloadable sample reports. Standard identifiers, brand names and user-entered text remain intact. Added locale-aware plural counts, dates and lists.
- Added Tamil, Telugu and Kannada Noto Sans fonts alongside Devanagari. Adjusted native-script typography, mobile labels, button wrapping, keyboard focus, contrast, safe-area spacing, product grids and document page growth to prevent clipped or overlapping translations.
- Added localized 404 pages and accepted Tamil, Telugu, Kannada and Devanagari digits in the OTP field.
- Clearly labelled illustrative assistant/evidence content, corrected guided laboratory navigation, added feedback for preview actions, functional citation copying and UTF-8 sample report downloads, and improved document-dialog focus/Escape behavior.
- Added `pnpm test:i18n` to catch missing/extra messages, invalid or mismatched ICU arguments/rich tags, damaged Unicode and new hardcoded JSX/accessibility labels. Updated product/design/developer documentation.

### Files modified

- `app/bis-intelligence.tsx`, `app/globals.css`
- `app/[locale]/layout.tsx`, `app/[locale]/not-found.tsx`, `app/[locale]/[...rest]/page.tsx`
- `app/[locale]/auth/page.tsx`, `app/[locale]/auth/verify/page.tsx`
- `components/language-switcher.tsx`
- `i18n/locales.ts`, `i18n/routing.ts`
- `i18n/dictionaries/en.json`, `ta.json`, `te.json`, `kn.json`, `hi.json`
- `scripts/check-i18n.mjs`, `package.json`, `pnpm-lock.yaml`
- `README.md`, `PRODUCT.md`, `DESIGN.md`, `changes-log.md`

### Validation

- Catalog checks: all five locales have 456 messages with matching keys, ICU arguments and rich-text tags; source-text extraction check passed.
- ESLint, TypeScript and optimized Next.js production build passed.
- Local Chromium: 135 workspace combinations (nine views × five locales × widths 320/768/1440) passed page/panel/text overflow checks with no runtime translation errors.
- Axe WCAG A/AA checks passed on mobile landing and invalid-email sign-in states in all five languages, plus the English assistant. These automated checks are not a full accessibility certification.
- Browser interactions verified workspace/hash/query retention, cookie preference, restored drafts, submitted user text, theme reversal, native-script OTP normalization, sample answer/evidence/document flow, Escape dismissal, no-results search, localized report download, translated auth expiry/error and localized 404 pages.
- Visual review included English/Tamil/Telugu/Kannada landing screens, Hindi sign-in, Tamil mobile product panels and source documents. Long document passages now expand the page and keep the footer below the text.
- Built production routes returned HTTP 200 and the correct language/title for all five locales.

### Boundaries

Translations were reviewed for terminology and technical completeness; independent native-speaker editorial review was not performed. Live Gemini conversations, live BIS retrieval, Supabase/provider sign-in and email delivery were not connected or exercised. Existing assistant data and exported reports remain explicitly illustrative. No deployment was performed.
