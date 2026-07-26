import { formatCurrency } from "@/lib/utils";

interface BalancePreviewCardProps {
  currentBalance: number;
  expenseAmount: number;
}

export function BalancePreviewCard({ currentBalance, expenseAmount }: BalancePreviewCardProps) {
  const remaining = currentBalance - expenseAmount;
  return (
    <div className="rounded-2xl border border-border/70 bg-surface/70 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-muted">Current balance</span>
        <span className="font-semibold text-text">{formatCurrency(currentBalance)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-text-muted">Expense</span>
        <span className="font-semibold text-danger">{formatCurrency(expenseAmount)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-text-muted">Remaining</span>
        <span className="font-semibold text-success">{formatCurrency(remaining)}</span>
      </div>
    </div>
  );
}
