import type { Log } from "$lib/types/schema";
import type { PieData } from "./charts";
import {
  timeDistributionByActivity,
  timeDistributionByProject,
} from "./time_distributions";

export const viewByMinute = (pieData: PieData[]): PieData[] => {
  // convert hours to minutes
  // That's because pieData already contains hours
  return pieData.map((data) => {
    return {
      group: data.group,
      value: data.value * 60,
    };
  });
};

export const pieChartByActivityOrProject = (viewBy: string, logs: Log[]) => {
  let pieData: PieData[] = [];

  if (viewBy === "activity") {
    pieData = timeDistributionByActivity(logs);
  } else if (viewBy === "project") {
    pieData = timeDistributionByProject(logs);
  }

  return pieData;
};
