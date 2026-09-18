/**
 * Next rewrites `href` and `src` on its own components, but a raw iframe src has to be prefixed by
 * hand so the landing page preview resolves when the site is served from a subpath.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
