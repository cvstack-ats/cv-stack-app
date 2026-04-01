import React from "react";

const tabs = [
  "dashboard",
  "branding",
  "formBuilder",
  "templates",
  "packages",
  "orders",
  "customers",
  "circleMembers",
  "referrals",
  "staff",
  "notifications",
  "jobOpenings",
  "analytics",
];

export default function AdminSidebar({ activeTab, onChange }) {
  return (
    <div className="table-card">
      <h3>Admin Tabs</h3>

      <div className="referral-list">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`btn ${activeTab === tab ? "btn-primary" : "btn-ghost"}`}
            onClick={() => onChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}