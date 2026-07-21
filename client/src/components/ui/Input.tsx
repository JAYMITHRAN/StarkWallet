import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border bg-surface px-4 text-sm text-text placeholder:text-text-muted",
          "border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          "transition-colors duration-150",
          error && "border-danger focus-visible:ring-danger",
          className
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
