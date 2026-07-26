import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
const sizeMap = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
export function LoadingSpinner({ size = "md", label, className }) {
    return (_jsxs("div", { className: cn("flex flex-col items-center justify-center gap-2 text-text-muted", className), children: [_jsx(Loader2, { className: cn(sizeMap[size], "animate-spin text-accent"), "aria-hidden": true }), label && _jsx("p", { className: "text-sm", children: label })] }));
}
