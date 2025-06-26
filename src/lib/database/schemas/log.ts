import type { Activity } from "./activity";
import type { Project } from "./project";

export interface Log {
  id: number;
  activity: Activity;
  project: Project;
  start: Date;
  end: Date;
}
