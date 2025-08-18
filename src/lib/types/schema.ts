export type Activity = {
  id: number;
  name: string;
};

export type Project = {
  name: string;
  color: string;
};

// This is a custom type that doesn't correspond with the definition of the
// log table in the database itself.
export type Log = {
  id: number;
  activity: string;
  project_name: string;
  project_color: string;
  elapsed: number;
  start: number;
  end: number;
};

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
