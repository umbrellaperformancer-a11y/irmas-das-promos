import React from "react";

export default function UrgencyPill({ text }) {
  if (!text) return null;

  return (
    <div
      className="urgencyPill"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 14px",
        borderRadius: 999,
        border: "1px solid rgba(255, 77, 79, 0.55)",
        color: "rgba(255, 77, 79, 0.95)",
        background: "rgba(255, 77, 79, 0.08)",
        fontWeight: 800,
        fontSize: 13,
      }}
    >
      {text}
    </div>
  );
}
