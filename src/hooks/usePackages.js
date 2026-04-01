import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function usePackages() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    async function fetchPackages() {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Packages error:", error);
      } else {
        setPackages(data || []);
      }
    }

    fetchPackages();
  }, []);

  return packages;
}