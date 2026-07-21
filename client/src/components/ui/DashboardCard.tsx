import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "danger" | "accent";
  className?: string;
}

const toneClasses: Record<NonNullable<DashboardCardProps["tone"]>, string> = {
  default: "text-text",
  success: "text-success",
  danger: "text-danger",
  accent: "text-accent",
};

export function DashboardCard({ label, value, icon: Icon, tone = "default", className }: DashboardCardProps) {
  return (
    <Card className={cn("flex items-center gap-4", className)}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface">
        <Icon className={cn("h-5 w-5", toneClasses[tone])} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-text-muted">{label}</p>
        <p className={cn("truncate text-lg font-semibold", toneClasses[tone])}>{value}</p>
      </div>
    </Card>
  );
}
