
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useJobOpenings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const { data } = await supabase
          .from("job_openings")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        setJobs(data || []);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  return { jobs, loading, setJobs };
}