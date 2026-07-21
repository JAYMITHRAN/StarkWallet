import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { PageContainer } from "@/components/ui/PageContainer";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  TrendingDown,
  LineChart as ChartIcon,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { transactionService } from "@/services/transactionService";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const YEARS = Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 5 + i);

const CATEGORY_COLORS = ["#FF9D00", "#FFD23F", "#10B981", "#4F46E5", "#FB923C", "#38BDF8", "#F472B6", "#A78BFA", "#22C55E", "#F43F5E"];

const formatCategoryLabel = (category: string) => {
  const normalized = category?.toUpperCase() ?? "OTHER";
  const labelMap: Record<string, string> = {
    SALARY: "Salary",
    BUSINESS: "Business",
    GIFT: "Gift",
    INVESTMENT_RETURN: "Investment Return",
    FOOD: "Food",
    TRANSPORT: "Transport",
    RENT: "Rent",
    UTILITIES: "Utilities",
    SHOPPING: "Shopping",
    HEALTH: "Health",
    ENTERTAINMENT: "Entertainment",
    EDUCATION: "Education",
    SUBSCRIPTION: "Subscription",
    BILLS: "Bills",
    TRAVEL: "Travel",
    INVESTMENT: "Investment",
    OTHER: "Other",
  };

  return labelMap[normalized] ?? normalized.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export function MonthlySummaryPage() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-based
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  // Fetch transactions for the selected month range
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions-summary", selectedYear, selectedMonth],
    queryFn: async () => {
      // First day of selected month: e.g. July 1st, 2026 local time
      const from = new Date(selectedYear, selectedMonth - 1, 1, 0, 0, 0, 0).toISOString();
      // Last day of selected month: e.g. July 31st, 2026 local time
      const to = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999).toISOString();
      return transactionService.list({ from, to });
    },
  });

  // Calculate monthly stats
  const stats = useMemo(() => {
    if (!transactions) {
      return {
        totalCashIn: 0,
        totalCashOut: 0,
        netBalance: 0,
        averageWeeklyExpenditure: 0,
      };
    }

    const totalCashIn = transactions
      .filter((tx) => tx.type === "CASH_IN" && !tx.isDeleted)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalCashOut = transactions
      .filter((tx) => tx.type === "CASH_OUT" && !tx.isDeleted)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const weeksCount = daysInMonth / 7;
    const averageWeeklyExpenditure = totalCashOut / weeksCount;

    return {
      totalCashIn,
      totalCashOut,
      netBalance: totalCashIn - totalCashOut,
      averageWeeklyExpenditure,
    };
  }, [transactions, selectedYear, selectedMonth]);

  // Calculate Weekly Expenditure Chart Data
  const weeklyChartData = useMemo(() => {
    if (!transactions) return [];

    const weeks = [
      { name: "Week 1 (1-7)", amount: 0 },
      { name: "Week 2 (8-14)", amount: 0 },
      { name: "Week 3 (15-21)", amount: 0 },
      { name: "Week 4 (22+)", amount: 0 },
    ];

    transactions.forEach((tx) => {
      if (tx.type !== "CASH_OUT" || tx.isDeleted) return;
      const day = new Date(tx.occurredAt).getDate();
      if (day <= 7) {
        weeks[0].amount += tx.amount;
      } else if (day <= 14) {
        weeks[1].amount += tx.amount;
      } else if (day <= 21) {
        weeks[2].amount += tx.amount;
      } else {
        weeks[3].amount += tx.amount;
      }
    });

    return weeks;
  }, [transactions]);

  // Calculate Daily Expenditure Chart Data (Rise & Fall by day)
  const dailyChartData = useMemo(() => {
    if (!transactions) return [];

    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const dailyMap = new Map<number, number>();
    for (let d = 1; d <= daysInMonth; d++) {
      dailyMap.set(d, 0);
    }

    transactions.forEach((tx) => {
      if (tx.type !== "CASH_OUT" || tx.isDeleted) return;
      const day = new Date(tx.occurredAt).getDate();
      dailyMap.set(day, (dailyMap.get(day) || 0) + tx.amount);
    });

    return Array.from(dailyMap.entries()).map(([day, amount]) => ({
      day: `${day}`,
      amount,
    }));
  }, [transactions, selectedYear, selectedMonth]);

  const categoryBreakdown = useMemo(() => {
    if (!transactions) return [];

    const totals = new Map<string, number>();

    transactions.forEach((tx) => {
      if (tx.type !== "CASH_OUT" || tx.isDeleted) return;
      const category = tx.category || "OTHER";
      totals.set(category, (totals.get(category) || 0) + tx.amount);
    });

    return Array.from(totals.entries())
      .map(([category, amount]) => ({
        category,
        name: formatCategoryLabel(category),
        value: amount,
      }))
      .sort((left, right) => right.value - left.value);
  }, [transactions]);

  return (
    <PageContainer>
      {/* Header with Month/Year picker */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
              <ChartIcon className="h-5 w-5 text-primary" />
            </span>
            Monthly Summary
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Aggregated dashboard of income, weekly expenditure, and daily trends.
          </p>
        </div>

        {/* Date Selector Dropdowns */}
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="h-10 rounded-xl border border-border bg-card px-3 text-sm font-medium text-text focus:border-primary focus:outline-none"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="h-10 rounded-xl border border-border bg-card px-3 text-sm font-medium text-text focus:border-primary focus:outline-none"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border/80 p-12 text-center text-sm text-text-muted glass-panel">
          Computing summary stats…
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Total Cash In</p>
                <p className="text-2xl font-bold font-mono text-success mt-1">
                  {formatCurrency(stats.totalCashIn)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-success/15 flex items-center justify-center text-success">
                <ArrowDownCircle className="h-5 w-5" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">This Month Expenditures</p>
                <p className="text-2xl font-bold font-mono text-danger mt-1">
                  {formatCurrency(stats.totalCashOut)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-danger/15 flex items-center justify-center text-danger">
                <ArrowUpCircle className="h-5 w-5" />
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Net Balance</p>
                <p className={cn(
                  "text-2xl font-bold font-mono mt-1",
                  stats.netBalance >= 0 ? "text-success" : "text-danger"
                )}>
                  {formatCurrency(stats.netBalance)}
                </p>
              </div>
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center",
                stats.netBalance >= 0 ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
              )}>
                {stats.netBalance >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              </div>
            </div>

            <div className="glass-panel p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Weekly Average</p>
                <p className="text-2xl font-bold font-mono text-primary mt-1">
                  {formatCurrency(stats.averageWeeklyExpenditure)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="glass-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text">Category Expenditures</p>
                <p className="text-xs text-text-muted">Breakdown for this month</p>
              </div>
              <span className="rounded-full border border-border/70 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-primary">
                {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
              </span>
            </div>

            <div className="space-y-3">
              {categoryBreakdown.length > 0 ? (
                categoryBreakdown.map((entry, index) => (
                  <div key={entry.category} className="flex items-center justify-between rounded-xl border border-border/60 bg-card/50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }} />
                      <span className="text-sm text-text">{entry.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-danger">{formatCurrency(entry.value)}</span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border/60 px-3 py-4 text-sm text-text-muted">
                  No category expenditure logged for this period.
                </div>
              )}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Expenditure by Category Pie Chart */}
            <ChartWrapper title="Expenditure by Category">
              {categoryBreakdown.length > 0 ? (
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={92}
                    innerRadius={54}
                    paddingAngle={2}
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={entry.category} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A2D4A",
                      borderColor: "rgba(255, 157, 0, 0.25)",
                      color: "#F0E6D0",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => [formatCurrency(value), "Expenditure"]}
                  />
                </PieChart>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-text-muted pb-8">
                  No expenditure logged in {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
                </div>
              )}
            </ChartWrapper>

            {/* Weekly Expenditure Bar Chart */}
            <ChartWrapper title="Weekly Expenditure Breakdown">
              {stats.totalCashOut > 0 ? (
                <BarChart data={weeklyChartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: "12px" }} />
                  <YAxis stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A2D4A",
                      borderColor: "rgba(255, 157, 0, 0.25)",
                      color: "#F0E6D0",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => [formatCurrency(value), "Expenditure"]}
                  />
                  <Bar dataKey="amount" fill="#FF9D00" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-text-muted pb-8">
                  No expenditure logged in {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
                </div>
              )}
            </ChartWrapper>

            {/* Daily Rise & Fall Line Chart */}
            <ChartWrapper title="Daily Expenditure Rise & Fall">
              {stats.totalCashOut > 0 ? (
                <LineChart data={dailyChartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="day" stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: "12px" }} />
                  <YAxis stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A2D4A",
                      borderColor: "rgba(255, 157, 0, 0.25)",
                      color: "#F0E6D0",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => [formatCurrency(value), "Expenditure"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#FFD23F"
                    strokeWidth={3}
                    dot={{ fill: "#FF9D00", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-text-muted pb-8">
                  No expenditure logged in {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
                </div>
              )}
            </ChartWrapper>
          </div>
        </div>
      )}

      {/* Extra spacing for mobile navigation layout */}
      <div className="h-24 lg:h-8" />
    </PageContainer>
  );
}
