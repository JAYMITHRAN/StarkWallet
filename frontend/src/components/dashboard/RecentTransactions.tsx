import { Receipt } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Transaction } from "@stark/shared/types/index";
import { TransactionCard } from "./TransactionCard";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (!transactions.length) {
    return (
      <EmptyState
        icon={Receipt}
        title="No transactions yet"
        description="Log a cash-in or cash-out to populate your activity feed."
      />
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}
