/**
 * Checks the seed against Google Ads asset limits, the brand naming rule, and the promise that no
 * Planner figure is invented.
 *
 *   npm run validate
 */
import { readFileSync } from "node:fs";
import { BRAND_ASSETS } from "../src/lib/brand.ts";
import {
  CAMPAIGN,
  EMAIL_COPY,
  GOOGLE_SPECS,
  AD_ANGLES,
  EVIDENCE,
  LANDING_COPY,
  NEGATIVE_GROUPS,
  PLANNER_SOURCE,
  PLAN_CARDS,
  SEED_KEYWORDS,
  SITELINKS,
  TREATMENTS,
  VERIFIED_DESTINATIONS,
} from "../src/lib/seed.ts";

const failures = [];
const fail = (msg) => failures.push(msg);
const len = (s) => Array.from(s).length;

/* --- Google Ads asset limits --- */
const { rsa, sitelink } = GOOGLE_SPECS;

if (TREATMENTS.length !== 4) fail(`expected 4 ads, found ${TREATMENTS.length}`);

for (const t of TREATMENTS) {
  const label = `ad "${t.name}"`;

  if (t.headlines.length < rsa.headlineMinCount || t.headlines.length > rsa.headlineMaxCount)
    fail(`${label}: ${t.headlines.length} headlines, outside ${rsa.headlineMinCount}–${rsa.headlineMaxCount}`);
  if (t.descriptions.length < rsa.descriptionMinCount || t.descriptions.length > rsa.descriptionMaxCount)
    fail(`${label}: ${t.descriptions.length} descriptions, outside ${rsa.descriptionMinCount}–${rsa.descriptionMaxCount}`);
  if (!t.headlines.some((h) => h.id === t.pinnedHeadlineId))
    fail(`${label}: pinned headline ${t.pinnedHeadlineId} is not in the headline list`);
  if (!t.why) fail(`${label}: missing its one-line rationale`);

  for (const h of t.headlines)
    if (len(h.text) > rsa.headlineMax)
      fail(`${label} ${h.id}: ${len(h.text)} chars > ${rsa.headlineMax} — "${h.text}"`);
  for (const d of t.descriptions)
    if (len(d.text) > rsa.descriptionMax)
      fail(`${label} ${d.id}: ${len(d.text)} chars > ${rsa.descriptionMax} — "${d.text}"`);

  const seen = new Set();
  for (const a of [...t.headlines, ...t.descriptions]) {
    const key = a.text.toLowerCase();
    if (seen.has(key)) fail(`${label}: duplicate asset text "${a.text}"`);
    seen.add(key);
  }
}

/* Every ad must open on a different line, or they are not four distinct ads. */
const pinned = TREATMENTS.map((t) => t.headlines.find((h) => h.id === t.pinnedHeadlineId)?.text);
if (new Set(pinned).size !== TREATMENTS.length)
  fail("two ads lead with the same pinned headline");

if (SITELINKS.length !== 4) fail(`expected 4 sitelinks, found ${SITELINKS.length}`);
for (const s of SITELINKS) {
  if (len(s.text) > sitelink.textMax)
    fail(`sitelink "${s.text}": ${len(s.text)} chars > ${sitelink.textMax}`);
  for (const [i, line] of [s.line1, s.line2].entries())
    if (len(line) > sitelink.lineMax)
      fail(`sitelink "${s.text}" line ${i + 1}: ${len(line)} chars > ${sitelink.lineMax}`);
  if (!s.line1 || !s.line2 || !s.path) fail(`sitelink "${s.text}": incomplete`);
}

/* --- Destinations --- */
const destinations = [
  ...SITELINKS.map((s) => s.url),
  ...PLAN_CARDS.map((p) => p.ctaUrl),
  EMAIL_COPY.ctaUrl,
];
for (const url of destinations)
  if (!VERIFIED_DESTINATIONS.some((v) => url.startsWith(v)))
    fail(`destination not in the verified list: ${url}`);

/* --- Brand naming: "Cursor", never "Cursor AI" or "Cursor Code" --- */
const BAD_NAME = /cursor\s+(ai|code)\b/i;
const authored = [
  ...TREATMENTS.flatMap((t) => [t.name, t.why, ...t.headlines.map((h) => h.text), ...t.descriptions.map((d) => d.text)]),
  ...SITELINKS.flatMap((s) => [s.text, s.line1, s.line2]),
  ...AD_ANGLES.flatMap((a) => [a.name, a.question]),
  ...EVIDENCE.map((e) => e.finding),
  ...PLAN_CARDS.flatMap((p) => [p.name, p.summary, p.cta, ...p.features]),
  LANDING_COPY.heroDefault.headline,
  LANDING_COPY.heroDefault.subhead,
  LANDING_COPY.heroAlt.headline,
  LANDING_COPY.heroAlt.subhead,
  ...LANDING_COPY.blocks.flatMap((b) => [b.heading, b.body]),
  EMAIL_COPY.subject,
  EMAIL_COPY.preheader,
  EMAIL_COPY.bodyIntro,
  ...EMAIL_COPY.steps,
  EMAIL_COPY.bodyOutro,
  CAMPAIGN.name,
  CAMPAIGN.goal,
];
for (const text of authored)
  if (BAD_NAME.test(text)) fail(`authored copy must say "Cursor" only: "${text}"`);

/* --- Planner data: ranges stay ranges, and nothing is invented --- */
const VOLUME_RANGE = /^(?:\d+(?:k|m)?)–(?:\d+(?:k|m)?)$/;
const BAND = { "10k–100k": 1, "1k–10k": 1, "100–1k": 2, "10–100": 3 };
const seenKeywords = new Set();

for (const k of SEED_KEYWORDS) {
  if (seenKeywords.has(k.keyword)) fail(`duplicate keyword: ${k.keyword}`);
  seenKeywords.add(k.keyword);

  if (!VOLUME_RANGE.test(k.volume ?? ""))
    fail(`"${k.keyword}": volume must stay a Planner range, got "${k.volume}"`);
  if (!["Low", "Medium", "High"].includes(k.competition ?? ""))
    fail(`"${k.keyword}": unexpected competition "${k.competition}"`);
  if (BAND[k.volume] && k.tier !== BAND[k.volume])
    fail(`"${k.keyword}": ${k.volume} belongs in tier ${BAND[k.volume]}, listed as ${k.tier}`);
}

if (!/Google Keyword Planner/.test(PLANNER_SOURCE)) fail("planner source line is missing");

/* --- No invented performance figures anywhere in authored copy --- */
const FAKE_PERF = /(cac|cvr|conversion rate|cost per acquisition|roas|ctr)\s*(of|:|=)?\s*[$\d]/i;
for (const text of authored)
  if (FAKE_PERF.test(text)) fail(`invented performance figure: "${text}"`);

/* --- Plan cards --- */
if (PLAN_CARDS.length !== 4) fail(`expected 4 plan cards, found ${PLAN_CARDS.length}`);
if (PLAN_CARDS.filter((p) => p.featured).length > 1) fail("more than one plan card is featured");

/* --- Research --- */
if (AD_ANGLES.length !== TREATMENTS.length)
  fail(`${AD_ANGLES.length} ad angles documented for ${TREATMENTS.length} ads`);
for (const e of EVIDENCE)
  if (!/^https:\/\//.test(e.url)) fail(`evidence "${e.label}": source must be an https link`);

/* --- Nothing in the UI carries claim IDs, observation dates, or scaffolding --- */
const UI_FORBIDDEN = [
  { re: /\b(CUST|COMP|MKT|BRF)-\d+/, why: "claim ID" },
  { re: /\bobserved \d{4}-\d{2}-\d{2}/i, why: "observation date" },
  { re: /\bre-?checked\b/i, why: "re-checked note" },
  { re: /what is not here|what this page cannot tell you/i, why: "disclaimer wall" },
  { re: /portfolio piece/i, why: "portfolio framing" },
];
for (const text of authored)
  for (const { re, why } of UI_FORBIDDEN)
    if (re.test(text)) fail(`${why} left in authored copy: "${text}"`);

const negCount = NEGATIVE_GROUPS.reduce((n, g) => n + g.keywords.length, 0);
if (negCount > 24) fail(`negative list is ${negCount} terms, longer than intended`);

/* --- Brand marks are never stretched --- */
for (const a of BRAND_ASSETS) {
  const buf = readFileSync(`public/brand/${a.file}`);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  if (width !== a.width || height !== a.height)
    fail(`brand asset ${a.file}: declared ${a.width}x${a.height}, file is ${width}x${height}`);
}

/* --- Report --- */
if (failures.length) {
  console.error(`✗ ${failures.length} problem(s)\n`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log("✓ content checks passed");
console.log(`  ${TREATMENTS.length} ads · ${SITELINKS.length} sitelinks · ${PLAN_CARDS.length} plan cards`);
console.log(`  ${SEED_KEYWORDS.length} keywords, every one with a Planner range`);
console.log(`  ${negCount} negatives · ${EVIDENCE.length} sources · ${BRAND_ASSETS.length} brand marks`);
