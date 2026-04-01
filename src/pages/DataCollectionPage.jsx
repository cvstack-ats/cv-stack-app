import React from "react";
import PageShell from "../components/common/PageShell";
import SectionHeader from "../components/common/SectionHeader";
import StepPill from "../components/common/StepPill";
import InputField from "../components/common/InputField";
import { useFormFields } from "../hooks/useFormFields";

export default function DataCollectionPage({ formData, onBack, onChange, onNext }) {
  const { formFields, loading } = useFormFields();

  return (
    <PageShell>
      <div className="page-top">
        <button className="text-link" onClick={onBack} type="button">
          ← Back
        </button>
        <div className="mini-logo">CV STACK</div>
      </div>

      <SectionHeader
        title="Data Collection"
        subtitle="Complete your details before selecting template and package."
      />

      <StepPill text="Step 1 of 4" />

      {loading ? <div className="login-note">Loading form fields...</div> : null}

      <form className="form-grid" onSubmit={(e) => onNext(e, formFields)}>
        {formFields.map((field) => (
          <InputField
            key={field.field_key}
            label={field.label}
            required={field.is_required}
            type={field.type}
            value={formData[field.field_key] || ""}
            onChange={(value) => onChange(field.field_key, value)}
            placeholder={field.placeholder}
          />
        ))}

        <div className="form-actions">
          <button className="btn btn-ghost" type="button" onClick={onBack}>
            Back
          </button>
          <button className="btn btn-primary" type="submit">
            Next: Templates
          </button>
        </div>
      </form>
    </PageShell>
  );
}