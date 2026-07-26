import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
export function TransactionList({ transactions, onEdit, onDelete }) {
    const sorted = useMemo(() => [...transactions].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()), [transactions]);
    if (!sorted.length)
        return null;
    return (_jsx("div", { className: "space-y-2", children: sorted.map((transaction) => (_jsxs(Card, { className: "flex items-start justify-between gap-3 rounded-2xl p-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "text-sm font-medium text-text", children: transaction.reason || transaction.category }), _jsx("span", { className: "rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-text-muted", children: transaction.category })] }), _jsx("p", { className: "mt-1 text-xs text-text-muted", children: transaction.note || "No note provided" }), _jsx("p", { className: "mt-1 text-[11px] text-text-muted", children: formatDate(transaction.occurredAt) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm font-semibold text-text", children: formatCurrency(transaction.amount) }), _jsx("p", { className: "text-[11px] text-text-muted", children: transaction.type === "CASH_IN" ? "Cash In" : "Cash Out" })] }), _jsxs("div", { className: "flex gap-1", children: [_jsx(Button, { variant: "ghost", size: "icon", "aria-label": `Edit ${transaction.id}`, onClick: () => onEdit(transaction), children: _jsx(MoreHorizontal, { className: "h-4 w-4", "aria-hidden": true }) }), _jsx(Button, { variant: "ghost", size: "icon", "aria-label": `Delete ${transaction.id}`, onClick: () => onDelete(transaction), children: _jsx(MoreHorizontal, { className: "h-4 w-4", "aria-hidden": true }) })] })] })] }, transaction.id))) }));
}
