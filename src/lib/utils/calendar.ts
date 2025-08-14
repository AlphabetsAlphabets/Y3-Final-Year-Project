/**
 * Populates the database with some sample data for testing purposes.
 * This function will add predefined projects, activities, and time logs.
 * It checks for existing data to avoid duplicates.
 * @param dbWorker - The database worker instance to interact with the database.
 */
/**
 * Populates the database with test data for projects, activities, and time logs.
 * This function is useful for development and testing purposes.
 *
 * @param dbWorker - The database worker instance to interact with the database.
 */
export const addTestLog = async (dbWorker) => {
  // If the database worker is not available, exit the function.
  // If the database worker is not available, exit the function.
  if (!dbWorker) return;

  // Define a set of sample projects with their associated colors.
  // Define sample projects with their corresponding colors.
  const projects = {
    Relaxing: "#6FCC68",
    Work: "#68A2CC",
  };

  // Define a set of sample activities and the project they belong to.
  // Define sample activities.
  const activities = [
    { name: "Reading", project: "Relaxing" },
    { name: "Gaming", project: "Relaxing" },
    { name: "FYP", project: "Work" },
  ];

  // Retrieve all existing projects from the database to prevent duplicates.
  // Retrieve existing projects from the database to avoid duplicates.
  const existingProjects = await dbWorker.listProjects();
  const existingProjectNames = new Set(existingProjects.map((p) => p.name));

  // Iterate over the sample projects and add them to the database if they don't already exist.
  // Add new projects if they don't already exist.
  for (const [projectName, projectColor] of Object.entries(projects)) {
    if (!existingProjectNames.has(projectName)) {
      await dbWorker.addProject(projectName, projectColor);
    }
  }

  // Retrieve all existing activities from the database to prevent duplicates.
  // Retrieve existing activities from the database to avoid duplicates.
  const existingActivities = await dbWorker.listActivities();
  const existingActivityNames = new Set(existingActivities.map((a) => a.name));

  // Iterate over the sample activities and add them to the database if they don't already exist.
  // Add new activities if they don't already exist.
  for (const activity of activities) {
    if (!existingActivityNames.has(activity.name)) {
      await dbWorker.addActivity(activity.name);
    }
  }

  // Get the current timestamp to use as a base for generating log entries.
  // Get the current timestamp.
  const now = Date.now();
  // Define a duration of two hours in milliseconds.
  const twoHoursInMillis = 2 * 60 * 60 * 1000;

  // Define a set of sample time logs with start and end times.
  // Define sample time logs to be added to the database.
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

  // Iterate over the sample logs and add them to the database.
  // Add the sample logs to the database.
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
