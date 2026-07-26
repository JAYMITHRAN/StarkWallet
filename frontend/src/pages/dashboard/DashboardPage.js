import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowDownCircle, ArrowUpCircle, Wallet, PiggyBank, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/ui/PageContainer";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { transactionService } from "@/services/transactionService";
import { formatCurrency } from "@/lib/utils";
// import { QuickCashInForm } from "@/components/dashboard/QuickCashInForm";
import { QuickCashOutForm } from "@/components/dashboard/QuickCashOutForm";
export function DashboardPage() {
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard"],
        queryFn: () => transactionService.dashboard(),
    });
    if (isLoading || !data) {
        return (_jsx(PageContainer, { children: _jsx("div", { className: "glass-panel rounded-2xl p-8 text-center text-text-muted", children: "Loading dashboard\u2026" }) }));
    }
    return (_jsxs(PageContainer, { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h1", { className: "text-lg font-semibold text-text", children: "Dashboard" }), _jsx("p", { className: "text-sm text-text-muted", children: "Your wallet at a glance" })] }) }), _jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4", children: [_jsx(DashboardCard, { label: "Current available balance", value: formatCurrency(data.currentBalance), icon: Wallet, tone: "accent" }), _jsx(DashboardCard, { label: "Opening balance", value: formatCurrency(data.openingBalance), icon: PiggyBank, tone: "default" }), _jsx(DashboardCard, { label: "Total cash in", value: formatCurrency(data.totalCashIn), icon: ArrowDownCircle, tone: "success" }), _jsx(DashboardCard, { label: "Total cash out", value: formatCurrency(data.totalCashOut), icon: ArrowUpCircle, tone: "danger" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4", children: [_jsx(DashboardCard, { label: "Current savings", value: formatCurrency(data.currentBalance), icon: TrendingUp, tone: "success" }), _jsx(DashboardCard, { label: "Today's income", value: formatCurrency(data.todayIncome), icon: ArrowDownCircle, tone: "success" }), _jsx(DashboardCard, { label: "Today's expense", value: formatCurrency(data.todayExpense), icon: ArrowUpCircle, tone: "danger" }), _jsx(DashboardCard, { label: "This week expense", value: formatCurrency(data.thisWeekExpense), icon: TrendingDown, tone: "danger" })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: _jsx(QuickCashOutForm, { currentBalance: data.currentBalance }) }), _jsxs("div", { className: "grid grid-cols-1 gap-3 lg:grid-cols-[1.3fr_0.7fr]", children: [_jsxs(Card, { className: "space-y-4 p-4", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Recent transactions" }) }), _jsx(RecentTransactions, { transactions: data.recentTransactions })] }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "glass-panel rounded-2xl p-4", children: [_jsx("p", { className: "mb-2 text-sm font-medium text-text", children: "This month expense" }), _jsx("p", { className: "text-2xl font-semibold text-text", children: formatCurrency(data.thisMonthExpense) }), _jsx("p", { className: "mt-1 text-sm text-text-muted", children: "Tracked for the current month." })] }) })] })] }));
}
