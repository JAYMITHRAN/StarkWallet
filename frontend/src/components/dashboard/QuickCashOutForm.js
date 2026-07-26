import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpCircle, CalendarDays, Sparkles } from "lucide-react";
import { TransactionCategory, TransactionType } from "@stark/shared/types/index";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { cn, formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";
import { ApiRequestError } from "@/services/apiClient";
const suggestionMap = {
    FOOD: ["Breakfast", "Lunch", "Dinner", "Snacks", "Tea", "Coffee"],
    TRANSPORT: ["Bus", "Train", "Fuel", "Taxi"],
    SHOPPING: ["Clothes", "Grocery", "Electronics"],
    BILLS: ["Electricity", "Internet", "Water"],
    RENT: ["Rent", "Maintenance"],
    HEALTHCARE: ["Medicine", "Checkup", "Pharmacy"],
    ENTERTAINMENT: ["Movie", "Streaming", "Games"],
    EDUCATION: ["Books", "Course", "Fee"],
    TRAVEL: ["Flight", "Hotel", "Taxi"],
    INVESTMENT: ["Portfolio", "Savings"],
    GIFT: ["Gift", "Donation"],
    OTHER: ["Misc", "Personal"],
};
const timeSuggestionMap = {
    morning: ["Breakfast", "Tea", "Coffee"],
    afternoon: ["Lunch", "Snacks"],
    evening: ["Tea", "Snacks"],
    night: ["Dinner", "Late Night Snack"],
};
const categoryOptions = [
    { value: TransactionCategory.FOOD, label: "Food" },
    { value: TransactionCategory.TRANSPORT, label: "Transport" },
    { value: TransactionCategory.SHOPPING, label: "Shopping" },
    { value: TransactionCategory.BILLS, label: "Bills" },
    { value: TransactionCategory.RENT, label: "Rent" },
    { value: TransactionCategory.HEALTH, label: "Healthcare" },
    { value: TransactionCategory.ENTERTAINMENT, label: "Entertainment" },
    { value: TransactionCategory.EDUCATION, label: "Education" },
    { value: TransactionCategory.TRAVEL, label: "Travel" },
    { value: TransactionCategory.INVESTMENT, label: "Investment" },
    { value: TransactionCategory.GIFT, label: "Gift" },
    { value: TransactionCategory.OTHER, label: "Others" },
];
const formSchema = z.object({
    amount: z.coerce.number().positive("Amount must be greater than zero"),
    category: z.nativeEnum(TransactionCategory).default(TransactionCategory.OTHER),
    reason: z.string().max(80).optional(),
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
export function QuickCashOutForm({ currentBalance, onSuccess }) {
    const queryClient = useQueryClient();
    const { show } = useToast();
    const [selectedCategory, setSelectedCategory] = useState(TransactionCategory.OTHER);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingValues, setPendingValues] = useState(null);
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0,
            category: TransactionCategory.OTHER,
            reason: "",
            note: "",
            occurredAt: toLocalInputValue(new Date().toISOString()),
        },
    });
    const watchedAmount = watch("amount") || 0;
    const watchedReason = watch("reason") || "";
    const remainingBalance = currentBalance - watchedAmount;
    const isLowBalance = remainingBalance < 1000;
    const timeKey = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12)
            return "morning";
        if (hour < 17)
            return "afternoon";
        if (hour < 22)
            return "evening";
        return "night";
    }, []);
    const suggestions = useMemo(() => {
        const base = suggestionMap[selectedCategory] ?? suggestionMap.OTHER;
        const timeBased = timeSuggestionMap[timeKey] ?? [];
        const previous = base.concat(timeBased);
        return Array.from(new Set(previous));
    }, [selectedCategory, timeKey]);
    useEffect(() => {
        if (watchedReason) {
            setValue("reason", watchedReason.trim(), { shouldDirty: true });
        }
    }, [watchedReason, setValue]);
    const mutation = useMutation({
        mutationFn: (values) => {
            const dateVal = values.occurredAt ? new Date(values.occurredAt) : new Date();
            const occurredAt = isNaN(dateVal.getTime()) ? new Date().toISOString() : dateVal.toISOString();
            return transactionService.create({
                type: TransactionType.CASH_OUT,
                category: values.category,
                amount: values.amount,
                reason: values.reason || undefined,
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
                reason: "",
                note: "",
                occurredAt: toLocalInputValue(new Date().toISOString()),
            });
            show({ tone: "success", title: "Cash out saved successfully", description: "Dashboard stats refreshed." });
            onSuccess?.();
        },
        onError: (err) => {
            const message = err instanceof ApiRequestError ? err.message : "Could not save this expense.";
            show({ tone: "danger", title: "Unable to save", description: message });
        },
    });
    const onSubmit = (values) => {
        if (remainingBalance < 0) {
            setPendingValues(values);
            setShowConfirm(true);
            return;
        }
        mutation.mutate(values);
    };
    const confirmContinue = () => {
        if (pendingValues)
            mutation.mutate(pendingValues);
        setShowConfirm(false);
        setPendingValues(null);
    };
    return (_jsxs(Card, { className: "p-5 flex-1", children: [_jsxs("div", { className: "mb-4 flex items-center gap-2", children: [_jsx(ArrowUpCircle, { className: "h-5 w-5 text-danger" }), _jsx("h3", { className: "text-base font-semibold text-text", children: "Quick Cash Out" })] }), isLowBalance && (_jsxs("div", { className: "mb-3 rounded-xl border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning", role: "status", children: ["Low balance warning \u2014 only ", formatCurrency(remainingBalance), " remains."] })), _jsxs("div", { className: "mb-4 rounded-2xl border border-border/80 bg-white/5 p-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-text-muted", children: [_jsx(Sparkles, { className: "h-4 w-4 text-accent", "aria-hidden": true }), "Suggestions for ", selectedCategory.toLowerCase()] }), _jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: suggestions.map((suggestion) => (_jsx("button", { type: "button", className: "rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-muted hover:bg-white/5", onClick: () => setValue("reason", suggestion, { shouldDirty: true }), children: suggestion }, suggestion))) })] }), _jsxs("form", { className: "flex flex-col gap-4", onSubmit: handleSubmit(onSubmit), noValidate: true, children: [_jsx(FormField, { label: "Amount", htmlFor: "out-amount", error: errors.amount?.message, children: _jsx(Input, { id: "out-amount", type: "number", step: "0.01", inputMode: "decimal", placeholder: "0.00", ...register("amount") }) }), _jsx(FormField, { label: "Category", htmlFor: "out-category", error: errors.category?.message, children: _jsx("select", { id: "out-category", className: "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text", ...register("category"), onChange: (event) => {
                                const nextValue = event.target.value;
                                setSelectedCategory(nextValue);
                                setValue("category", nextValue, { shouldDirty: true });
                            }, children: categoryOptions.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value))) }) }), _jsx(FormField, { label: "Reason", htmlFor: "out-reason", error: errors.reason?.message, children: _jsx(Input, { id: "out-reason", placeholder: "Enter a reason or pick a suggestion", ...register("reason") }) }), _jsx(FormField, { label: "Notes (optional)", htmlFor: "out-note", error: errors.note?.message, children: _jsx(Input, { id: "out-note", placeholder: "Optional note", ...register("note") }) }), _jsx(FormField, { label: "Date & Time", htmlFor: "out-occurredAt", error: errors.occurredAt?.message, children: _jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border bg-surface px-3", children: [_jsx(CalendarDays, { className: "h-4 w-4 text-text-muted", "aria-hidden": true }), _jsx(Input, { id: "out-occurredAt", type: "datetime-local", ...register("occurredAt") })] }) }), _jsxs("div", { className: "rounded-2xl border border-border/80 bg-surface/70 p-4", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-text-muted", children: "Current balance" }), _jsx("span", { className: "font-semibold text-text", children: formatCurrency(currentBalance) })] }), _jsxs("div", { className: "mt-2 flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-text-muted", children: "Expense" }), _jsx("span", { className: "font-semibold text-danger", children: formatCurrency(watchedAmount) })] }), _jsxs("div", { className: "mt-2 flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-text-muted", children: "Remaining" }), _jsx("span", { className: cn("font-semibold", remainingBalance < 0 ? "text-danger" : "text-success"), children: formatCurrency(remainingBalance) })] })] }), _jsx(Button, { type: "submit", size: "lg", isLoading: mutation.isPending, children: "Save Expense" })] }), showConfirm && (_jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4", children: _jsxs("div", { className: "glass-panel max-w-md rounded-2xl p-5", children: [_jsx("p", { className: "text-base font-semibold text-text", children: "This expense exceeds your current balance." }), _jsx("p", { className: "mt-2 text-sm text-text-muted", children: "You can continue saving it, but your balance will go negative." }), _jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [_jsx(Button, { variant: "ghost", onClick: () => setShowConfirm(false), children: "Cancel" }), _jsx(Button, { onClick: confirmContinue, children: "Continue" })] })] }) }))] }));
}
