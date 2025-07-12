import type { RowModeArray, RowModeObject } from "./promiser";

export type Message = {
  command: string;
  messageId: number;
};

export type MessageReply = {
  message?: string;
  messageId: number;
  data?: RowModeArray | RowModeObject | string;
  error?: string;
};
