useAppSettings.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAppSettings() {
  const [settings, setSettings] = useState(null);
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [{ data: settingsRows }, { data: brandingRows }] = await Promise.all([
          supabase.from("app_settings").select("*").limit(1),
          supabase.from("branding_settings").select("*").limit(1),
        ]);

        setSettings(settingsRows?.[0] || null);
        setBranding(brandingRows?.[0] || null);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  return {
    settings,
    branding,
    loading,
    setSettings,
    setBranding,
  };
}