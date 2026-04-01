import React, { useState } from "react";
import PageShell from "../components/common/PageShell";
import SectionHeader from "../components/common/SectionHeader";
import { useCircleMembers } from "../hooks/useCircleMembers";

export default function CircleLoginPage({ onBack, onLoginSuccess, onAdminLogin }) {
  const { circleMembers } = useCircleMembers();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tapCount, setTapCount] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();

    const found = circleMembers.find(
      (member) => member.username === username.trim() && member.password === password.trim()
    );

    if (!found) {
      alert("Invalid circle login.");
      return;
    }

    onLoginSuccess(found);
  }

  function handleHiddenAdmin() {
    const next = tapCount + 1;
    setTapCount(next);

    if (next >= 5) {
      onAdminLogin();
    }
  }

  return (
    <PageShell>
      <div className="page-top">
        <button className="text-link" onClick={onBack} type="button">
          ← Back
        </button>

        <button className="mini-logo hidden-admin-trigger" onClick={handleHiddenAdmin} type="button">
          CV STACK
        </button>
      </div>

      <SectionHeader
        title="Circle Member Login"
        subtitle="Login to track referrals, rewards and support."
      />

      <form className="login-card" onSubmit={handleSubmit}>
        <div className="field-block">
          <label className="field-label">Username</label>
          <input
            className="field-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div className="field-block">
          <label className="field-label">Password</label>
          <input
            className="field-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <button className="btn btn-primary wide-btn" type="submit">
          Login
        </button>

        <button
          className="btn btn-ghost wide-btn"
          type="button"
          onClick={() => window.open("https://wa.me/?text=Hello%20CV%20STACK%20Support", "_blank")}
        >
          Support WhatsApp
        </button>
      </form>
    </PageShell>
  );
}