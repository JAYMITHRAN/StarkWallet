import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpCircle } from "lucide-react";
import { PageContainer } from "@/components/ui/PageContainer";
import { ExpenseForm } from "@/components/transactions/ExpenseForm";
import { transactionService } from "@/services/transactionService";

export function CashOutPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => transactionService.dashboard(),
  });
  const [submitted, setSubmitted] = useState(false);
  const currentBalance = useMemo(() => data?.currentBalance ?? 0, [data]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    setSubmitted(true);
  };

  return (
    <PageContainer className="max-w-xl">
      <div className="mb-6 flex items-center gap-2">
        <ArrowUpCircle className="h-5 w-5 text-danger" aria-hidden />
        <h1 className="text-lg font-semibold text-text">Cash Out</h1>
      </div>
      <ExpenseForm currentBalance={currentBalance} onSubmitted={refresh} />
      {submitted && <p className="mt-3 text-sm text-success">Transaction saved and synced.</p>}
    </PageContainer>
  );
}
