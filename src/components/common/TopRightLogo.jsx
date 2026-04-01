import React from "react";
import { useAppSettings } from "../../hooks/useAppSettings";

export default function TopRightLogo({ onClickHome }) {
  const { settings } = useAppSettings();

  return (
    <button
      type="button"
      className="top-right-logo-btn"
      onClick={onClickHome}
      title="Go Home"
    >
      {settings?.logo_url ? (
        <img src={settings.logo_url} alt="CV STACK Logo" className="top-right-logo-img" />
      ) : (
        <span className="top-right-logo-text">CV STACK</span>
      )}
    </button>
  );
}