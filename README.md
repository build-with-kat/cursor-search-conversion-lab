# Google Search Conversion Lab

A workspace for building and reviewing a Google Search campaign against Cursor's pricing and plans
queries. Four responsive search ads, one pricing landing page, and one activation email — reviewed,
approved, and queued from a single tool.

Nothing is published. "Push to Google" records the queue locally and shows a toast; there is no
Google Ads API call anywhere in this repo.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The app opens on Creatives.

## The four sections

| Route | What it holds |
| --- | --- |
| `/research` | The decision, why Search and pricing, the four ad angles, and the sources behind them |
| `/keywords` | The Planner-backed keyword table with tiers, match types, and the negatives list |
| `/creatives` | Ads, landing page, and email on one surface — the default route |
| `/action` | The push queue: approve each asset, then push |
| `/lp` | The landing page itself, as an ad would land on it (`?hero=alt` for the alternate hero) |

## Review workflow

Each asset carries one of three states: *Needs review*, *Needs revise*, or *Approved*. **Revise**
takes a note explaining what should change; the note is kept so a rewrite has the context, and it
retracts approval. Editing an ad's headlines or descriptions also retracts approval. Everything
persists to `localStorage` under one versioned key, so bumping `STORAGE_KEY` invalidates stale
state after a breaking change.

## Where the numbers come from

Search volumes are Google Keyword Planner ranges (US, Sep 2025–Aug 2026), kept verbatim as ranges
and never converted to point estimates. Plan names, prices, and feature lines on the landing page
mirror [cursor.com/pricing](https://cursor.com/pricing) rather than restating it from memory.

`npm run check` enforces this. It fails the build if a volume range is flattened to an integer, if
an ad exceeds Google's RSA character limits, if a destination URL is not on the verified list, if
authored copy invents a performance figure, or if the brand marks are used off-spec.

## Layout

```
src/lib/seed.ts      All campaign content — research, treatments, sitelinks, keywords, copy
src/lib/brand.ts     Brand asset inventory and the rules that govern their use
src/lib/store.tsx    Approvals, revision notes, keyword edits, and the push record
src/app/             One route per section, plus /lp for the landing page itself
scripts/             The content validator behind `npm run check`
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run check` | Lint and the content validator (typecheck runs in `build`) |

## Publishing to a static host

Vercel needs none of this — it runs the app directly. For a plain file host such as GitHub Pages:

```bash
npm run export:static -- /your-repo-name   # serving from user.github.io/your-repo-name
npm run export:static                      # serving from a domain root
```

The result is in `out/`, ready to commit to a `gh-pages` branch or a `docs/` folder. The script
writes the redirect stubs for the old routes and the `.nojekyll` marker, without which GitHub Pages
refuses to serve `_next/`.
