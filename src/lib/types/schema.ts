/**
 * @param id - The unique ID of an activity.
 * @param name - Unique name of an activity.
 */
export type Activity = {
  id: number;
  name: string;
};

/**
 * @param name - Unique name of an project.
 * @param color - Unique color of an project.
 */
export type Project = {
  name: string;
  color: string;
};

/**
 * This is a custom type that doesn't correspond with the definition of the
 * log table in the database itself.
 * @param elapsed - Elapsed time in seconds.
 * @param start - A timestamp in milliseconds.
 * @param end - A timestamp in milliseconds.
 */
export type Log = {
  id: number;
  activity: string;
  project_name: string;
  project_color: string;
  elapsed: number;
  start: number;
  end: number;
};

/**
 * Represents the task table in the database.
 * @param id - The unique ID of a task.
 * @param name - name of a task.
 * @param description - Description of a task. This is an optional field.
 * @param completed - Whether a task is completed.
 * @param created_at - Timestamp when a task was created.
 * @param completed_at - Timestamp when a task was completed.
 */
export type Task = {
  id: number;
  name: string;
  description: string;
  completed: number;
  created_at: number;
  completed_at: number | null;
};

const createActivity = `
  CREATE TABLE IF NOT EXISTS activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
  );
`;

const createProject = `
  CREATE TABLE IF NOT EXISTS project (
  name TEXT PRIMARY KEY,
  color TEXT NOT NULL
  );
`;

const createLog = `
  CREATE TABLE IF NOT EXISTS log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity TEXT NOT NULL,
  project_name TEXT,
  elapsed INTEGER NOT NULL,
  start INTEGER NOT NULL,
  end INTEGER NOT NULL,
  FOREIGN KEY (project_name) REFERENCES project(name) ON UPDATE CASCADE
  );
`;

const createTask = `
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  completed INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  completed_at INTEGER
);
`;

export const createSql = [createActivity, createProject, createLog, createTask];
