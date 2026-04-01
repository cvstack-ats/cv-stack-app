import React from "react";

export default function TemplateGrid({ templates, selectedTemplate, onSelect }) {
  return (
    <div className="template-grid template-grid-3">
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          className={`template-card ${
            selectedTemplate?.id === template.id ? "template-card-selected" : ""
          }`}
          onClick={() => onSelect(template)}
        >
          <div className="template-preview-sheet">
            <div className="template-preview-line line-1" />
            <div className="template-preview-line line-2" />
            <div className="template-preview-line line-3" />
            <div className="template-preview-line line-4" />
          </div>

          <div className="template-meta">
            <strong>{template.name}</strong>
            <span>{template.tag}</span>
            <small>{template.preview || "Preview available"}</small>
          </div>
        </button>
      ))}
    </div>
  );
}