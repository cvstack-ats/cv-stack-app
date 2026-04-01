import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAppSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadSettings() {
    setLoading(true);
    const { data, error } = await supabase
      .from("app_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Settings load error:", error);
    } else {
      setSettings(data || null);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  return { settings, setSettings, loadSettings, loading };
}