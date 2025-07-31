import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    // https: {
    //   key: fs.readFileSync("192.168.100.181+3-key.pem"),
    //   cert: fs.readFileSync("192.168.100.181+3.pem"),
    // },
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  base: "https://alphabetsalphabets.github.io/Y3-Final-Year-Project/",
});
