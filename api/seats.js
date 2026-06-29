// Live "seats taken" for the two paywalls, read from the Circle Admin API V2.
//
// The page calls GET /api/seats and updates the seat counters when this returns
// real numbers. If anything is missing or errors, it returns { ok:false } and the
// page keeps its static fallback numbers — so the sales page never shows 0 of 60.
//
// It counts the members carrying a "purchaser" member-tag per tier. Circle can add
// a member tag automatically when someone buys a paywall (Settings -> Paywalls ->
// the paywall -> add a member tag on purchase). Point the env vars at those tags.
//
// Vercel project env vars (Settings -> Environment Variables):
//   CIRCLE_API_TOKEN      Circle Admin API V2 token            (required)
//   CIRCLE_COURSE_TAG_ID  member-tag id = "The AI Course" buyers
//   CIRCLE_VIP_TAG_ID     member-tag id = "Build With Me (VIP)" buyers
//   SEATS_COURSE_SEED     number added on top of the live count (default 0)
//   SEATS_VIP_SEED        number added on top of the live count (default 0)
//   SEATS_COURSE_TOTAL    default 60
//   SEATS_VIP_TOTAL       default 8

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');
  res.setHeader('Content-Type', 'application/json');

  const token = process.env.CIRCLE_API_TOKEN;
  const courseTotal = parseInt(process.env.SEATS_COURSE_TOTAL || '60', 10);
  const vipTotal = parseInt(process.env.SEATS_VIP_TOTAL || '8', 10);
  const courseSeed = parseInt(process.env.SEATS_COURSE_SEED || '0', 10);
  const vipSeed = parseInt(process.env.SEATS_VIP_SEED || '0', 10);
  const courseTagId = process.env.CIRCLE_COURSE_TAG_ID;
  const vipTagId = process.env.CIRCLE_VIP_TAG_ID;

  if (!token) { res.status(200).end(JSON.stringify({ ok: false, reason: 'no-token' })); return; }

  try {
    const r = await fetch('https://app.circle.so/api/admin/v2/member_tags?per_page=100', {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        // Circle sits behind Cloudflare which rejects default bot UAs
        'User-Agent': 'Mozilla/5.0 (theaicourse-seats)'
      }
    });
    if (!r.ok) { res.status(200).end(JSON.stringify({ ok: false, reason: 'circle-' + r.status })); return; }

    const data = await r.json();
    const tags = (data && data.records) || [];
    const countFor = (id) => {
      if (!id) return null;
      const t = tags.find((x) => String(x.id) === String(id));
      return t ? (t.tagged_members_count || 0) : null;
    };

    const courseLive = countFor(courseTagId);
    const vipLive = countFor(vipTagId);

    const out = { ok: true, source: 'circle', courseTotal, vipTotal };
    // A VIP seat is a cohort seat plus extras, so the cohort counter aggregates cohort + VIP buyers.
    const vipForCohort = (vipLive === null ? 0 : vipLive);
    if (courseLive !== null) out.course = Math.max(0, Math.min(courseTotal, courseSeed + courseLive + vipForCohort));
    if (vipLive !== null) out.vip = Math.max(0, Math.min(vipTotal, vipSeed + vipLive));
    res.status(200).end(JSON.stringify(out));
  } catch (e) {
    res.status(200).end(JSON.stringify({ ok: false, reason: 'error' }));
  }
};
