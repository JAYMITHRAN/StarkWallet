import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(PageContainer, { className: "max-w-xl", children: [_jsxs("div", { className: "mb-6 flex items-center gap-2", children: [_jsx(ArrowUpCircle, { className: "h-5 w-5 text-danger", "aria-hidden": true }), _jsx("h1", { className: "text-lg font-semibold text-text", children: "Cash Out" })] }), _jsx(ExpenseForm, { currentBalance: currentBalance, onSubmitted: refresh }), submitted && _jsx("p", { className: "mt-3 text-sm text-success", children: "Transaction saved and synced." })] }));
}
