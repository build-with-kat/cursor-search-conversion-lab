import type {
  EmailCopy,
  KeywordRow,
  LandingCopy,
  NegativeGroup,
  PlanCard,
  Sitelink,
  Treatment,
} from "./types";

export const GOOGLE_SPECS = {
  rsa: {
    headlineMax: 30,
    descriptionMax: 90,
    headlineMinCount: 3,
    headlineMaxCount: 15,
    descriptionMinCount: 2,
    descriptionMaxCount: 4,
  },
  sitelink: { textMax: 25, lineMax: 35 },
} as const;

export const PRODUCT_NAME = "Google Search Conversion Lab";

export const CAMPAIGN = {
  name: "Cursor — Pricing & plans",
  network: "Google Search",
  geo: "United States",
  language: "English",
  goal: "Activated new account",
  goalNote: "Proposed — activation means a first useful coding task, pending product sign-off.",
  budgetNote: "Set in the ad account at launch.",
} as const;

export const VERIFIED_DESTINATIONS = [
  "https://cursor.com/",
  "https://cursor.com/pricing",
  "https://cursor.com/download",
  "https://cursor.com/docs",
  "https://cursor.com/docs/models-and-pricing",
  "https://cursor.com/enterprise",
] as const;

export const AD_CONFIG = {
  displayUrl: "cursor.com",
  displayPath: ["plans", "compare"],
  finalUrl: "https://cursor.com/pricing",
} as const;

/** One shared set, shown on every ad. All four answer a pricing-intent question. */
export const SITELINKS: Sitelink[] = [
  {
    id: "sl-1",
    text: "What Changes By Plan",
    line1: "Hobby, Pro, Pro+ and Ultra",
    line2: "Side by side",
    path: "cursor.com/pricing",
    url: "https://cursor.com/pricing",
  },
  {
    id: "sl-2",
    text: "How Included Usage Works",
    line1: "What your plan covers",
    line2: "Before anything is metered",
    path: "cursor.com/docs",
    url: "https://cursor.com/docs/models-and-pricing",
  },
  {
    id: "sl-3",
    text: "On-Demand Billing",
    line1: "Where extra charges start",
    line2: "And what they cost",
    path: "cursor.com/docs",
    url: "https://cursor.com/docs/models-and-pricing",
  },
  {
    id: "sl-4",
    text: "Pro, Pro+ And Ultra",
    line1: "Which tier fits your work",
    line2: "Compare included usage",
    path: "cursor.com/pricing",
    url: "https://cursor.com/pricing",
  },
];

/**
 * Four responsive search ads against one intent cluster. Cost-intent queries ("is cursor free",
 * "how much does cursor cost") are answered by the Free-first ad rather than a fifth variant.
 */
export const TREATMENTS: Treatment[] = [
  {
    id: "ad-plan-delta",
    name: "What changes between plans",
    queueLine: "Search ad · plan comparison angle",
    why: "Answers the comparison question directly: what changes as you move up a tier.",
    pinnedHeadlineId: "a-h1",
    headlines: [
      { id: "a-h1", text: "See What Changes By Plan" },
      { id: "a-h2", text: "Cursor Pricing And Plans" },
      { id: "a-h3", text: "What Each Plan Includes" },
      { id: "a-h4", text: "Hobby, Pro, Pro+ Or Ultra" },
      { id: "a-h5", text: "Compare Cursor Plans" },
      { id: "a-h6", text: "Know Before You Pay" },
      { id: "a-h7", text: "Frontier Models On Paid Plans" },
    ],
    descriptions: [
      { id: "a-d1", text: "Hobby is free with Agent and Composer. See what paid Individual plans add." },
      { id: "a-d2", text: "Pro, Pro+ and Ultra differ by how much included model usage you get." },
      { id: "a-d3", text: "Compare every plan before you enter a card. No guessing at the delta." },
    ],
  },
  {
    id: "ad-free-first",
    name: "Start free, upgrade when ready",
    queueLine: "Search ad · free-to-paid angle",
    why: "Takes the cost-intent queries head-on: yes, there is a free plan — start there.",
    pinnedHeadlineId: "b-h1",
    headlines: [
      { id: "b-h1", text: "Start Cursor Free On Hobby" },
      { id: "b-h2", text: "Is Cursor Free? Yes, To Start" },
      { id: "b-h3", text: "Upgrade When You Know Why" },
      { id: "b-h4", text: "Try Cursor Before Paying" },
      { id: "b-h5", text: "Start Free, Then Decide" },
      { id: "b-h6", text: "The Free Plan, Explained" },
    ],
    descriptions: [
      { id: "b-d1", text: "Start on the free Hobby plan. Upgrade when you know which limit you hit." },
      { id: "b-d2", text: "Agent and Composer are included free. Paid plans raise the limits." },
      { id: "b-d3", text: "See what the free plan covers before you compare the paid tiers." },
    ],
  },
  {
    id: "ad-usage",
    name: "Included usage vs on-demand",
    queueLine: "Search ad · when billing starts",
    why: "Names the moment buyers are actually worried about — when billing starts.",
    pinnedHeadlineId: "c-h1",
    headlines: [
      { id: "c-h1", text: "Where Extra Charges Start" },
      { id: "c-h2", text: "Included Usage Explained" },
      { id: "c-h3", text: "How On-Demand Billing Works" },
      { id: "c-h4", text: "What Your Plan Covers" },
      { id: "c-h5", text: "Usage Limits In Plain Terms" },
      { id: "c-h6", text: "Track Usage As You Go" },
    ],
    descriptions: [
      { id: "c-d1", text: "Included usage comes with your plan. On-demand after that is billed at API rates." },
      { id: "c-d2", text: "Every plan includes model usage. Your dashboard shows where you stand." },
      { id: "c-d3", text: "Know what is included and what is metered before you pick a plan." },
    ],
  },
  {
    id: "ad-tier-fit",
    name: "Which plan fits whom",
    queueLine: "Search ad · tier recommendation",
    why: "For searchers already past the free question and choosing between paid tiers.",
    pinnedHeadlineId: "d-h1",
    headlines: [
      { id: "d-h1", text: "Pro, Pro+ Or Ultra?" },
      { id: "d-h2", text: "Which Cursor Tier Fits" },
      { id: "d-h3", text: "Pro+ For Daily Agent Work" },
      { id: "d-h4", text: "Ultra For Power Users" },
      { id: "d-h5", text: "Compare Individual Plans" },
      { id: "d-h6", text: "Pick Your Usage Level" },
    ],
    descriptions: [
      { id: "d-d1", text: "Cursor recommends Pro+ for daily agent work and Ultra for power users." },
      { id: "d-d2", text: "The Individual tiers differ by included usage, not by which features you get." },
      { id: "d-d3", text: "See how much model usage each paid tier includes before you choose." },
    ],
  },
];

export const PLANNER_SOURCE = "Google Keyword Planner · US · Sep 2025–Aug 2026";

export const TIER_LABELS: Record<1 | 2 | 3, string> = {
  1: "Spine",
  2: "Supporting",
  3: "Low volume — message support",
};

export const SEED_KEYWORDS: KeywordRow[] = [
  { id: "kw-1", keyword: "cursor pricing", matchType: "exact", tier: 1, volume: "10k–100k", competition: "Low" },
  { id: "kw-2", keyword: "is cursor free", matchType: "exact", tier: 1, volume: "1k–10k", competition: "Low" },
  { id: "kw-3", keyword: "cursor plans", matchType: "exact", tier: 1, volume: "1k–10k", competition: "Medium" },
  { id: "kw-4", keyword: "cursor pro", matchType: "phrase", tier: 1, volume: "1k–10k", competition: "Medium" },
  { id: "kw-5", keyword: "cursor ai pricing", matchType: "phrase", tier: 1, volume: "1k–10k", competition: "Low" },
  { id: "kw-6", keyword: "cursor subscription", matchType: "phrase", tier: 1, volume: "1k–10k", competition: "Medium" },
  { id: "kw-7", keyword: "cursor ultra", matchType: "phrase", tier: 1, volume: "1k–10k", competition: "Low" },

  { id: "kw-8", keyword: "cursor pricing plans", matchType: "phrase", tier: 2, volume: "100–1k", competition: "Low" },
  { id: "kw-9", keyword: "how much does cursor cost", matchType: "phrase", tier: 2, volume: "100–1k", competition: "Low" },
  { id: "kw-10", keyword: "cursor free plan limits", matchType: "phrase", tier: 2, volume: "100–1k", competition: "Low" },
  { id: "kw-11", keyword: "cursor pro limits", matchType: "phrase", tier: 2, volume: "100–1k", competition: "Low" },
  { id: "kw-12", keyword: "cursor usage limits", matchType: "phrase", tier: 2, volume: "100–1k", competition: "Low" },
  { id: "kw-13", keyword: "cursor pro+", matchType: "phrase", tier: 2, volume: "100–1k", competition: "Low" },

  { id: "kw-14", keyword: "cursor hobby", matchType: "exact", tier: 3, volume: "10–100", competition: "Medium" },
  { id: "kw-15", keyword: "cursor included usage", matchType: "exact", tier: 3, volume: "10–100", competition: "Low" },
  { id: "kw-16", keyword: "cursor on demand", matchType: "exact", tier: 3, volume: "10–100", competition: "Low" },
];

/** Offered by the mock "Generate more keywords" action. Nothing here has Planner data yet. */
export const SUGGESTED_KEYWORDS = [
  "cursor cost per month",
  "cursor plan comparison",
  "cursor free vs paid",
  "what is included in cursor pro",
  "cursor usage based pricing",
  "do i need cursor pro",
];

export const NEGATIVE_GROUPS: NegativeGroup[] = [
  {
    id: "n1",
    name: "Not our cursor",
    keywords: ["mouse cursor", "custom cursor", "cursor css", "database cursor", "cursor pagination"],
  },
  {
    id: "n2",
    name: "Already a customer",
    keywords: ["cursor login", "cursor sign in", "cursor refund", "cancel cursor subscription"],
  },
  {
    id: "n3",
    name: "Reference lookups",
    keywords: ["cursor api docs", "cursor changelog", "cursor keyboard shortcuts", "cursor release notes"],
  },
  {
    id: "n4",
    name: "Not buying",
    keywords: ["cursor jobs", "cursor careers", "cursor crack", "cursor free license", "cursor coupon code"],
  },
];

/**
 * Mirrors the Individual tab of cursor.com/pricing as fetched on build. Names, prices and feature
 * lines are copied from that page rather than paraphrased, so nothing here is invented.
 */
export const PLAN_CARDS: PlanCard[] = [
  {
    id: "hobby",
    name: "Hobby",
    price: "Free",
    summary: "Includes:",
    features: ["No credit card required", "Limited Agent requests", "Access to Composer"],
    cta: "Start free",
    ctaUrl: "https://cursor.com/download",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$20",
    priceNote: "/ mo.",
    summary: "Everything in Hobby, plus:",
    features: [
      "Extended limits on Agent",
      "Access to frontier models",
      "MCPs, skills, and hooks",
      "Cloud agents",
      "Bugbot on usage-based billing",
    ],
    cta: "View plans",
    ctaUrl: "https://cursor.com/pricing",
  },
  {
    id: "pro-plus",
    name: "Pro+",
    price: "$60",
    priceNote: "/ mo.",
    summary: "Everything in Pro, plus:",
    features: [
      "3x Pro limits on Agent",
      "Access to frontier models",
      "MCPs, skills, and hooks",
      "Cloud agents",
    ],
    cta: "View plans",
    ctaUrl: "https://cursor.com/pricing",
    featured: true,
  },
  {
    id: "ultra",
    name: "Ultra",
    price: "$200",
    priceNote: "/ mo.",
    summary: "Everything in Pro, plus:",
    features: [
      "20x Pro limits on Agent",
      "Access to frontier models",
      "Cloud agents",
      "Priority access to new features",
    ],
    cta: "View plans",
    ctaUrl: "https://cursor.com/pricing",
  },
];

/** The second state of the billing toggle. Prices are not published on the Individual tab. */
export const TEAM_PLANS = [
  {
    id: "teams",
    name: "Teams",
    summary: "For professionals collaborating with others.",
    cta: "See Teams pricing",
    ctaUrl: "https://cursor.com/pricing",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    summary: "For organizations needing invoicing, pooled usage, or advanced security.",
    cta: "Contact sales",
    ctaUrl: "https://cursor.com/enterprise",
  },
] as const;

export const LANDING_COPY: LandingCopy = {
  heroDefault: {
    eyebrow: "Pricing",
    headline: "Start free. Upgrade when you hit a limit.",
    subhead:
      "Hobby needs no credit card. Paid plans extend your Agent limits and open up frontier models.",
  },
  heroAlt: {
    eyebrow: "Pricing",
    headline: "See what changes before you upgrade",
    subhead:
      "Pro, Pro+ and Ultra differ by how much Agent usage you get — 3x and 20x the Pro limits.",
  },
  blocks: [
    {
      id: "usage",
      heading: "How usage-based pricing works",
      body: "Every plan includes a set amount of model usage. On-demand usage lets you keep using models after your included amount is consumed, billed in arrears.",
    },
  ],
  ctaPrimary: "Start free",
  ctaSecondary: "View plans",
};

export const EMAIL_COPY: EmailCopy = {
  subject: "Ship one real change with Cursor",
  preheader: "Pick something small from your backlog and let Agent do it.",
  bodyIntro:
    "You installed Cursor. The fastest way to know whether it fits is to give it one real task — not a toy file.",
  steps: [
    "Open a repository you already know well.",
    "Pick a change you have been putting off: a rename, a flaky test, a missing edge case.",
    "Describe it to Agent in one sentence and review the diff it proposes.",
  ],
  bodyOutro:
    "Most of the decision happens in that first diff. If it holds up on code you know, it will hold up on the rest.",
  ctaText: "Open Cursor",
  ctaUrl: "https://cursor.com/download",
};

export const DECISION = [
  { label: "ICP", value: "Individual professional developers." },
  { label: "Channel", value: "Google Search." },
  { label: "Wedge", value: "Pricing and plans intent." },
  {
    label: "Primary metric",
    value: "Cost per activated signup — activation means a first useful coding task. Proposed.",
  },
] as const;

export const WHY_SEARCH = [
  "Plan and pricing queries carry commercial intent: the searcher is already choosing, not discovering.",
  "The ad and the destination answer the same question, so the click has somewhere honest to land.",
  "Search spend and signups are measurable in the ad account without assuming a presence on any other channel.",
] as const;

export const AD_ANGLES = [
  { name: "What changes between plans", question: "What actually changes if I move up a tier?" },
  { name: "Start free, upgrade when ready", question: "Is it free, and when does paying start to make sense?" },
  { name: "Included usage vs on-demand", question: "When does billing start?" },
  { name: "Which plan fits whom", question: "Which plan is meant for someone like me?" },
] as const;

export const RESEARCH_CREDIT = "Research compiled with Grok Bot";

export const EVIDENCE = [
  {
    finding:
      "Buyers comparing Pro, Pro+ and Ultra read the same phrasing on every tier and ask what the upgrade actually buys them.",
    label: "Cursor forum",
    url: "https://forum.cursor.com/t/question-about-first-party-models-pool-limits-between-pro-pro-plus-and-ultra-plans/166360",
  },
  {
    finding:
      "Without a clear delta, buyers stall. One runs several Pro accounts side by side rather than move to a tier he cannot size.",
    label: "Cursor forum",
    url: "https://forum.cursor.com/t/auto-composer-is-there-a-difference-in-those-plan-pro-vs-pro-vs-ultra/156411",
  },
  {
    finding:
      "Live Search ads on these queries lead with price and speed. None of them explain what usage a plan includes.",
    label: "Google Ads Transparency Center",
    url: "https://adstransparency.google.com/advertiser/AR14589023080010481665?region=US",
  },
  {
    finding:
      "Plan names, prices and the included-versus-on-demand explanation are taken from the live pricing page rather than restated.",
    label: "cursor.com/pricing",
    url: "https://cursor.com/pricing",
  },
] as const;


/** Demo ad account. No Google API is contacted; this only labels the shell campaign. */
export const AD_ACCOUNT = {
  name: "Cursor Brand — US",
  id: "123-456-7890",
} as const;

export const SHELL = {
  adGroupName: "AG | Pricing intent",
  status: "Paused / Ready for review",
} as const;

/** SEM | US | Brand+Pricing | YYYYMM */
export function shellCampaignName(date = new Date()): string {
  const yyyymm = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
  return `SEM | US | Brand+Pricing | ${yyyymm}`;
}
