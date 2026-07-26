import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as RadixToast from "@radix-ui/react-toast";
import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
const ToastContext = createContext(undefined);
const toneIcon = {
    success: CheckCircle2,
    danger: XCircle,
    info: Info,
};
const toneColor = {
    success: "text-success",
    danger: "text-danger",
    info: "text-accent",
};
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const show = useCallback((toast) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { ...toast, id }]);
    }, []);
    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    return (_jsx(ToastContext.Provider, { value: { show }, children: _jsxs(RadixToast.Provider, { swipeDirection: "right", duration: 4000, children: [children, toasts.map((toast) => {
                    const Icon = toneIcon[toast.tone];
                    return (_jsxs(RadixToast.Root, { onOpenChange: (open) => !open && dismiss(toast.id), className: "glass-panel flex items-start gap-3 p-4 shadow-glow animate-slide-up", children: [_jsx(Icon, { className: cn("mt-0.5 h-5 w-5 shrink-0", toneColor[toast.tone]), "aria-hidden": true }), _jsxs("div", { children: [_jsx(RadixToast.Title, { className: "text-sm font-medium text-text", children: toast.title }), toast.description && (_jsx(RadixToast.Description, { className: "mt-0.5 text-xs text-text-muted", children: toast.description }))] })] }, toast.id));
                }), _jsx(RadixToast.Viewport, { className: "fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" })] }) }));
}
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}
