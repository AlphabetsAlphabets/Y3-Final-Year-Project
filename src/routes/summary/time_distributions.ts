import type { Log } from "$lib/types/schema";

export const timeDistributionByActivity = (logs: Log[]) => {
  // Group time spent per activity
  const activityTotals = new Map<string, number>();
  logs.forEach((log) => {
    // Convert ms to hours. Because unix timestamp is in ms.
    const hours = log.elapsed / (1000 * 60 * 60);
    let totals = 0;
    if (activityTotals.get(log.activity)) {
      totals += hours;
    } else {
      totals = hours;
    }

    activityTotals.set(log.activity, totals);
  });

  // Convert it pie data form.
  return Array.from(activityTotals.entries()).map(([activity, total]) => {
    return {
      group: activity,
      value: Math.round(total * 100) / 100, // Round to 2 decimal places
    };
  });
};
