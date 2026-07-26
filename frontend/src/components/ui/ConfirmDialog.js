import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", isDestructive = false, isLoading = false, onConfirm, }) {
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, title: title, description: description, children: _jsxs("div", { className: "mt-2 flex justify-end gap-2", children: [_jsx(Button, { variant: "ghost", onClick: () => onOpenChange(false), disabled: isLoading, children: cancelLabel }), _jsx(Button, { variant: isDestructive ? "black" : "primary", className: isDestructive ? "text-danger" : undefined, onClick: onConfirm, isLoading: isLoading, children: confirmLabel })] }) }));
}
