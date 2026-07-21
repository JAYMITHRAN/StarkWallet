import { ArrowDownCircle, ArrowUpCircle, History, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const actions = [
  { to: "/cash-in", label: "Cash In", icon: ArrowDownCircle, variant: "primary" as const },
  { to: "/cash-out", label: "Cash Out", icon: ArrowUpCircle, variant: "black" as const },
  { to: "/history", label: "History", icon: History, variant: "ghost" as const },
  { to: "/settings", label: "Settings", icon: Settings, variant: "ghost" as const },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map(({ to, label, icon: Icon, variant }) => (
        <Link key={to} to={to} className={cn(buttonVariants({ variant, size: "lg" }), "justify-center") }>
          <Icon className="h-4 w-4" aria-hidden />
          <span>{label}</span>
        </Link>
      ))}
    </div>
  );
}
