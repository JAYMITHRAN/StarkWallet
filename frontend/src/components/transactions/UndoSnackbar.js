import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
export function UndoSnackbar({ open, onUndo, onDismiss }) {
    useEffect(() => {
        if (!open)
            return;
        const timeout = window.setTimeout(() => onDismiss(), 4000);
        return () => window.clearTimeout(timeout);
    }, [open, onDismiss]);
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed bottom-4 left-1/2 z-[70] -translate-x-1/2 rounded-2xl border border-border bg-surface px-4 py-3 shadow-glow", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-sm text-text", children: "Transaction deleted" }), _jsx(Button, { variant: "primary", size: "sm", onClick: onUndo, children: "Undo" })] }) }));
}
