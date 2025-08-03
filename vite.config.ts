import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import fs from "fs";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    // https: {
    //   key: fs.readFileSync("localhost-key.pem"),
    //   cert: fs.readFileSync("localhost.pem"),
    // },
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
});
