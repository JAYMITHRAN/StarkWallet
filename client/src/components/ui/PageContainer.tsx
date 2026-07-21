import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function PageContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10", className)}
      {...props}
    />
  );
}
