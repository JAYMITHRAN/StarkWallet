import { useState, useCallback } from "react";
import "./PlayButtonScreen.css";

interface PlayButtonScreenProps {
  /** Called once the fade-out animation finishes, to advance to Stage 2. */
  onPlay: () => void;
}

/**
 * STAGE 1 — Retro Play Button
 * A tactile, classic geometric play button rendered with layered radial /
 * linear gradients to fake a pressed, beveled golden-cream surface.
 * Tapping it triggers a CSS-driven fade-out, then hands control back to
 * the parent via `onPlay` so Stage 2 can mount.
 */
export default function PlayButtonScreen({ onPlay }: PlayButtonScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handlePress = useCallback(() => {
    if (isExiting) return; // guard against double-taps
    setIsExiting(true);

    // Match the CSS transition duration below (600ms) before unmounting.
    window.setTimeout(() => {
      onPlay();
    }, 600);
  }, [isExiting, onPlay]);

  return (
    <div className={`fade-layer intro-stage ${isExiting ? "fade-out" : ""}`}>
      <button
        className="play-button"
        aria-label="Play — enter portfolio"
        onClick={handlePress}
      >
        <span className="play-button__ring" />
        <span className="play-button__face">
          <svg
            className="play-button__icon"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="35,22 82,50 35,78" />
          </svg>
        </span>
      </button>
      <p className="play-button__label">TAP TO BEGIN</p>
    </div>
  );
}
