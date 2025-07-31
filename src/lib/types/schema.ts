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
  activity: number;
  project: string;
  startTime: Date;
  endTime: Date;
};
