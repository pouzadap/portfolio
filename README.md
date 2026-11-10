# Pedro Fernandes · Portfolio

Personal portfolio. One continuous scroll in a dark theme, with a WebGL "Liquid Core" that dissolves into particles between sections.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · three.js (custom shaders) · Lenis · Resend

## Run locally

```bash
npm install
cp .env.example .env.local   # add RESEND_API_KEY to enable the contact form
npm run dev
```

## Structure

| Path | What it is |
|---|---|
| `lib/liquid-core.ts` | The 3D scene: liquid blob, cursor stretch, drag-to-rotate, scroll-driven particle dispersion |
| `lib/i18n.tsx` | EN/PT dictionaries and the language context (switched by the flags in the nav) |
| `lib/content.ts` | Links, skills, roles and video lists |
| `components/sections/*` | One file per section |
| `app/api/contact/route.ts` | Contact form endpoint, sends via Resend |
| `scripts/compress-videos.mjs` | Turns raw clips into web-ready MP4s + posters |

## Videos

Raw clips go in `briefing/refs/videos/` (ignored by git). Then run:

```bash
npm run videos          # encodes new clips into public/videos
npm run videos -- --force   # re-encodes everything
```

To use the workflow demo, name the raw file `workflows.mp4`, run the script, then set `hasWorkflowVideo = true` in `lib/content.ts`.

## Deploy

Import the repo into Vercel and set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in the project's environment variables.
