import type { NextConfig } from "next";

/**
 * Set when exporting a static site for a host that serves from a subpath, e.g. GitHub Pages at
 * /<repo>/. Left empty for Vercel and local development, which serve from the root.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** `next export` has no server, so redirects are emitted as static stubs from /public instead. */
const staticExport = process.env.STATIC_EXPORT === "1";

const REDIRECTS: Record<string, string> = {
  "/ads": "/creatives",
  "/landing": "/creatives",
  "/email": "/creatives",
  "/campaign": "/action",
  "/results": "/action",
  "/insight": "/research",
  "/insights": "/research",
  "/market-research": "/research",
};

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  trailingSlash: staticExport,
  ...(staticExport ? { output: "export" as const, images: { unoptimized: true } } : {}),

  // The workspace used to be split across a route per asset type. Those links are kept alive and
  // folded into the four sections that replaced them.
  ...(staticExport
    ? {}
    : {
        async redirects() {
          return Object.entries(REDIRECTS).map(([source, destination]) => ({
            source,
            destination,
            permanent: false,
          }));
        },
      }),
};

export default nextConfig;
