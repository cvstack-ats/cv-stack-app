import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function TemplatesTab() {
  const [templates, setTemplates] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const [form, setForm] = useState({
    name: "",
    tag: "",
    preview_image_url: "",
    sort_order: 0,
    is_active: true,
  });

  async function loadTemplates() {
    const { data } = await supabase
      .from("templates")
      .select("*")
      .order("sort_order", { ascending: true });

    setTemplates(data || []);
  }

  useEffect(() => {
    loadTemplates();
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(file) {
    if (!file) return;

    try {
      setUploading(true);

      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("templates")
        .upload(fileName, file);

      if (error) {
        alert(error.message);
        return;
      }

      const { data } = supabase.storage.from("templates").getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      updateField("preview_image_url", publicUrl);
      setPreviewUrl(publicUrl);
    } finally {
      setUploading(false);
    }
  }

  async function handleAddTemplate(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Template name required.");
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase.from("templates").insert([form]);

      if (error) {
        alert(error.message);
        return;
      }

      setForm({
        name: "",
        tag: "",
        preview_image_url: "",
        sort_order: 0,
        is_active: true,
      });
      setPreviewUrl("");

      await loadTemplates();
      alert("Template saved.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteTemplate(id) {
    await supabase.from("templates").delete().eq("id", id);
    await loadTemplates();
  }

  return (
    <>
      <div className="table-card">
        <h3>Add Template</h3>

        <form className="form-grid" onSubmit={handleAddTemplate}>
          <div className="field-block">
            <label className="field-label">Template Name</label>
            <input
              className="field-input"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div className="field-block">
            <label className="field-label">Tag</label>
            <input
              className="field-input"
              value={form.tag}
              onChange={(e) => updateField("tag", e.target.value)}
            />
          </div>

          <div className="field-block">
            <label className="field-label">Preview Upload</label>
            <input
              className="field-input file-input"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0])}
            />
          </div>

          <div className="field-block">
            <label className="field-label">Sort Order</label>
            <input
              className="field-input"
              type="number"
              value={form.sort_order}
              onChange={(e) => updateField("sort_order", Number(e.target.value))}
            />
          </div>

          {previewUrl ? (
            <div className="admin-template-preview-box">
              <div className="admin-template-preview-top">
                <span>Uploaded Preview</span>
                <button
                  className="btn btn-ghost small-btn"
                  type="button"
                  onClick={() => window.open(previewUrl, "_blank")}
                >
                  Preview
                </button>
              </div>

              <div className="admin-template-preview-image-wrap">
                <img
                  src={previewUrl}
                  alt="Template preview"
                  className="admin-template-preview-image"
                />
              </div>
            </div>
          ) : null}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={saving || uploading}
          >
            {uploading ? "Uploading..." : saving ? "Saving..." : "Save Template"}
          </button>
        </form>
      </div>

      <div className="table-card">
        <h3>Templates</h3>

        <div className="referral-list">
          {templates.map((item) => (
            <div className="referral-row" key={item.id}>
              <div>
                <div className="referral-name">{item.name}</div>
                <div className="referral-meta">{item.tag}</div>
              </div>

              <div className="form-actions">
                {item.preview_image_url ? (
                  <button
                    className="btn btn-ghost small-btn"
                    type="button"
                    onClick={() => window.open(item.preview_image_url, "_blank")}
                  >
                    Preview
                  </button>
                ) : null}

                <button
                  className="btn btn-ghost small-btn"
                  type="button"
                  onClick={() => deleteTemplate(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}