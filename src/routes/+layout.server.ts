export const prerender = true;
export const trailingSlash = "always";

export function load({ setHeaders }) {
  setHeaders({
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
  });
}
