
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

type FormValues = z.infer<typeof schema>;

function toLocalInputValue(iso: string | undefined): string {
  if (!iso) return new Date().toISOString().slice(0, 16);
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CashInPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { show } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
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
      // If user clears the date-time input or leaves it empty, default to today
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

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <PageContainer className="max-w-lg">
      <div className="mb-6 flex items-center gap-2">
        <ArrowDownCircle className="h-5 w-5 text-success" aria-hidden />
        <h1 className="text-lg font-semibold text-text">Cash In</h1>
      </div>

      <Card>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Amount" htmlFor="amount" error={errors.amount?.message}>
            <Input id="amount" type="number" step="0.01" inputMode="decimal" placeholder="0.00" autoFocus {...register("amount")} />
          </FormField>
          <FormField label="Reason / category" htmlFor="category" error={errors.category?.message}>
            <select id="category" className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text" {...register("category")}>
              <option value="SALARY">Salary</option>
              <option value="BUSINESS">Business</option>
              <option value="GIFT">Gift</option>
              <option value="INVESTMENT_RETURN">Investment Return</option>
              <option value="OTHER">Other</option>
            </select>
          </FormField>
          <FormField label="Notes (optional)" htmlFor="note" error={errors.note?.message}>
            <Input id="note" placeholder="What's this for?" {...register("note")} />
          </FormField>
          <FormField label="Date" htmlFor="occurredAt" error={errors.occurredAt?.message}>
            <Input id="occurredAt" type="datetime-local" {...register("occurredAt")} />
          </FormField>
          <Button type="submit" size="lg" isLoading={isSubmitting || mutation.isPending}>
            Add Cash In
          </Button>
        </form>
      </Card>
    </PageContainer>
  );
}
