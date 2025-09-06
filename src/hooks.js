/** @type {import('@sveltejs/kit').Load} */
export async function load({ setHeaders }) {
  setHeaders({
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
  });
}
