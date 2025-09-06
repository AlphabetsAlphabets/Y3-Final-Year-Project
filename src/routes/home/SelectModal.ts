import type { Activity, Task } from "$lib/types/schema";

export const getTaskAndActivities = (tasks: Task[], activities: Activity[]) => {
  const taskItems = tasks
    .filter((task) => task.completed == 0)
    .map((task: Task) => {
      return { id: task.id, name: task.name, isTask: true };
    });

  const activityItems = activities.map((activity: Activity) => {
    return { id: activity.id, name: activity.name, isTask: false };
  });

  return [...taskItems, ...activityItems];
};
