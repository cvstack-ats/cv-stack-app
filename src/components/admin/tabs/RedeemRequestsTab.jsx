import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function RedeemRequestsTab() {
  const [requests, setRequests] = useState([]);

  async function loadRequests() {
    const { data, error } = await supabase
      .from("redeem_requests")
      .select("*, circle_members(name, member_code, referral_code)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setRequests(data || []);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function updateRequestStatus(request, status) {
    const { error } = await supabase
      .from("redeem_requests")
      .update({ status })
      .eq("id", request.id);

    if (error) {
      alert(error.message);
      return;
    }

    if (status === "Approved") {
      const memberId = request.circle_member_id;
      const amount = Number(request.requested_amount || 0);

      const { data: member } = await supabase
        .from("circle_members")
        .select("*")
        .eq("id", memberId)
        .single();

      if (member) {
        await supabase
          .from("circle_members")
          .update({
            reward_due: Math.max(Number(member.reward_due || 0) - amount, 0),
            reward_paid: Number(member.reward_paid || 0) + amount,
          })
          .eq("id", memberId);
      }
    }

    await loadRequests();
  }

  return (
    <div className="table-card">
      <h3>Redeem Requests</h3>

      <div className="referral-list">
        {requests.map((request) => (
          <div className="referral-row" key={request.id}>
            <div>
              <div className="referral-name">
                {request.circle_members?.name || "Member"} - ₹{request.requested_amount}
              </div>
              <div className="referral-meta">
                {request.circle_members?.member_code || "-"} | {request.status}
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-ghost small-btn"
                type="button"
                onClick={() => updateRequestStatus(request, "Approved")}
              >
                Approve
              </button>
              <button
                className="btn btn-ghost small-btn"
                type="button"
                onClick={() => updateRequestStatus(request, "Rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}