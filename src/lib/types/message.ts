import type { Command } from "$lib/workers/commands";
import type { RowModeArray, RowModeObject } from "./promiser";

export type Message = {
  command: Command;
  messageId: number;
  data?: string[];
};

export type MessageReply = {
  message?: string;
  messageId: number;
  data?: RowModeArray | RowModeObject | string;
  error?: string;
};
