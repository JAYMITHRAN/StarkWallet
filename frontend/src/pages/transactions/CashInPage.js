import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { transactionService } from "@/services/transactionService";
import { useToast } from "@/components/ui/Toast";
import { ApiRequestError } from "@/services/apiClient";
import { z } from "zod";
import { TransactionCategory, TransactionType } from "@stark/shared/types/index";
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
export function CashInPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { show } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
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
            // If user clears the date-time input or leaves it empty, default to today
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
            await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            await queryClient.invalidateQueries({ queryKey: ["transactions"] });
            await queryClient.invalidateQueries({ queryKey: ["summary"] });
            show({ tone: "success", title: "Cash in saved", description: "Your dashboard has been refreshed." });
            navigate("/dashboard", { replace: true });
        },
        onError: (err) => {
            const message = err instanceof ApiRequestError ? err.message : "Could not save this cash-in entry.";
            show({ tone: "danger", title: "Could not save", description: message });
        },
    });
    const onSubmit = (values) => {
        mutation.mutate(values);
    };
    return (_jsxs(PageContainer, { className: "max-w-lg", children: [_jsxs("div", { className: "mb-6 flex items-center gap-2", children: [_jsx(ArrowDownCircle, { className: "h-5 w-5 text-success", "aria-hidden": true }), _jsx("h1", { className: "text-lg font-semibold text-text", children: "Cash In" })] }), _jsx(Card, { children: _jsxs("form", { className: "flex flex-col gap-4", onSubmit: handleSubmit(onSubmit), noValidate: true, children: [_jsx(FormField, { label: "Amount", htmlFor: "amount", error: errors.amount?.message, children: _jsx(Input, { id: "amount", type: "number", step: "0.01", inputMode: "decimal", placeholder: "0.00", autoFocus: true, ...register("amount") }) }), _jsx(FormField, { label: "Reason / category", htmlFor: "category", error: errors.category?.message, children: _jsxs("select", { id: "category", className: "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text", ...register("category"), children: [_jsx("option", { value: "SALARY", children: "Salary" }), _jsx("option", { value: "BUSINESS", children: "Business" }), _jsx("option", { value: "GIFT", children: "Gift" }), _jsx("option", { value: "INVESTMENT_RETURN", children: "Investment Return" }), _jsx("option", { value: "OTHER", children: "Other" })] }) }), _jsx(FormField, { label: "Notes (optional)", htmlFor: "note", error: errors.note?.message, children: _jsx(Input, { id: "note", placeholder: "What's this for?", ...register("note") }) }), _jsx(FormField, { label: "Date", htmlFor: "occurredAt", error: errors.occurredAt?.message, children: _jsx(Input, { id: "occurredAt", type: "datetime-local", ...register("occurredAt") }) }), _jsx(Button, { type: "submit", size: "lg", isLoading: isSubmitting || mutation.isPending, children: "Add Cash In" })] }) })] }));
}
