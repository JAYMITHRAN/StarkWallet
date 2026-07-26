import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
export const buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none", {
    variants: {
        variant: {
            primary: "bg-primary text-white hover:bg-primary-hover",
            black: "bg-black text-white border border-border hover:bg-white/5",
            white: "bg-white text-background hover:bg-white/90",
            ghost: "bg-transparent text-text hover:bg-white/5",
        },
        size: {
            sm: "h-9 px-3 text-sm",
            md: "h-11 px-4 text-sm",
            lg: "h-12 px-6 text-base",
            icon: "h-10 w-10",
        },
    },
    defaultVariants: { variant: "primary", size: "md" },
});
export const Button = forwardRef(({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
    return (_jsxs("button", { ref: ref, className: cn(buttonVariants({ variant, size }), className), disabled: disabled || isLoading, ...props, children: [isLoading && _jsx(Loader2, { className: "h-4 w-4 animate-spin", "aria-hidden": true }), children] }));
});
Button.displayName = "Button";
