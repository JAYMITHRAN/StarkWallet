import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { ArrowDownCircle, ArrowUpCircle, Clock3, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
const groupLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(date);
    let label = formattedDate;
    if (isToday) {
        label = `Today — ${formattedDate}`;
    }
    else if (isYesterday) {
        label = `Yesterday — ${formattedDate}`;
    }
    // Group by the local date string representation to ensure correct grouping
    const groupKey = date.toDateString();
    // Sort descending: newest dates first
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return { label, groupKey, order: -startOfDay };
};
export function formatTime(iso) {
    return new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    }).format(new Date(iso));
}
export function TransactionTimeline({ transactions, onEdit, onDelete }) {
    if (!transactions.length)
        return null;
    // Group by groupKey, but also track the label and sort order
    const groupMap = new Map();
    transactions.forEach((transaction) => {
        const { label, groupKey, order } = groupLabel(transaction.occurredAt);
        if (!groupMap.has(groupKey)) {
            groupMap.set(groupKey, { label, order, items: [] });
        }
        groupMap.get(groupKey).items.push(transaction);
    });
    // Sort groups by their computed order (ascending computed order means descending date since order is negative timestamp)
    const orderedGroups = Array.from(groupMap.values()).sort((a, b) => a.order - b.order);
    return (_jsx("div", { className: "space-y-6", children: orderedGroups.map((group) => (_jsxs("div", { children: [_jsx("div", { className: "mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted", children: group.label }), _jsx("div", { className: "space-y-2", children: group.items.map((transaction) => {
                        const isCashIn = transaction.type === "CASH_IN";
                        return (_jsxs(Card, { className: "flex items-center gap-3 rounded-2xl p-3 group hover:bg-white/[0.03] transition-colors", children: [_jsx("div", { className: cn("flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl", isCashIn ? "bg-success/10" : "bg-danger/10"), children: isCashIn
                                        ? _jsx(ArrowDownCircle, { className: "h-4 w-4 text-success", "aria-hidden": true })
                                        : _jsx(ArrowUpCircle, { className: "h-4 w-4 text-danger", "aria-hidden": true }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-text truncate", children: transaction.reason || transaction.category }), _jsxs("p", { className: "mt-0.5 text-xs text-text-muted truncate", children: [transaction.category, transaction.note ? ` • ${transaction.note}` : ""] })] }), _jsxs("div", { className: "text-right flex-shrink-0 mr-1", children: [_jsxs("p", { className: cn("text-sm font-bold font-mono", isCashIn ? "text-success" : "text-danger"), children: [isCashIn ? "+" : "−", formatCurrency(transaction.amount)] }), _jsxs("div", { className: "mt-0.5 flex items-center justify-end gap-1 text-[11px] text-text-muted", children: [_jsx(Clock3, { className: "h-3 w-3", "aria-hidden": true }), _jsx("span", { children: formatTime(transaction.occurredAt) })] })] }), (onEdit || onDelete) && (_jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0", children: [onEdit && (_jsx("button", { onClick: () => onEdit(transaction), title: "Edit transaction", className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-primary/15 hover:text-primary transition-colors", children: _jsx(Pencil, { className: "h-3.5 w-3.5" }) })), onDelete && (_jsx("button", { onClick: () => onDelete(transaction), title: "Delete transaction", className: "flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-danger/15 hover:text-danger transition-colors", children: _jsx(Trash2, { className: "h-3.5 w-3.5" }) }))] }))] }, transaction.id));
                    }) })] }, group.label))) }));
}
