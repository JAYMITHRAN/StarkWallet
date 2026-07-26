import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
];
const STEP_DURATION_MS = 320;
export function LoadingScreen({ onComplete }) {
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
    return (_jsx("div", { className: "loading-screen-shell fixed inset-0 z-[200]", children: _jsxs("div", { className: "arc-reactor-screen", children: [_jsxs("div", { className: "arc-reactor", style: { ["--glow"]: 0.85 }, children: [_jsxs("svg", { className: "ring ring--outer", viewBox: "0 0 220 220", children: [_jsx("circle", { cx: "110", cy: "110", r: "100", className: "ring-track" }), Array.from({ length: 24 }).map((_, i) => {
                                    const angle = (i / 24) * 360;
                                    return (_jsx("line", { x1: "110", y1: "10", x2: "110", y2: "24", className: "ring-tick", transform: `rotate(${angle} 110 110)` }, i));
                                })] }), _jsx("svg", { className: "ring ring--middle", viewBox: "0 0 220 220", children: _jsx("circle", { cx: "110", cy: "110", r: "76", className: "ring-track ring-track--dashed" }) }), _jsx("svg", { className: "ring ring--inner", viewBox: "0 0 220 220", children: _jsx("circle", { cx: "110", cy: "110", r: "58", className: "ring-track ring-track--thin" }) }), _jsxs("svg", { className: "core", viewBox: "0 0 120 120", children: [_jsx("circle", { cx: "60", cy: "60", r: "46", className: "core-track" }), _jsx("circle", { cx: "60", cy: "60", r: "46", className: "core-progress", strokeDasharray: 2 * Math.PI * 46, strokeDashoffset: 2 * Math.PI * 46 * (1 - progress / 100) }), _jsx("circle", { cx: "60", cy: "60", r: "30", className: "core-glow" })] }), _jsx("div", { className: "core-center", "aria-hidden": "true", children: _jsx(Wallet, { className: "core-icon" }) })] }), _jsxs("div", { className: "loading-copy", children: [_jsx("p", { className: "loading-label", children: "Stark Wallet" }), !showWelcome ? (_jsxs(_Fragment, { children: [_jsx("p", { className: "loading-message", children: currentMessage }), _jsx("div", { className: "loading-bar", "aria-hidden": "true", children: _jsx("div", { className: "loading-bar__fill", style: { width: `${progress}%` } }) })] })) : (_jsx("p", { className: "loading-message", children: "Welcome to StarkMoneyWalletTracker" }))] })] }) }));
}
