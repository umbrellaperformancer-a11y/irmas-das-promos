import React from "react";

export default function Manutencao() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        padding: 24,
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 12 }}>
        🚧 Site em manutenção
      </h1>
      <p style={{ opacity: 0.7, maxWidth: 420 }}>
        Estamos ajustando alguns detalhes para melhorar sua experiência.
        Voltamos em breve.
      </p>
    </div>
  );
}
