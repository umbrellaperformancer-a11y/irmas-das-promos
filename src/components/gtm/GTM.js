import React from "react";

export default function GTM({ gtmId = "GTM-NRWHDJ6Q" }) {
  React.useEffect(() => {
    if (!gtmId) return;

    // evita duplicar
    if (document.getElementById("gtm-script")) return;

    // garante dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

    const script = document.createElement("script");
    script.id = "gtm-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;

    document.head.appendChild(script);

    // cleanup opcional (normalmente não precisa remover)
    return () => {};
  }, [gtmId]);

  // noscript precisa ficar dentro do body, então renderizamos aqui
  return (
    <noscript>
      <iframe
        title="gtm"
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
