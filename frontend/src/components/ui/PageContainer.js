import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
export function PageContainer({ className, ...props }) {
    return (_jsx("div", { className: cn("mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10", className), ...props }));
}
