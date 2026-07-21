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

type FormValues = z.infer<typeof schema>;

function toLocalInputValue(iso: string | undefined): string {
  if (!iso) return new Date().toISOString().slice(0, 16);
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface QuickCashInFormProps {
  onSuccess?: () => void;
}

export function QuickCashInForm({ onSuccess }: QuickCashInFormProps) {
  const queryClient = useQueryClient();
  const { show } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      category: TransactionCategory.OTHER,
      note: "",
      occurredAt: toLocalInputValue(new Date().toISOString()),
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const dateVal = values.occurredAt ? new Date(values.occurredAt) : new Date();
      const occurredAt = isNaN(dateVal.getTime()) ? new Date().toISOString() : dateVal.toISOString();

      return transactionService.create({
        type: TransactionType.CASH_IN,
        category: values.category as TransactionCategory,
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

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Card className="p-5 flex-1">
      <div className="mb-4 flex items-center gap-2">
        <ArrowDownCircle className="h-5 w-5 text-success" />
        <h3 className="text-base font-semibold text-text">Quick Cash In</h3>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Amount" htmlFor="in-amount" error={errors.amount?.message}>
          <Input id="in-amount" type="number" step="0.01" inputMode="decimal" placeholder="0.00" {...register("amount")} />
        </FormField>

        <FormField label="Category" htmlFor="in-category" error={errors.category?.message}>
          <select id="in-category" className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text" {...register("category")}>
            <option value="SALARY">Salary</option>
            <option value="BUSINESS">Business</option>
            <option value="GIFT">Gift</option>
            <option value="INVESTMENT_RETURN">Investment Return</option>
            <option value="OTHER">Other</option>
          </select>
        </FormField>

        <FormField label="Note" htmlFor="in-note" error={errors.note?.message}>
          <Input id="in-note" placeholder="Source details (optional)" {...register("note")} />
        </FormField>

        <FormField label="Date" htmlFor="in-occurredAt" error={errors.occurredAt?.message}>
          <Input id="in-occurredAt" type="datetime-local" {...register("occurredAt")} />
        </FormField>

        <Button type="submit" size="lg" isLoading={mutation.isPending}>
          Add Cash In
        </Button>
      </form>
    </Card>
  );
}
