import React from "react";

export default function InputField({ label, required, type = "text", value, onChange, placeholder }) {
  return (
    <div className="field-block">
      <label className="field-label">
        {label} {required ? <span className="required">*</span> : null}
      </label>

      {type === "textarea" ? (
        <textarea
          className="field-input field-textarea"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="field-input"
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}