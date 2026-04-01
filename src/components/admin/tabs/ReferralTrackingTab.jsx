import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function ReferralTrackingTab() {
  const [rows, setRows] = useState([]);

  async function loadRows() {
    const { data, error } = await supabase
      .from("referral_transactions")
      .select("*, circle_members(name, member_code, referral_code), orders(job_number, customer_name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setRows(data || []);
  }

  useEffect(() => {
    loadRows();
  }, []);

  async function updateReferralStatus(id, status) {
    const { error } = await supabase
      .from("referral_transactions")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadRows();
  }

  return (
    <div className="table-card">
      <h3>Referral Tracking</h3>

      <div className="referral-list">
        {rows.map((row) => (
          <div className="referral-row" key={row.id}>
            <div>
              <div className="referral-name">
                {row.circle_members?.name || "Member"} - ₹{row.reward_amount || 0}
              </div>
              <div className="referral-meta">
                {row.orders?.customer_name || "Customer"} | {row.orders?.job_number || "-"} | {row.status}
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-ghost small-btn"
                type="button"
                onClick={() => updateReferralStatus(row.id, "Eligible")}
              >
                Eligible
              </button>
              <button
                className="btn btn-ghost small-btn"
                type="button"
                onClick={() => updateReferralStatus(row.id, "Due")}
              >
                Due
              </button>
              <button
                className="btn btn-ghost small-btn"
                type="button"
                onClick={() => updateReferralStatus(row.id, "Paid")}
              >
                Paid
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}