import { AlertTriangle } from "lucide-react";

interface LowBalanceWarningProps {
  remainingBalance: number;
}

export function LowBalanceWarning({ remainingBalance }: LowBalanceWarningProps) {
  if (remainingBalance >= 1000) return null;
  return (
    <div className="rounded-xl border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning" role="status">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        <span>Only {remainingBalance.toFixed(2)} remains.</span>
      </div>
    </div>
  );
}
