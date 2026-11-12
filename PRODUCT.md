# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, confirmed in `req.md`:

- **Clients**: founders, startups, small and medium businesses, agencies, in Bangladesh and internationally, who need a website, web application, SaaS product, AI integration, or automation. Their job on the site: decide whether this engineer can take their idea to production, then get in touch.
- **Hiring teams**: technical recruiters, engineering managers, CTOs, founders. Their job: find projects, experience, skills, and the resume quickly, and judge technical depth.

## Product Purpose

Personal portfolio and professional identity for Ahsanul Karim, an AI-native full-stack software engineer. Success is a visitor concluding: "This person can understand my problem, engineer the solution, and deliver a complete digital product", and then contacting him or reading his work.

## Positioning

A single engineer who covers the whole path from idea to production: frontend, backend, AI integration, quality engineering, and deployment. A technical development partner, not only a website developer.

## Operating Context

Two primary pages only: `/` (homepage) and `/work` (projects, case studies, writing). Case studies and articles open as overlays on `/work`. About and Contact are homepage sections.

## Capabilities and Constraints

- Stack: Next.js App Router, React, TypeScript, Tailwind CSS v4, GSAP, Three.js, Lucide.
- Content lives in `src/data/`, separate from components.
- Confirmed by the owner on 2026-11-11:
  - Display name: Ahsanul Karim (from git config).
  - Project 03 (AI-powered QA and testing automation) is implemented and in real use.
  - Project 04 (cloud and deployment engineering) is a learning project, not client work.
  - The availability line "Available for selected projects & opportunities" is true.
- Undecided, held as placeholders in `src/data/site.ts`: public email, LinkedIn URL, GitHub URL, resume PDF, production domain, journey dates and organisation names.

## Brand Commitments

Binding visual constraints from `req.md`: monochrome black and white (`#080808`, `#111111`, `#FFFFFF`, `#A1A1AA`, `#292929`, hover `#EDEDED` on `#080808`); Geist as the grotesk; optional serif accent for selected statements; typography as the primary visual asset; GSAP as the animation engine; Three.js only where it adds value.

## Evidence on Hand

- Four projects described in `req.md` at a general level. No screenshots, client names, metrics, or outcomes exist, and none may be invented.
- No published articles yet. Article text in the repo is draft and is labelled as draft on the site.
- No testimonials, client logos, or performance figures.

## Product Principles

1. Never state what is not verified: no invented clients, metrics, dates, or outcomes.
2. Confidential employer and customer details stay out.
3. Both audiences reach their answer fast: services and contact for clients; work, experience, skills, resume for hiring teams.
4. The site is itself the proof of frontend engineering skill, so it must stay fast and accessible with motion on.

## Accessibility & Inclusion

Keyboard-accessible navigation, visible focus, sufficient contrast, semantic headings, `prefers-reduced-motion` support, nothing essential behind hover.
