import React from "react";
import PageShell from "../components/common/PageShell";
import SectionHeader from "../components/common/SectionHeader";
import { useJobOpenings } from "../hooks/useJobOpenings";
import { supabase } from "../lib/supabase";

export default function CircleDashboardPage({ member, onLogout }) {
  const { jobs, loading } = useJobOpenings();

  if (!member) return null;

  async function handleRedeemRequest() {
    const amount = Number(member.reward_due || 0);

    if (amount <= 0) {
      alert("No due amount available for redeem.");
      return;
    }

    const { error } = await supabase.from("redeem_requests").insert([
      {
        circle_member_id: member.id,
        requested_amount: amount,
        status: "Pending",
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase.from("notifications").insert([
      {
        type: "redeem",
        title: "Redeem Request",
        message: `${member.name} requested redeem for ₹${amount}`,
        is_read: false,
        related_id: String(member.id),
      },
    ]);

    alert("Redeem request submitted.");
  }

  return (
    <PageShell>
      <div className="page-top">
        <button className="text-link" onClick={onLogout} type="button">
          ← Logout
        </button>
        <div className="mini-logo">CV STACK</div>
      </div>

      <SectionHeader
        title={`Welcome, ${member.name}`}
        subtitle="Track your referral amount and member activity."
      />

      <div className="dashboard-cards">
        <div className="dash-card">
          <span className="dash-label">Circle Member ID</span>
          <strong>{member.member_code || member.referral_code}</strong>
        </div>
        <div className="dash-card">
          <span className="dash-label">Referral Code</span>
          <strong>{member.referral_code}</strong>
        </div>
        <div className="dash-card">
          <span className="dash-label">Pending Amount</span>
          <strong>₹{member.reward_pending || 0}</strong>
        </div>
        <div className="dash-card">
          <span className="dash-label">Due Amount</span>
          <strong>₹{member.reward_due || 0}</strong>
        </div>
        <div className="dash-card">
          <span className="dash-label">Paid Amount</span>
          <strong>₹{member.reward_paid || 0}</strong>
        </div>
        <div className="dash-card">
          <span className="dash-label">Status</span>
          <strong>{member.status || "Active"}</strong>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="button" onClick={handleRedeemRequest}>
          Request Redeem
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => window.open("https://wa.me/?text=Hello%20CV%20STACK%20Support", "_blank")}
        >
          Support WhatsApp
        </button>
      </div>

      <div className="table-card">
        <h3>Explore Job Openings</h3>

        {loading ? <div className="login-note">Loading job openings...</div> : null}

        <div className="referral-list">
          {jobs.map((job) => (
            <div className="referral-row" key={job.id}>
              <div>
                <div className="referral-name">{job.title}</div>
                <div className="referral-meta">
                  {job.company} | {job.location}
                </div>
              </div>

              <button
                className="btn btn-ghost small-btn"
                type="button"
                onClick={() => window.open(job.apply_url, "_blank")}
              >
                Open Link
              </button>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}