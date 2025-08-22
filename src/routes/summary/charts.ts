export type PieData = {
  group: string;
  value: number;
};

export const activityDistributionPieOptions = {
  title: "Time Distribution by Activity",
  resizable: true,
  height: "400px",
  pie: {
    alignment: "center",
  },
  donut: {
    center: {
      label: "Total Hours",
    },
  },
  legend: {
    position: "right",
  },
  color: {
    scale: {
      // Dynamic colors will be applied based on data
    },
  },
};
