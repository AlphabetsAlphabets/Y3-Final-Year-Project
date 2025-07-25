/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
// The stuff above is for type checking.
// From https://svelte.dev/docs/kit/service-workers#Type-safety

import { build, files, version, prerendered } from "$service-worker";

// Creates a unique cache name every time there is an update
const CACHE = `cache-${version}`;
console.log(`Current version: ${CACHE}`);

const ASSETS = [
  ...build, // the app itself
  ...files, // everything in `static`
  ...prerendered, // all the prerendered stuff.
];

// This fixes typing issues
const sw = /** @type {ServiceWorkerGlobalScope} */ (
  /** @type {unknown} */ (self)
);

// Installing the PWA onto the user's device
sw.addEventListener("install", (event) => {
  console.log("Assets: \n", ASSETS);

  event.waitUntil(
    (async () => {
      console.log("Cashing assets.");
      const cache = await caches.open(CACHE);
      await cache.addAll(ASSETS);
    })(),
  );
});

// Delete old caches and all that is unsued.
sw.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      // delete old caches
      for (const key of keys) {
        if (key !== CACHE) await caches.delete(key);
      }
    }),
  );
});

// The "server" part. Helps with redirection, etc.
// Took this directly from SvelteKit website.
// site: https://svelte.dev/docs/kit/service-workers#Inside-the-service-worker
sw.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    // `build`/`files` can always be served from the cache
    if (ASSETS.includes(url.pathname)) {
      const response = await cache.match(url.pathname);

      if (response) {
        return response;
      }
    }

    // for everything else, try the network first, but
    // fall back to the cache if we're offline
    try {
      const response = await fetch(event.request);

      // if we're offline, fetch can return a value that is not a Response
      // instead of throwing - and we can't pass this non-Response to respondWith
      if (!(response instanceof Response)) {
        throw new Error("invalid response from fetch");
      }

      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch (err) {
      const response = await cache.match(event.request);

      if (response) {
        return response;
      }

      // if there's no cache, then just error out
      // as there is nothing we can do to respond to this request
      throw err;
    }
  }

  event.respondWith(respond());
});
