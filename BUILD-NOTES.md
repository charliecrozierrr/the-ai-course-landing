# The AI Course — sales page build notes

Self-contained, working long-form sales/paywall page for The AI Course. Built on the live AI With Remy design system (Sophisticated Digital Nostalgia), Remy voice throughout, motion + ASCII as signatures.

## Run it
From this folder: `python3 -m http.server 8799` then open `http://localhost:8799/index.html`.
(Local preview uses relative asset paths + a font that needs http, so use the server, not file://.)

## Files
- `index.html` — the page (20 sections + sticky nav + sticky buy bar)
- `the-ai-course.css` — page-specific styles + motion (extends the brand stylesheet)
- `the-ai-course.js` — countdown, seats bar, the loop animation, dial reveals, accordions, sticky bars, UTM pass-through
- `styles.css` — copied verbatim from the live site (Code : Output) for tokens + components; font path made relative
- `js/button-sounds.js` — reused from the live site (Web 1.0 button click)
- `assets/` — PP Neue Bit font, Remy signature, founder photos (Noah/Hudson/Alfie), logo gif, course pixel gif, icon gifs, ASCII pngs

## Locked decisions baked in
- 30 seats · early bird $1,497 (anchored vs $1,997) · 8 × $275/wk instalments · 1 month free alumni ($147 value)
- Guarantee: "show up, do the work, or your money back" (conditional)
- Proof built around founders (Noah/Hudson/Alfie) — quotes are PLACEHOLDERS (see below)
- All CTAs → `https://the-ai-course.circle.so/checkout/test`

## PLACEHOLDERS to replace before launch (all visibly marked with dashed outline)
1. **Dates** — `starts mon 14 jul`, the 6 session date chips, and the countdown deadline (`data-deadline` on `#tacCountdown` in index.html, currently `2026-07-11`). Search `tac-placeholder`.
2. **Seats left** — `#tacSeats` `data-left="12"` (of 30). Set the real number.
3. **Proof quotes** — three founder cards in `#proof` carry bracketed placeholder quotes + result lines. Drop in real words once we have them (do NOT ship the brackets).

## Integration into the live site (later)
- Destination: `/the-ai-course` on aiwithremy.com (git repo root on `main`, Vercel `ai-with-remy-landing`).
- Ship via a clean worktree off `main` → surgical diff → PR → merge (never deploy `Code : Output/`).
- On integration: point asset paths at the live `/assets`, share the root `styles.css` instead of the copy, and confirm Stripe is connected on Circle so the checkout takes real money (prior blocker).

## QA done
- Desktop (1280) + mobile: full-page screenshots, all sections render, no horizontal overflow (`scrollW == vw`).
- No JS console errors. Countdown ticks live, seats bar fills, the loop cycles observe→think→act, dials light on scroll, accordions toggle, sticky nav + buy bar behave.
- Brand checks: blue hero + white PP Neue Bit headline + faint same-hue ASCII (locked tint rule), blue-diamond lists, Silkscreen kickers, squared corners, glass pill nav, Web 1.0 CTAs. Voice: lowercase "i", spaced hyphens, no em dashes, no marketer words.
- Reduced-motion respected (animations disabled under `prefers-reduced-motion`).
