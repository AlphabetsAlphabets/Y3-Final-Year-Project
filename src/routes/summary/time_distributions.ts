import type { Log } from "$lib/types/schema";

export const timeDistributionByActivity = (logs: Log[]) => {
  const activityTotals = new Map<string, number>();
  logs.forEach((log) => {
    // Convert ms to hours. Because unix timestamp is in ms.
    const hours = log.elapsed / (1000 * 60 * 60);

    let totals = activityTotals.get(log.activity);
    if (totals) {
      totals += hours;
    } else {
      totals = hours;
    }

    activityTotals.set(log.activity, totals);
  });

  return Array.from(activityTotals.entries()).map(([activity, total]) => {
    return {
      group: activity,
      value: Math.round(total * 100) / 100, // Round to 2 decimal places
    };
  });
};

export const timeDistributionByProject = (logs: Log[]) => {
  // Group time spent per activity
  const projectTotals = new Map<string, number>();
  logs.forEach((log) => {
    // Convert ms to hours. Because unix timestamp is in ms.
    const hours = log.elapsed / (1000 * 60 * 60);
    let totals = 0;
    if (projectTotals.get(log.project_name)) {
      totals += hours;
    } else {
      totals = hours;
    }

    projectTotals.set(log.project_name, totals);
  });

  return Array.from(projectTotals.entries()).map(([project, total]) => {
    return {
      group: project,
      value: Math.round(total * 100) / 100, // Round to 2 decimal places
    };
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
