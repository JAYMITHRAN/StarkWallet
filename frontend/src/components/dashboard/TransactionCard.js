import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowDownCircle, ArrowUpCircle, Wallet2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
export function TransactionCard({ transaction }) {
    const isCashIn = transaction.type === "CASH_IN";
    const Icon = isCashIn ? ArrowDownCircle : ArrowUpCircle;
    const toneClass = isCashIn ? "text-success" : "text-danger";
    return (_jsxs(Card, { className: "flex items-start justify-between gap-3 rounded-2xl p-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: cn("mt-0.5 rounded-xl bg-surface p-2", toneClass), children: _jsx(Icon, { className: "h-4 w-4", "aria-hidden": true }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "text-sm font-medium text-text", children: transaction.type.replace("_", " ") }), _jsx("span", { className: "rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-text-muted", children: transaction.category })] }), _jsx("p", { className: "mt-1 text-xs text-text-muted", children: transaction.note || "No note provided" }), _jsxs("p", { className: "mt-1 text-[11px] text-text-muted", children: [formatDate(transaction.occurredAt), " \u2022 ", new Date(transaction.occurredAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })] })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: cn("text-sm font-semibold", toneClass), children: formatCurrency(transaction.amount) }), _jsxs("div", { className: "mt-2 flex items-center gap-1 text-[11px] text-text-muted", children: [_jsx(Wallet2, { className: "h-3 w-3", "aria-hidden": true }), _jsx("span", { children: "Recorded" })] })] })] }));
}
