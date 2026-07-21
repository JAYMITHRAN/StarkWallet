import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { openingBalanceService } from "@/services/openingBalanceService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { ApiRequestError } from "@/services/apiClient";

const schema = z.object({
  amount: z.coerce.number().min(0, "Balance cannot be negative"),
});

type FormValues = z.infer<typeof schema>;

export function OpeningBalancePage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { show } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { amount: 0 } });

  const onSubmit = async (values: FormValues) => {
    try {
      await openingBalanceService.set(values);
      await refreshUser();
      show({ tone: "success", title: "Wallet ready", description: "Your opening balance has been recorded." });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message = err instanceof ApiRequestError ? err.message : "Could not save your opening balance.";
      show({ tone: "danger", title: "Setup failed", description: message });
    }
  };

  return (
    <Card>
      <div className="mb-5 flex items-center gap-2">
        <Wallet className="h-4 w-4 text-accent" aria-hidden />
        <h2 className="text-base font-semibold text-text">What's your available balance?</h2>
      </div>
      <p className="mb-5 text-sm text-text-muted">
        Not your monthly income — just the cash and bank balance you have right now. We'll track every change from here.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Current available balance" htmlFor="amount" error={errors.amount?.message}>
          <Input id="amount" type="number" step="0.01" inputMode="decimal" autoFocus {...register("amount")} />
        </FormField>
        <Button type="submit" isLoading={isSubmitting} className="mt-1">
          Set up wallet
        </Button>
      </form>
    </Card>
  );
}
