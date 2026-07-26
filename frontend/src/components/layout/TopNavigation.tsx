import { Wallet, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface TopNavigationProps {
  title: string;
}

export function TopNavigation({ title }: TopNavigationProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border bg-surface/70 px-4 backdrop-blur-glass lg:hidden">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Wallet className="h-3.5 w-3.5 text-white" aria-hidden />
        </div>
        <h1 className="text-sm font-semibold text-text truncate">{title}</h1>
      </div>
      <Link
        to="/settings"
        aria-label="Settings"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/10 hover:text-text"
      >
        <Settings className="h-4 w-4" aria-hidden />
      </Link>
    </header>
  );
}

