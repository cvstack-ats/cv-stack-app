
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function BrandingTab() {
  const [settingsId, setSettingsId] = useState(null);
  const [brandingId, setBrandingId] = useState(null);

  const [form, setForm] = useState({
    app_name: "",
    whatsapp_number: "",
    hero_title: "",
    hero_subtitle: "",
    support_label: "",
    primary_color: "#6f79ff",
    secondary_color: "#99a8ff",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [{ data: settingsRows }, { data: brandingRows }] = await Promise.all([
        supabase.from("app_settings").select("*").limit(1),
        supabase.from("branding_settings").select("*").limit(1),
      ]);

      const settings = settingsRows?.[0];
      const branding = brandingRows?.[0];

      if (settings) {
        setSettingsId(settings.id);
        setForm((prev) => ({
          ...prev,
          app_name: settings.app_name || "",
          whatsapp_number: settings.whatsapp_number || "",
          hero_title: settings.hero_title || "",
          hero_subtitle: settings.hero_subtitle || "",
          support_label: settings.support_label || "",
        }));
      }

      if (branding) {
        setBrandingId(branding.id);
        setForm((prev) => ({
          ...prev,
          primary_color: branding.primary_color || "#6f79ff",
          secondary_color: branding.secondary_color || "#99a8ff",
        }));
      }
    }

    loadData();
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    try {
      setSaving(true);

      if (settingsId) {
        await supabase
          .from("app_settings")
          .update({
            app_name: form.app_name,
            whatsapp_number: form.whatsapp_number,
            hero_title: form.hero_title,
            hero_subtitle: form.hero_subtitle,
            support_label: form.support_label,
            updated_at: new Date().toISOString(),
          })
          .eq("id", settingsId);
      }

      if (brandingId) {
        await supabase
          .from("branding_settings")
          .update({
            primary_color: form.primary_color,
            secondary_color: form.secondary_color,
            updated_at: new Date().toISOString(),
          })
          .eq("id", brandingId);
      }

      alert("Branding updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to save branding.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="table-card">
      <h3>Branding Settings</h3>

      <div className="form-grid">
        <div className="field-block">
          <label className="field-label">App Name</label>
          <input className="field-input" value={form.app_name} onChange={(e) => updateField("app_name", e.target.value)} />
        </div>

        <div className="field-block">
          <label className="field-label">WhatsApp Number</label>
          <input className="field-input" value={form.whatsapp_number} onChange={(e) => updateField("whatsapp_number", e.target.value)} />
        </div>

        <div className="field-block">
          <label className="field-label">Hero Title</label>
          <input className="field-input" value={form.hero_title} onChange={(e) => updateField("hero_title", e.target.value)} />
        </div>

        <div className="field-block">
          <label className="field-label">Hero Subtitle</label>
          <textarea className="field-input field-textarea" value={form.hero_subtitle} onChange={(e) => updateField("hero_subtitle", e.target.value)} />
        </div>

        <div className="field-block">
          <label className="field-label">Support Button Label</label>
          <input className="field-input" value={form.support_label} onChange={(e) => updateField("support_label", e.target.value)} />
        </div>

        <div className="field-block">
          <label className="field-label">Primary Color</label>
          <input className="field-input" value={form.primary_color} onChange={(e) => updateField("primary_color", e.target.value)} />
        </div>

        <div className="field-block">
          <label className="field-label">Secondary Color</label>
          <input className="field-input" value={form.secondary_color} onChange={(e) => updateField("secondary_color", e.target.value)} />
        </div>

        <button className="btn btn-primary" type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Branding"}
        </button>
      </div>
    </div>
  );
}