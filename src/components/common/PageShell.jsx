import React from "react";

export default function PageShell({ children, wide = false }) {
  return (
    <main className="app-shell">
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />
      <section className={`page-card ${wide ? "page-card-wide" : ""}`}>{children}</section>
    </main>
  );
}