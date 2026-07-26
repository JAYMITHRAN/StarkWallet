import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowDownCircle, ArrowUpCircle, History, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
const actions = [
    { to: "/cash-in", label: "Cash In", icon: ArrowDownCircle, variant: "primary" },
    { to: "/cash-out", label: "Cash Out", icon: ArrowUpCircle, variant: "black" },
    { to: "/history", label: "History", icon: History, variant: "ghost" },
    { to: "/settings", label: "Settings", icon: Settings, variant: "ghost" },
];
export function QuickActions() {
    return (_jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: actions.map(({ to, label, icon: Icon, variant }) => (_jsxs(Link, { to: to, className: cn(buttonVariants({ variant, size: "lg" }), "justify-center"), children: [_jsx(Icon, { className: "h-4 w-4", "aria-hidden": true }), _jsx("span", { children: label })] }, to))) }));
}
