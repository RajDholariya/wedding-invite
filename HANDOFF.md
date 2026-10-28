# Project handoff notes (for Claude on another machine)

Wedding invitation site for **Raj Dholariya & Shyama Patadiya** (Hindu Gujarati Kathiyawadi Patel wedding).
Vite + React + framer-motion + Tailwind, recreating the Invitima "Blush Romance" template.

To resume on a new machine / account: `git pull`, `npm install`, run `claude`, and say "read HANDOFF.md and continue".

## Live site
- English: https://invite.rajdholariya.in
- Gujarati: https://invite.rajdholariya.in/gu/
- Repo: https://github.com/RajDholariya/wedding-invite (public, branch `main`)
- Hosting: GitHub Pages, Source = **GitHub Actions** (not "Deploy from a branch").
  `.github/workflows/deploy.yml` builds and deploys on every push to `main` (~1 min).
- Domain: `rajdholariya.in` registered on Hostinger (nameservers `ns1/ns2.dns-parking.com`).
  DNS: `CNAME invite → rajdholariya.github.io`. `public/CNAME` holds `invite.rajdholariya.in`. HTTPS enforced.
- Commits use `Raj Dholariya <dholariyaraj1111@gmail.com>` (set in repo-local git config; re-set on a new machine).
- Pushing needs the user's GitHub auth (personal access token or `gh auth login`); no credentials are stored in the repo.

## Run
- `npm install`, `npm run dev` (dev server), `npm run build` (builds `dist/`, both pages).
- `vite.config.js` has two inputs: `index.html` (English) and `gu/index.html` (Gujarati). Base is `/` (needed for the custom domain).

## Where things live
- English text/data: `src/data.js`. Gujarati text/data: `src/data.gu.js` (entry `src/main.gu.jsx`, strings via `src/i18n.jsx`).
- Images: `public/templates/blush-romance/` (replace with same file name to swap).
- Section order: `src/App.jsx`. Sections: `src/sections/*.jsx`. Shared animation helpers: `src/motion.jsx`.

## Content (current)
- Groom: Raj Dholariya (ઢોલરિયા), son of Milanbhai & Rekhaben Dholariya.
- Bride: Shyama Patadiya, daughter of Nipulbhai & Rupalben Patadiya.
- Hashtag `#RajWedsShyama`. Countdown → 2 Feb 2027, 7:00 PM (`new Date(2027, 1, 2, 19, 0)`, month 0-based, viewer's local time).
- Ceremonies (all at Madhuvan Farm), in this order; Reception removed:
  1. Mandap Vidhi — Mon 1 Feb 2027, 8:30 AM (art `events/mandap.webp`)
  2. Haldi — Mon 1 Feb 2027, 5:00 PM (art `events/mehendi.webp`)
  3. Sangeet — Mon 1 Feb 2027, 8:30 PM
  4. Wedding — Tue 2 Feb 2027, 7:00 PM
- Venue: Madhuvan Farm (Madhuvan Party Plot), Near Hotel Deshi Pakwan, near Khalilpur Chowkdi, Junagadh - 362002.
  `embedUrl` = user's Google Maps embed; `mapUrl` = https://maps.app.goo.gl/MLd81BytVMwmx7gg8

## Changes made so far
1. Hero titles kept ≥6% below viewport top on short screens (`Hero.jsx`).
2. Gate titles moved to a separate non-scaled layer so "The Wedding" no longer goes off-screen during the zoom (`Gate.jsx`).
3. Removed from page (code + data kept, re-add in `App.jsx` to restore):
   "Once upon a time" (Story), "Our Family" (Family), RSVP, Contacts ("For any help, call us"), Wishes Wall.
4. Venue, countdown and ceremony schedule set as above.
5. Gujarati page added (`/gu/`) with several Gujarati font families.
6. Mandap Vidhi art generated with Figma: groom in royal blue band-collar Jodhpuri kurta with gold buttis, white trousers,
   no safa; bride in matching blue-and-gold lehenga with red bandhani dupatta; Kathiyawadi mandap.
   Earlier versions kept as `events/mandap-v1.webp` … `mandap-v5.webp` (v5 = same look with safa).
7. Phone/desktop hero reveal images upscaled + sharpened (`gate/portrait-reveal.webp` 1882×3344,
   `gate/landscape-reveal.webp` 2508×1412); intro blur now on its own layer, removed after 2.4 s.

## Current page order
Gate → Hero → Countdown → Save the Date scratch card → Couple → Ceremonies → Gallery → Venue → Farewell → Bench footer.

## Open items
- Hero image sharpness not yet confirmed by the user on a real phone. If still soft, offer to regenerate at 2048 px via Figma.
- `placeLabel` in `src/data.js` still says "Shubh Vivah Banquet Hall"; check it and any other leftover old date/venue text
  (Save the Date, Farewell) against Madhuvan Farm / 2 Feb 2027.
- Unused family/story data in `data.js` is still placeholder (Verma/Sharma) — only matters if those sections are restored.
- Countdown uses the viewer's local time zone; could pin to IST.
