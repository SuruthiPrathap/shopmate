import React, { useEffect, useState } from "react";

const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#facc15", "#14b8a6"];

const makePieces = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 6 + Math.random() * 8,
    color: COLORS[i % COLORS.length],
    delay: Math.random() * 1.2,
    duration: 2.8 + Math.random() * 2.2,
    drift: (Math.random() - 0.5) * 160,
    spin: 360 + Math.random() * 720,
    round: Math.random() < 0.3,
  }));

// Colour paper falling from the top of the screen to the bottom, then it removes itself.
function Confetti({ count = 90, showMs = 6500 }) {
  const [pieces] = useState(() => makePieces(count));
  const [visible, setVisible] = useState(
    () => !(typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
  );

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), showMs);
    return () => clearTimeout(t);
  }, [showMs]);

  if (!visible) return null;

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 100000 }} aria-hidden="true">
      <style>{`
        @keyframes shopmate-confetti-fall {
          0%   { transform: translate3d(0, -30px, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate3d(var(--drift), 105vh, 0) rotate(var(--spin)); opacity: 0.9; }
        }
      `}</style>
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 1.6,
            background: p.color,
            borderRadius: p.round ? "50%" : "2px",
            "--drift": `${p.drift}px`,
            "--spin": `${p.spin}deg`,
            animation: `shopmate-confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}

export default Confetti;