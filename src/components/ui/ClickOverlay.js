import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function ClickOverlay({ open }) {
    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 999999,
                display: "grid",
                placeItems: "center",
                background: "rgba(0,0,0,0.65)",
            }}
        >
            <div style={{ color: "#fff", fontWeight: 900, position: "absolute", top: 20, left: 20 }}>
                <DotLottieReact
                    src="https://lottie.host/e8bb0508-d764-4eb5-894d-98d67194ac9f/evVOvvAsDK.lottie"
                    autoplay
                    loop={false}
                    style={{ width: "min(80vw, 820px)", height: "min(80vh, 820px)" }}
                />
            </div>
            {/* pode deixar o lottie ou comentar */}
        </div>
    );
}
