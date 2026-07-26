import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from "./Card";
import { cn } from "@/lib/utils";
const toneClasses = {
    default: "text-text",
    success: "text-success",
    danger: "text-danger",
    accent: "text-accent",
};
export function DashboardCard({ label, value, icon: Icon, tone = "default", className }) {
    return (_jsxs(Card, { className: cn("flex items-center gap-4", className), children: [_jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface", children: _jsx(Icon, { className: cn("h-5 w-5", toneClasses[tone]), "aria-hidden": true }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "truncate text-xs text-text-muted", children: label }), _jsx("p", { className: cn("truncate text-lg font-semibold", toneClasses[tone]), children: value })] })] }));
}
