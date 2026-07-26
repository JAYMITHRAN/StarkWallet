import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
export function Dialog({ open, onOpenChange, title, description, children, className }) {
    return (_jsx(RadixDialog.Root, { open: open, onOpenChange: onOpenChange, children: _jsxs(RadixDialog.Portal, { children: [_jsx(RadixDialog.Overlay, { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" }), _jsxs(RadixDialog.Content, { className: cn("fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2", "glass-panel p-6 animate-slide-up", className), children: [_jsxs("div", { className: "mb-4 flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx(RadixDialog.Title, { className: "text-base font-semibold text-text", children: title }), description && (_jsx(RadixDialog.Description, { className: "mt-1 text-sm text-text-muted", children: description }))] }), _jsxs(RadixDialog.Close, { className: "rounded-lg p-1 text-text-muted hover:bg-white/5 hover:text-text", children: [_jsx(X, { className: "h-4 w-4", "aria-hidden": true }), _jsx("span", { className: "sr-only", children: "Close" })] })] }), children] })] }) }));
}
