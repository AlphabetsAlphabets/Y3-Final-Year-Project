/// <reference types="@sveltejs/kit" />
import { build, files, version, prerendered } from "$service-worker";

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;
console.log(`Current version: ${CACHE}`);

const ASSETS = [
  ...build, // the app itself
  ...files, // everything in `static`
  ...prerendered,
];

self.addEventListener("install", (event) => {
  event.waitUntil(async () => {
    console.log("Cashing assets.");
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  });
});

// STILL MISSING THE ACTIVATE EVENT.
// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/CycleTracker/Service_workers

self.addEventListener("fetch", (event) => {
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
