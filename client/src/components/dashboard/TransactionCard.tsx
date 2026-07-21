import { ArrowDownCircle, ArrowUpCircle, Wallet2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Transaction } from "@stark/shared/types/index";

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const isCashIn = transaction.type === "CASH_IN";
  const Icon = isCashIn ? ArrowDownCircle : ArrowUpCircle;
  const toneClass = isCashIn ? "text-success" : "text-danger";

  return (
    <Card className="flex items-start justify-between gap-3 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 rounded-xl bg-surface p-2", toneClass)}>
          <Icon className="h-4 w-4" aria-hidden />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-text">{transaction.type.replace("_", " ")}</p>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-text-muted">
              {transaction.category}
            </span>
          </div>
          <p className="mt-1 text-xs text-text-muted">{transaction.note || "No note provided"}</p>
          <p className="mt-1 text-[11px] text-text-muted">{formatDate(transaction.occurredAt)} • {new Date(transaction.occurredAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn("text-sm font-semibold", toneClass)}>{formatCurrency(transaction.amount)}</p>
        <div className="mt-2 flex items-center gap-1 text-[11px] text-text-muted">
          <Wallet2 className="h-3 w-3" aria-hidden />
          <span>Recorded</span>
        </div>
      </div>
    </Card>
  );
}
