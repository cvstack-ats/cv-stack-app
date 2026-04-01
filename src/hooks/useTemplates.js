import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useTemplates() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    async function fetchTemplates() {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Template error:", error);
      } else {
        setTemplates(data || []);
      }
    }

    fetchTemplates();
  }, []);

  return templates;
}