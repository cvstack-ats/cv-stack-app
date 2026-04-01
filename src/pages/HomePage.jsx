
import React from "react";
import PageShell from "../components/common/PageShell";
import { useAppSettings } from "../hooks/useAppSettings";

export default function HomePage({ onCreateCv, onCheckAts, onCircleLogin }) {
  const { settings, branding } = useAppSettings();

  const appName = settings?.app_name || "CV STACK";
  const heroTitle = settings?.hero_title || "Build a CV That Opens Doors";
  const heroSubtitle =
    settings?.hero_subtitle ||
    "Professional CV support designed to help you present yourself better, look more polished, and move closer to interview calls.";

  return (
    <PageShell>
      <div className="logo-wrap">
        <div className="logo-ring">
          <span>{appName}</span>
        </div>
      </div>

      <div className="hero-copy">
        <h1>{heroTitle}</h1>
        <p>{heroSubtitle}</p>
      </div>

      <div className="hero-actions">
        <button className="btn btn-primary" onClick={onCreateCv} type="button">
          Create My CV
        </button>
        <button className="btn btn-secondary" onClick={onCheckAts} type="button">
          Check ATS Score
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() =>
            window.open(
              `https://wa.me/${settings?.whatsapp_number || ""}?text=Hello%20${encodeURIComponent(appName)}`,
              "_blank"
            )
          }
        >
          {settings?.support_label || "WhatsApp Support"}
        </button>
      </div>

      <button className="circle-link" type="button" onClick={onCircleLogin}>
        Circle Member Login
      </button>
    </PageShell>
  );
}