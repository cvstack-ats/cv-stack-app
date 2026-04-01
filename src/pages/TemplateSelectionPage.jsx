import React, { useState } from "react";
import PageShell from "../components/common/PageShell";
import SectionHeader from "../components/common/SectionHeader";
import StepPill from "../components/common/StepPill";
import { useTemplates } from "../hooks/useTemplates";

export default function TemplateSelectionPage({
  selectedTemplate,
  onSelectTemplate,
  onBack,
  onNext,
}) {
  const templates = useTemplates();
  const [previewTemplate, setPreviewTemplate] = useState(null);

  return (
    <PageShell wide>
      <div className="page-top">
        <button className="text-link" onClick={onBack} type="button">
          ← Back
        </button>
        <div className="mini-logo">CV STACK</div>
      </div>

      <SectionHeader
        title="CV Template Selection"
        subtitle="Select your preferred template style."
      />

      <StepPill text="Step 2 of 4" />

      <div className="template-grid template-grid-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${
              selectedTemplate?.id === template.id ? "template-card-selected" : ""
            }`}
          >
            <div className="template-image-wrap">
              {template.preview_image_url ? (
                <img
                  src={template.preview_image_url}
                  alt={template.name}
                  className="template-image"
                />
              ) : (
                <div className="template-preview-sheet">
                  <div className="template-preview-line line-1" />
                  <div className="template-preview-line line-2" />
                  <div className="template-preview-line line-3" />
                  <div className="template-preview-line line-4" />
                </div>
              )}
            </div>

            <div className="template-meta">
              <strong>{template.name}</strong>
              <span>{template.tag || "CV Template"}</span>
            </div>

            <div className="template-card-actions">
              <button
                className="btn btn-ghost small-btn"
                type="button"
                onClick={() => setPreviewTemplate(template)}
              >
                Preview
              </button>

              <button
                className="btn btn-primary small-btn"
                type="button"
                onClick={() => onSelectTemplate(template)}
              >
                {selectedTemplate?.id === template.id ? "Selected" : "Select"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button className="btn btn-ghost" type="button" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" type="button" onClick={onNext}>
          Next
        </button>
      </div>

      {previewTemplate ? (
        <div className="template-preview-modal-overlay" onClick={() => setPreviewTemplate(null)}>
          <div
            className="template-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="template-preview-modal-top">
              <div>
                <h3>{previewTemplate.name}</h3>
                <p>{previewTemplate.tag || "CV Template"}</p>
              </div>

              <button
                className="btn btn-ghost small-btn"
                type="button"
                onClick={() => setPreviewTemplate(null)}
              >
                Close
              </button>
            </div>

            <div className="template-preview-modal-body">
              {previewTemplate.preview_image_url ? (
                <img
                  src={previewTemplate.preview_image_url}
                  alt={previewTemplate.name}
                  className="template-preview-large-image"
                />
              ) : (
                <div className="template-preview-large-fallback">
                  <div className="template-preview-line line-1" />
                  <div className="template-preview-line line-2" />
                  <div className="template-preview-line line-3" />
                  <div className="template-preview-line line-4" />
                  <div className="template-preview-line line-2" />
                  <div className="template-preview-line line-3" />
                </div>
              )}
            </div>

            <div className="template-preview-modal-actions">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  onSelectTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}