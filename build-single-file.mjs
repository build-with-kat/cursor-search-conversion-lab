/**
 * Emits index.html: the whole workspace as one self-contained file, with no build step, no
 * dependencies and no _next directory. Content is read from the same seed the app uses, so this
 * file cannot drift from what the React version renders.
 *
 *   npm run build:single
 */
import { readFileSync, writeFileSync } from "node:fs";
import {
  AD_ANGLES,
  AD_CONFIG,
  CAMPAIGN,
  DECISION,
  EMAIL_COPY,
  EVIDENCE,
  LANDING_COPY,
  NEGATIVE_GROUPS,
  PLAN_CARDS,
  PLANNER_SOURCE,
  PRODUCT_NAME,
  RESEARCH_CREDIT,
  SEED_KEYWORDS,
  SITELINKS,
  TEAM_PLANS,
  TIER_LABELS,
  TREATMENTS,
  WHY_SEARCH,
} from "../src/lib/seed.ts";

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * The official marks, inlined so the file stays self-contained. cursor-icon-dark is the mark for
 * light backgrounds, which is what the white SERP card is; the light lockup is for the dark chrome.
 */
const dataUri = (file) =>
  `data:image/png;base64,${readFileSync(`public/brand/${file}`).toString("base64")}`;

const LOCKUP = dataUri("cursor-lockup-horizontal-light.png");
const ICON = dataUri("cursor-icon-dark.png");

const DISPLAY_URL = `${AD_CONFIG.displayUrl}/${AD_CONFIG.displayPath.join("/")}`;

const headlineOf = (t) => {
  const pinned = t.headlines.find((h) => h.id === t.pinnedHeadlineId) ?? t.headlines[0];
  const rest = t.headlines.filter((h) => h.id !== pinned.id);
  return [pinned.text, rest[0]?.text, rest[1]?.text].filter(Boolean).join(" | ");
};

const sitelinksHtml = SITELINKS.map(
  (s) => `<li>
      <a href="${esc(s.url)}" target="_blank" rel="noreferrer">${esc(s.text)}</a>
      <p class="sl-line">${esc(s.line1)}</p>
      <p class="sl-path">${esc(s.path)}</p>
    </li>`,
).join("");

const adsHtml = TREATMENTS.map(
  (t) => `<article class="card" data-asset="${esc(t.id)}">
    <div class="card-head">
      <div>
        <h3>${esc(t.name)}</h3>
        <p class="muted">${esc(t.why)}</p>
      </div>
      <div class="actions">
        <span class="badge" data-badge="${esc(t.id)}">Needs review</span>
        <button class="btn ghost" data-revise="${esc(t.id)}" data-label="${esc(t.name)}">Revise</button>
        <button class="btn" data-approve="${esc(t.id)}" data-label="${esc(t.name)}">Approve</button>
      </div>
    </div>
    <div class="serp">
      <div class="serp-top">
        <span class="favicon" role="img" aria-label="Cursor"></span>
        <div>
          <p class="serp-brand">Cursor</p>
          <p class="serp-url">${esc(DISPLAY_URL)}</p>
        </div>
        <span class="sponsored">Sponsored</span>
      </div>
      <p class="serp-headline">${esc(headlineOf(t))}</p>
      <p class="serp-desc">${esc(t.descriptions[0]?.text ?? "")}</p>
      <ul class="sitelinks">${sitelinksHtml}</ul>
    </div>
    <p class="note" data-note="${esc(t.id)}"></p>
  </article>`,
).join("");

const planHtml = PLAN_CARDS.map(
  (p) => `<div class="plan${p.featured ? " featured" : ""}">
      <h3>${esc(p.name)}</h3>
      <p class="price">${esc(p.price)}${p.priceNote ? `<span>${esc(p.priceNote)}</span>` : ""}</p>
      <p class="muted plan-sum">${esc(p.summary)}</p>
      <ul class="feat">${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      <a class="plan-cta${p.featured ? " solid" : ""}" href="${esc(p.ctaUrl)}" target="_blank" rel="noreferrer">${esc(p.cta)}</a>
    </div>`,
).join("");

const teamHtml = TEAM_PLANS.map(
  (p) => `<div class="plan">
      <h3>${esc(p.name)}</h3>
      <p class="muted plan-sum">${esc(p.summary)}</p>
      <a class="plan-cta" href="${esc(p.ctaUrl)}" target="_blank" rel="noreferrer">${esc(p.cta)}</a>
    </div>`,
).join("");

const keywordRows = SEED_KEYWORDS.map(
  (k) => `<tr>
      <td>${esc(k.keyword)}</td>
      <td class="mono">${esc(k.matchType)}</td>
      <td>${esc(TIER_LABELS[k.tier])}</td>
      <td class="mono">${esc(k.volume ?? "—")}</td>
      <td>${esc(k.competition ?? "—")}</td>
    </tr>`,
).join("");

const negativesHtml = NEGATIVE_GROUPS.map(
  (g) => `<div class="neg">
      <p class="neg-name">${esc(g.name)}</p>
      <p class="muted">${g.keywords.map(esc).join(" · ")}</p>
    </div>`,
).join("");

const GROUPS = [
  {
    id: "google",
    name: "Google Search",
    note: "Goes to the ad account.",
    assets: TREATMENTS.map((t) => ({ key: t.id, name: t.name, line: t.queueLine, tab: "ads" })),
  },
  {
    id: "website",
    name: "Website",
    note: "Goes to the site, not to Google Ads.",
    assets: [
      {
        key: "landing",
        name: "Pricing & plans page",
        line: "Shared destination for all four ads",
        tab: "landing",
      },
    ],
  },
  {
    id: "lifecycle",
    name: "Lifecycle",
    note: "Goes to the email tool, not to Google Ads.",
    assets: [
      {
        key: "email",
        name: "Activation email",
        line: "First useful coding task after signup",
        tab: "email",
      },
    ],
  },
];

const REQUIRED = GROUPS.flatMap((g) => g.assets.map((a) => a.key));

const unvalidatedCount = SEED_KEYWORDS.filter((k) => !k.volume).length;

const groupsHtml = GROUPS.map(
  (g) => `<section class="panel">
      <div class="panel-head row">
        <h2 style="font-size:14px">${esc(g.name)}</h2>
        <p class="muted" style="margin:0;font-size:12px">${esc(g.note)}</p>
      </div>
      <ul class="queue">
        ${g.assets
          .map(
            (a) => `<li>
            <div>
              <button class="link plain" data-review="${esc(a.tab)}">${esc(a.name)}</button>
              <p class="muted" style="margin:2px 0 0;font-size:14px">${esc(a.line)} · v<span data-version="${esc(a.key)}">1</span></p>
            </div>
            <div class="row-end">
              <span class="badge" data-badge="${esc(a.key)}">Needs review</span>
              <button class="btn" data-approve="${esc(a.key)}" data-label="${esc(a.name)}">Approve</button>
            </div>
          </li>`,
          )
          .join("")}
      </ul>
    </section>`,
).join("");

const csv = (rows) =>
  rows
    .map((r) => r.map((c) => (/[",\n]/.test(c) ? `"${String(c).replace(/"/g, '""')}"` : c)).join(","))
    .join("\n");

/** Three folders, because these materials go to three different places. */
const exportFiles = {
  "README.txt": [
    `${CAMPAIGN.name} — approved demo export`,
    "",
    "No campaign is created and nothing is published. These are draft materials for review.",
    "",
    "google-search/  Ad and keyword materials. Only these belong in Google Ads.",
    "website/        Landing page copy. Goes to the website, not to Google Ads.",
    "email/          Activation email. Goes to the email tool, not to Google Ads.",
    "",
    unvalidatedCount > 0
      ? `${unvalidatedCount} keyword(s) carry no Keyword Planner data and are marked as such.`
      : "Every keyword carries a Keyword Planner range.",
  ].join("\n"),

  "google-search/responsive-search-ads.csv": csv([
    ["Ad", "Field", "Position", "Text"],
    ...TREATMENTS.flatMap((t) => [
      ...t.headlines.map((h, i) => [t.name, "Headline", String(i + 1), h.text]),
      ...t.descriptions.map((d, i) => [t.name, "Description", String(i + 1), d.text]),
    ]),
  ]),

  "google-search/sitelinks.csv": csv([
    ["Sitelink text", "Description line 1", "Description line 2", "Final URL"],
    ...SITELINKS.map((s) => [s.text, s.line1, s.line2, s.url]),
  ]),

  "google-search/keywords.csv": csv([
    ["Keyword", "Match type", "Tier", "Avg monthly searches", "Competition", "Volume source"],
    ...SEED_KEYWORDS.map((k) => [
      k.keyword,
      k.matchType,
      TIER_LABELS[k.tier],
      k.volume ?? "Not validated",
      k.competition ?? "Not validated",
      k.volume ? PLANNER_SOURCE : "No Planner data",
    ]),
  ]),

  "google-search/campaign-settings.txt": [
    `Campaign: ${CAMPAIGN.name}`,
    `Network: ${CAMPAIGN.network}`,
    `Location: ${CAMPAIGN.geo}`,
    `Language: ${CAMPAIGN.language}`,
    `Goal: ${CAMPAIGN.goal}`,
    `Display URL: ${DISPLAY_URL}`,
    `Final URL: ${AD_CONFIG.finalUrl}`,
    `Volume source: ${PLANNER_SOURCE}`,
  ].join("\n"),

  "website/landing-page-copy.txt": [
    "HERO (default)",
    LANDING_COPY.heroDefault.eyebrow,
    LANDING_COPY.heroDefault.headline,
    LANDING_COPY.heroDefault.subhead,
    "",
    "HERO (alternate)",
    LANDING_COPY.heroAlt.eyebrow,
    LANDING_COPY.heroAlt.headline,
    LANDING_COPY.heroAlt.subhead,
    "",
    ...LANDING_COPY.blocks.flatMap((b) => [b.heading.toUpperCase(), b.body, ""]),
    `Primary CTA: ${LANDING_COPY.ctaPrimary}`,
    `Secondary CTA: ${LANDING_COPY.ctaSecondary}`,
    "",
    "Plan names, prices and feature lines mirror cursor.com/pricing and are not authored here.",
  ].join("\n"),

  "email/activation-email.txt": [
    `Subject: ${EMAIL_COPY.subject}`,
    `Preheader: ${EMAIL_COPY.preheader}`,
    "",
    EMAIL_COPY.bodyIntro,
    "",
    ...EMAIL_COPY.steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    EMAIL_COPY.bodyOutro,
    "",
    `CTA: ${EMAIL_COPY.ctaText} — ${EMAIL_COPY.ctaUrl}`,
  ].join("\n"),
};

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(PRODUCT_NAME)}</title>
<meta name="description" content="A Google Search workspace for Cursor pricing intent: four responsive search ads, one pricing landing page, and one activation email." />
<meta name="theme-color" content="#0d0d0c" />
<style>
  :root {
    --bg: #0d0d0c; --card: #161615; --border: #2a2a28; --fg: #f7f7f4; --muted: #9a9a94;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--bg); color: var(--fg);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .muted { color: var(--muted); }
  .shell { display: flex; min-height: 100vh; }
  aside {
    width: 232px; flex-shrink: 0; border-right: 1px solid var(--border);
    padding: 24px 16px; position: sticky; top: 0; height: 100vh;
  }
  .lockup {
    display: block; height: 20px; width: 84px;
    background: url("${LOCKUP}") left center / contain no-repeat;
  }
  .product { margin-top: 8px; font-size: 13px; color: var(--muted); line-height: 1.3; }
  nav { margin-top: 32px; display: flex; flex-direction: column; gap: 2px; }
  nav button {
    all: unset; cursor: pointer; padding: 9px 12px; border-radius: 8px;
    font-size: 14px; color: var(--muted);
  }
  nav button:hover { background: #1f1f1e; color: var(--fg); }
  nav button[aria-current="page"] { background: #1f1f1e; color: var(--fg); font-weight: 500; }
  .campaign-foot { position: absolute; bottom: 24px; font-size: 12px; color: var(--muted); line-height: 1.5; }
  main { flex: 1; min-width: 0; padding: 44px 40px 80px; max-width: 1360px; }
  h1 { font-size: 28px; letter-spacing: -0.02em; margin: 0; }
  .lede { margin: 8px 0 0; color: var(--muted); font-size: 15px; line-height: 1.7; max-width: 680px; }
  h2 { font-size: 18px; letter-spacing: -0.01em; margin: 0; }
  h3 { font-size: 15px; margin: 0; }
  .tabs { display: flex; gap: 8px; flex-wrap: wrap; margin: 32px 0 0; }
  .tabs button {
    all: unset; cursor: pointer; padding: 10px 20px; border-radius: 999px;
    border: 1px solid var(--border); color: var(--muted); font-size: 14px; font-weight: 500;
  }
  .tabs button[aria-selected="true"] { background: var(--fg); color: #14120b; border-color: var(--fg); }
  .grid { display: grid; gap: 24px; margin-top: 28px; }
  @media (min-width: 1500px) { .grid.ads { grid-template-columns: 1fr 1fr; } }
  .card { border: 1px solid var(--border); background: var(--card); border-radius: 16px; padding: 26px; }
  .card.approved { border-color: rgba(247,247,244,.3); }
  .card-head { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
  .actions { display: flex; align-items: center; gap: 8px; }
  .badge {
    display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 999px;
    background: #1f1f1e; color: var(--muted); font-size: 12px; font-weight: 500; white-space: nowrap;
  }
  .badge.ok { background: var(--fg); color: #14120b; }
  .btn {
    all: unset; cursor: pointer; padding: 7px 16px; border-radius: 999px;
    background: var(--fg); color: #14120b; font-size: 13px; font-weight: 500;
  }
  .btn.ghost { background: transparent; color: var(--muted); }
  .btn.ghost:hover { color: var(--fg); }
  .btn.outline { background: transparent; border: 1px solid var(--border); color: var(--fg); }
  .btn.lg { padding: 11px 22px; font-size: 14px; }
  /* Google renders results on white; the mock keeps Google's palette inside the dark chrome. */
  .serp { background: #fff; color: #202124; border-radius: 12px; padding: 20px; }
  .serp-top { display: flex; align-items: center; gap: 10px; }
  .favicon {
    width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
    border: 1px solid #dadce0;
    background: #fff url("${ICON}") center / 14px 16px no-repeat;
  }
  .serp-brand { margin: 0; font-size: 13px; font-weight: 500; }
  .serp-url { margin: 0; font-size: 13px; color: #4d5156; }
  .sponsored { margin-left: 4px; border: 1px solid #dadce0; border-radius: 4px; padding: 1px 6px; font-size: 11px; font-weight: 500; color: #4d5156; }
  .serp-headline { margin: 12px 0 0; font-size: 20px; line-height: 1.4; color: #1a0dab; }
  .serp-desc { margin: 6px 0 0; font-size: 14px; line-height: 1.55; color: #4d5156; }
  .sitelinks { list-style: none; margin: 18px 0 0; padding: 18px 0 0; border-top: 1px solid #dadce0; display: grid; gap: 16px 32px; }
  @media (min-width: 640px) { .sitelinks { grid-template-columns: 1fr 1fr; } }
  .sitelinks a { color: #1a0dab; font-size: 15px; text-decoration: none; }
  .sitelinks a:hover { text-decoration: underline; }
  .sl-line { margin: 2px 0 0; font-size: 13px; color: #4d5156; }
  .sl-path { margin: 0; font-size: 11px; color: #70757a; font-family: ui-monospace, monospace; }
  .note { margin: 14px 0 0; font-size: 13px; color: var(--muted); }
  .note:empty { display: none; }
  table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  th, td { text-align: left; padding: 12px 16px; font-size: 14px; border-bottom: 1px solid var(--border); }
  th { font-size: 11px; text-transform: uppercase; letter-spacing: .12em; color: var(--muted); font-weight: 500; }
  .plans { display: grid; gap: 16px; margin-top: 28px; }
  @media (min-width: 1000px) { .plans.four { grid-template-columns: repeat(4, 1fr); } .plans.two { grid-template-columns: repeat(2, 1fr); } }
  .plan { border: 1px solid var(--border); background: var(--card); border-radius: 16px; padding: 26px; display: flex; flex-direction: column; }
  .plan.featured { border-color: #4a4a46; }
  .price { font-size: 30px; font-weight: 600; letter-spacing: -0.02em; margin: 18px 0 0; }
  .price span { font-size: 14px; font-weight: 400; color: var(--muted); margin-left: 5px; }
  .plan-sum { margin: 16px 0 0; font-size: 14px; }
  .feat { list-style: none; margin: 14px 0 0; padding: 0; flex: 1; display: grid; gap: 10px; }
  .feat li { font-size: 14px; line-height: 1.5; padding-left: 20px; position: relative; }
  .feat li::before { content: "✓"; position: absolute; left: 0; color: var(--muted); }
  .plan-cta { margin-top: 26px; text-align: center; padding: 12px; border-radius: 999px; border: 1px solid var(--border); color: var(--fg); text-decoration: none; font-size: 14px; font-weight: 500; }
  .plan-cta.solid { background: var(--fg); color: #14120b; border-color: var(--fg); }
  .hero { text-align: center; padding: 48px 0 8px; }
  .hero h2 { font-size: 40px; letter-spacing: -0.03em; line-height: 1.1; }
  .hero p { margin: 18px auto 0; max-width: 620px; color: var(--muted); font-size: 17px; line-height: 1.7; }
  .eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: .16em; color: var(--muted); margin: 0 0 16px; }
  .email { background: #f7f7f4; color: #14120b; border-radius: 16px; padding: 36px; max-width: 620px; }
  .email h3 { font-size: 22px; letter-spacing: -0.02em; }
  .email p { font-size: 15px; line-height: 1.7; }
  .email ol { padding-left: 20px; font-size: 15px; line-height: 1.9; }
  .email .cta { display: inline-block; margin-top: 8px; background: #14120b; color: #f7f7f4; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-size: 14px; font-weight: 500; }
  .queue { list-style: none; margin: 0; padding: 0; }
  .queue li { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 16px 26px; border-bottom: 1px solid var(--border); }
  .q-title { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 500; }
  .chip { border: 1px solid var(--border); border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 500; color: var(--muted); }
  .panel { border: 1px solid var(--border); background: var(--card); border-radius: 16px; margin-top: 28px; }
  .panel-head { padding: 16px 26px; border-bottom: 1px solid var(--border); }
  .panel-foot { padding: 20px 26px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  .dl { display: grid; gap: 20px 40px; margin: 20px 0 0; }
  @media (min-width: 640px) { .dl { grid-template-columns: 1fr 1fr; } }
  .dl dt { font-size: 11px; text-transform: uppercase; letter-spacing: .14em; color: var(--muted); font-family: ui-monospace, monospace; }
  .dl dd { margin: 6px 0 0; font-size: 15px; line-height: 1.7; }
  .bullets { margin: 16px 0 0; padding-left: 20px; }
  .bullets li { font-size: 15px; line-height: 1.7; margin-bottom: 10px; }
  .angle { display: grid; gap: 4px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  @media (min-width: 640px) { .angle { grid-template-columns: 240px 1fr; gap: 24px; } }
  .neg { padding: 14px 0; border-bottom: 1px solid var(--border); }
  .neg-name { margin: 0 0 4px; font-size: 14px; font-weight: 500; }
  .step-row {
    display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
    margin-top: 48px; padding-top: 30px; border-top: 1px solid var(--border);
  }
  .link {
    all: unset; cursor: pointer; font-size: 14px; color: var(--muted);
    text-decoration: underline; text-underline-offset: 4px;
  }
  .link:hover { color: var(--fg); }
  .link.plain { color: var(--fg); font-size: 15px; font-weight: 500; text-decoration: none; }
  .link.plain:hover { text-decoration: underline; }
  .row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .row-end { display: flex; align-items: center; gap: 16px; }
  .row-start { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .btn:disabled { opacity: .45; cursor: not-allowed; }
  .section { display: none; }
  .section.on { display: block; }
  a.src { color: var(--muted); font-size: 14px; }
  #toast {
    position: fixed; left: 50%; bottom: 28px; transform: translateX(-50%);
    background: var(--card); border: 1px solid var(--border); border-radius: 999px;
    padding: 13px 22px; font-size: 14px; display: none; z-index: 50;
  }
  @media (max-width: 900px) {
    .shell { flex-direction: column; }
    aside { position: static; width: auto; height: auto; border-right: 0; border-bottom: 1px solid var(--border); }
    nav { flex-direction: row; flex-wrap: wrap; margin-top: 18px; }
    .campaign-foot { position: static; margin-top: 18px; }
    main { padding: 28px 20px 64px; }
  }
</style>
</head>
<body>
<div class="shell">
  <aside>
    <a href="#research" data-view="research" class="lockup" aria-label="Cursor"></a>
    <p class="product">${esc(PRODUCT_NAME)}</p>
    <nav>
      <button data-view="research" aria-current="page">Research</button>
      <button data-view="keywords">Keywords</button>
      <button data-view="creatives">Creatives</button>
      <button data-view="action">Review &amp; export</button>
    </nav>
    <p class="campaign-foot">${esc(CAMPAIGN.name)}<br />${esc(CAMPAIGN.network)} · ${esc(CAMPAIGN.geo)}</p>
  </aside>

  <main>
    <!-- Research -->
    <section class="section on" id="research">
      <h1>Research</h1>
      <p class="lede">Why this campaign runs on Google Search against pricing intent, and what each ad is for.</p>
      <div class="card" style="margin-top:28px">
        <h2>Decision</h2>
        <dl class="dl">
          ${DECISION.map((d) => `<div><dt>${esc(d.label)}</dt><dd>${esc(d.value)}</dd></div>`).join("")}
        </dl>
      </div>
      <div class="card" style="margin-top:20px">
        <h2>Why Search, why pricing</h2>
        <ul class="bullets">${WHY_SEARCH.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
      </div>
      <div class="card" style="margin-top:20px">
        <h2>Four ad angles</h2>
        <div style="margin-top:12px">
          ${AD_ANGLES.map((a) => `<div class="angle"><p style="margin:0;font-weight:500">${esc(a.name)}</p><p class="muted" style="margin:0">${esc(a.question)}</p></div>`).join("")}
        </div>
      </div>
      <div class="card" style="margin-top:20px">
        <h2>Evidence</h2>
        <div style="margin-top:16px;display:grid;gap:18px">
          ${EVIDENCE.map((e) => `<div><p style="margin:0 0 4px;line-height:1.7">${esc(e.finding)}</p><a class="src" href="${esc(e.url)}" target="_blank" rel="noreferrer">${esc(e.label)}</a></div>`).join("")}
        </div>
      </div>
      <div class="step-row">
        <p class="muted" style="font-size:12px;margin:0">${esc(RESEARCH_CREDIT)}</p>
        <button class="btn lg" data-view="keywords">Review keywords →</button>
      </div>
    </section>

    <!-- Keywords -->
    <section class="section" id="keywords">
      <h1>Keywords</h1>
      <p class="lede">Volumes are the ranges Google reports, kept as ranges.</p>
      <table>
        <thead><tr><th>Keyword</th><th>Match</th><th>Tier</th><th>Avg monthly searches</th><th>Competition</th></tr></thead>
        <tbody>${keywordRows}</tbody>
      </table>
      <p class="muted" style="margin-top:12px;font-size:12px">${esc(PLANNER_SOURCE)}</p>
      <h2 style="margin-top:44px">Negative keywords</h2>
      <div style="margin-top:12px">${negativesHtml}</div>
      <div class="step-row" style="justify-content:flex-end">
        <button class="btn lg" data-view="creatives">Review creatives →</button>
      </div>
    </section>

    <!-- Creatives -->
    <section class="section" id="creatives">
      <h1>Creatives</h1>
      <p class="lede">Four ads, one landing page, one activation email. Every ad points at the same destination.</p>
      <div class="tabs" role="tablist">
        <button data-sub="ads" aria-selected="true">Ads</button>
        <button data-sub="landing" aria-selected="false">Landing page</button>
        <button data-sub="email" aria-selected="false">Email</button>
      </div>

      <div class="sub on" id="sub-ads">
        <div class="grid ads">${adsHtml}</div>
      </div>

      <div class="sub" id="sub-landing" style="display:none">
        <div class="card-head" style="margin-top:28px">
          <div>
            <h2>Landing page</h2>
            <p class="muted" style="margin:4px 0 0;font-size:14px">The single destination for all four ads. Plan names, prices and feature lines mirror the live pricing page.</p>
          </div>
          <div class="actions">
            <span class="badge" data-badge="landing">Needs review</span>
            <button class="btn ghost" data-revise="landing" data-label="Landing page">Revise</button>
            <button class="btn" data-approve="landing" data-label="Landing page">Approve</button>
          </div>
        </div>
        <p class="note" data-note="landing"></p>
        <button class="btn outline" id="alt-hero" style="margin-top:16px">Alt headline</button>
        <div class="hero">
          <p class="eyebrow" id="lp-eyebrow"></p>
          <h2 id="lp-headline"></h2>
          <p id="lp-sub"></p>
        </div>
        <div class="tabs" style="justify-content:center;margin-top:24px">
          <button data-plan="individual" aria-selected="true">Individual</button>
          <button data-plan="teams" aria-selected="false">Teams &amp; Enterprise</button>
        </div>
        <div class="plans four" id="plans-individual">${planHtml}</div>
        <div class="plans two" id="plans-teams" style="display:none">${teamHtml}</div>
        <div style="text-align:center;padding:56px 0 8px">
          <h2>${esc(LANDING_COPY.blocks[0].heading)}</h2>
          <p class="muted" style="margin:14px auto 0;max-width:620px;font-size:16px;line-height:1.8">${esc(LANDING_COPY.blocks[0].body)}</p>
        </div>
      </div>

      <div class="sub" id="sub-email" style="display:none">
        <div class="card-head" style="margin-top:28px">
          <div>
            <h2>Email</h2>
            <p class="muted" style="margin:4px 0 0;font-size:14px">Sent after signup. One task, three steps, one call to action.</p>
          </div>
          <div class="actions">
            <span class="badge" data-badge="email">Needs review</span>
            <button class="btn ghost" data-revise="email" data-label="Activation email">Revise</button>
            <button class="btn" data-approve="email" data-label="Activation email">Approve</button>
          </div>
        </div>
        <p class="note" data-note="email"></p>
        <dl class="dl" style="max-width:620px">
          <div><dt>Subject</dt><dd>${esc(EMAIL_COPY.subject)}</dd></div>
          <div><dt>Preheader</dt><dd>${esc(EMAIL_COPY.preheader)}</dd></div>
        </dl>
        <div class="email" style="margin-top:28px">
          <h3>${esc(EMAIL_COPY.subject)}</h3>
          <p>${esc(EMAIL_COPY.bodyIntro)}</p>
          <ol>${EMAIL_COPY.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
          <p>${esc(EMAIL_COPY.bodyOutro)}</p>
          <a class="cta" href="${esc(EMAIL_COPY.ctaUrl)}" target="_blank" rel="noreferrer">${esc(EMAIL_COPY.ctaText)}</a>
        </div>
      </div>
      <div class="step-row" style="justify-content:flex-end">
        <button class="btn lg" data-view="action">Review &amp; export →</button>
      </div>
    </section>

    <!-- Review & export -->
    <section class="section" id="action">
      <h1>Ready to launch</h1>
      <p style="margin:18px 0 0;font-size:22px;font-weight:500;letter-spacing:-0.02em">${esc(CAMPAIGN.name)}</p>
      <p class="muted" style="margin:6px 0 0;font-size:15px">${esc(CAMPAIGN.network)} · ${esc(CAMPAIGN.geo)} · ${esc(CAMPAIGN.language)}</p>
      <p class="muted" style="margin:16px 0 32px;font-size:14px">Keyword plan: ${SEED_KEYWORDS.length} keywords${unvalidatedCount > 0 ? `, ${unvalidatedCount} without Keyword Planner data` : ", all with a Keyword Planner range"}. ${esc(PLANNER_SOURCE)}.</p>
      ${groupsHtml}
      <div class="card" style="margin-top:28px">
        <div class="row-start">
          <button class="btn lg" id="download" disabled>Download approved package</button>
          <button class="btn outline lg" id="approve-all">Approve all pending</button>
        </div>
        <div id="blockers" style="margin-top:20px"></div>
      </div>
      <p class="muted" style="margin-top:20px;font-size:12px">${esc(CAMPAIGN.name)} · ${esc(CAMPAIGN.network)} · ${esc(CAMPAIGN.geo)}</p>
    </section>
  </main>
</div>

<div id="toast" role="status" aria-live="polite"></div>

<script>
(function () {
  var KEY = "gscl-single/v1";
  var REQUIRED = ${JSON.stringify(REQUIRED)};
  var ASSET_NAMES = ${JSON.stringify(
    Object.fromEntries(GROUPS.flatMap((g) => g.assets.map((a) => [a.key, a.name]))),
  )};
  var FILES = ${JSON.stringify(exportFiles)};
  var HERO = ${JSON.stringify({ def: LANDING_COPY.heroDefault, alt: LANDING_COPY.heroAlt })};

  var state = { versions: {}, approvals: {}, notes: {} };
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved) state = saved;
  } catch (e) {}

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  var toastTimer;
  function toast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.style.display = "block";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.style.display = "none"; }, 4000);
  }

  function version(k) { return state.versions[k] || 1; }

  function status(k) {
    if (state.notes[k]) return "revise";
    if (state.approvals[k] == null) return "review";
    return state.approvals[k] === version(k) ? "approved" : "stale";
  }

  function pending() {
    return REQUIRED.filter(function (k) { return status(k) !== "approved"; });
  }

  function render() {
    document.querySelectorAll("[data-badge]").forEach(function (el) {
      var k = el.getAttribute("data-badge");
      var st = status(k);
      el.textContent = st === "approved" ? "Approved" : "Needs review";
      el.className = "badge" + (st === "approved" ? " ok" : "");
    });
    document.querySelectorAll("[data-approve]").forEach(function (el) {
      el.textContent = status(el.getAttribute("data-approve")) === "approved" ? "Approved" : "Approve";
    });
    document.querySelectorAll("[data-version]").forEach(function (el) {
      el.textContent = String(version(el.getAttribute("data-version")));
    });
    document.querySelectorAll("[data-note]").forEach(function (el) {
      el.textContent = state.notes[el.getAttribute("data-note")] || "";
    });
    document.querySelectorAll(".card[data-asset]").forEach(function (el) {
      el.classList.toggle("approved", status(el.getAttribute("data-asset")) === "approved");
    });

    var blocked = pending();
    document.getElementById("download").disabled = blocked.length > 0;
    document.getElementById("approve-all").style.display = blocked.length > 0 ? "" : "none";

    var box = document.getElementById("blockers");
    if (blocked.length === 0) {
      box.innerHTML =
        '<p class="muted" style="margin:0;font-size:14px">Every asset is approved at its current version. ' +
        'The package separates ad materials from website and email materials.</p>';
    } else {
      var lines = blocked.map(function (k) {
        var why =
          status(k) === "stale"
            ? "approved at an earlier version, edited since, and now at v" + version(k)
            : status(k) === "revise"
              ? "sent back: " + state.notes[k]
              : "has not been reviewed yet";
        return '<li class="muted" style="font-size:14px;margin-bottom:6px">' +
          '<span style="color:var(--fg)">' + ASSET_NAMES[k] + "</span> — " + why + "</li>";
      });
      box.innerHTML =
        '<p style="margin:0 0 8px;font-size:14px">' +
        (blocked.length === 1 ? "One asset is not ready:" : blocked.length + " assets are not ready:") +
        '</p><ul style="margin:0;padding-left:18px">' + lines.join("") + "</ul>";
    }
  }

  function showView(view) {
    document.querySelectorAll(".section").forEach(function (sec) {
      sec.classList.toggle("on", sec.id === view);
    });
    document.querySelectorAll("nav [data-view]").forEach(function (b) {
      if (b.getAttribute("data-view") === view) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
  }

  function showSub(sub) {
    ["ads", "landing", "email"].forEach(function (id) {
      document.getElementById("sub-" + id).style.display = id === sub ? "block" : "none";
    });
    document.querySelectorAll("[data-sub]").forEach(function (b) {
      b.setAttribute("aria-selected", String(b.getAttribute("data-sub") === sub));
    });
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-approve], [data-revise], [data-view], [data-sub], [data-plan]");
    if (!t) return;

    if (t.hasAttribute("data-approve")) {
      var k = t.getAttribute("data-approve");
      var label = t.getAttribute("data-label");
      if (status(k) === "approved") {
        delete state.approvals[k];
        save(); render();
        toast(label + " approval removed.");
      } else {
        state.approvals[k] = version(k);
        delete state.notes[k];
        save(); render();
        toast("Approved for demo export. No campaign is created and nothing is published.");
      }
      return;
    }

    if (t.hasAttribute("data-revise")) {
      var rk = t.getAttribute("data-revise");
      var rlabel = t.getAttribute("data-label");
      var note = window.prompt("What needs to change?");
      if (!note) return;
      state.notes[rk] = note;
      delete state.approvals[rk];
      save(); render();
      toast(rlabel + " sent back for revision.");
      return;
    }

    if (t.hasAttribute("data-view")) {
      e.preventDefault();
      showView(t.getAttribute("data-view"));
      return;
    }

    if (t.hasAttribute("data-sub")) {
      showSub(t.getAttribute("data-sub"));
      return;
    }

    if (t.hasAttribute("data-review")) {
      showView("creatives");
      showSub(t.getAttribute("data-review"));
      return;
    }

    if (t.hasAttribute("data-plan")) {
      var plan = t.getAttribute("data-plan");
      document.getElementById("plans-individual").style.display = plan === "individual" ? "grid" : "none";
      document.getElementById("plans-teams").style.display = plan === "teams" ? "grid" : "none";
      document.querySelectorAll("[data-plan]").forEach(function (b) {
        b.setAttribute("aria-selected", String(b.getAttribute("data-plan") === plan));
      });
    }
  });

  var alt = false;
  function paintHero() {
    var h = alt ? HERO.alt : HERO.def;
    document.getElementById("lp-eyebrow").textContent = h.eyebrow;
    document.getElementById("lp-headline").textContent = h.headline;
    document.getElementById("lp-sub").textContent = h.subhead;
  }
  document.getElementById("alt-hero").addEventListener("click", function () {
    alt = !alt;
    paintHero();
  });

  document.getElementById("approve-all").addEventListener("click", function () {
    var n = pending().length;
    if (n === 0) { toast("Everything is already approved."); return; }
    REQUIRED.forEach(function (k) { state.approvals[k] = version(k); });
    state.notes = {};
    save(); render();
    toast("Approved for demo export. No campaign is created and nothing is published.");
  });

  /**
   * A minimal store-only ZIP writer. The file has no dependencies, so the archive is assembled by
   * hand: no compression, just headers around the raw bytes, which every unzip tool accepts.
   */
  function crcTable() {
    var t = [];
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  }
  var CRC = crcTable();

  function crc32(bytes) {
    var c = 0xffffffff;
    for (var i = 0; i < bytes.length; i++) c = CRC[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  function zip(files) {
    var enc = new TextEncoder();
    var chunks = [];
    var central = [];
    var offset = 0;

    function u32(v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
    function u16(v) { return [v & 255, (v >>> 8) & 255]; }

    Object.keys(files).forEach(function (name) {
      var nameBytes = enc.encode(name);
      var data = enc.encode(files[name]);
      var sum = crc32(data);

      var local = [].concat(
        u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(sum), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0)
      );
      chunks.push(new Uint8Array(local), nameBytes, data);

      central.push([].concat(
        u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(sum), u32(data.length), u32(data.length),
        u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset)
      ));
      central.push(nameBytes);

      offset += local.length + nameBytes.length + data.length;
    });

    var centralStart = offset;
    var centralSize = 0;
    central.forEach(function (c) {
      var arr = c instanceof Uint8Array ? c : new Uint8Array(c);
      chunks.push(arr);
      centralSize += arr.length;
    });

    var count = Object.keys(files).length;
    chunks.push(new Uint8Array([].concat(
      u32(0x06054b50), u16(0), u16(0), u16(count), u16(count),
      u32(centralSize), u32(centralStart), u16(0)
    )));

    return new Blob(chunks, { type: "application/zip" });
  }

  document.getElementById("download").addEventListener("click", function () {
    if (pending().length > 0) return;
    try {
      var d = new Date();
      var stamp = "" + d.getFullYear() +
        String(d.getMonth() + 1).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0");
      var url = URL.createObjectURL(zip(FILES));
      var a = document.createElement("a");
      a.href = url;
      a.download = "cursor-pricing-search-" + stamp + ".zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast("Approved for demo export. No campaign is created and nothing is published.");
    } catch (e) {
      toast("The package could not be built. Nothing was downloaded.");
    }
  });

  paintHero();
  render();
})();
</script>
</body>
</html>
`;

// A broken inline script fails silently in the browser: the page still renders, it just never
// hydrates. Parsing it here turns that into a build failure instead.
const script = html.slice(html.indexOf("<script>") + 8, html.lastIndexOf("</script>"));
try {
  new Function(script);
} catch (error) {
  console.error(`The generated inline script does not parse: ${error.message}`);
  process.exit(1);
}

writeFileSync("index.html", html);
console.log(`index.html written — ${(html.length / 1024).toFixed(0)} KB, no dependencies`);
