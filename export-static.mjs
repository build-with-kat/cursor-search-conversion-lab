/**
 * Builds a static copy of the workspace for a plain file host such as GitHub Pages.
 *
 *   npm run export:static -- /repo-name    (subpath host, e.g. user.github.io/repo-name)
 *   npm run export:static                  (root host)
 *
 * Output lands in out/. Two things a plain `next build --export` will not do for you are handled
 * here: the redirects from the old routes, which need a server, and the .nojekyll marker, without
 * which GitHub Pages silently refuses to serve the _next directory because of its leading underscore.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REDIRECTS = {
  "/ads": "/creatives",
  "/landing": "/creatives",
  "/email": "/creatives",
  "/campaign": "/action",
  "/results": "/action",
  "/insight": "/research",
  "/insights": "/research",
  "/market-research": "/research",
};

const raw = process.argv[2] ?? "";
const basePath = raw && !raw.startsWith("/") ? `/${raw}` : raw;
if (basePath.endsWith("/")) {
  console.error("Base path must not end with a slash.");
  process.exit(1);
}

const out = join(process.cwd(), "out");
rmSync(out, { recursive: true, force: true });

console.log(basePath ? `Exporting for ${basePath}/` : "Exporting for the site root");

execFileSync("npx", ["next", "build"], {
  stdio: "inherit",
  env: { ...process.env, STATIC_EXPORT: "1", NEXT_PUBLIC_BASE_PATH: basePath },
});

const stub = (to) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=${basePath}${to}/" />
    <link rel="canonical" href="${basePath}${to}/" />
    <title>Redirecting</title>
  </head>
  <body>
    <p>Redirecting to <a href="${basePath}${to}/">${basePath}${to}/</a></p>
  </body>
</html>
`;

for (const [from, to] of Object.entries(REDIRECTS)) {
  const dir = join(out, from);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), stub(to));
}

writeFileSync(join(out, ".nojekyll"), "");

console.log(`\nStatic site ready in out/`);
console.log(`  ${Object.keys(REDIRECTS).length} redirect stubs, .nojekyll written`);
