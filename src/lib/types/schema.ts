export type Activity = {
  id: number;
  name: string;
};

export type Project = {
  name: string;
  color: string;
};

export type Log = {
  id: number;
  activity: string;
  project_name: string;
  project_color: string;
  elapsed: number;
  start: number;
  end: number;
};
