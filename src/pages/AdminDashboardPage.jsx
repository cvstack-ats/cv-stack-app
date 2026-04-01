import React, { useState } from "react";
import PageShell from "../components/common/PageShell";
import SectionHeader from "../components/common/SectionHeader";
import AdminSidebar from "../components/admin/AdminSidebar";

import BrandingTab from "../components/admin/tabs/BrandingTab";
import FormBuilderTab from "../components/admin/tabs/FormBuilderTab";
import TemplatesTab from "../components/admin/tabs/TemplatesTab";
import PackagesTab from "../components/admin/tabs/PackagesTab";
import OrdersTab from "../components/admin/tabs/OrdersTab";
import CircleMembersTab from "../components/admin/tabs/CircleMembersTab";
import ReferralTrackingTab from "../components/admin/tabs/ReferralTrackingTab";
import RedeemRequestsTab from "../components/admin/tabs/RedeemRequestsTab";
import StaffTab from "../components/admin/tabs/StaffTab";
import AnalyticsTab from "../components/admin/tabs/AnalyticsTab";
import { useNotifications } from "../hooks/useNotifications";

export default function AdminDashboardPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { notifications, loading } = useNotifications();

  function renderTab() 
  {
    if (activeTab === "dashboard") {
      return (
        <div className="dashboard-cards">
          <div className="dash-card">
            <span className="dash-label">Orders</span>
            <strong>Track customer submissions</strong>
          </div>
          <div className="dash-card">
            <span className="dash-label">Templates</span>
            <strong>Manage uploaded CV previews</strong>
          </div>
          <div className="dash-card">
            <span className="dash-label">Referrals</span>
            <strong>Track earnings and payouts</strong>
          </div>
          <div className="dash-card">
            <span className="dash-label">Analytics</span>
            <strong>Monitor usage and conversions</strong>
          </div>
        </div>
      );
    }

    if (activeTab === "branding") return <BrandingTab />;
    if (activeTab === "formBuilder") return <FormBuilderTab />;
    if (activeTab === "templates") return <TemplatesTab />;
    if (activeTab === "packages") return <PackagesTab />;
    if (activeTab === "orders") return <OrdersTab />;
    if (activeTab === "circleMembers") return <CircleMembersTab />;
    if (activeTab === "referrals") return <ReferralTrackingTab />;
    if (activeTab === "redeemRequests") return <RedeemRequestsTab />;
    if (activeTab === "staff") return <StaffTab />;
    if (activeTab === "analytics") return <AnalyticsTab />;

    if (activeTab === "notifications") {
      return (
        <div className="table-card">
          <h3>Notifications</h3>
          {loading ? <div className="login-note">Loading notifications...</div> : null}

          <div className="referral-list">
            {notifications.map((item) => (
              <div className="referral-row" key={item.id}>
                <div>
                  <div className="referral-name">{item.title}</div>
                  <div className="referral-meta">{item.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="table-card">
        <h3>{activeTab}</h3>
        <p className="login-note">This tab will be connected next.</p>
      </div>
    );
  }

  return (
    <PageShell wide>
      <div className="page-top">
        <button className="text-link" onClick={onLogout} type="button">
          ← Logout
        </button>
        <div className="mini-logo">ADMIN</div>
      </div>

      <SectionHeader title="Admin Dashboard" subtitle="Manage CV STACK from one place." />

      <div className="admin-layout">
        <div className="admin-sidebar-wrap">
          <AdminSidebar activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <div className="admin-content-wrap">{renderTab()}</div>
      </div>
    </PageShell>
  );
}