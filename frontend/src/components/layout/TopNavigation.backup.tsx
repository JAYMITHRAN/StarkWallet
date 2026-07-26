import { Wallet } from "lucide-react";

interface TopNavigationProps {
  title: string;
}

export function TopNavigation({ title }: TopNavigationProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-surface/70 px-4 backdrop-blur-glass lg:hidden">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
        <Wallet className="h-3.5 w-3.5 text-white" aria-hidden />
      </div>
      <h1 className="text-sm font-semibold text-text">{title}</h1>
    </header>
  );
}
