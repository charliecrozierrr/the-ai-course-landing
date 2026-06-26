# The AI Course — Sales Page + Paywall — Build Plan

A long-form, hard-sell landing page for **The AI Course** (the live cohort), feeding the waitlist straight into the Circle checkout. Plan first — Charlie/Remy approve, then build the live page.

- **Product:** live 6-session cohort, 2 weeks, building your own AI operating system with Remy.
- **Primary action:** Buy now → Circle checkout (`https://the-ai-course.circle.so/checkout/test`).
- **Page type:** single long-form sales page, every objection handled (competitor-style hard sell), rebuilt for a *live cohort* not self-paced.
- **Route (proposed):** `/the-ai-course` on aiwithremy.com (vanilla HTML/CSS/JS, existing Vercel project, shipped via clean worktree off `main` → PR → merge).

---

## 1. Strategy & positioning spine

The whole page sits on three arguments the brand already owns:

1. **You don't have a knowledge problem, you have an implementation problem.** The gap between watching AI and building it into your work is where everyone quietly gives up. This course closes that gap.
2. **The magic was never the tool — it's the setup.** A raw agent is mediocre. Almost nobody teaches the setup. That's the wedge.
3. **You leave actually understanding it.** The engine you never touch, the three dials you do. Literacy, not a copied setup you can't run — so when the next thing drops, you've already got it.

The **unique mechanism** (this is our "named framework", the thing the competitor teardown says every strong page needs): **The engine you never touch. The three dials you do.** Engine = the brain (LLM) + the loop (observe → think → act). Dials = Context, Tools, Skills. This is the spine of both the curriculum and the sale — we make it the visual + animated centrepiece.

**Market awareness:** the audience is mostly Solution-Aware (they know AI is the answer, they're shopping the "how"). So we lead with the mechanism + proof, not with "AI is important". Voice is mate-who-happens-to-be-a-founder, never guru — the single most-repeated correction on this project.

---

## 2. Page architecture (section-by-section, in order)

Borrowed architecture from the Uncommon Business / Superhuman teardown — *value block → proof → CTA*, roughly every 1.5 screens, two persistent buy rails, anchor-funnel into one pricing block — but rebuilt for a dated, seat-capped, countdown-driven live cohort.

> Each section below: **purpose · copy direction (Remy voice) · motion/ASCII · CTA**. All sample copy is direction, to be finalised by the Copywriter sub-agent + humanise/stop-slop pass and approved by Remy.

**0 · Sticky top nav.** Persistent buy action one click away. Logo (browser-pill), anchor links (how it works / what's inside / the build / pricing / faqs), and a price-anchored CTA button "Join the cohort - $1,497". *Motion:* glass pill nav, subtle on-scroll shrink. *CTA:* → pricing.

**1 · Hero.** The promise + the price anchor immediately. Headline lands the transformation; subhead defines the product in one breath; primary CTA; cohort meta strip (next cohort dates · seats left · "live, with Remy"). *Copy direction:* "build your own AI operating system - live, with me, in two weeks." + "no word of a lie, i'm 5-10x more productive than i used to be." *Motion/ASCII:* faint same-hue ASCII workstation backdrop (reuse `.ascii-workstation`, drifting clouds + banner plane), the **"The AI Course" pixel GIF** as the wordmark, headline reveal on load, a live pulsing dot on the cohort strip. *CTA:* "Join the cohort - $1,497" → checkout.

**2 · Trust strip.** Lower skepticism before the pitch. "hundreds of founders already on the waitlist", newsletter reader count, the names Remy's set this up for (Noah, Hudson, Alfie - first names only). *Motion:* animated count-up. *CTA:* none (reassurance band).

**3 · The gap (problem agitation).** Name where they're standing. The three pains, verbatim from the curriculum: *they know it matters but can't get it into their work · the busywork eats the week · they tried AI and it fizzled.* Close on the horse-vs-tractor line. *Motion/ASCII:* ASCII divider; the three pains reveal in sequence. *CTA:* soft, info-framed ("show me how it works" → mechanism).

**4 · What it is.** What you're actually buying. The AI operating system - a setup that knows your business and does real work for you. "i drop my whole setup on your machine and we build one real, working thing with it, live." The three things that hold it together (understand it / my machine on yours / one real build). *Motion:* product-in-context; blue diamond list. *CTA:* price-anchored.

**5 · The mechanism — the engine + the three dials (SIGNATURE / centrepiece).** Make the offer feel new, not "another AI course". The engine you never touch (brain + loop), the three dials you do (context, tools, skills). "treat it like a hire" frame. *Motion/ASCII:* the conversion + comprehension centrepiece — an **animated ASCII diagram** of the loop (observe → think → act, cycling) and the three dials lighting up one at a time as you scroll. This teaches the mechanism *and* is the page's signature motion moment. *CTA:* "this is the whole course - here's how we build it" → curriculum.

**6 · Before / after.** Sell the felt transformation. From watching AI happen to running it. After-states in Remy voice: "you stop asking ChatGPT the odd question and start operating a system that knows your business... the boring 80% of your week, gone." *Motion:* before-column → after-column wipe on scroll. *CTA:* identity-led button.

**7 · How it works (the shape).** De-risk the mechanics. 6 live sessions · 90 min each (60 build + 30 Q&A) · 2 weeks, 3 a week · all recorded · resource library every session · one cohort, all levels met where they stand. *Motion/ASCII:* a 6-node ASCII timeline. *CTA:* price-anchored.

**8 · The curriculum (6 sessions).** Concrete proof of substance + curiosity. Accordion, one row per session, each showing the **deliverable** + "you walk out with". Sessions: 1 Theory + install · 2 Context · 3 Memory · 4 Tools · 5 Skills · 6 The live build. *Motion/ASCII:* ASCII session markers `[ S1 ]`…`[ S6 ]`, expand-to-reveal. *CTA:* "get the full curriculum" → checkout.

**9 · What you walk out with.** Stack the outcomes. The blue-diamond list from the curriculum (model cold · my setup installed · context files · self-improving memory · tools wired in · custom skills · one real build · alumni community). *Motion:* staggered reveal. *CTA:* price-anchored.

**10 · The live build (S6 vote).** Show-don't-tell payoff. The cohort votes: a landing page, an analytics dashboard, or a social dashboard - "a real URL you can send someone", "your numbers in one view", "your channels in one place". *Motion/ASCII:* three build cards, the "voted" one ticks live. *CTA:* none (momentum).

**11 · The alumni community (+ the bonus).** Justify the after, plant the bonus. "the course gives you the foundations and your first build. the community is where you keep going." Live builds every week or two. **Bonus: one month free in the alumni community ($147 value), for everyone who finishes.** *Motion:* the community GIF/icon set. *CTA:* price-anchored.

**12 · Who this is for (and who it's not).** Self-selection / identity. Heading is **"Who this is for?"** (locked — never "Pick your door"). Two columns: for (high-agency founders/operators/marketers/ecom/freelancers/consultants/100x employees, technical or not) vs not-for (not comfortable on a computer / "just do it for me" / magic-button hunters / engineers after code training). *Motion:* two-column reveal. *CTA:* none.

**13 · Founder story (full, prominent).** Authority + narrative. Remy in first person: marketing background, "i don't have a technical bone in my body either - that's rather the point", built a full AI operating system, set the same up for founders. Tie in the manifesto worldview (amplify, don't replace - "context creators, not content creators"). Signed, signature image. *Motion/ASCII:* the paper-letter treatment (reuse `.letter` / `.paper`), Remy signature. *CTA:* soft.

**14 · Wall of love / results.** Proof escalating in status, just before price. Real testimonials + student/founder results, interleaved. *Motion:* reuse the marquee Wall of Love (two scrolling rows). *CTA:* price-anchored, "see what's included" → pricing. *(Depends on which real results we can feature — see §9 open items.)*

**15 · The offer / pricing (the decision point).** Anchor + stack + risk-reverse. Hero price **early bird $1,497** with **~~$1,997~~** struck through; instalment option **8 × $275/week**; everything-included list (6 live sessions, resource library every session, recordings, private community, **+ 1 month free alumni, $147 value**). Secure-checkout badges. *Motion:* the price card raises (Web 1.0 button treatment). *CTA:* "Buy now - join the cohort" → **Circle checkout** (primary), instalment link secondary.

**16 · Objection handling.** Clear resistance at the buy decision. Reuse **the 6 lies** accordion (the self-talk objections, each killed in Remy voice) + the curriculum's honest **"but is it safe?"** frame (you secure an AI employee like a human one - no payments access, drafts-not-sends, one click cuts access). Sits right after price. *Motion:* accordion. *CTA:* "escape the loop" identity button.

**17 · Scarcity / decision frame.** Force the choice. Countdown to enrollment close · seats-left counter · the "two types of people" future-pace in Remy voice. "you already feel which way the wind's blowing, or you wouldn't be here." *Motion:* **live countdown timer** + animated seats-left. *CTA:* price-anchored.

**18 · FAQ.** Logistics + last objections. Live times + what if i miss a call (recorded) · how technical do i need to be · what do i need installed (Claude Code, VS Code, Whisper Flow) · beginner vs already-building · payment plan · refund/guarantee · what happens after. *Motion:* reuse `.accordion`. *CTA:* none.

**19 · Final CTA block.** Last push. Dates + seats + the one-line promise + button. *Motion/ASCII:* full-width, ASCII flourish, dither into footer. *CTA:* "Join the cohort - $1,497" → checkout.

**20 · Footer.** Reuse browser-pill footer, dither page-end, nav.

**Persistent · Sticky bottom buy bar.** Second always-on buy rail (esp. mobile): "The AI Course · next cohort [dates] · $1,497 · [X] seats left" + Get button → checkout.

---

## 3. Paywall / CTA integration system

- **Straight to checkout.** Per the brief, the primary CTAs go **directly** to the Circle checkout (`/checkout/test`), not just an anchor jump. A few low-commitment CTAs jump to the pricing/curriculum anchors to keep cold readers moving.
- **Cadence:** a CTA roughly every 1.5 screens — ~12-14 total, plus the two persistent rails (sticky nav + sticky bottom bar).
- **Button-pitch craft:** the button is the natural next sentence after the section above it, never a generic "Buy now". Rotation: price-anchored on cold sections ("Join the cohort - $1,497"), identity-led deeper ("yes, i'm in - let's build it"), enroll-verb near the end ("save your seat"). Each carries the momentum of the block it closes.
- **Tracking:** carry UTM/attribution through to the checkout link (reuse `attribution-tracking.js`).

---

## 4. Offer & pricing stack

| Tier | Price | Notes |
|---|---|---|
| **Early bird (pay in full)** | **$1,497** | The hero price. Anchored against the $1,997 full price (struck through). The launch incentive. |
| Full (pay in full) | $1,997 | The anchor. |
| Instalments | **8 × $275/week** ($2,200) | Accessibility option, financing premium. |
| **Included bonus (all tiers)** | **1 month free** alumni community | $147 value, for everyone who finishes. Stacked on the offer. |

**Risk reversal:** recommend adding a simple guarantee for the hard sell (the competitor had none — a clear gap). Proposed: a "show up, do the work, or your money back" guarantee. *Needs Remy's call — see open items.*

---

## 5. Scarcity system

A live cohort runs on dated, seat-capped urgency (the lever the self-paced competitor lacks):

- **Specific dates** — the next cohort's 6 session dates + times (6pm ET, 3/week across 2 weeks).
- **Countdown timer** — to enrollment close.
- **Seats-left counter** — out of the cohort cap (20-30).
- **Future-pace** — the "two types of people" / horse-vs-tractor framing, in Remy voice.

*All four need real inputs (dates, cap) — see open items. Until confirmed I'll build with clearly-marked placeholders so the mechanic is ready to drop numbers into.*

---

## 6. Motion & ASCII system (the signature)

Motion is a centrepiece, ASCII is the signature motif — both in service of comprehension and conversion, never decoration for its own sake.

**Motion (built with the `animate` / `emil-design-eng` skills, all respecting `prefers-reduced-motion`):**
- Hero: ASCII workstation drift (reuse), pixel wordmark GIF, headline reveal, live pulsing cohort dot.
- **The mechanism centrepiece:** animated ASCII loop (observe → think → act cycling) + the three dials lighting up on scroll. The teach-the-mechanism moment.
- Scroll-reveal fade-ins throughout (reuse `flair.js` IntersectionObserver).
- Marquee testimonials (reuse Wall of Love).
- Count-up stats + animated seats-left.
- Live countdown timer (new JS).
- Sticky nav shrink + sticky bottom buy bar (new).
- Button press/release sounds on primary CTAs (reuse `button-sounds.js`).

**ASCII motif:** same-hue faint blue (never white/inverted on the blue — locked rule), used as section dividers, the engine/loop + three-dials diagram, session markers `[ S1 ]…[ S6 ]`, and the dither page-end. Brand pixel GIFs reused from the Circle GIF set. New ASCII generated with the AWR pixel/ASCII tooling (`pixel-glitch-gif` skill + the Ascii assets folder).

---

## 7. Brand & build standards (non-negotiables)

- **Voice:** canonical Remy voice — lowercase "i", spaced hyphens (never em dashes), chatty/cheeky, trailing dots, blue-diamond 🔹 lists, no marketer words. Copy routed through the **Copywriter sub-agent**, then humanise-text + stop-slop, then Remy approves. (Founder-story/manifesto section uses the manifesto's essay register, per the rule.)
- **Design system:** exact tokens/components from the live site — `#FFFFFF` bg, `#121212` text, Blueprint Blue `rgb(64,64,255)` used sparingly, PP Neue Bit / Jersey 25 / Silkscreen / Inter / Space Mono, 680/560px containers, fixed spacing scale, Web 1.0 raised buttons, Mac window, Win95 dialog, browser-pill, dither. Reuse classes; don't reinvent.
- **Not founders-only** — speak to "you / builders / people" (Safeguard door = "my role at work").
- **Tech:** vanilla HTML/CSS/JS, mobile-first, lightweight, fast, accessible. No heavy frameworks.
- **Deploy safely:** verify live repo state first; build in a clean worktree off `main`; surgical diff → PR → merge. **Never deploy `Code : Output/`** (it broke prod before).

---

## 8. Build phases

0. **Verify + branch.** Confirm the canonical live repo state (`git fetch`, HEAD vs origin/main), spin up a clean worktree off `main`. Lock dates/seats/checkout inputs.
1. **Copy.** Copywriter sub-agent drafts every section in Remy voice → humanise/stop-slop → Remy approves. (Curriculum doc is the content source of truth.)
2. **Build static.** Section-by-section HTML/CSS reusing tokens + components. Present in passes for approval.
3. **Motion + ASCII + commerce.** Mechanism animation, scroll reveals, countdown, seats counter, sticky bars, checkout wiring + attribution.
4. **Responsive + a11y + performance.** Mobile-first pass, contrast, keyboard, reduced-motion, asset weight (`audit` skill).
5. **QA + ship.** Playwright screenshots desktop+mobile, brand/conversion test, then PR → review → merge → live at `/the-ai-course`.

---

## 9. Open items to confirm before build (not blocking the plan)

1. **Cohort dates + seat cap.** The single biggest scarcity input. The curriculum's old Jul 1/2/6/8/10/13 dates were for the previous shape; it's a single cohort now, all 6pm ET, 3/week across 2 weeks. Need the real set + the cap (20 or 30).
2. **Circle checkout.** Is `/checkout/test` wired to real products (early bird / instalments) and is **Stripe connected**? (Paywalls were previously blocked on Stripe — real money needs it live.) And does the "1 month free alumni" get handled as a product/coupon?
3. **Real testimonials/results.** Which can we feature — cohort-specific results, or newsletter/founder testimonials (Noah/Hudson/Alfie)? Launching July, so cohort results may be limited.
4. **Guarantee.** Do we offer a money-back / "show up and do the work" guarantee? Recommended for the hard sell.
5. **Route.** `/the-ai-course` on aiwithremy.com — confirm (vs `/cohort` or a standalone).
