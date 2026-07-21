import { ArrowDownCircle, ArrowUpCircle, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@stark/shared/types/index";

interface TransactionCardProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export function TransactionCard({ transaction, onEdit, onDelete }: TransactionCardProps) {
  const isCashIn = transaction.type === "CASH_IN";
  const Icon = isCashIn ? ArrowDownCircle : ArrowUpCircle;
  return (
    <Card className="flex items-start justify-between gap-3 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-surface p-2">
          <Icon className={`h-4 w-4 ${isCashIn ? "text-success" : "text-danger"}`} aria-hidden />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-text">{transaction.reason || transaction.category}</p>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-text-muted">{transaction.category}</span>
          </div>
          <p className="mt-1 text-xs text-text-muted">{transaction.note || "No note provided"}</p>
          <p className="mt-1 text-[11px] text-text-muted">{formatDate(transaction.occurredAt)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${isCashIn ? "text-success" : "text-danger"}`}>{formatCurrency(transaction.amount)}</p>
        <div className="mt-2 flex items-center gap-1 text-[11px] text-text-muted">
          {onEdit && (
            <button type="button" className="rounded-lg p-1 hover:bg-white/5" onClick={() => onEdit(transaction)} aria-label="Edit transaction">
              <MoreHorizontal className="h-3 w-3" aria-hidden />
            </button>
          )}
          {onDelete && (
            <button type="button" className="rounded-lg p-1 hover:bg-white/5" onClick={() => onDelete(transaction)} aria-label="Delete transaction">
              <MoreHorizontal className="h-3 w-3" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
