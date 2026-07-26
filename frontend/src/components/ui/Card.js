import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
export function Card({ className, ...props }) {
    return _jsx("div", { className: cn("glass-panel p-5", className), ...props });
}
export function CardHeader({ className, ...props }) {
    return _jsx("div", { className: cn("mb-4 flex items-center justify-between", className), ...props });
}
export function CardTitle({ className, ...props }) {
    return _jsx("h3", { className: cn("text-sm font-medium text-text-muted", className), ...props });
}
export function CardContent({ className, ...props }) {
    return _jsx("div", { className: cn("", className), ...props });
}
