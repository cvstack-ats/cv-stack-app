import { supabase } from "../lib/supabase";

export async function trackEvent(eventName, meta = {}) {
  try {
    await supabase.from("site_events").insert([
      {
        event_name: eventName,
        meta,
      },
    ]);
  } catch (error) {
    console.error("Analytics error:", error);
  }
}