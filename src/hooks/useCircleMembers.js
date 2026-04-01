import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useCircleMembers() {
  const [circleMembers, setCircleMembers] = useState([]);

  useEffect(() => {
    async function loadMembers() {
      const { data, error } = await supabase.from("circle_members").select("*");

      if (error) {
        console.error("Circle members error:", error);
      } else {
        setCircleMembers(data || []);
      }
    }

    loadMembers();
  }, []);

  return { circleMembers };
}