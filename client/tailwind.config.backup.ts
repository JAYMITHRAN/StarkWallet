import type { Config } from "tailwindcss";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Stark Glass — Design Tokens
 * Dark-mode-only fintech theme. Do not add a light-mode palette in Phase 1.
 * Buttons: blue / black / white ONLY. Multi-color is reserved for charts.
 * ─────────────────────────────────────────────────────────────────────────
 */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0B1220",
        surface: "#111827",
        card: "#1E293B",
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
        },
        accent: "#38BDF8",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        text: {
          DEFAULT: "#F8FAFC",
          muted: "#94A3B8",
        },
        border: "rgba(148, 163, 184, 0.14)",
        glass: "rgba(30, 41, 59, 0.55)",
        // Chart-only categorical palette — never used for UI chrome.
        chart: {
          1: "#38BDF8",
          2: "#2563EB",
          3: "#22C55E",
          4: "#F59E0B",
          5: "#EF4444",
          6: "#A78BFA",
          7: "#F472B6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.35)",
        glow: "0 0 24px rgba(56, 189, 248, 0.25)",
      },
      backdropBlur: {
        glass: "16px",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
