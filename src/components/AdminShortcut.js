// src/components/AdminShortcut.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminShortcut() {
  const navigate = useNavigate();

  useEffect(() => {
    // ----- DESKTOP: Ctrl + A + M
    const handleKeyDown = (e) => {
      const isCtrl = e.ctrlKey || e.metaKey; // metaKey = Mac
      const isA = e.key.toLowerCase() === "a";
      const isM = e.key.toLowerCase() === "m";

      // Guardamos o estado da tecla A
      if (isCtrl && isA) {
        window.__adminShortcutA = true;
        e.preventDefault();
      }

      if (isCtrl && window.__adminShortcutA && isM) {
        e.preventDefault();
        navigate("/admin");
      }
    };

    const handleKeyUp = () => {
      window.__adminShortcutA = false;
    };

    // ----- MOBILE: 3 dedos na tela
    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length === 3) {
        navigate("/admin");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [navigate]);

  return null; // não renderiza nada
}
