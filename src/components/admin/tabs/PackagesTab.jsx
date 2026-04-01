import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function PackagesTab() {
  const [packages, setPackages] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: 0,
    delivery_days: 3,
    features: "",
    sort_order: 0,
    is_active: true,
  });

  async function loadPackages() {
    const { data } = await supabase
      .from("packages")
      .select("*")
      .order("sort_order", { ascending: true });

    setPackages(data || []);
  }

  useEffect(() => {
    loadPackages();
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleAddPackage(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Package name required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        features: form.features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const { error } = await supabase.from("packages").insert([payload]);
      if (error) {
        alert(error.message);
        return;
      }

      setForm({
        name: "",
        price: 0,
        delivery_days: 3,
        features: "",
        sort_order: 0,
        is_active: true,
      });

      await loadPackages();
      alert("Package saved.");
    } finally {
      setSaving(false);
    }
  }

  async function deletePackage(id) {
    await supabase.from("packages").delete().eq("id", id);
    await loadPackages();
  }

  return (
    <>
      <div className="table-card">
        <h3>Add Package</h3>

        <form className="form-grid" onSubmit={handleAddPackage}>
          <div className="field-block">
            <label className="field-label">Package Name</label>
            <input
              className="field-input"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div className="field-block">
            <label className="field-label">Price</label>
            <input
              className="field-input"
              type="number"
              value={form.price}
              onChange={(e) => updateField("price", Number(e.target.value))}
            />
          </div>

          <div className="field-block">
            <label className="field-label">Delivery Days</label>
            <input
              className="field-input"
              type="number"
              value={form.delivery_days}
              onChange={(e) => updateField("delivery_days", Number(e.target.value))}
            />
          </div>

          <div className="field-block">
            <label className="field-label">Features</label>
            <input
              className="field-input"
              value={form.features}
              onChange={(e) => updateField("features", e.target.value)}
              placeholder="ATS-ready CV, Cover Letter"
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Package"}
          </button>
        </form>
      </div>

      <div className="table-card">
        <h3>Packages</h3>

        <div className="referral-list">
          {packages.map((item) => (
            <div className="referral-row" key={item.id}>
              <div>
                <div className="referral-name">{item.name}</div>
                <div className="referral-meta">
                  ₹{item.price} | {item.delivery_days} day(s)
                </div>
              </div>

              <button
                className="btn btn-ghost small-btn"
                type="button"
                onClick={() => deletePackage(item.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}