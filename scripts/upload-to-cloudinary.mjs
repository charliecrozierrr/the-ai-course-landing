#!/usr/bin/env node
/*
 * Bulk-upload the testimonial videos in assets/videos/ to Cloudinary.
 *
 * Zero dependencies — uses Node 18+ built-ins (fetch, FormData, Blob, crypto).
 * Credentials are read from the environment and never written to disk.
 *
 * Get them from your Cloudinary dashboard (Settings -> API Keys):
 *   CLOUDINARY_CLOUD        your cloud name (also goes in index.html)
 *   CLOUDINARY_API_KEY      API key
 *   CLOUDINARY_API_SECRET   API secret  (keep private — never commit it)
 *
 * Run from the repo root:
 *   CLOUDINARY_CLOUD=xxx CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=xxx \
 *     node scripts/upload-to-cloudinary.mjs
 *
 * Each file uploads to  <folder>/<filename-without-extension>  with overwrite,
 * so re-running is safe and the public_id matches what the page expects
 * (the page resolves assets/videos/<id>.mp4 -> <folder>/<id> by filename).
 */
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';

const cloud  = process.env.CLOUDINARY_CLOUD;
const key    = process.env.CLOUDINARY_API_KEY;
const secret = process.env.CLOUDINARY_API_SECRET;
const FOLDER = process.env.CLOUDINARY_FOLDER || 'tac/testimonials';
const DIR    = 'assets/videos';

if (!cloud || !key || !secret) {
  console.error('Missing credentials. Set CLOUDINARY_CLOUD, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.');
  console.error('See docs/VIDEO-CMS.md for where to find them.');
  process.exit(1);
}

const files = (await readdir(DIR)).filter((f) => /\.(mp4|mov|webm)$/i.test(f));
if (!files.length) { console.error(`No video files found in ${DIR}/`); process.exit(1); }

console.log(`Uploading ${files.length} file(s) to cloud "${cloud}", folder "${FOLDER}"\n`);

let ok = 0;
for (const file of files) {
  const id = basename(file, extname(file));
  const timestamp = Math.floor(Date.now() / 1000);

  // signed upload: sha1 of the alphabetically-sorted params + the api secret
  const signParams = { folder: FOLDER, overwrite: 'true', public_id: id, timestamp: String(timestamp) };
  const toSign = Object.keys(signParams).sort().map((k) => `${k}=${signParams[k]}`).join('&');
  const signature = createHash('sha1').update(toSign + secret).digest('hex');

  const buf = await readFile(join(DIR, file));
  const form = new FormData();
  form.append('file', new Blob([buf]), file);
  form.append('api_key', key);
  form.append('timestamp', String(timestamp));
  form.append('public_id', id);
  form.append('folder', FOLDER);
  form.append('overwrite', 'true');
  form.append('signature', signature);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/video/upload`, { method: 'POST', body: form });
    const json = await res.json();
    if (json.secure_url) { console.log(`  OK  ${file}  ->  ${json.secure_url}`); ok++; }
    else console.error(`  FAIL ${file}: ${json.error?.message || JSON.stringify(json)}`);
  } catch (e) {
    console.error(`  FAIL ${file}: ${e.message}`);
  }
}

console.log(`\nDone: ${ok}/${files.length} uploaded.`);
console.log(`Now set  cloud: "${cloud}"  in window.TAC_CLOUDINARY (index.html) and the page serves from the CDN.`);
process.exit(ok === files.length ? 0 : 1);
