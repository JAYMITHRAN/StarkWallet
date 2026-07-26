import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Wallet, Settings } from "lucide-react";
import { Link } from "react-router-dom";
export function TopNavigation({ title }) {
    return (_jsxs("header", { className: "sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border bg-surface/70 px-4 backdrop-blur-glass lg:hidden", children: [_jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [_jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary", children: _jsx(Wallet, { className: "h-3.5 w-3.5 text-white", "aria-hidden": true }) }), _jsx("h1", { className: "text-sm font-semibold text-text truncate", children: title })] }), _jsx(Link, { to: "/settings", "aria-label": "Settings", className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/10 hover:text-text", children: _jsx(Settings, { className: "h-4 w-4", "aria-hidden": true }) })] }));
}
