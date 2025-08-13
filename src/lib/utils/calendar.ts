export const addTestLog = async (dbWorker) => {
  if (!dbWorker) return;

  const projects = {
    Relaxing: "#6FCC68",
    Work: "#68A2CC",
  };

  const activities = [
    { name: "Reading", project: "Relaxing" },
    { name: "Gaming", project: "Relaxing" },
    { name: "FYP", project: "Work" },
  ];

  const existingProjects = await dbWorker.listProjects();
  const existingProjectNames = new Set(existingProjects.map((p) => p.name));

  for (const [projectName, projectColor] of Object.entries(projects)) {
    if (!existingProjectNames.has(projectName)) {
      await dbWorker.addProject(projectName, projectColor);
    }
  }

  const existingActivities = await dbWorker.listActivities();
  const existingActivityNames = new Set(existingActivities.map((a) => a.name));

  for (const activity of activities) {
    if (!existingActivityNames.has(activity.name)) {
      await dbWorker.addActivity(activity.name);
    }
  }

  const now = Date.now();
  const twoHoursInMillis = 2 * 60 * 60 * 1000;

  const logsToAdd = [
    {
      activityName: "Reading",
      projectName: "Relaxing",
      start: now,
      end: now + twoHoursInMillis,
    },
    {
      activityName: "FYP",
      projectName: "Work",
      start: now + twoHoursInMillis,
      end: now + 2 * twoHoursInMillis,
    },
    {
      activityName: "Gaming",
      projectName: "Relaxing",
      start: now - 3 * 60 * 60 * 1000,
      end: now - 3 * 60 * 60 * 1000 + twoHoursInMillis,
    },
  ];

  for (const log of logsToAdd) {
    await dbWorker.addLog(
      log.activityName,
      log.projectName,
      log.end - log.start,
      log.start,
      log.end,
    );
  }
};
