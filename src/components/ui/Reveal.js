import React, { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  delay = 0,        // ms
  y = 16,           // deslocamento vertical
  once = true,      // anima só 1 vez
  threshold = 0.12, // % visível pra ativar
  className = "",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "isVisible" : ""} ${className}`}
      style={{
        "--reveal-delay": `${delay}ms`,
        "--reveal-y": `${y}px`,
      }}
    >
      {children}
    </div>
  );
}
