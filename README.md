# The AI Course — landing page

The long-form sales / paywall page for **The AI Course** (AI with Remy's live cohort). Static HTML/CSS/JS on the AI with Remy design system. CTAs funnel into the Circle checkout.

> **Status:** LIVE at <https://theaicourse.aiwithremy.com> (also `the-ai-course-landing.vercel.app`).
> Deployed on Vercel from the **`master`** branch.

---

## Run it locally

No build step, no dependencies — plain HTML/CSS/JS. You need a local web server (open it over `http://`, **not** by double-clicking the file, or the web font, the live-seats fetch and some assets won't work).

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

**VS Code** — "Live Server" extension → right-click `index.html` → **Open with Live Server**.

Stop the Python server with `Ctrl+C` (or `lsof -ti tcp:8000 | xargs kill`).

> Note: `/api/seats` only runs on Vercel, so locally the seat numbers stay on their static fallback and you'll see one 404 for it in the console. That's expected.

---

## What's in here

```
index.html            the whole page (one long scroll). Cloudinary config block lives in <head>.
the-ai-course.css     page-specific styles + motion (the file you'll mostly edit)
the-ai-course.js      countdowns, seat load-bar, live-seats fetch, hero brain defer,
                      wall-of-love video logic, scroll/erase reveals, sticky nav + buy bar
styles.css            AI with Remy design system (tokens + shared components). Inherited — don't edit.
api/seats.js          Vercel serverless function: live "seats taken" from the Circle Admin API
js/button-sounds.js   Web 1.0 button click (reused from the live site)
assets/               fonts (woff2 + otf), images (WebP), gifs, brain videos + poster, testimonial videos
scripts/              dev tooling — upload-to-cloudinary.mjs (bulk video upload)
docs/PLAN.md          the strategy + section plan
docs/VIDEO-CMS.md     how testimonial videos are hosted (Cloudinary) + upload steps
docs/BUILD-NOTES.md   build notes
```

New components are prefixed `tac-` (e.g. `.tac-hero`, `.tac-pricing`, `.tac-seatbar`). Edit `the-ai-course.css` / `the-ai-course.js`; leave `styles.css` alone.

---

## Page sections (top to bottom)

Announcement bar → glass pill nav → **hero** (brain video) → as-featured-on → the problem → the reframe (interactive ripple) → introducing (unrolling scroll) → build your AI team in 4 layers → how it works: 6 sessions → what's included → **wall of love** (3-row carousel, middle row = video testimonials) → founder story → who this is for → rooms → ROI calculator → proof → **pricing** (2-tier + seat bar + countdown) → guarantee → FAQ → final CTA (`#join`) → footer → sticky buy bar.

---

## Video testimonials — hosted on Cloudinary

Testimonial videos are served from **Cloudinary** (a free video CMS), so they load from a CDN for anyone who clones the repo. **Configured and live** — cloud `dufuwl2hx`, folder `tac/testimonials`, 7 testimonials (Alfie, Adrian, Jai, Mason, Leo, Armandas, Jack Boxer). Reference: [`docs/VIDEO-CMS.md`](docs/VIDEO-CMS.md).

How it works: the `VIDEO CMS` block at the top of `index.html` holds the cloud name, and `the-ai-course.js` rewrites each `assets/videos/<id>.mp4` source to `https://res.cloudinary.com/dufuwl2hx/video/upload/q_auto/tac/testimonials/<id>.mp4` (then calls `video.load()` so it re-selects the CDN source). Blank the cloud name and it falls back to the local files in `assets/videos/`.

**To add a new testimonial:**
1. Upload the clip to Cloudinary as `tac/testimonials/<id>` — Media Library UI, or `node scripts/upload-to-cloudinary.mjs` with your API creds in the env. 9:16 portrait, short.
2. Add a card in the middle "wall of love" row in `index.html` with `data-slot="N"` and `<source src="assets/videos/<id>.mp4" type="video/mp4">` (the path just encodes the id; the resolver points it at the CDN).
3. Optional: drop a `creators/<id>.jpg` avatar in `assets/images/creators/` for the credit (the credit image self-removes if the file is missing).

Clips autoplay muted, **unmute on hover**, and pause off-screen. The cloud name is public (it's in every CDN URL); the API **key/secret are not in the repo** — the upload script reads them from the environment. The hero **brain** videos are *not* part of this CMS — they stay in the repo (design, not changing content).

---

## Performance — please don't undo these

The hero was 6.7MB; it's now ~0.7MB on first load. Keep it that way:

- **Hero brain**: a transparent WebP **poster** (`assets/brain/brain_lo_white.webp`, a white low-def brain, preloaded) paints instantly; the video has `preload="none"` and **no `autoplay`** — JS starts it on idle. The lens layer (`brain_lo`) only loads on hover. Don't re-add `autoplay` or remove the poster.
- **Font**: PP Neue Bit ships as **woff2** (preloaded). Keep the `.woff2` first in the `@font-face` src.
- **Images** are WebP and below-the-fold ones are `loading="lazy"`. Testimonial videos are `preload="none"`. Keep new below-fold media lazy.

---

## Live wiring (what's connected)

- **Checkout** — cohort CTAs → `https://the-ai-course.circle.so/checkout/the-ai-course`; VIP CTAs → `.../checkout/vip-or-build-with-me`. Circle needs Stripe connected to actually take payment.
- **Countdown** — `data-deadline="2026-07-11T23:59:00-04:00"` (doors close). Update for the real cohort.
- **Seats** — `api/seats.js` reads the Circle Admin API and updates `[data-course-taken]` / `[data-vip-taken]`, the announcement bar, and the `.tac-seatbar` load-bar; it polls every 60s and falls back to the static numbers if the API is unset/unavailable. Configure its env vars (`CIRCLE_API_TOKEN`, `CIRCLE_COURSE_TAG_ID`, `CIRCLE_VIP_TAG_ID`, optional `SEATS_*`) in Vercel → Project → Environment Variables. **Never commit these.**

---

## Deploying

Production is on **Vercel** (project `the-ai-course-landing`), production branch **`master`**.

- **Auto-deploy:** push to `master` → Vercel builds + deploys to production.
- **Manual:** `vercel --prod` from the repo root.

Custom domain `theaicourse.aiwithremy.com` (DNS at GoDaddy → A record to Vercel). It's a static site, so any static host works if you ever move it.

---

## Design + voice notes (so edits stay on-brand)

- **Colours:** white background, near-black text, Blueprint Blue accent — `#173EF5` on this page (the brand token is `#4040FF`; this page uses the brighter `--color-accent: #173EF5`). Plus deliberate full-blue / dark feature bands.
- **Type:** PP Neue Bit (display headlines), Inter (body), Space Mono (labels), Silkscreen + Jersey 25 (pixel accents).
- **Voice:** lowercase "i" except at the start of a sentence, spaced hyphens (` - `) never em dashes, chatty and direct, no marketer words. Match the existing copy.
- **Motion:** scroll reveals, live countdowns, the segmented seat load-bar, the unrolling parchment scroll, the interactive pixel ripple, hover cascade reveals. All motion respects `prefers-reduced-motion`.
- **ASCII** is a signature motif (the sand-dune hero backdrop, dividers).

---

Built for AI with Remy. Strategy + section plan → `docs/PLAN.md`.
