export type Promiser = {
  (messageType: "open", args: OpenArgs): Promise<OpenResponse>;
  (
    messageType: "exec",
    args: ExecArgs & { rowMode: "array" },
  ): Promise<RowModeArray>;
  (
    messageType: "exec",
    args: ExecArgs & { rowMode: "object" },
  ): Promise<object[]>;
  (messageType: "exec", args: ExecArgs): Promise<RowModeObject>;
};

type OpenArgs = {
  filename: string;
  vfs: string;
};

type OpenResponse = {
  messageId: string;
  result: {
    filename: string;
    dbId: string;
    persistent: boolean;
    vfs: string;
  };
};

type ExecArgs = {
  sql: string | (() => void);
  bind?: string[];
  callback?: (statement: string) => void;
  rowMode?: "array" | "object" | "stmt";
};

export type RowModeArray = {
  dbId: string;
  messageId: string;
  result: { resultRows: object[] };
};

export type RowModeObject = {
  dbId: string;
  messageId: string;
  result: { sql: string; rowMode: string; resultRows: object[] };
};

export type WorkerCommand = {
  command: "schema" | "list" | "reset" | string;
  messageId: string;
};

export type WorkerResponse = {
  success: boolean;
  message: string;
  messageId: string;
  data: any;
  error?: string;
};
