export const prerender = true;
export const trailingSlash = "always";

export function load({ setHeaders }) {
  setHeaders({
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin",
  });
}
