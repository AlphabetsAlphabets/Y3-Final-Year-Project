import * as Comlink from "comlink";
import {
  Command,
  initDb,
  insert,
  list,
  reset,
  setupTables,
} from "$lib/workers/commands";
import type { RowModeArray } from "$lib/types/promiser";

/**
 * Database worker API exposed through Comlink
 */
const dbWorker = {
  /**
   * Initialize the database
   */
  async init(): Promise<void> {
    await initDb();
  },

  /**
   * Setup database tables
   */
  async setup(): Promise<void> {
    await initDb();
    await setupTables();
  },

  /**
   * List items from a table
   * @param table The table name to query
   * @param columns Optional columns to select
   * @param clause Optional WHERE clause
   */
  async list(
    table: string,
    columns?: string,
    clause?: string,
  ): Promise<RowModeArray> {
    await initDb();
    return await list(table, columns, clause);
  },

  /**
   * Insert data into a table
   * @param table The table name
   * @param columns Column names (comma-separated)
   * @param values Values to insert (formatted as SQL string)
   */
  async insert(table: string, columns: string, values: string): Promise<void> {
    await initDb();
    await insert(table, columns, values);
  },

  /**
   * Reset data in tables
   * @param table Optional table name to reset. If not provided, all tables will be reset
   */
  async reset(table?: string): Promise<void> {
    await initDb();
    await reset(table);
  },

  /**
   * Process command by type (legacy support)
   * @param command Command enum value
   * @param data Command data
   */
  async processCommand(command: Command, data?: any): Promise<any> {
    await initDb();

    try {
      if (command === Command.SETUP) {
        return await setupTables();
      } else if (command === Command.LIST) {
        const table = data?.table || "activity";
        const columns = data?.columns;
        const clause = data?.clause;
        return await list(table, columns, clause);
      } else if (command === Command.INSERT) {
        const table = data?.table;
        const columns = data?.columns;
        const values = data?.values;

        if (!table || !columns || !values) {
          throw new Error("Missing required data for INSERT command");
        }

        return await insert(table, columns, values);
      } else if (command === Command.RESET) {
        await reset(data);
      } else {
        throw new Error(`Unknown command: ${command}`);
      }
    } catch (error: any) {
      console.error("Worker error:", error);
      throw error;
    }
  },
};

// Expose the API to the main thread using Comlink
Comlink.expose(dbWorker);

export type DbWorker = typeof dbWorker;
