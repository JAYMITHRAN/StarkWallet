import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { TransactionCategory, TransactionType } from "@stark/shared/types/index";
import { transactionService } from "@/services/transactionService";
import { ApiRequestError } from "@/services/apiClient";
import { useToast } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowDownCircle } from "lucide-react";
const schema = z.object({
    amount: z.coerce.number().positive("Amount must be greater than zero"),
    category: z.nativeEnum(TransactionCategory).default(TransactionCategory.OTHER),
    note: z.string().max(280).optional(),
    occurredAt: z.string().optional(),
});
function toLocalInputValue(iso) {
    if (!iso)
        return new Date().toISOString().slice(0, 16);
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
export function QuickCashInForm({ onSuccess }) {
    const queryClient = useQueryClient();
    const { show } = useToast();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            amount: 0,
            category: TransactionCategory.OTHER,
            note: "",
            occurredAt: toLocalInputValue(new Date().toISOString()),
        },
    });
    const mutation = useMutation({
        mutationFn: (values) => {
            const dateVal = values.occurredAt ? new Date(values.occurredAt) : new Date();
            const occurredAt = isNaN(dateVal.getTime()) ? new Date().toISOString() : dateVal.toISOString();
            return transactionService.create({
                type: TransactionType.CASH_IN,
                category: values.category,
                amount: values.amount,
                note: values.note || undefined,
                occurredAt,
            });
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
                queryClient.invalidateQueries({ queryKey: ["transactions"] }),
                queryClient.invalidateQueries({ queryKey: ["summary"] }),
                queryClient.invalidateQueries({ queryKey: ["transactions-summary"] }),
            ]);
            reset({
                amount: 0,
                category: TransactionCategory.OTHER,
                note: "",
                occurredAt: toLocalInputValue(new Date().toISOString()),
            });
            show({ tone: "success", title: "Cash In saved successfully", description: "Dashboard stats refreshed." });
            onSuccess?.();
        },
        onError: (err) => {
            const message = err instanceof ApiRequestError ? err.message : "Could not save cash-in transaction.";
            show({ tone: "danger", title: "Save failed", description: message });
        },
    });
    const onSubmit = (values) => {
        mutation.mutate(values);
    };
    return (_jsxs(Card, { className: "p-5 flex-1", children: [_jsxs("div", { className: "mb-4 flex items-center gap-2", children: [_jsx(ArrowDownCircle, { className: "h-5 w-5 text-success" }), _jsx("h3", { className: "text-base font-semibold text-text", children: "Quick Cash In" })] }), _jsxs("form", { className: "flex flex-col gap-4", onSubmit: handleSubmit(onSubmit), noValidate: true, children: [_jsx(FormField, { label: "Amount", htmlFor: "in-amount", error: errors.amount?.message, children: _jsx(Input, { id: "in-amount", type: "number", step: "0.01", inputMode: "decimal", placeholder: "0.00", ...register("amount") }) }), _jsx(FormField, { label: "Category", htmlFor: "in-category", error: errors.category?.message, children: _jsxs("select", { id: "in-category", className: "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text", ...register("category"), children: [_jsx("option", { value: "SALARY", children: "Salary" }), _jsx("option", { value: "BUSINESS", children: "Business" }), _jsx("option", { value: "GIFT", children: "Gift" }), _jsx("option", { value: "INVESTMENT_RETURN", children: "Investment Return" }), _jsx("option", { value: "OTHER", children: "Other" })] }) }), _jsx(FormField, { label: "Note", htmlFor: "in-note", error: errors.note?.message, children: _jsx(Input, { id: "in-note", placeholder: "Source details (optional)", ...register("note") }) }), _jsx(FormField, { label: "Date", htmlFor: "in-occurredAt", error: errors.occurredAt?.message, children: _jsx(Input, { id: "in-occurredAt", type: "datetime-local", ...register("occurredAt") }) }), _jsx(Button, { type: "submit", size: "lg", isLoading: mutation.isPending, children: "Add Cash In" })] })] }));
}
