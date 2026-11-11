@AGENTS.md

# CLAUDE.md

Personal portfolio website, built with Next.js. The site content and design will be added in later steps.

## Stack

- **Next.js 16** (App Router, Turbopack). This version may differ from what you know, so check `node_modules/next/dist/docs/` before using framework APIs.
- **React 19**, **TypeScript** (strict)
- **Tailwind CSS v4**: configured in CSS through `@import "tailwindcss"` and `@theme` in `src/app/globals.css`. There is no `tailwind.config.js`.
- **ESLint 9** (flat config, `eslint.config.mjs`)
- npm is the package manager.

## Commands

```bash
npm run dev     # start the dev server at http://localhost:3000
npm run build   # production build (also type-checks)
npm run start   # serve the production build
npm run lint    # run ESLint
```

## Structure

```
src/app/          # App Router: layout.tsx, page.tsx, globals.css
public/           # static assets (images, resume PDF, etc.)
```

- Import alias: `@/*` maps to `src/*`.
- Fonts: Geist and Geist Mono through `next/font/google` in `src/app/layout.tsx`.

## Conventions

- Use Server Components by default. Add `"use client"` only for interactivity.
- Put reusable UI in `src/components/` and site content (projects, experience, links) in `src/data/` or `src/content/` so copy is separate from layout.
- Use `next/image` for images and `next/link` for internal links.
- Set page metadata through the `metadata` export or `generateMetadata`.
- Run `npm run lint` and `npm run build` before you consider a change done.
