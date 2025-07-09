// https://www.youtube.com/watch?v=Uvnzwp72Ze8
// proper setup of WASM SQLITE
//
// This should only run once in the entire lifetime of the application.
// So the database object must be shared in a convenient manner.
//
// Having database stuff be here is the preferred and standard way of doing
// things. https://www.sqlite.org/wasm/doc/trunk/api-index.md#mwthread
//
// There are two approaches OO API #1 (OO1) or Worker API #2 (Worker1 and Promiser).
// Gonna need to try both and see what doesn't work lmfao
// OO1 - https://www.sqlite.org/wasm/doc/trunk/api-worker1.md
// Worker1 and Promiser - https://www.sqlite.org/wasm/doc/trunk/api-worker1.md
//
// Web Worker generic tutorial - https://freedium.cfd/https://medium.com/geekculture/sveltekit-web-worker-8cfc0c86abf6

onmessage = async (event) => {
  // The worker itself is broken.
  // Currently following this:
  // https://www.sqlite.org/wasm/doc/trunk/api-worker1.md#promiser
  // await import("$lib/sqlite/jswasm/sqlite3-worker1-promiser.mjs");
  // const config = {
  //   onready: () => console.log("OK!"),
  // };

  // sqlite3Worker1Promiser(config);

  postMessage("Hello!");
};

export {};
