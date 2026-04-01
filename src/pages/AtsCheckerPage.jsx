import React, { useState } from "react";
import PageShell from "../components/common/PageShell";
import SectionHeader from "../components/common/SectionHeader";
import { calculateDeterministicAtsScore } from "../utils/ats";

export default function AtsCheckerPage({ onBack }) {
  const [cvText, setCvText] = useState("");
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState(null);

  function handleCheck() {
    const data = calculateDeterministicAtsScore(cvText, jdText);
    setResult(data);
  }

  return (
    <PageShell>
      <div className="page-top">
        <button className="text-link" onClick={onBack} type="button">
          ← Back
        </button>
        <div className="mini-logo">CV STACK</div>
      </div>

      <SectionHeader
        title="ATS Score Checker"
        subtitle="Paste CV text and job description for a stable score."
      />

      <div className="ats-box">
        <div className="field-block">
          <label className="field-label">CV Text</label>
          <textarea
            className="field-input field-textarea"
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            placeholder="Paste CV text here"
          />
        </div>

        <div className="field-block">
          <label className="field-label">Job Description</label>
          <textarea
            className="field-input field-textarea"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste job description here"
          />
        </div>

        <button className="btn btn-primary wide-btn" type="button" onClick={handleCheck}>
          Check My ATS Score
        </button>
      </div>

      {result ? (
        <div className="result-card">
          <div className="score-badge">{result.score}</div>
          <h3>ATS Match Score</h3>
          <p className="result-summary">{result.summary}</p>
        </div>
      ) : null}
    </PageShell>
  );
}