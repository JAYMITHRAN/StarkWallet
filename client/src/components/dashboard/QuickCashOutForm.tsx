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

const suggestionMap: Record<string, string[]> = {
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

const timeSuggestionMap: Record<string, string[]> = {
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

type FormValues = z.infer<typeof formSchema>;

interface QuickCashOutFormProps {
  currentBalance: number;
  onSuccess?: () => void;
}

function toLocalInputValue(iso: string | undefined): string {
  if (!iso) return new Date().toISOString().slice(0, 16);
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function QuickCashOutForm({ currentBalance, onSuccess }: QuickCashOutFormProps) {
  const queryClient = useQueryClient();
  const { show } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory>(TransactionCategory.OTHER);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
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
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    if (hour < 22) return "evening";
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
    mutationFn: (values: FormValues) => {
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

  const onSubmit = (values: FormValues) => {
    if (remainingBalance < 0) {
      setPendingValues(values);
      setShowConfirm(true);
      return;
    }
    mutation.mutate(values);
  };

  const confirmContinue = () => {
    if (pendingValues) mutation.mutate(pendingValues);
    setShowConfirm(false);
    setPendingValues(null);
  };

  return (
    <Card className="p-5 flex-1">
      <div className="mb-4 flex items-center gap-2">
        <ArrowUpCircle className="h-5 w-5 text-danger" />
        <h3 className="text-base font-semibold text-text">Quick Cash Out</h3>
      </div>

      {isLowBalance && (
        <div className="mb-3 rounded-xl border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning" role="status">
          Low balance warning — only {formatCurrency(remainingBalance)} remains.
        </div>
      )}

      <div className="mb-4 rounded-2xl border border-border/80 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Sparkles className="h-4 w-4 text-accent" aria-hidden />
          Suggestions for {selectedCategory.toLowerCase()}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-muted hover:bg-white/5"
              onClick={() => setValue("reason", suggestion, { shouldDirty: true })}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Amount" htmlFor="out-amount" error={errors.amount?.message}>
          <Input id="out-amount" type="number" step="0.01" inputMode="decimal" placeholder="0.00" {...register("amount")} />
        </FormField>

        <FormField label="Category" htmlFor="out-category" error={errors.category?.message}>
          <select
            id="out-category"
            className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text"
            {...register("category")}
            onChange={(event) => {
              const nextValue = event.target.value as TransactionCategory;
              setSelectedCategory(nextValue);
              setValue("category", nextValue, { shouldDirty: true });
            }}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Reason" htmlFor="out-reason" error={errors.reason?.message}>
          <Input id="out-reason" placeholder="Enter a reason or pick a suggestion" {...register("reason")} />
        </FormField>

        <FormField label="Notes (optional)" htmlFor="out-note" error={errors.note?.message}>
          <Input id="out-note" placeholder="Optional note" {...register("note")} />
        </FormField>

        <FormField label="Date & Time" htmlFor="out-occurredAt" error={errors.occurredAt?.message}>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3">
            <CalendarDays className="h-4 w-4 text-text-muted" aria-hidden />
            <Input id="out-occurredAt" type="datetime-local" {...register("occurredAt")} />
          </div>
        </FormField>

        <div className="rounded-2xl border border-border/80 bg-surface/70 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Current balance</span>
            <span className="font-semibold text-text">{formatCurrency(currentBalance)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-text-muted">Expense</span>
            <span className="font-semibold text-danger">{formatCurrency(watchedAmount)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-text-muted">Remaining</span>
            <span className={cn("font-semibold", remainingBalance < 0 ? "text-danger" : "text-success")}>
              {formatCurrency(remainingBalance)}
            </span>
          </div>
        </div>

        <Button type="submit" size="lg" isLoading={mutation.isPending}>
          Save Expense
        </Button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
          <div className="glass-panel max-w-md rounded-2xl p-5">
            <p className="text-base font-semibold text-text">This expense exceeds your current balance.</p>
            <p className="mt-2 text-sm text-text-muted">You can continue saving it, but your balance will go negative.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={confirmContinue}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
