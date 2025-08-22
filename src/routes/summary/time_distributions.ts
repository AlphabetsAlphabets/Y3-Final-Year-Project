import type { Log } from "$lib/types/schema";

// Helper function to format date for display
export const formatDateRange = (startDate: string, endDate: string): string => {
  if (!startDate && !endDate) return "All Time";
  if (startDate && !endDate)
    return `From ${new Date(startDate).toLocaleDateString()}`;
  if (!startDate && endDate)
    return `Until ${new Date(endDate).toLocaleDateString()}`;
  return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
};

// Helper function to get summary statistics
export const getSummaryStats = (logs: Log[]) => {
  if (logs.length === 0) {
    return {
      totalHours: 0,
      totalSessions: 0,
      averageSessionLength: 0,
      dateRange: { earliest: null as Date | null, latest: null as Date | null },
    };
  }

  const totalMs = logs.reduce((sum, log) => sum + log.elapsed, 0);
  const totalHours = totalMs / (1000 * 60 * 60);
  const averageSessionLength = totalHours / logs.length;

  const timestamps = logs.map((log) => log.start).sort((a, b) => a - b);
  const earliest = new Date(timestamps[0]);
  const latest = new Date(timestamps[timestamps.length - 1]);

  return {
    totalHours: Math.round(totalHours * 100) / 100,
    totalSessions: logs.length,
    averageSessionLength: Math.round(averageSessionLength * 100) / 100,
    dateRange: { earliest, latest },
  };
};

export const timeDistributionByActivity = (logs: Log[]) => {
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
