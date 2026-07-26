import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
export const PasswordInput = forwardRef(({ className, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (_jsxs("div", { className: "relative", children: [_jsx(Input, { ref: ref, type: showPassword ? "text" : "password", error: error, className: cn("pr-12", className), ...props }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-3 flex items-center text-text-muted transition-colors hover:text-text", onClick: () => setShowPassword((value) => !value), "aria-label": showPassword ? "Hide password" : "Show password", children: showPassword ? _jsx(EyeOff, { className: "h-4 w-4", "aria-hidden": true }) : _jsx(Eye, { className: "h-4 w-4", "aria-hidden": true }) })] }));
});
PasswordInput.displayName = "PasswordInput";
