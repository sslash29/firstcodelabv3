// utils/logEvent.js
import supabase from "../../supabase-client";

export async function logEvent(event, user_id) {
  const { error } = await supabase.from("Logs").insert([{ event, user_id }]);
  if (error) {
    console.error("Error logging event:", error.message);
  }
}
