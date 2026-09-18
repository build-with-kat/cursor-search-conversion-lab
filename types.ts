export type MatchType = "exact" | "phrase" | "broad";

/** 1 — core demand. 2 — supporting. 3 — low volume, carried for message coverage. */
export type KeywordTier = 1 | 2 | 3;

export interface KeywordRow {
  id: string;
  keyword: string;
  matchType: MatchType;
  tier: KeywordTier;
  /** Google's own range, verbatim. Null for keywords added in the tool. */
  volume: string | null;
  competition: "Low" | "Medium" | "High" | null;
}

export interface NegativeGroup {
  id: string;
  name: string;
  keywords: string[];
}

export interface AdAsset {
  id: string;
  text: string;
}

export interface Treatment {
  id: string;
  name: string;
  /** Plain-English description of the asset, shown in the push queue. */
  queueLine: string;
  /** One sentence of rationale, shown under the ad name in the default view. */
  why: string;
  pinnedHeadlineId: string;
  headlines: AdAsset[];
  descriptions: AdAsset[];
}

export interface Sitelink {
  id: string;
  text: string;
  line1: string;
  line2: string;
  path: string;
  url: string;
}

export interface Insight {
  id: string;
  finding: string;
  soWhat: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface PlanCard {
  id: string;
  name: string;
  price: string;
  priceNote?: string;
  summary: string;
  features: string[];
  cta: string;
  ctaUrl: string;
  featured?: boolean;
}

export interface LandingHero {
  eyebrow: string;
  headline: string;
  subhead: string;
}

export interface LandingBlock {
  id: string;
  heading: string;
  body: string;
}

export interface LandingCopy {
  heroDefault: LandingHero;
  heroAlt: LandingHero;
  blocks: LandingBlock[];
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface EmailCopy {
  subject: string;
  preheader: string;
  bodyIntro: string;
  steps: string[];
  bodyOutro: string;
  ctaText: string;
  ctaUrl: string;
}

/** Keys used by the approval map and the push gate. */
export type ApprovalKey = string;

export interface TasteEntry {
  id: string;
  assetKey: string;
  assetLabel: string;
  /** Why it was sent back. This is the memory a rewrite would be given. */
  note: string;
  at: string;
}

export interface ShellCampaign {
  accountName: string;
  accountId: string;
  campaignName: string;
  adGroupName: string;
  status: string;
  at: string;
  keywordCount: number;
  adCount: number;
  sitelinkCount: number;
}
