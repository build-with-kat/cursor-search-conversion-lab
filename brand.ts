/**
 * Brand source of truth for this demo.
 *
 * content/cursor-brand.md governs authored UI and copy and outranks any design observation in the
 * research notes. The marks below are the official files supplied with that document; nothing here
 * is redrawn, recoloured or reconstructed. Where the brand kit has a variant this project was not
 * given, BRAND_GAPS records the omission instead of a substitute mark being invented.
 */

export type BrandTone = "dark" | "light" | "dimensional";

export interface BrandAsset {
  file: string;
  /** Public path under /brand. */
  src: string;
  form: "horizontal lockup" | "app icon" | "wordmark";
  dimension: "2D" | "2.5D";
  tone: BrandTone;
  /** The background this variant is drawn for. Drives both the contrast rule and every swatch. */
  forBackground: "light" | "dark" | "either";
  width: number;
  height: number;
  /** Which background this variant is for, per the contrast rule in cursor-brand.md. */
  placement: string;
  usedIn: string;
}

export const BRAND_SOURCE = {
  document: "content/cursor-brand.md",
  officialPage: "https://cursor.com/brand",
  fetchedOn: "2026-09-18",
} as const;

export const BRAND_ASSETS: BrandAsset[] = [
  {
    file: "cursor-lockup-horizontal-dark.png",
    src: "/brand/cursor-lockup-horizontal-dark.png",
    form: "horizontal lockup",
    dimension: "2D",
    tone: "dark",
    forBackground: "light",
    width: 2000,
    height: 476,
    placement: "Light backgrounds",
    usedIn: "Review board header, landing page header, email header, export cover",
  },
  {
    file: "cursor-lockup-horizontal-light.png",
    src: "/brand/cursor-lockup-horizontal-light.png",
    form: "horizontal lockup",
    dimension: "2D",
    tone: "light",
    forBackground: "dark",
    width: 2000,
    height: 476,
    placement: "Dark backgrounds",
    usedIn: "Landing page footer",
  },
  {
    file: "cursor-lockup-horizontal-2-5d-dark.png",
    src: "/brand/cursor-lockup-horizontal-2-5d-dark.png",
    form: "horizontal lockup",
    dimension: "2.5D",
    tone: "dimensional",
    forBackground: "light",
    width: 2000,
    height: 476,
    placement: "Light backgrounds, larger applications",
    usedIn: "Not used — 2D is the documented default at these sizes",
  },
  {
    file: "cursor-lockup-horizontal-2-5d-light.png",
    src: "/brand/cursor-lockup-horizontal-2-5d-light.png",
    form: "horizontal lockup",
    dimension: "2.5D",
    tone: "dimensional",
    forBackground: "dark",
    width: 2000,
    height: 476,
    placement: "Dark backgrounds, larger applications",
    usedIn: "Not used — 2D is the documented default at these sizes",
  },
  {
    file: "cursor-icon-dark.png",
    src: "/brand/cursor-icon-dark.png",
    form: "app icon",
    dimension: "2D",
    tone: "dark",
    forBackground: "light",
    width: 1401,
    height: 1597,
    placement: "Light backgrounds",
    usedIn: "Ad preview favicon slot, browser tab icon",
  },
  {
    file: "cursor-icon-light.png",
    src: "/brand/cursor-icon-light.png",
    form: "app icon",
    dimension: "2D",
    tone: "light",
    forBackground: "dark",
    width: 1401,
    height: 1597,
    placement: "Dark backgrounds",
    usedIn: "Not used in this pass",
  },
  {
    file: "cursor-icon-2-5d.png",
    src: "/brand/cursor-icon-2-5d.png",
    form: "app icon",
    dimension: "2.5D",
    tone: "dimensional",
    forBackground: "either",
    width: 1401,
    height: 1600,
    placement: "Either background — the mark carries its own shading",
    usedIn: "Not used — flat 2D reads better at favicon scale",
  },
  {
    file: "cursor-wordmark-dark.png",
    src: "/brand/cursor-wordmark-dark.png",
    form: "wordmark",
    dimension: "2D",
    tone: "dark",
    forBackground: "light",
    width: 2000,
    height: 337,
    placement: "Light backgrounds where the cube is already present",
    usedIn: "Not used in this pass",
  },
  {
    file: "cursor-wordmark-light.png",
    src: "/brand/cursor-wordmark-light.png",
    form: "wordmark",
    dimension: "2D",
    tone: "light",
    forBackground: "dark",
    width: 2000,
    height: 337,
    placement: "Dark backgrounds where the cube is already present",
    usedIn: "Not used in this pass",
  },
];

export const LOCKUP_DARK = BRAND_ASSETS[0];
export const LOCKUP_LIGHT = BRAND_ASSETS[1];
export const ICON_DARK = BRAND_ASSETS[4];

/**
 * Split deliberately: the brand document states which of its own sections are documented rules and
 * which are observations of the marketing site. Presenting an observation as a rule would be the
 * same error this campaign argues against everywhere else.
 */
export const BRAND_RULES = {
  documented: [
    {
      topic: "Name",
      rule: "The product is Cursor. Authored copy never writes “Cursor AI” or “Cursor Code”. Quoted evidence and observed search queries keep their original wording.",
    },
    {
      topic: "Logo",
      rule: "Use the official marks. Prefer the horizontal lockup in headers and export covers. Light marks on dark backgrounds, dark marks on light.",
    },
    {
      topic: "Logo handling",
      rule: "Do not stretch, recolour off-brand, add drop shadows, or place a mark on a busy photo. Do not invent a logomark or borrow another AI tool's visual identity.",
    },
    {
      topic: "Missing variants",
      rule: "If an official file is missing, use a clean text “Cursor” treatment in a geometric sans and report the omission rather than drawing a substitute.",
    },
    {
      topic: "Voice",
      rule: "Technical, precise, calm — developer to developer. Plan and pricing clarity rather than hype. No invented allotments or performance claims.",
    },
  ],
  observed: [
    {
      topic: "Colour",
      rule: "The brand page publishes a theme colour of #f7f7f4 light and #14120b dark. Those two values are documented; the rest of this demo's palette is an interpretation, not a published token set.",
    },
    {
      topic: "Typography",
      rule: "The brand site loads Cursor Gothic, Berkeley Mono, Cursor Mono and EB Garamond. None were supplied as embeddable files, so this demo uses a geometric sans and a system mono in the same spirit.",
    },
  ],
} as const;

/**
 * Variants named on cursor.com/brand that were not supplied to this project. Listed so a reviewer
 * can see the difference between a variant that was ruled out and one that never arrived.
 */
export const BRAND_GAPS = [
  {
    item: "Vertical lockup",
    detail:
      "Named on the brand page but not supplied. Nothing in this demo needs it — every placement is horizontal — so no substitute was made.",
  },
  {
    item: "Avatars (circular and square, light and dark)",
    detail: "Named on the brand page but not supplied. This demo has no avatar placement.",
  },
  {
    item: "3D app icon",
    detail: "Named on the brand page but not supplied. The 2D and 2.5D icons cover every placement here.",
  },
  {
    item: "Vector (SVG) versions of any mark",
    detail:
      "All nine supplied files are PNG. They are used at well under half their native width, so raster scaling is not visible, but a print or large-format use would want the vector originals.",
  },
  {
    item: "Published hex tokens beyond theme-color",
    detail:
      "Only #f7f7f4 and #14120b are documented. The greys, ambers and emeralds used for review status in this board are this project's own choices and are not brand colours.",
  },
  {
    item: "Embeddable brand typefaces",
    detail:
      "Cursor Gothic, Berkeley Mono and Cursor Mono were not supplied as webfonts. The demo uses Geist and a system mono stack, which is the documented fallback position, not a match.",
  },
] as const;
