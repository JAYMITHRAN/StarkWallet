import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { Wallet, LogOut } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
export function Sidebar() {
    const { logout } = useAuth();
    return (_jsxs("aside", { className: "fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-surface/60 backdrop-blur-glass lg:flex", children: [_jsxs("div", { className: "flex h-16 items-center gap-2 px-6", children: [_jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary", children: _jsx(Wallet, { className: "h-4 w-4 text-white", "aria-hidden": true }) }), _jsx("span", { className: "text-sm font-semibold tracking-tight text-text", children: "StarkMoneyWalletTracker" })] }), _jsx("nav", { className: "flex-1 space-y-1 px-3 py-4", children: NAV_ITEMS.map(({ label, to, icon: Icon }) => (_jsxs(NavLink, { to: to, className: ({ isActive }) => cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", isActive ? "bg-primary/15 text-accent" : "text-text-muted hover:bg-white/5 hover:text-text"), children: [_jsx(Icon, { className: "h-4 w-4", "aria-hidden": true }), label] }, to))) }), _jsx("div", { className: "border-t border-border p-3", children: _jsxs("button", { onClick: logout, className: "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-danger", children: [_jsx(LogOut, { className: "h-4 w-4", "aria-hidden": true }), "Lock Wallet"] }) })] }));
}
