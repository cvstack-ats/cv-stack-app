import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function CircleMembersTab() {
  const [members, setMembers] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    member_code: "",
    username: "",
    password: "",
    name: "",
    referral_code: "",
    whatsapp_number: "",
    reward_pending: 0,
    reward_due: 0,
    reward_paid: 0,
    status: "Active",
  });

  async function loadMembers() {
    const { data } = await supabase.from("circle_members").select("*").order("created_at", { ascending: false });
    setMembers(data || []);
  }

  useEffect(() => {
    loadMembers();
  }, []);

  function updateField(key, value) {
    const next = { ...form, [key]: value };

    if (key === "member_code") {
      next.referral_code = value;
      next.username = value;
    }

    setForm(next);
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!form.member_code.trim() || !form.name.trim() || !form.password.trim()) {
      alert("Member code, name and password are required.");
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase.from("circle_members").insert([form]);
      if (error) {
        alert(error.message);
        return;
      }

      setForm({
        member_code: "",
        username: "",
        password: "",
        name: "",
        referral_code: "",
        whatsapp_number: "",
        reward_pending: 0,
        reward_due: 0,
        reward_paid: 0,
        status: "Active",
      });

      await loadMembers();
      alert("Circle member saved.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteMember(id) {
    await supabase.from("circle_members").delete().eq("id", id);
    await loadMembers();
  }

  return (
    <>
      <div className="table-card">
        <h3>Create Circle Member</h3>

        <form className="form-grid" onSubmit={handleSave}>
          <div className="field-block">
            <label className="field-label">Circle Member ID</label>
            <input className="field-input" value={form.member_code} onChange={(e) => updateField("member_code", e.target.value)} placeholder="Example: CIRCLE1001" />
          </div>

          <div className="field-block">
            <label className="field-label">Name</label>
            <input className="field-input" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
          </div>

          <div className="field-block">
            <label className="field-label">Password</label>
            <input className="field-input" value={form.password} onChange={(e) => updateField("password", e.target.value)} />
          </div>

          <div className="field-block">
            <label className="field-label">WhatsApp Number</label>
            <input className="field-input" value={form.whatsapp_number} onChange={(e) => updateField("whatsapp_number", e.target.value)} />
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Member"}
          </button>
        </form>
      </div>

      <div className="table-card">
        <h3>Circle Members</h3>

        <div className="referral-list">
          {members.map((member) => (
            <div className="referral-row" key={member.id}>
              <div>
                <div className="referral-name">{member.name}</div>
                <div className="referral-meta">
                  ID: {member.member_code} | Referral: {member.referral_code} | Paid: ₹{member.reward_paid || 0}
                </div>
              </div>

              <button className="btn btn-ghost small-btn" type="button" onClick={() => deleteMember(member.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}