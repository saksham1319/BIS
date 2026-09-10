# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

BIS Sathi serves Indian consumers, MSMEs, startups, engineers, students, and manufacturers. Users may be unfamiliar with BIS terminology or may need precise compliance guidance for product design, manufacture, testing, certification, procurement, or consumer verification.

## Product Purpose

BIS Sathi helps people understand Indian Standards and BIS services through natural-language conversation. It reduces the time and expertise required to identify relevant standards, understand certification and Quality Control Order requirements, find testing laboratories, navigate hallmarking, and turn regulatory information into clear next steps.

Success means a user can understand the likely compliance path for a product within minutes, see what is certain or conditional, and trace every important regulatory statement to an original BIS source.

## Positioning

The product is an intelligent digital layer over the BIS ecosystem. It combines conversational product discovery with structured compliance decisions and clause-level evidence, so the user can move directly from an answer to the exact standard, order, manual, page, or clause that supports it.

## Operating Context

Users may begin with a plain-language product question, a product profile, a known IS number, a certification task, a laboratory search, or a consumer hallmarking need. The product supports guest questions and progressively adds saved products, query history, reports, preferences, and reusable compliance work after sign-in.

Regulatory answers may depend on material, intended use, product construction, target market, manufacturing details, current QCO status, and the scope of a cited standard. When information is missing or sources conflict, the assistant asks a targeted question or clearly reports the uncertainty.

## Capabilities and Constraints

- AI Assistant with contextual follow-up questions and visible retrieval states.
- Product Compliance workspace with product profiles, relevant standards, QCO checks, certification schemes, testing requirements, laboratories, and licence steps.
- Standards Explorer with search, filtering, status, relationships, and revision information.
- Certification guidance with eligibility, documents, testing, factory assessment, application steps, fees, and notices.
- BIS-recognised laboratory discovery and comparison.
- Consumer-friendly hallmarking verification and guidance.
- Saved queries, conversation history, reports, products, and preferences after authentication.
- Integrated document viewer that opens the exact cited page or clause and highlights the relevant passage.
- Every important regulatory claim must be traceable to source evidence. Chain-of-thought is never exposed.
- Applicability is described with calibrated language when the available product information is insufficient.
- The interface includes loading, empty, error, unavailable-source, conflicting-source, and ambiguous-query states.
- Desktop, tablet, and mobile web are first-class. On mobile, evidence opens as a bottom sheet or expandable drawer.
- Google and email/OTP sign-in are supported without blocking basic guest questions.
- Supabase provides browser/server clients, cookie-based SSR sessions, Google OAuth, and passwordless email verification. User-specific tables must use Row Level Security when persistence is added.
- Locale-prefixed routes and message dictionaries support English and Hindi. Official document excerpts may remain in their published language while navigation and guidance adapt to the selected locale.

## Brand Commitments

The product name is BIS Sathi and the proposed tagline is “Understand Standards. Simplify Compliance.” The identity must communicate standards, verification, documentation, trust, and intelligence while remaining visually distinct from a generic chatbot. The experience should feel professional, calm, precise, modern, premium, and credible within the Indian public standards ecosystem. BIS branding must be used sparingly.

The visual direction is light-first with white or warm-neutral surfaces, deep navy or indigo as the primary brand color, one restrained accent, neutral typography, subtle semantic colors, generous whitespace, strong hierarchy, subtle borders, restrained shadows, and consistent 8px spacing. Decorative AI tropes, neon, excessive gradients, excessive glass, large illustrations, cartoon imagery, and crowded dashboards are excluded.

## Evidence on Hand

The detailed product brief supplies the confirmed navigation, example questions, required workflows, example stainless steel water bottle response, source panel structure, responsive rules, and required interaction states. The authentication interaction and locale plumbing were adapted from the user-provided Sprinte project, while BIS Sathi retains its own information architecture and visual language. No official BIS logo assets, live BIS documents, verified regulatory dataset, Supabase project credentials, or laboratory dataset were supplied. Demonstration regulatory values are therefore clearly identified as illustrative, and authentication remains ready for the project's public Supabase environment values.

## Product Principles

1. Put the direct answer first and disclose detail progressively.
2. Connect every material regulatory claim to exact, inspectable evidence.
3. Express uncertainty honestly and ask focused clarification questions.
4. Turn complex procedures into clear decisions and next actions.
5. Keep the assistant central while making specialist workflows easy to enter.

## Accessibility & Inclusion

Use WCAG-conscious contrast, visible keyboard focus, semantic controls, readable type, sufficiently large touch targets, reduced-motion support, and responsive layouts. Explain unfamiliar BIS terminology in context. Keep language plain enough for non-technical consumers while preserving the precision professionals need.
