import type { Message, MessageReply } from "$lib/types/message";

import {
  Command,
  initDb,
  insert,
  list,
  setupTables,
} from "$lib/workers/commands";

// TODO: Will need to fix this
onmessage = async (e) => {
  const { command, messageId, data }: Message = e.data;

  await initDb();

  const result: MessageReply = {
    messageId,
  };

  try {
    if (command === Command.INIT) {
      await setupTables();
    } else if (command === Command.LIST) {
      result.data = await list("users");
    } else if (command === Command.INSERT) {
      // Use data here.
      insert("users", "name", "Steve Rogers");
    } else {
      throw new Error(`Unknown command: ${command}`);
    }

    postMessage(result);
  } catch (error: any) {
    // TODO: FIX THIS
    // Use the same result structure for consistency
    result.error = error.message || "An unknown error occurred";
    console.error("Worker error:", error);
    postMessage(result);
  }
};

export {};
