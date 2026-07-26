import { useMemo } from "react";
import { MoreHorizontal } from "lucide-react";
import type { Transaction } from "@stark/shared/types/index";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const sorted = useMemo(() => [...transactions].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()), [transactions]);

  if (!sorted.length) return null;

  return (
    <div className="space-y-2">
      {sorted.map((transaction) => (
        <Card key={transaction.id} className="flex items-start justify-between gap-3 rounded-2xl p-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-text">{transaction.reason || transaction.category}</p>
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-text-muted">{transaction.category}</span>
            </div>
            <p className="mt-1 text-xs text-text-muted">{transaction.note || "No note provided"}</p>
            <p className="mt-1 text-[11px] text-text-muted">{formatDate(transaction.occurredAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-semibold text-text">{formatCurrency(transaction.amount)}</p>
              <p className="text-[11px] text-text-muted">{transaction.type === "CASH_IN" ? "Cash In" : "Cash Out"}</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" aria-label={`Edit ${transaction.id}`} onClick={() => onEdit(transaction)}>
                <MoreHorizontal className="h-4 w-4" aria-hidden />
              </Button>
              <Button variant="ghost" size="icon" aria-label={`Delete ${transaction.id}`} onClick={() => onDelete(transaction)}>
                <MoreHorizontal className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
