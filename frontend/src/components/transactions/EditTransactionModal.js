import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "@/components/ui/Dialog";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TransactionCategory } from "@stark/shared/types/index";
const schema = z.object({
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    type: z.enum(["CASH_IN", "CASH_OUT"]),
    category: z.nativeEnum(TransactionCategory),
    reason: z.string().max(120).optional(),
    note: z.string().max(280).optional(),
    occurredAt: z.string().min(1, "Date is required"),
});
/** Convert ISO string → "YYYY-MM-DDTHH:mm" for datetime-local input */
function toLocalInputValue(iso) {
    if (!iso)
        return new Date().toISOString().slice(0, 16);
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
/** Convert "YYYY-MM-DDTHH:mm" back to ISO */
function fromLocalInputValue(val) {
    return new Date(val).toISOString();
}
const CATEGORIES = [
    { value: TransactionCategory.FOOD, label: "🍽  Food" },
    { value: TransactionCategory.TRANSPORT, label: "🚌  Transport" },
    { value: TransactionCategory.SHOPPING, label: "🛍  Shopping" },
    { value: TransactionCategory.BILLS, label: "💡  Bills" },
    { value: TransactionCategory.RENT, label: "🏠  Rent" },
    { value: TransactionCategory.HEALTH, label: "🏥  Healthcare" },
    { value: TransactionCategory.ENTERTAINMENT, label: "🎬  Entertainment" },
    { value: TransactionCategory.EDUCATION, label: "📚  Education" },
    { value: TransactionCategory.TRAVEL, label: "✈️  Travel" },
    { value: TransactionCategory.INVESTMENT, label: "📈  Investment" },
    { value: TransactionCategory.GIFT, label: "🎁  Gift" },
    { value: TransactionCategory.SALARY, label: "💰  Salary" },
    { value: TransactionCategory.OTHER, label: "📦  Other" },
];
export function EditTransactionModal({ transaction, open, onOpenChange, onSubmit, isSubmitting = false, }) {
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
    });
    useEffect(() => {
        if (transaction) {
            reset({
                amount: transaction.amount,
                type: (transaction.type === "CASH_IN" || transaction.type === "CASH_OUT")
                    ? transaction.type
                    : "CASH_IN",
                category: transaction.category ?? TransactionCategory.OTHER,
                reason: transaction.reason ?? "",
                note: transaction.note ?? "",
                occurredAt: toLocalInputValue(transaction.occurredAt),
            });
        }
    }, [transaction, reset]);
    const handleFormSubmit = (values) => {
        onSubmit({
            ...values,
            occurredAt: fromLocalInputValue(values.occurredAt),
        });
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, title: "Edit Transaction", description: "Update any field \u2014 date, type, category, amount, or notes.", children: _jsxs("form", { className: "space-y-4", onSubmit: handleSubmit(handleFormSubmit), noValidate: true, children: [_jsx(FormField, { label: "Transaction Type", htmlFor: "type", error: errors.type?.message, children: _jsx("div", { className: "grid grid-cols-2 gap-2", children: ["CASH_IN", "CASH_OUT"].map((t) => (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer rounded-xl border border-border bg-card p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-colors", children: [_jsx("input", { type: "radio", value: t, ...register("type"), className: "accent-primary" }), _jsx("span", { className: "text-sm font-medium text-text", children: t === "CASH_IN" ? "💚 Cash In" : "🔴 Cash Out" })] }, t))) }) }), _jsx(FormField, { label: "Amount (\u20B9)", htmlFor: "edit-amount", error: errors.amount?.message, children: _jsx(Input, { id: "edit-amount", type: "number", step: "0.01", inputMode: "decimal", ...register("amount") }) }), _jsx(FormField, { label: "Category", htmlFor: "edit-category", error: errors.category?.message, children: _jsx("select", { id: "edit-category", className: "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text focus:border-primary focus:outline-none", ...register("category"), children: CATEGORIES.map(({ value, label }) => (_jsx("option", { value: value, children: label }, value))) }) }), _jsx(FormField, { label: "Date & Time", htmlFor: "edit-occurredAt", error: errors.occurredAt?.message, children: _jsx(Input, { id: "edit-occurredAt", type: "datetime-local", ...register("occurredAt"), className: "cursor-pointer" }) }), _jsx(FormField, { label: "Reason / Description", htmlFor: "edit-reason", error: errors.reason?.message, children: _jsx(Input, { id: "edit-reason", placeholder: "e.g. Lunch with team", ...register("reason") }) }), _jsx(FormField, { label: "Notes (optional)", htmlFor: "edit-note", error: errors.note?.message, children: _jsx(Input, { id: "edit-note", placeholder: "Any extra details\u2026", ...register("note") }) }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Button, { variant: "ghost", type: "button", onClick: () => onOpenChange(false), children: "Cancel" }), _jsx(Button, { variant: "primary", type: "submit", isLoading: isSubmitting, id: "btn-save-edit", children: "Save Changes" })] })] }) }));
}
