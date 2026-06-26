# The AI Course — landing page

The long-form sales / paywall page for **The AI Course** (AI with Remy's live cohort). Static HTML/CSS/JS, built on the AI with Remy design system. CTAs funnel into the Circle checkout.

> **Status:** preview build for review + handover. Not yet deployed. Intended home: `theaicourse.aiwithremy.com`.

---

## Run it locally

No build step, no dependencies — it's plain HTML/CSS/JS. You just need a local web server (open it through `http://`, **not** by double-clicking the file, or the web font and some assets won't load).

Pick whichever you have:

**Python (already on every Mac)**
```bash
cd the-ai-course-landing
python3 -m http.server 8000
```
Then open <http://localhost:8000>.

**Node**
```bash
cd the-ai-course-landing
npx serve -l 8000
```
Then open the URL it prints.

**VS Code**
Install the "Live Server" extension, right-click `index.html` → **Open with Live Server**.

To stop the Python server: `Ctrl+C` (or `lsof -ti tcp:8000 | xargs kill`).

---

## What's in here

```
index.html            the whole page (one long scroll, ~20 sections)
the-ai-course.css     page-specific styles + motion (the part you'll mostly edit)
the-ai-course.js      countdown, seats bar, the loop/dial animation, accordions,
                      sticky nav + buy bar, hover cascade reveals
styles.css            the AI with Remy design system (tokens + shared components),
                      copied from the live site — treat as inherited, edit the file above
js/button-sounds.js   Web 1.0 button click (reused from the live site)
assets/               fonts, images, gifs (founder photos, pixel gifs, ASCII, cascades)
docs/PLAN.md          the full strategy + section-by-section plan behind the page
docs/BUILD-NOTES.md   build notes + the placeholder checklist
```

The page reuses the brand stylesheet verbatim and layers `the-ai-course.css` on top. New components are prefixed `tac-` (e.g. `.tac-hero`, `.tac-pricing`, `.tac-dial`). Edit `the-ai-course.css` / `the-ai-course.js`; leave `styles.css` alone.

---

## Before it goes live — placeholders to replace

These are clearly marked on the page (dashed outlines). Search the code for `tac-placeholder` and `data-` attributes.

1. **Cohort dates** — `starts mon 14 jul`, the six session-date chips, and the countdown target (`data-deadline` on `#tacCountdown` in `index.html`). All currently placeholder July dates.
2. **Seats left** — `#tacSeats` `data-left="12"` (of 30). Set the real number.
3. **Founder proof** — the three cards in the `#proof` section carry bracketed **placeholder quotes** for Noah / Hudson / Alfie. Drop in their real words (remove the brackets) — do not ship the placeholders.
4. **Checkout** — every CTA points at the Circle **test** checkout (`https://the-ai-course.circle.so/checkout/test`). Swap for the live checkout, and make sure Stripe is connected on Circle so it can actually take payment.

---

## Design + voice notes (so edits stay on-brand)

- **Colours:** white background, near-black text, Blueprint Blue `#4040FF` as a sparse accent (plus deliberate full-blue / dark feature bands). Tokens live in `styles.css` `:root`.
- **Type:** PP Neue Bit (display headlines), Inter (body), Space Mono (labels), Silkscreen + Jersey 25 (pixel accents).
- **Voice:** lowercase "i" except at the start of a sentence, spaced hyphens (` - `) never em dashes, chatty and direct, no marketer words. Match the existing copy.
- **Motion:** scroll reveals, a live countdown, the observe→think→act loop, the segmented dial load-bars, and a brand **pixel-cascade GIF** that fades in behind CTAs / cards / the offer on hover. All motion respects `prefers-reduced-motion`.
- **ASCII** is a signature motif (the sand-dune hero backdrop, the section dividers).

---

## Deploying (later)

It's a static site, so any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages). Point it at the repo root and serve `index.html`. Target subdomain: `theaicourse.aiwithremy.com`.

---

Built for AI with Remy. Questions on the build → check `docs/PLAN.md` first.
