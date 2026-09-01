# Wedding Invitation Platform

Production-architecture, cinematic wedding invitation system.
Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion + Supabase.

## What this is

Not a single static invitation — a multi-tenant platform: an authenticated
admin creates and manages any number of invitations, each with its own
slug, theme, content, and RSVP list; guests only ever see the public,
read-only `/invite/[slug]` experience.

## Stack choices (and why)

- **Next.js App Router** — server components for the public page (fast,
  SEO-friendly, no admin code ships to guests) + client components where
  interactivity is needed (editor, countdown, RSVP form).
- **Supabase** — Postgres + Auth + Storage + Row Level Security in one
  place, matching what the brief asked for. RLS is the actual security
  boundary: a guest's browser can hold the anon key and still never read
  another guest's RSVP or an unpublished draft — see `supabase/schema.sql`.
- **Framer Motion** — one coherent animation primitive for both the intro
  sequence and scroll reveals, instead of mixing an animation library per
  effect.
- **Tailwind** — utility styling; all theme color is pushed into CSS
  custom properties (`src/lib/themes.ts`) so switching a theme never
  touches layout or component code.

No state manager, no CMS, no extra animation library — everything here
is used by more than one screen.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project values
```

In your Supabase project's SQL editor, run `supabase/schema.sql` once.
It creates the `weddings`, `gallery_images`, `rsvps` tables, RLS policies,
and a public `wedding-media` storage bucket.

Create your first admin user in Supabase Auth (Dashboard → Authentication →
Users → Add user), then:

```bash
npm run dev
```

- Public demo (no Supabase needed): `/invite/demo`
- Admin: `/admin/login`

Without `.env.local` filled in, the app still runs: the public route
serves a placeholder invitation and the admin screens explain that
Supabase isn't connected yet, instead of crashing.

## Route map

```
/                                    landing
/invite/[slug]                       public, cinematic, read-only
/admin/login                         Supabase Auth
/admin/dashboard                     overview + aggregate RSVP stats
/admin/invitations                   list — publish/duplicate/delete/copy link
/admin/invitations/new               create a draft, redirects to editor
/admin/invitations/[id]/edit         split-screen editor + live preview
/api/rsvp                            public POST, RLS-gated insert only
/api/upload                          admin-only, auth-checked, validated upload
```

## Data model

See `src/lib/types.ts` for the full `Wedding` shape and `supabase/schema.sql`
for the table definitions and RLS policies. Every field the brief listed
(couple names, date/time/timezone, venue, media, theme/accent, audio,
text, social, countdown toggle, SEO/OG) is a real column, editable from
the admin UI's tabs (General / Location / Media / Design / Audio / Text /
Social / Countdown / SEO).

## Animation system

`src/components/invitation/IntroSequence.tsx` implements one authored
timeline (gate → soft light → grain → initials → morph to full names →
handoff) rather than generic confetti/curtain effects. It fully respects
`prefers-reduced-motion` (collapses to a near-instant reveal) and requires
one tap to start, which also satisfies mobile audio-autoplay policy for
background music.

Scroll sections share a single reveal signature
(`src/components/invitation/ScrollSection.tsx`) via `IntersectionObserver`
— consistent visual rhythm instead of a different trick per section.

## Theming

Six presets in `src/lib/themes.ts` (Champagne, Emerald, Burgundy,
Midnight/Cinematic Dark, Ivory Editorial, Rose). Switching `theme` on a
`Wedding` row swaps CSS variables only — no component re-renders its
structure differently between themes.

## Security notes

- Admin routes are protected by `src/middleware.ts`, which redirects to
  `/admin/login` when there is no Supabase session.
- RLS is the real boundary, not the middleware: even a public API request
  to `/invite/[slug]` for an unpublished wedding returns nothing, because
  the `select` policy only allows `published = true` rows.
- Guest RSVP data is never selectable by other guests — only by the
  invitation's owner.
- Upload endpoint checks auth, MIME type, and file size before touching
  Storage.

## What's intentionally left for you to finish

- Wiring the Media tab's file inputs to `POST /api/upload` (the endpoint
  is ready; a small `<input type="file">` handler needs to call it and
  patch `cover_image` / gallery rows with the returned URL).
- A dedicated Gallery reorder UI (`gallery_images.sort_order`) — the
  column and public rendering already exist.
- Hosting: this deploys cleanly to Vercel; set the three env vars from
  `.env.example` in the project settings.

## QA checklist

Before shipping a real invitation, verify the flows called out in the
original brief: intro (including reduced-motion), publish/unpublish,
save/discard in the editor, RSVP submit, gallery lightbox, share links,
missing cover image/video fallback, and no horizontal overflow at
375/390/430px and 1366/1440/1920px.
