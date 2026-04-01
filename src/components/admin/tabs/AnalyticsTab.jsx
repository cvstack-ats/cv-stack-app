import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AnalyticsTab() {
  const [stats, setStats] = useState({
    pageViews: 0,
    createCvClicks: 0,
    atsChecks: 0,
    templateSelections: 0,
    packageSelections: 0,
    payNowClicks: 0,
    ordersCreated: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const { data, error } = await supabase.from("site_events").select("*");

      if (error) {
        console.error(error);
        return;
      }

      const rows = data || [];

      setStats({
        pageViews: rows.filter((x) => x.event_name === "page_view").length,
        createCvClicks: rows.filter((x) => x.event_name === "start_create_cv").length,
        atsChecks: rows.filter((x) => x.event_name === "open_ats_checker").length,
        templateSelections: rows.filter((x) => x.event_name === "template_selected").length,
        packageSelections: rows.filter((x) => x.event_name === "package_selected").length,
        payNowClicks: rows.filter((x) => x.event_name === "pay_now_clicked").length,
        ordersCreated: rows.filter((x) => x.event_name === "order_created").length,
      });
    }

    loadStats();
  }, []);

  return (
    <div className="dashboard-cards">
      <div className="dash-card">
        <span className="dash-label">Page Views</span>
        <strong>{stats.pageViews}</strong>
      </div>
      <div className="dash-card">
        <span className="dash-label">Create CV Clicks</span>
        <strong>{stats.createCvClicks}</strong>
      </div>
      <div className="dash-card">
        <span className="dash-label">ATS Checks</span>
        <strong>{stats.atsChecks}</strong>
      </div>
      <div className="dash-card">
        <span className="dash-label">Template Selections</span>
        <strong>{stats.templateSelections}</strong>
      </div>
      <div className="dash-card">
        <span className="dash-label">Package Selections</span>
        <strong>{stats.packageSelections}</strong>
      </div>
      <div className="dash-card">
        <span className="dash-label">Pay Now Clicks</span>
        <strong>{stats.payNowClicks}</strong>
      </div>
      <div className="dash-card">
        <span className="dash-label">Orders Created</span>
        <strong>{stats.ordersCreated}</strong>
      </div>
    </div>
  );
}