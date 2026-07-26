import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formatCurrency } from "@/lib/utils";
export function BalancePreviewCard({ currentBalance, expenseAmount }) {
    const remaining = currentBalance - expenseAmount;
    return (_jsxs("div", { className: "rounded-2xl border border-border/70 bg-surface/70 p-4", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-text-muted", children: "Current balance" }), _jsx("span", { className: "font-semibold text-text", children: formatCurrency(currentBalance) })] }), _jsxs("div", { className: "mt-2 flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-text-muted", children: "Expense" }), _jsx("span", { className: "font-semibold text-danger", children: formatCurrency(expenseAmount) })] }), _jsxs("div", { className: "mt-2 flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-text-muted", children: "Remaining" }), _jsx("span", { className: "font-semibold text-success", children: formatCurrency(remaining) })] })] }));
}
