import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import { Wallet } from "lucide-react";
export function AuthLayout() {
    return (_jsxs("div", { className: "flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10", children: [_jsxs("div", { className: "mb-8 flex flex-col items-center gap-3", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-glow", children: _jsx(Wallet, { className: "h-6 w-6 text-white", "aria-hidden": true }) }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-base font-semibold text-text", children: "StarkMoneyWalletTracker" }), _jsx("p", { className: "text-xs text-text-muted", children: "Stark Glass \u00B7 Secure Ledger" })] })] }), _jsx("div", { className: "w-full max-w-sm", children: _jsx(Outlet, {}) })] }));
}
