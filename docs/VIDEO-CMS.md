# Video CMS (Cloudinary)

The testimonial videos are served from **Cloudinary**, a free video CMS, instead of being shipped as large files in the repo. This means:

- Videos load reliably for **anyone** who clones the repo (they come from a CDN URL, not a binary in git that can fail to download or get evicted by iCloud).
- The repo stays light — no multi-MB video blobs growing the history.
- Cloudinary handles delivery, compression (`q_auto`) and global CDN caching.

If no cloud is configured the page automatically falls back to the local files in `assets/videos/`, so nothing breaks before you set this up.

---

## One-time setup

1. **Create a free Cloudinary account** — <https://cloudinary.com/users/register_free>.
2. On the **Dashboard** note your **Cloud name** (e.g. `aiwithremy`). That's the only public value.
3. Open `index.html`, find the `VIDEO CMS (Cloudinary)` block near the top, and set your cloud name:
   ```js
   window.TAC_CLOUDINARY = { cloud: "your-cloud-name", folder: "tac/testimonials", transform: "q_auto" };
   ```
   That's it — the page now pulls testimonial videos from Cloudinary.

---

## Uploading videos

The page maps each local filename to a Cloudinary asset by name:

```
assets/videos/<id>.mp4   ->   <folder>/<id>      (folder = tac/testimonials)
```

So a card whose source is `assets/videos/alfie.mp4` will load `tac/testimonials/alfie` from your cloud. Keep the `<source src="assets/videos/<id>.mp4">` in the HTML — it doubles as the local fallback and tells the page which Cloudinary id to use.

### Option A — Cloudinary web UI (easiest, no credentials)

1. In the Cloudinary **Media Library**, create a folder `tac/testimonials`.
2. Drag in each video. Name each asset to match its id (`alfie`, `jai`, …) — the **Public ID**, not the display name.
3. Done. Refresh the page.

### Option B — bulk upload script (uploads everything in `assets/videos/`)

From the repo root, with your API credentials from **Settings → API Keys**:

```bash
CLOUDINARY_CLOUD=your-cloud-name \
CLOUDINARY_API_KEY=your-key \
CLOUDINARY_API_SECRET=your-secret \
  node scripts/upload-to-cloudinary.mjs
```

It uploads every `*.mp4` in `assets/videos/` to `tac/testimonials/<id>` (overwriting on re-run) and prints the URLs. The secret is read from the environment and never stored.

> Keep the API **secret** private — never commit it or paste it into a file.

---

## Adding a new testimonial

1. Add the clip to Cloudinary as `tac/testimonials/<id>` (UI or script). Clips must be **9:16 portrait**, short, web-compressed (H.264 .mp4).
2. In `index.html`, add a card in the middle "wall of love" row with `data-slot="N"` and `<source src="assets/videos/<id>.mp4" type="video/mp4">`. (Also keep a copy of the file in `assets/videos/` so the local fallback works.)
3. The page does the rest: autoplay muted on loop, **unmute on hover**, pause off-screen, and the carousel duplicate syncs automatically.

---

## Sound

Testimonial videos autoplay **muted** (browser policy) and **unmute when hovered** (`v.muted = false`), re-muting on mouse-out. Cloudinary keeps the audio track, so sound works the same whether served from the CDN or locally. The first hover may need to follow any click/scroll on the page (browser autoplay rules).

## Notes

- Free tier is generous for a launch; video **bandwidth** is what adds up. Because videos only play on hover/in-view, usage is gated by interaction — monitor the Cloudinary dashboard during high-traffic spikes.
- The decorative hero **brain** videos stay in the repo (they're part of the design, not content that changes, and already load via a poster + webm). They're not part of this CMS.
