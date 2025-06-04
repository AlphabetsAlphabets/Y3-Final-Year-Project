import { error } from "@sveltejs/kit";
import { activities } from "../data.js";

// Get the data for the correct activity
export function load({ params }) {
  const activity = activities.find((activity) => activity.name === params.name);

  if (!activity) error(404);

  return {
    activity, // this activity variable is only available for
    // whatever [name] is. It is also unique. But, the
    // activities contained inside data.activities is different.
  };
}
