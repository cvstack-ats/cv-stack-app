
import React from "react";
import PageShell from "../components/common/PageShell";
import SectionHeader from "../components/common/SectionHeader";

export default function ConfirmationPage({ jobNumber, onBackHome }) {
  return (
    <PageShell>
      <SectionHeader title="Order Confirmed" subtitle="Your order was placed successfully." />

      <div className="result-card">
        <div className="score-badge">✓</div>
        <h3>Reference Number</h3>
        <p className="result-summary">{jobNumber}</p>

        <div className="sales-box">
          <h4>Next Step</h4>
          <p>Use this reference number when contacting CV STACK on WhatsApp.</p>
          <button
            className="btn btn-primary wide-btn"
            type="button"
            onClick={() => window.open("https://wa.me/?text=Hello%20CV%20STACK", "_blank")}
          >
            Continue to WhatsApp
          </button>
        </div>
        </div>
    </PageShell>)}