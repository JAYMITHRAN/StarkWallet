import { useEffect, useRef, useState } from "react";
import "./ArcReactorScreen.css";

interface ArcReactorScreenProps {
  /** Total charge duration in ms. Defaults to 3000ms per spec. */
  durationMs?: number;
  /** Called once charging reaches 100%, to navigate to the main portfolio. */
  onChargeComplete: () => void;
}

const CORE_RADIUS = 46;
const CORE_CIRCUMFERENCE = 2 * Math.PI * CORE_RADIUS;

/**
 * STAGE 2 — Golden Jarvis Arc Reactor
 * Pure SVG + CSS implementation:
 *  - Three concentric rings spin continuously at different speeds/directions
 *    via CSS animation (GPU-accelerated `transform: rotate`, smooth at 60fps).
 *  - The inner core "charges" via a stroke-dashoffset animation driven by
 *    requestAnimationFrame, so we can read exact progress and fire a single
 *    completion callback precisely at 100%, instead of relying on brittle
 *    CSS transitionend events.
 */
export default function ArcReactorScreen({
  durationMs = 3000,
  onChargeComplete,
}: ArcReactorScreenProps) {
  const [progress, setProgress] = useState(0); // 0 - 100
  const rafId = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const hasCompleted = useRef(false);

  useEffect(() => {
    const tick = (timestamp: number) => {
      if (startTime.current === null) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(pct);

      if (pct < 100) {
        rafId.current = requestAnimationFrame(tick);
      } else if (!hasCompleted.current) {
        hasCompleted.current = true;
        // Small buffer so the "100%" glow state is visible before we leave.
        window.setTimeout(onChargeComplete, 250);
      }
    };

    rafId.current = requestAnimationFrame(tick);

    // Proper lifecycle cleanup: cancel any in-flight frame on unmount.
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [durationMs, onChargeComplete]);

  const dashOffset = CORE_CIRCUMFERENCE * (1 - progress / 100);
  const glowIntensity = 0.35 + (progress / 100) * 0.65; // 0.35 -> 1.0

  return (
    <div className="fade-layer fade-in intro-stage arc-reactor-screen">
      <div className="arc-reactor" style={{ ["--glow" as string]: glowIntensity }}>
        {/* Outer ring — slow clockwise spin */}
        <svg className="ring ring--outer" viewBox="0 0 220 220">
          <circle cx="110" cy="110" r="100" className="ring-track" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * 360;
            return (
              <line
                key={i}
                x1="110"
                y1="10"
                x2="110"
                y2="24"
                className="ring-tick"
                transform={`rotate(${angle} 110 110)`}
              />
            );
          })}
        </svg>

        {/* Middle ring — medium speed, reverse direction */}
        <svg className="ring ring--middle" viewBox="0 0 220 220">
          <circle cx="110" cy="110" r="76" className="ring-track ring-track--dashed" />
        </svg>

        {/* Inner ring — fastest spin */}
        <svg className="ring ring--inner" viewBox="0 0 220 220">
          <circle cx="110" cy="110" r="58" className="ring-track ring-track--thin" />
        </svg>

        {/* Core — charges from 0% to 100% over `durationMs` */}
        <svg className="core" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={CORE_RADIUS} className="core-track" />
          <circle
            cx="60"
            cy="60"
            r={CORE_RADIUS}
            className="core-progress"
            strokeDasharray={CORE_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
          <circle cx="60" cy="60" r="30" className="core-glow" />
        </svg>

        <span className="core-percentage">{Math.round(progress)}%</span>
      </div>

      <p className="arc-reactor-label">CHARGING SYSTEMS</p>
    </div>
  );
}
