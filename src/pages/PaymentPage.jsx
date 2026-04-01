import React from "react";
import PageShell from "../components/common/PageShell";
import SectionHeader from "../components/common/SectionHeader";
import StepPill from "../components/common/StepPill";

export default function PaymentPage({
  selectedTemplate,
  selectedPackage,
  referralDiscount,
  paymentLoading,
  onBack,
  onPayNow,
}) {
  const total = Math.max(Number(selectedPackage?.price || 0) - Number(referralDiscount || 0), 0);

  return (
    <PageShell>
      <div className="page-top">
        <button className="text-link" onClick={onBack} type="button">
          ← Back
        </button>
        <div className="mini-logo">CV STACK</div>
      </div>

      <SectionHeader title="Payment" subtitle="Review your order before payment." />
      <StepPill text="Step 4 of 4" />

      <div className="result-card">
        <div className="summary-row">
          <span>Template</span>
          <strong>{selectedTemplate?.name || "-"}</strong>
        </div>
        <div className="summary-row">
          <span>Package</span>
          <strong>{selectedPackage?.name || "-"}</strong>
        </div>
        <div className="summary-row">
          <span>Package Price</span>
          <strong>₹{selectedPackage?.price || 0}</strong>
        </div>
        <div className="summary-row">
          <span>Referral Discount</span>
          <strong>- ₹{referralDiscount || 0}</strong>
        </div>
        <div className="summary-row total-row">
          <span>Total</span>
          <strong>₹{total}</strong>
        </div>

        <div className="sales-box">
          <h4>Payment Gateway</h4>
          <p>This button saves the order in Supabase for now.</p>
          <button
            className="btn btn-primary wide-btn"
            type="button"
            onClick={onPayNow}
            disabled={paymentLoading}
          >
            {paymentLoading ? "Saving Order..." : "Pay Now"}
          </button>
        </div>
      </div>
    </PageShell>
  );
}