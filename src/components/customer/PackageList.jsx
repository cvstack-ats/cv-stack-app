import React from "react";

export default function PackageList({ packages, selectedPackage, onSelect }) {
  return (
    <div className="package-list">
      {packages.map((pkg) => (
        <button
          key={pkg.id}
          type="button"
          className={`package-card ${
            selectedPackage?.id === pkg.id ? "package-card-selected" : ""
          }`}
          onClick={() => onSelect(pkg)}
        >
          <div className="package-top">
            <strong>{pkg.name}</strong>
            <span>₹{pkg.price}</span>
          </div>
          <div className="package-delivery">Delivery: {pkg.delivery_days ?? pkg.deliveryDays} day(s)</div>
          <ul className="package-features">
            {(pkg.features || []).map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </button>
      ))}
    </div>
  );
}