import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { BOTTOM_NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";
export function BottomNavigation() {
    return (_jsx("nav", { className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/80 backdrop-blur-glass lg:hidden", children: _jsx("div", { className: "flex items-center justify-around px-2 py-2", style: { paddingBottom: "env(safe-area-inset-bottom)" }, children: BOTTOM_NAV_ITEMS.map(({ label, to, icon: Icon }) => (_jsxs(NavLink, { to: to, className: ({ isActive }) => cn("flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors", isActive ? "text-accent" : "text-text-muted"), children: [_jsx(Icon, { className: "h-5 w-5", "aria-hidden": true }), label] }, to))) }) }));
}
