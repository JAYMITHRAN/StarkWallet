import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Wallet } from "lucide-react";
export function TopNavigation({ title }) {
    return (_jsxs("header", { className: "sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-surface/70 px-4 backdrop-blur-glass lg:hidden", children: [_jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary", children: _jsx(Wallet, { className: "h-3.5 w-3.5 text-white", "aria-hidden": true }) }), _jsx("h1", { className: "text-sm font-semibold text-text", children: title })] }));
}
