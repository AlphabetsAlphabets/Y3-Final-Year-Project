// This specific +layout.server.ts is at the root of `routes`.
// This means that all pages below (subdirectories) are subject
// to the settings established here. This means that /database route
// will also send this as well.

export const prerender = true;
export const trailingSlash = "always";

export function load({ setHeaders }) {
  setHeaders({
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin",
  });
}
