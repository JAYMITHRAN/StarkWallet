import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle } from "lucide-react";
export function LowBalanceWarning({ remainingBalance }) {
    if (remainingBalance >= 1000)
        return null;
    return (_jsx("div", { className: "rounded-xl border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning", role: "status", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "h-4 w-4", "aria-hidden": true }), _jsxs("span", { children: ["Only ", remainingBalance.toFixed(2), " remains."] })] }) }));
}
