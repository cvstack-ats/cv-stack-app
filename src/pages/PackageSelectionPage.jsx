import React from "react";
import PageShell from "../components/common/PageShell";
import SectionHeader from "../components/common/SectionHeader";
import StepPill from "../components/common/StepPill";
import { usePackages } from "../hooks/usePackages";

export default function PackageSelectionPage({
  selectedPackage,
  onSelectPackage,
  referralCode,
  referralMessage,
  onReferralCodeChange,
  onBack,
  onNext,
}) {
  const packages = usePackages();

  return (
    <PageShell>
      <div className="page-top">
        <button className="text-link" onClick={onBack} type="button">
          ← Back
        </button>
        <div className="mini-logo">CV STACK</div>
      </div>

      <SectionHeader
        title="Package Selection"
        subtitle="Choose the package that fits your requirement."
      />

      <StepPill text="Step 3 of 4" />

      <div className="package-list">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            className={`package-card ${
              selectedPackage?.id === pkg.id ? "package-card-selected" : ""
            }`}
            onClick={() => onSelectPackage(pkg)}
          >
            <div className="package-top">
              <strong>{pkg.name}</strong>
              <span>₹{pkg.price}</span>
            </div>

            <div className="package-delivery">
              Delivery: {pkg.delivery_days} day(s)
            </div>

            <ul className="package-features">
              {(pkg.features || []).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="field-block">
        <label className="field-label">Referral Code</label>
        <input
          className="field-input"
          type="text"
          placeholder="Enter referral code if available"
          value={referralCode}
          onChange={(e) => onReferralCodeChange(e.target.value)}
        />
        {referralMessage ? <div className="login-note">{referralMessage}</div> : null}
      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" type="button" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" type="button" onClick={onNext}>
          Next Payment
        </button>
      </div>
    </PageShell>
  );
}