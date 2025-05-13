import { activities } from "./data";

export function load() {
  return {
    summaries: activities.map((activity) => ({
      name: activity.name,
      stats: activity.stats,
    })),
  };
}
