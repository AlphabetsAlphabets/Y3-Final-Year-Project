import type { Log } from "$lib/types/schema";

const mapKeytoValue = (key: string, value: number) => {
  return {
    group: key,
    value: value,
  };
};

const entryToMap = (map: Map<string, number>, key: string, value: number) => {
  if (map.has(key)) {
    map.set(key, (map.get(key) as number) + value);
  } else {
    map.set(key, value);
  }
};

export const timeDistributionByActivity = (logs: Log[]) => {
  const activityTotals = new Map<string, number>();
  logs.forEach((log) => {
    const hours = log.elapsed / (60 * 60);
    entryToMap(activityTotals, log.activity, hours);
  });

  const data = Array.from(activityTotals.entries()).map(([activity, total]) => {
    return mapKeytoValue(activity, total);
  });

  return data;
};

export const timeDistributionByProject = (logs: Log[]) => {
  // Group time spent per activity
  const projectTotals = new Map<string, number>();
  logs.forEach((log) => {
    const hours = log.elapsed / (60 * 60);
    entryToMap(projectTotals, log.project_name, hours);
  });

  return Array.from(projectTotals.entries()).map(([project, total]) => {
    return mapKeytoValue(project, total);
  });
};

export type PieColor = {
  [k: string]: string;
};

export const getColors = (logs: Log[], activity: boolean): PieColor => {
  const colorMap = new Map<string, string>();
  logs.forEach((log) => {
    const entry = activity ? log.activity : log.project_name;
    colorMap.set(entry, log.project_color);
  });

  // Convert Map to a single object
  return Object.fromEntries(colorMap);
};
