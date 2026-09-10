---
name: BIS Intelligence
description: A calm, evidence-first interface for understanding Indian Standards and navigating BIS compliance.
colors:
  dossier-navy: "#0e315e"
  dossier-navy-deep: "#0a274b"
  paper-background: "#f7f8fa"
  paper-surface: "#ffffff"
  ink-strong: "#07182f"
  ink-body: "#101828"
  ink-muted: "#5d6879"
  rule-line: "#dce2e9"
  saffron-signal: "#cc620b"
  verified-green: "#18724b"
  attention-amber: "#9b4a08"
typography:
  display:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(42px, 3.75vw, 54px)"
    fontWeight: 650
    lineHeight: 1.03
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(28px, 3vw, 40px)"
    fontWeight: 640
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Geist, sans-serif"
    fontSize: "26px"
    fontWeight: 680
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.72
  label:
    fontFamily: "Geist, sans-serif"
    fontSize: "11px"
    fontWeight: 680
    lineHeight: 1.35
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.dossier-navy}"
    textColor: "{colors.paper-surface}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 15px"
  button-secondary:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 15px"
  input:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.sm}"
    height: "46px"
    padding: "0 12px"
  card:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink-body}"
    rounded: "{rounded.md}"
    padding: "24px"
  citation:
    backgroundColor: "#e8f0f8"
    textColor: "{colors.dossier-navy}"
    rounded: "5px"
    size: "21px"
---

# Design System: BIS Intelligence

## Overview

**Creative North Star: "The Verification Dossier"**

BIS Intelligence feels like a precise standards dossier made interactive. Warm paper surfaces, navy ink, thin document rules, clause markers, and restrained saffron signals make each answer feel inspectable and official while preserving the speed of a modern AI product.

The interface stays calm even when the subject is complex. It presents a direct answer, the decision factors, the evidence, and the next action in that order. Authentication and localized routes use the same visual language so users never feel they have entered a separate consumer app.

**Key Characteristics:**

- Evidence-first hierarchy with clause-level citations.
- Light, warm-neutral surfaces with high-contrast navy typography.
- Dense metadata only where it supports a decision.
- English, Tamil, Telugu, Kannada, and Hindi interfaces with script-appropriate typography.
- Responsive evidence drawers and vertically stacked workflows on small screens.

## Colors

The palette treats navy as institutional ink, saffron as a scarce action or attention signal, and green as verified status.

### Primary

- **Dossier Navy:** The primary action, active navigation, and authoritative document color.
- **Dossier Navy Deep:** Hover state for high-emphasis actions.

### Secondary

- **Saffron Signal:** Reserved for unresolved applicability, attention, and report-generation actions.
- **Verified Green:** Source verification, completed steps, and successful status.

### Neutral

- **Paper Background:** The cool-warm workspace canvas behind documents and panels.
- **Paper Surface:** Reading surfaces, cards, fields, and navigation.
- **Strong Ink:** Display type, titles, and decisive values.
- **Body Ink:** Long-form explanations and core interface text.
- **Muted Ink:** Secondary descriptions and navigation at rest.
- **Rule Line:** Section boundaries, table rules, and field borders.

**The Evidence Color Rule.** Navy identifies authoritative actions and citations; semantic colors describe state. Do not recolor citations by confidence level.

**The Saffron Scarcity Rule.** Saffron appears only when the user must act or when applicability needs attention.

## Typography

**Display Font:** Geist (with sans-serif fallback)

**Body Font:** Geist (with sans-serif fallback)

**Hindi Font:** Noto Sans Devanagari (with Geist and sans-serif fallback)

**Character:** The Latin typography is compact, contemporary, and neutral enough for regulatory reading. Hindi uses a dedicated Devanagari face with matching weight and density rather than relying on a browser fallback.

### Hierarchy

- **Display** (650, fluid 42px to 54px, 1.03): Landing promise only, kept to two deliberate lines on desktop.
- **Headline** (640, fluid 28px to 40px, 1.15): Auth context and major feature introductions.
- **Title** (680, 26px, 1.2): Workspace and page titles.
- **Body** (400, 15px, 1.72): Source-backed answers and explanatory copy with short readable line lengths.
- **Label** (680, 11px, 1.35): Decision labels, metadata, and status text.

**The Direct Heading Rule.** Begin with the actual page or decision title. Do not add decorative uppercase kickers above headings.

## Layout

The application uses three related grids: a balanced split landing viewport, a navigation-conversation-evidence workspace, and a structured compliance canvas. Desktop evidence occupies a fixed right column; tablet evidence floats over the workspace; mobile evidence becomes a bottom sheet. The main reading column stays near 800px, while workflow pages expand to roughly 1120px.

Spacing follows an 8px base rhythm. Major page gaps use 24px to 48px, cards use 16px to 24px internal spacing, and tightly related controls use 8px. Breakpoints at 1180px, 980px, and 720px progressively collapse the navigation, grids, and evidence panel. At 420px, multi-column action and result layouts become single-column.

## Elevation & Depth

The system is flat by default and uses borders and tonal changes to separate most surfaces. Low ambient shadows appear on primary composers, auth cards, and hoverable results. The strongest shadow belongs to temporary elevated surfaces such as the evidence sheet and document viewer.

### Shadow Vocabulary

- **Ambient Low:** A one-pixel contact shadow plus a diffuse 16px haze for fields and cards that accept input.
- **Workspace Lift:** A soft 20px to 60px navy-tinted shadow for the landing query desk and temporary panels.

**The Document Edge Rule.** Prefer a crisp border and a change in paper tone before adding elevation.

## Shapes

Corners are restrained and consistent. Controls use 8px corners, content panels use 12px, and modal-scale surfaces use 16px. Status chips may use a pill shape because their silhouette communicates compact state. Citation markers use a tighter 5px corner so they read as clause references rather than badges.

## Components

### Buttons

- **Shape:** Compact rectangular controls with gently curved 8px corners.
- **Primary:** Dossier navy fill, paper-white text, and 40px minimum height.
- **Hover / Focus:** Navy deepens on hover; keyboard focus uses a visible saffron-tinted three-pixel ring.
- **Secondary / Ghost:** Secondary buttons use a paper surface and rule border. Ghost actions rely on text color and a subtle tonal hover.

### Chips

- **Style:** Status chips use pale semantic fills and dark semantic text. Citation chips use navy ink on a pale blue surface with a defined border.
- **State:** Completed is green, current or attention is amber, and upcoming is neutral.

### Cards / Containers

- **Corner Style:** Content panels use a 12px radius; modal-scale surfaces use 16px.
- **Background:** Paper surface over the paper background.
- **Shadow Strategy:** Flat at rest unless the surface is interactive or temporary.
- **Border:** One-pixel rule line defines every decision or document region.
- **Internal Padding:** 16px to 24px depending on density.

### Inputs / Fields

- **Style:** White paper surface, rule border, 8px radius, and compact inline icons.
- **Focus:** Navy border with a low-opacity navy focus halo.
- **Error / Disabled:** Error uses the danger color on the border and inline text. Disabled controls reduce opacity while retaining readable labels.

### Navigation

Desktop navigation uses a 248px sidebar that can collapse to icons. Active items receive a pale navy field and navy label. Tablet uses an icon rail, while mobile uses five direct bottom destinations and an expandable menu. The locale selector remains available on every public and workspace surface.

### Evidence Panel

The evidence panel links an answer marker to the document type, number, page or clause, excerpt, and original viewer. Selected sources use navy; verified metadata uses green. On mobile the panel opens as a bottom sheet and never obscures the initial answer by default.

### Authentication

Authentication is a focused page rather than a forced gate or chat modal. Desktop pairs account benefits with one compact sign-in card. Mobile presents only the card. Google OAuth and email OTP are equal-height actions, and the interface explains that basic BIS questions remain available as a guest.

## Do's and Don'ts

### Do:

- **Do** put the direct compliance answer before supporting detail.
- **Do** attach material claims to small, keyboard-accessible citation markers.
- **Do** use borders, paper tones, and spacing to explain structure.
- **Do** keep uncertainty visible with calibrated status language and one clear next action.
- **Do** verify English, Tamil, Telugu, Kannada, and Hindi layouts at the same responsive widths.

### Don't:

- **Don't** introduce generic chat bubbles, decorative AI gradients, or neon accents.
- **Don't** use saffron as a general brand fill or decorative highlight.
- **Don't** place every metadata field in a separate floating card.
- **Don't** hide the evidence route behind an unlabeled icon.
- **Don't** force authentication before a user can ask a basic standards question.

## Multilingual interface

The native-name language selector remains visible on landing, workspace, authentication and error pages. Use Geist for English and script-specific Noto Sans for Tamil, Telugu, Kannada and Hindi. Indian-script headings use normal letter spacing and generous line heights; controls wrap instead of clipping. Mobile navigation uses concise translated labels, with full labels retained in the sidebar. Language changes preserve the active workspace and user question drafts.
