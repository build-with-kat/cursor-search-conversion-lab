# Cursor brand guidelines (for Search Conversion Lab)

**Source:** https://cursor.com/brand (fetched 2026-09-18)  
**Use:** Design + copy constraints for the demo app, LP, and email. Prefer official assets from the brand page downloads when available.

---

## Name

- Refer to the product as **Cursor**.
- **Never** write “Cursor AI” or “Cursor Code” in authored brand copy.
- Preserve original wording in quoted evidence / observed search queries.

---

## Logo & marks (from brand page)

Assets on cursor.com/brand:

| Asset | Variants |
| --- | --- |
| Logos | 2D (default) and 2.5D (larger applications); horizontal lockup (**preferred**), vertical lockup; cube or wordmark separately |
| App icons | 2.5D (default), 2D, and 3D; light and dark |
| Avatars | 2D (default) and 2.5D; light and dark; circular or square |

**Rules for this project**

- Prefer **horizontal lockup** in headers / export covers.
- Use light marks on dark UI backgrounds and dark marks on light backgrounds for contrast.
- Do **not** stretch, recolor off-brand, add drop shadows, or place the mark on busy photos.
- Do **not** invent a new logomark or copy Cognition / other AI tools’ visual identity.
- If an official file is missing, use a clean text treatment (“Cursor”) in a geometric sans — report the omission.

---

## Color (observed from brand page / marketing theme)

Documented theme colors from cursor.com/brand page meta (2026-09-18):

| Token | Light | Dark |
| --- | --- | --- |
| Theme color / chrome | `#f7f7f4` | `#14120b` |

**Lab UI guidance (interpretation for demo — label as such)**

- Background: warm off-white `#f7f7f4` (light) or near-black `#14120b` (dark).
- Text: near-black on light; off-white on dark.
- Keep high contrast for ads/LP/email previews.
- Do not invent a neon/purple “AI” palette.

If official hex tokens beyond theme-color are downloaded from the brand kit, prefer those and update this file.

---

## Typography (observed)

Brand site loads Cursor Gothic, Berkeley Mono, Cursor Mono, EB Garamond families.

**For the demo app / LP / email**

- UI + body: clean geometric sans (system stack OK if Cursor Gothic not embeddable).
- Code / metrics / IDs: monospace (Berkeley Mono / Cursor Mono if available; otherwise system mono).
- Avoid playful display fonts that read as generic SaaS AI.

---

## Voice (for authored copy)

- Technical, precise, calm — developer-to-developer.
- Plan/pricing clarity over hype (“code 10× faster”).
- No invented allotments, CAC, or performance claims.
- Grok / Grok Bot: supporting inclusion only when verified on cursor.com/pricing; never SpaceXAI Meta → x.ai/bot.

---

## Do / don’t

| Do | Don’t |
| --- | --- |
| Say “Cursor” | Say “Cursor AI” / “Cursor Code” |
| Use official logo lockups | Recreate or distort the mark |
| Prefer horizontal logo | Crowded or low-contrast placements |
| Claim-table–safe plan language | Invent usage limits or entitlements |
| Link CTAs to verified cursor.com URLs | Fake signup or deep links |

---

## Assets for builders

1. Download latest packs from https://cursor.com/brand when starting the repo.
2. Place logos under `/public/brand/` (e.g. `cursor-lockup-horizontal.svg`, `cursor-icon.svg`).
3. Reference this file in the LP/email/header components.

---

## Source

- Official: https://cursor.com/brand  
- Naming rule also aligned with prior Cursor research brand notes.
