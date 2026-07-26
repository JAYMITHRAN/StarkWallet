import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "@/components/ui/Dialog";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Transaction } from "@stark/shared/types/index";
import { TransactionCategory } from "@stark/shared/types/index";

const schema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  type: z.enum(["CASH_IN", "CASH_OUT"]),
  category: z.nativeEnum(TransactionCategory),
  reason: z.string().max(120).optional(),
  note: z.string().max(280).optional(),
  occurredAt: z.string().min(1, "Date is required"),
});

type FormValues = z.infer<typeof schema>;

/** Convert ISO string → "YYYY-MM-DDTHH:mm" for datetime-local input */
function toLocalInputValue(iso: string | undefined): string {
  if (!iso) return new Date().toISOString().slice(0, 16);
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Convert "YYYY-MM-DDTHH:mm" back to ISO */
function fromLocalInputValue(val: string): string {
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

interface EditTransactionModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Record<string, unknown>) => void;
  isSubmitting?: boolean;
}

export function EditTransactionModal({
  transaction,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: EditTransactionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (transaction) {
      reset({
        amount: transaction.amount,
        type: (transaction.type === "CASH_IN" || transaction.type === "CASH_OUT")
          ? transaction.type
          : "CASH_IN",
        category: transaction.category as TransactionCategory ?? TransactionCategory.OTHER,
        reason: transaction.reason ?? "",
        note: transaction.note ?? "",
        occurredAt: toLocalInputValue(transaction.occurredAt),
      });
    }
  }, [transaction, reset]);

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      occurredAt: fromLocalInputValue(values.occurredAt),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Transaction"
      description="Update any field — date, type, category, amount, or notes."
    >
      <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)} noValidate>

        {/* Type row */}
        <FormField label="Transaction Type" htmlFor="type" error={errors.type?.message}>
          <div className="grid grid-cols-2 gap-2">
            {(["CASH_IN", "CASH_OUT"] as const).map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer rounded-xl border border-border bg-card p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-colors">
                <input type="radio" value={t} {...register("type")} className="accent-primary" />
                <span className="text-sm font-medium text-text">
                  {t === "CASH_IN" ? "💚 Cash In" : "🔴 Cash Out"}
                </span>
              </label>
            ))}
          </div>
        </FormField>

        {/* Amount */}
        <FormField label="Amount (₹)" htmlFor="edit-amount" error={errors.amount?.message}>
          <Input id="edit-amount" type="number" step="0.01" inputMode="decimal" {...register("amount")} />
        </FormField>

        {/* Category */}
        <FormField label="Category" htmlFor="edit-category" error={errors.category?.message}>
          <select
            id="edit-category"
            className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text focus:border-primary focus:outline-none"
            {...register("category")}
          >
            {CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </FormField>

        {/* Date & Time */}
        <FormField label="Date & Time" htmlFor="edit-occurredAt" error={errors.occurredAt?.message}>
          <Input
            id="edit-occurredAt"
            type="datetime-local"
            {...register("occurredAt")}
            className="cursor-pointer"
          />
        </FormField>

        {/* Reason */}
        <FormField label="Reason / Description" htmlFor="edit-reason" error={errors.reason?.message}>
          <Input id="edit-reason" placeholder="e.g. Lunch with team" {...register("reason")} />
        </FormField>

        {/* Note */}
        <FormField label="Notes (optional)" htmlFor="edit-note" error={errors.note?.message}>
          <Input id="edit-note" placeholder="Any extra details…" {...register("note")} />
        </FormField>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting} id="btn-save-edit">
            Save Changes
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
