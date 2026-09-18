import JSZip from "jszip";
import { emailHtml } from "./email-html";
import { AD_CONFIG, CAMPAIGN, PLANNER_SOURCE, SITELINKS, TIER_LABELS } from "./seed";
import type { LabState } from "./store";
import { versionOf } from "./store";

const DISPLAY_URL = `${AD_CONFIG.displayUrl}/${AD_CONFIG.displayPath.join("/")}`;

function csv(rows: string[][]): string {
  return rows
    .map((row) =>
      row.map((cell) => (/[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell)).join(","),
    )
    .join("\n");
}

/**
 * Three folders, because these materials go to three different places. Only the google-search
 * folder is anything Google Ads would accept; the other two are for the website and the email tool.
 */
export async function buildPackage(state: LabState): Promise<Blob> {
  const zip = new JSZip();

  const google = zip.folder("google-search")!;
  const website = zip.folder("website")!;
  const email = zip.folder("email")!;

  google.file(
    "responsive-search-ads.csv",
    csv([
      ["Ad", "Version", "Field", "Position", "Text"],
      ...state.treatments.flatMap((t) => [
        ...t.headlines.map((h, i) => [
          t.name,
          String(versionOf(state, t.id)),
          "Headline",
          String(i + 1),
          h.text,
        ]),
        ...t.descriptions.map((d, i) => [
          t.name,
          String(versionOf(state, t.id)),
          "Description",
          String(i + 1),
          d.text,
        ]),
      ]),
    ]),
  );

  google.file(
    "sitelinks.csv",
    csv([
      ["Sitelink text", "Description line 1", "Description line 2", "Final URL"],
      ...SITELINKS.map((s) => [s.text, s.line1, s.line2, s.url]),
    ]),
  );

  const unvalidated = state.keywords.filter((k) => !k.volume).length;
  google.file(
    "keywords.csv",
    csv([
      ["Keyword", "Match type", "Tier", "Avg monthly searches", "Competition", "Volume source"],
      ...state.keywords.map((k) => [
        k.keyword,
        k.matchType,
        TIER_LABELS[k.tier],
        k.volume ?? "Not validated",
        k.competition ?? "Not validated",
        k.volume ? PLANNER_SOURCE : "Added in this session — no Planner data",
      ]),
    ]),
  );

  google.file(
    "campaign-settings.txt",
    [
      `Campaign: ${CAMPAIGN.name}`,
      `Network: ${CAMPAIGN.network}`,
      `Location: ${CAMPAIGN.geo}`,
      `Language: ${CAMPAIGN.language}`,
      `Goal: ${CAMPAIGN.goal}`,
      `Display URL: ${DISPLAY_URL}`,
      `Final URL: ${AD_CONFIG.finalUrl}`,
      "",
      `Keywords: ${state.keywords.length} (${unvalidated} without Planner validation)`,
      `Volume source: ${PLANNER_SOURCE}`,
    ].join("\n"),
  );

  website.file(
    "landing-page-copy.txt",
    [
      "HERO (default)",
      state.landing.heroDefault.eyebrow,
      state.landing.heroDefault.headline,
      state.landing.heroDefault.subhead,
      "",
      "HERO (alternate)",
      state.landing.heroAlt.eyebrow,
      state.landing.heroAlt.headline,
      state.landing.heroAlt.subhead,
      "",
      ...state.landing.blocks.flatMap((b) => [b.heading.toUpperCase(), b.body, ""]),
      `Primary CTA: ${state.landing.ctaPrimary}`,
      `Secondary CTA: ${state.landing.ctaSecondary}`,
      "",
      "Plan names, prices and feature lines mirror cursor.com/pricing and are not authored here.",
    ].join("\n"),
  );

  email.file("activation-email.html", emailHtml(state.email));
  email.file(
    "activation-email.txt",
    [
      `Subject: ${state.email.subject}`,
      `Preheader: ${state.email.preheader}`,
      "",
      state.email.bodyIntro,
      "",
      ...state.email.steps.map((s, i) => `${i + 1}. ${s}`),
      "",
      state.email.bodyOutro,
      "",
      `CTA: ${state.email.ctaText} — ${state.email.ctaUrl}`,
    ].join("\n"),
  );

  zip.file(
    "README.txt",
    [
      `${CAMPAIGN.name} — approved demo export`,
      "",
      "No campaign is created and nothing is published. These are draft materials for review.",
      "",
      "google-search/  Ad and keyword materials. Only these belong in Google Ads.",
      "website/        Landing page copy. Goes to the website, not to Google Ads.",
      "email/          Activation email. Goes to the email tool, not to Google Ads.",
      "",
      "Approved versions:",
      ...state.treatments.map((t) => `  ${t.name} — v${versionOf(state, t.id)}`),
      `  Landing page — v${versionOf(state, "landing")}`,
      `  Activation email — v${versionOf(state, "email")}`,
      "",
      unvalidated > 0
        ? `${unvalidated} keyword${unvalidated === 1 ? "" : "s"} added in this session carry no Keyword Planner data and are marked as such in keywords.csv.`
        : "Every keyword carries a Keyword Planner range.",
    ].join("\n"),
  );

  return zip.generateAsync({ type: "blob" });
}

export function packageFileName(): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `cursor-pricing-search-${stamp}.zip`;
}
