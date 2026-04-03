import React from "react";

export default function ProofStrip({ text }) {
  if (!text) return null;
  return (
    <div style={{ opacity: 0.85, fontSize: 13, textAlign: "center" }}>
      {text}
    </div>
  );
}
