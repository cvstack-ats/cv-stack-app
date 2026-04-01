
import React, { useState } from "react";
import PageShell from "../components/common/PageShell";
import SectionHeader from "../components/common/SectionHeader";

export default function AdminLoginPage({ onBack, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      onLoginSuccess();
      return;
    }

    alert("Invalid admin login.");
  }

  return (
    <PageShell>
      <div className="page-top">
        <button className="text-link" onClick={onBack} type="button">
          ← Back
        </button>
        <div className="mini-logo">ADMIN</div>
      </div>

      <SectionHeader title="Admin Login" subtitle="Hidden admin access panel." />

      <form className="login-card" onSubmit={handleSubmit}>
        <div className="field-block">
          <label className="field-label">Username</label>
          <input className="field-input" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="field-block">
          <label className="field-label">Password</label>
          <input
            className="field-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary wide-btn" type="submit">
          Login
        </button>
      </form>
    </PageShell>
  );
}