import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
export function FormField({ label, htmlFor, error, hint, children, className }) {
    return (_jsxs("div", { className: cn("flex flex-col gap-1.5", className), children: [_jsx("label", { htmlFor: htmlFor, className: "text-sm font-medium text-text", children: label }), children, error ? (_jsx("p", { className: "text-xs text-danger", role: "alert", children: error })) : hint ? (_jsx("p", { className: "text-xs text-text-muted", children: hint })) : null] }));
}
