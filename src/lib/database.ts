import { onMount } from "svelte";

export function connectToDatabase() {
  let database: IDBDatabase | null = null;
  onMount(() => {
    window.addEventListener("onupgradeneeded", (event) => {
      const database = (event.currentTarget as IDBOpenDBRequest).result;
      database.createObjectStore("name", {
        keyPath: "myKey",
      });
    });

    const request = window.indexedDB.open("myTestDB", 3);
    request.onsuccess = (event) => {
      const target = event.target as IDBOpenDBRequest;
      database = target.result;
      console.log("Mounted. Database opened.");
    };

    request.onerror = (event) => {
      console.log(event);
    };

    if (database !== null) {
      database.onerror = (event) => {
        const target = event?.target as IDBOpenDBRequest;
        console.error(`Database error: ${target.error?.message}`);
      };
    }
  });
}
