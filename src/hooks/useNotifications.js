
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const { data } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false });

        setNotifications(data || []);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  return { notifications, loading, setNotifications };
}