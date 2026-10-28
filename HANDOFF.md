# Project handoff notes (for Claude on another machine)

Wedding invitation site — Vite + React + framer-motion + Tailwind, recreating the Invitima "Blush Romance" template.

## Run
- `npm install` then `npm run dev` (dev server), `npm run build` (production build to `dist/`).
- Deploy: `.github/workflows/deploy.yml` publishes `dist` to GitHub Pages on push to `main`.
  Still pending: subdomain of rajdholariya.com, GitHub repo, DNS CNAME → `<username>.github.io`, then add `public/CNAME`.

## Where things live
- All text/data: `src/data.js` (names, dates, countdown, events via `ev(...)`, venue, gallery, wishes, contacts, theme).
- Images: `public/templates/blush-romance/` (replace with same file name to swap).
- Section order: `src/App.jsx`. Sections: `src/sections/*.jsx`. Shared animation helpers: `src/motion.jsx`.

## Changes made so far (in order)
1. Hero titles kept ≥6% below viewport top on short screens (`Hero.jsx`, `max(...)` top offset).
2. Gate titles moved out of the zooming artboard into a separate non-scaled layer that fades on open (`Gate.jsx`) — fixed "The Wedding" going off-screen during the zoom.
3. Removed from page (code + data kept, re-add in `App.jsx` to restore):
   "Once upon a time" (Story), "Our Family" (Family), RSVP, Contacts ("For any help, call us"), Wishes Wall.
4. Venue (`data.js` → `venue`): Madhuvan Farm (Madhuvan Party Plot), Near Hotel Deshi Pakwan, near Khalilpur Chowkdi, Junagadh - 362002.
   `embedUrl` = user's Google Maps embed; `mapUrl` = https://maps.app.goo.gl/MLd81BytVMwmx7gg8
5. Countdown target: 2 Feb 2027, 7:00 PM (`countdownTo = new Date(2027, 1, 2, 19, 0)`; month is 0-based).

## Current page order
Gate → Hero → Countdown → Save the Date scratch card → Couple → Ceremonies → Gallery → Venue → Farewell → Bench footer.

## Open questions for the user
- Other places still show old date 11 Dec 2026 and old venue (hero `placeLabel`, Save the Date, Venue date, Farewell, ceremony cards). Waiting on per-ceremony dates/times/venues.
- Countdown uses viewer's local time zone; offered to pin to IST.
- Couple names, photos and other real details still to be supplied.
