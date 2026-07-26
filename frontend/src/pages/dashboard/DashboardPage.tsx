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
    return (
      <PageContainer>
        <div className="glass-panel rounded-2xl p-8 text-center text-text-muted">Loading dashboard…</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text">Dashboard</h1>
          <p className="text-sm text-text-muted">Your wallet at a glance</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Current available balance" value={formatCurrency(data.currentBalance)} icon={Wallet} tone="accent" />
        <DashboardCard label="Opening balance" value={formatCurrency(data.openingBalance)} icon={PiggyBank} tone="default" />
        <DashboardCard label="Total cash in" value={formatCurrency(data.totalCashIn)} icon={ArrowDownCircle} tone="success" />
        <DashboardCard label="Total cash out" value={formatCurrency(data.totalCashOut)} icon={ArrowUpCircle} tone="danger" />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Current savings" value={formatCurrency(data.currentBalance)} icon={TrendingUp} tone="success" />
        <DashboardCard label="Today's income" value={formatCurrency(data.todayIncome)} icon={ArrowDownCircle} tone="success" />
        <DashboardCard label="Today's expense" value={formatCurrency(data.todayExpense)} icon={ArrowUpCircle} tone="danger" />
        <DashboardCard label="This week expense" value={formatCurrency(data.thisWeekExpense)} icon={TrendingDown} tone="danger" />
      </div>

      {/* Transaction Entry Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <QuickCashInForm /> */}
        <QuickCashOutForm currentBalance={data.currentBalance} />
      </div>

      {/* Recent Transactions & Actions */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="space-y-4 p-4">
          <CardHeader>
            <CardTitle>Recent transactions</CardTitle>
          </CardHeader>
          <RecentTransactions transactions={data.recentTransactions as Array<import("@stark/shared/types/index").Transaction>} />
        </Card>
        <div className="space-y-4">
          
          <div className="glass-panel rounded-2xl p-4">
            <p className="mb-2 text-sm font-medium text-text">This month expense</p>
            <p className="text-2xl font-semibold text-text">{formatCurrency(data.thisMonthExpense)}</p>
            <p className="mt-1 text-sm text-text-muted">Tracked for the current month.</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
