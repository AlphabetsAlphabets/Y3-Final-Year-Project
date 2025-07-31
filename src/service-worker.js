/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope} */ (
  /** @type {unknown} */ (self)
);
import { build, files, version, prerendered } from "$service-worker";

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;
console.log(`Current version: ${CACHE}`);

const ASSETS = [
  ...build, // the app itself
  ...files, // everything in `static`
  ...prerendered,
];

sw.addEventListener("install", (event) => {
  event.waitUntil(async () => {
    console.log("Cashing assets.");
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  });
});

// TODO: This is from gemini, will need to vet through it.
// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/CycleTracker/Service_workers
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

sw.addEventListener("fetch", (event) => {
  event.waitUntil(async () => {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    if (ASSETS.includes(url.pathname)) {
      const response = await cache.match(url.pathname);

      if (response) {
        console.log("Cache hit.");
        // Cache hit, so just return.
        return response;
      }
    }

    console.log("Miss. Requesting from network.");
    // get response from network
    const response = await fetch(event.request);

    // if we're offline, fetch can return a value that is not a Response
    // instead of throwing - and we can't pass this non-Response to respondWith
    if (!(response instanceof Response)) {
      throw new Error("invalid response from fetch");
    }

    if (response.status === 200) {
      cache.put(event.request, response.clone());
      return;
    }

    console.error("Unable to request resource from network.");
  });
});
