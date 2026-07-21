import { useEffect, useMemo, useState } from "react";
import { Wallet } from "lucide-react";
import "./LoadingScreen.css";

const BOOT_SEQUENCE = [
  "Initializing Stark OS...",
  "Loading Security...",
  "Loading Wallet Engine...",
  "Loading Analytics...",
  "Loading Components...",
  "Loading Dashboard...",
] as const;

const STEP_DURATION_MS = 320;

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (stepIndex < BOOT_SEQUENCE.length) {
      const timer = window.setTimeout(() => setStepIndex((i) => i + 1), STEP_DURATION_MS);
      return () => window.clearTimeout(timer);
    }

    setShowWelcome(true);
    const welcomeTimer = window.setTimeout(onComplete, 800);
    return () => window.clearTimeout(welcomeTimer);
  }, [stepIndex, onComplete]);

  const progress = useMemo(() => ((stepIndex + 1) / BOOT_SEQUENCE.length) * 100, [stepIndex]);
  const currentMessage = BOOT_SEQUENCE[Math.min(stepIndex, BOOT_SEQUENCE.length - 1)];

  return (
    <div className="loading-screen-shell fixed inset-0 z-[200]">
      <div className="arc-reactor-screen">
        <div className="arc-reactor" style={{ ["--glow" as string]: 0.85 }}>
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

          <svg className="ring ring--middle" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r="76" className="ring-track ring-track--dashed" />
          </svg>

          <svg className="ring ring--inner" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r="58" className="ring-track ring-track--thin" />
          </svg>

          <svg className="core" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="46" className="core-track" />
            <circle
              cx="60"
              cy="60"
              r="46"
              className="core-progress"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - progress / 100)}
            />
            <circle cx="60" cy="60" r="30" className="core-glow" />
          </svg>

          <div className="core-center" aria-hidden="true">
            <Wallet className="core-icon" />
          </div>
        </div>

        <div className="loading-copy">
          <p className="loading-label">Stark Wallet</p>
          {!showWelcome ? (
            <>
              <p className="loading-message">{currentMessage}</p>
              <div className="loading-bar" aria-hidden="true">
                <div className="loading-bar__fill" style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : (
            <p className="loading-message">Welcome to StarkMoneyWalletTracker</p>
          )}
        </div>
      </div>
    </div>
  );
}
