import { jsx as _jsx } from "react/jsx-runtime";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
export function SessionLoader() {
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: _jsx("div", { className: "glass-panel w-full max-w-sm p-6 text-center", children: _jsx(LoadingSpinner, { label: "Checking authentication...", size: "lg" }) }) }));
}
