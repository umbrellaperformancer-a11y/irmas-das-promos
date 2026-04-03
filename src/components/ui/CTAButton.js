import React from "react";

const ALLOW_HOSTS = new Set([
  "chat.whatsapp.com",
  "wa.me",
  "api.whatsapp.com",
  "web.whatsapp.com",
  "sndflw.com",
]);

function sanitizeWhatsappUrl(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;

  // garante protocolo
  const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  let url;
  try {
    url = new URL(withProto);
  } catch {
    return null;
  }

  // só https
  if (url.protocol !== "https:") return null;

  // remove lixo comum de ads (não é obrigatório, mas ajuda a “limpar”)
  ["fbclid", "gclid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) =>
    url.searchParams.delete(k)
  );

  // só hosts permitidos
  if (!ALLOW_HOSTS.has(url.hostname)) return null;

  return url.toString();
}

const WhatsIcon = ({ size = 18, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="currentColor"
    style={style}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16.003 3C9.384 3 4 8.38 4 14.999c0 2.646.863 5.09 2.32 7.065L4 29l7.143-2.276a11.94 11.94 0 004.86 1.01h.001c6.617 0 12-5.38 12-11.999C28.004 8.38 22.62 3 16.003 3zm0 21.818a9.82 9.82 0 01-4.998-1.37l-.357-.21-4.24 1.352 1.384-4.126-.233-.373a9.804 9.804 0 01-1.495-5.092c0-5.46 4.44-9.9 9.94-9.9 5.484 0 9.937 4.44 9.937 9.9 0 5.46-4.453 9.819-9.938 9.819zm5.443-7.34c-.298-.15-1.764-.87-2.037-.969-.273-.1-.472-.15-.67.15-.198.298-.77.968-.944 1.167-.173.198-.347.223-.645.075-.298-.15-1.258-.463-2.397-1.477-.887-.792-1.486-1.77-1.66-2.068-.173-.298-.018-.458.13-.606.134-.133.298-.347.447-.52.15-.174.198-.298.298-.496.1-.198.05-.372-.025-.521-.075-.15-.67-1.612-.918-2.206-.242-.58-.487-.502-.67-.512l-.572-.01c-.198 0-.52.075-.793.372-.273.298-1.04 1.018-1.04 2.48 0 1.463 1.066 2.875 1.214 3.074.15.198 2.097 3.2 5.077 4.487.709.306 1.262.489 1.693.626.712.226 1.36.194 1.873.118.572-.085 1.764-.72 2.012-1.414.248-.695.248-1.29.173-1.414-.075-.124-.273-.198-.57-.347z" />
  </svg>
);


export default function CTAButton({
  href,
  children,
  onClicked,
  gtmEventName = "leads-facebook",
  delayMs = 300,
}) {
  const safeTarget = sanitizeWhatsappUrl(href);

  const fireGTMEvent = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: gtmEventName,
      source: "blackclub_landing",
      action: "cta_click",
      destination: "whatsapp_group",
      href: safeTarget || "",
      ts: Date.now(),
    });
  };

  const go = () => {
    if (!safeTarget) return;
    window.location.assign(safeTarget);
  };

  const onClick = (e) => {
    e.preventDefault();
    fireGTMEvent();
    if (onClicked) onClicked();
    setTimeout(go, delayMs);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="ctaRound"
      aria-label="ENTRAR NO GRUPO DE PROMOÇÕES"
      disabled={!safeTarget}
      style={!safeTarget ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
    >
      <span className="ctaRoundGlow" aria-hidden="true" />
      <span className="ctaRoundInner">
        <span
          className="ctaRoundIcon"
          style={{ marginRight: 8, display: "flex", alignItems: "center" }}
        >
          <WhatsIcon size={25} style={{ color: '#000' }} />
        </span>
        <span className="ctaRoundText">{children}</span>
      </span>
    </button>
  );

}
