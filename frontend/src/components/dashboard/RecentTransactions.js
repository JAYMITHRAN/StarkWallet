import { jsx as _jsx } from "react/jsx-runtime";
import { Receipt } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { TransactionCard } from "./TransactionCard";
export function RecentTransactions({ transactions }) {
    if (!transactions.length) {
        return (_jsx(EmptyState, { icon: Receipt, title: "No transactions yet", description: "Log a cash-in or cash-out to populate your activity feed." }));
    }
    return (_jsx("div", { className: "space-y-3", children: transactions.map((transaction) => (_jsx(TransactionCard, { transaction: transaction }, transaction.id))) }));
}
