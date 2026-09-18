// Node's ESM resolver requires file extensions; TypeScript's bundler resolution does not, so the
// app's extensionless relative imports need a hook when these modules run outside Next.js.
import { register } from "node:module";
import { pathToFileURL } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
    for (const ext of [".ts", ".tsx"]) {
      try {
        return await nextResolve(specifier + ext, context);
      } catch {
        // Try the next extension.
      }
    }
  }
  return nextResolve(specifier, context);
}

if (process.env.TS_RESOLVE_REGISTER !== "0") {
  register(pathToFileURL(new URL(import.meta.url).pathname));
}
