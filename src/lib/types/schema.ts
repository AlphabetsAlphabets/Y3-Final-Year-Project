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
  completed: boolean;
  created_at: string;
  completed_at: string | null;
};
