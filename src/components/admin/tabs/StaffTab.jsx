import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function StaffTab() {
  const [staff, setStaff] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    staff_id: "",
    name: "",
    username: "",
    password: "",
    role: "staff",
    is_active: true,
  });

  async function loadStaff() {
    const { data, error } = await supabase
      .from("staff_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setStaff(data || []);
  }

  useEffect(() => {
    loadStaff();
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!form.staff_id.trim() || !form.name.trim() || !form.username.trim() || !form.password.trim()) {
      alert("Fill all required staff fields.");
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase.from("staff_users").insert([form]);
      if (error) {
        alert(error.message);
        return;
      }

      setForm({
        staff_id: "",
        name: "",
        username: "",
        password: "",
        role: "staff",
        is_active: true,
      });

      await loadStaff();
      alert("Staff created.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(member) {
    await supabase
      .from("staff_users")
      .update({ is_active: !member.is_active })
      .eq("id", member.id);

    await loadStaff();
  }

  async function deleteStaff(id) {
    await supabase.from("staff_users").delete().eq("id", id);
    await loadStaff();
  }

  return (
    <>
      <div className="table-card">
        <h3>Create Staff Access</h3>

        <form className="form-grid" onSubmit={handleSave}>
          <div className="field-block">
            <label className="field-label">Staff ID</label>
            <input className="field-input" value={form.staff_id} onChange={(e) => updateField("staff_id", e.target.value)} />
          </div>

          <div className="field-block">
            <label className="field-label">Name</label>
            <input className="field-input" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
          </div>

          <div className="field-block">
            <label className="field-label">Username</label>
            <input className="field-input" value={form.username} onChange={(e) => updateField("username", e.target.value)} />
          </div>

          <div className="field-block">
            <label className="field-label">Password</label>
            <input className="field-input" value={form.password} onChange={(e) => updateField("password", e.target.value)} />
          </div>

          <div className="field-block">
            <label className="field-label">Role</label>
            <select className="field-input" value={form.role} onChange={(e) => updateField("role", e.target.value)}>
              <option value="staff">staff</option>
              <option value="editor">editor</option>
              <option value="order_manager">order_manager</option>
              <option value="support">support</option>
            </select>
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Staff"}
          </button>
        </form>
      </div>

      <div className="table-card">
        <h3>Staff Users</h3>

        <div className="referral-list">
          {staff.map((item) => (
            <div className="referral-row" key={item.id}>
              <div>
                <div className="referral-name">{item.name}</div>
                <div className="referral-meta">
                  {item.staff_id} | {item.username} | {item.role} | {item.is_active ? "Active" : "Inactive"}
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-ghost small-btn" type="button" onClick={() => toggleStatus(item)}>
                  {item.is_active ? "Disable" : "Enable"}
                </button>
                <button className="btn btn-ghost small-btn" type="button" onClick={() => deleteStaff(item.id)}>
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