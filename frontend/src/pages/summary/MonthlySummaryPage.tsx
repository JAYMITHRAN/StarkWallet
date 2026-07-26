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
  Legend,
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

const CATEGORY_COLORS = [
  "#FF9D00", "#FFD23F", "#10B981", "#4F46E5", "#FB923C",
  "#38BDF8", "#F472B6", "#A78BFA", "#22C55E", "#F43F5E",
];

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
  return (
    labelMap[normalized] ??
    normalized
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
};

// ─── Custom tooltip for the Pie chart ──────────────────────────────────────
function CustomPieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-surface/90 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
      <p className="font-semibold text-text">{payload[0]!.name}</p>
      <p className="mt-0.5 text-text-muted">{formatCurrency(payload[0]!.value)}</p>
    </div>
  );
}

// ─── Custom label for pie slices ─────────────────────────────────────────
function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  name: string;
  percent: number;
}) {
  if (percent < 0.05) return null; // skip tiny slices
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  // Shorten label on mobile by truncating at 8 chars
  const short = name.length > 9 ? name.slice(0, 8) + "…" : name;
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {short}
    </text>
  );
}

type PieMode = "CASH_OUT" | "CASH_IN";

export function MonthlySummaryPage() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [pieMode, setPieMode] = useState<PieMode>("CASH_OUT");

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions-summary", selectedYear, selectedMonth],
    queryFn: async () => {
      const from = new Date(selectedYear, selectedMonth - 1, 1, 0, 0, 0, 0).toISOString();
      const to = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999).toISOString();
      return transactionService.list({ from, to });
    },
  });

  // ── Summary stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!transactions)
      return { totalCashIn: 0, totalCashOut: 0, netBalance: 0, averageWeeklyExpenditure: 0 };

    const totalCashIn = transactions
      .filter((tx) => tx.type === "CASH_IN" && !tx.isDeleted)
      .reduce((s, tx) => s + tx.amount, 0);

    const totalCashOut = transactions
      .filter((tx) => tx.type === "CASH_OUT" && !tx.isDeleted)
      .reduce((s, tx) => s + tx.amount, 0);

    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const averageWeeklyExpenditure = totalCashOut / (daysInMonth / 7);

    return { totalCashIn, totalCashOut, netBalance: totalCashIn - totalCashOut, averageWeeklyExpenditure };
  }, [transactions, selectedYear, selectedMonth]);

  // ── Weekly expenditure bar data ────────────────────────────────────────
  const weeklyChartData = useMemo(() => {
    if (!transactions) return [];
    const weeks = [
      { name: "W1", label: "Week 1 (1–7)", amount: 0 },
      { name: "W2", label: "Week 2 (8–14)", amount: 0 },
      { name: "W3", label: "Week 3 (15–21)", amount: 0 },
      { name: "W4", label: "Week 4 (22+)", amount: 0 },
    ];
    transactions.forEach((tx) => {
      if (tx.type !== "CASH_OUT" || tx.isDeleted) return;
      const day = new Date(tx.occurredAt).getDate();
      if (day <= 7) weeks[0]!.amount += tx.amount;
      else if (day <= 14) weeks[1]!.amount += tx.amount;
      else if (day <= 21) weeks[2]!.amount += tx.amount;
      else weeks[3]!.amount += tx.amount;
    });
    return weeks;
  }, [transactions]);

  // ── Daily expenditure line data ────────────────────────────────────────
  const dailyChartData = useMemo(() => {
    if (!transactions) return [];
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const dailyMap = new Map<number, number>();
    for (let d = 1; d <= daysInMonth; d++) dailyMap.set(d, 0);
    transactions.forEach((tx) => {
      if (tx.type !== "CASH_OUT" || tx.isDeleted) return;
      const day = new Date(tx.occurredAt).getDate();
      dailyMap.set(day, (dailyMap.get(day) || 0) + tx.amount);
    });
    return Array.from(dailyMap.entries()).map(([day, amount]) => ({ day: `${day}`, amount }));
  }, [transactions, selectedYear, selectedMonth]);

  // ── Category breakdown — CASH_OUT (expenditure) ───────────────────────
  const expenditureBreakdown = useMemo(() => {
    if (!transactions) return [];
    const totals = new Map<string, number>();
    transactions.forEach((tx) => {
      if (tx.type !== "CASH_OUT" || tx.isDeleted) return;
      const cat = tx.category || "OTHER";
      totals.set(cat, (totals.get(cat) || 0) + tx.amount);
    });
    return Array.from(totals.entries())
      .map(([category, amount]) => ({
        category,
        name: formatCategoryLabel(category),
        value: amount,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // ── Category breakdown — CASH_IN (income) ─────────────────────────────
  const incomeBreakdown = useMemo(() => {
    if (!transactions) return [];
    const totals = new Map<string, number>();
    transactions.forEach((tx) => {
      if (tx.type !== "CASH_IN" || tx.isDeleted) return;
      const cat = tx.category || "OTHER";
      totals.set(cat, (totals.get(cat) || 0) + tx.amount);
    });
    return Array.from(totals.entries())
      .map(([category, amount]) => ({
        category,
        name: formatCategoryLabel(category),
        value: amount,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const categoryBreakdown = pieMode === "CASH_OUT" ? expenditureBreakdown : incomeBreakdown;

  const monthLabel = MONTHS.find((m) => m.value === selectedMonth)?.label ?? "";
  const tooltipStyle = {
    backgroundColor: "#1A2D4A",
    borderColor: "rgba(255, 157, 0, 0.25)",
    color: "#F0E6D0",
    borderRadius: "12px",
  };

  return (
    <PageContainer>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-text flex items-center gap-2 sm:text-2xl">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <ChartIcon className="h-4 w-4 text-primary" />
              </span>
              Monthly Summary
            </h1>
            <p className="mt-0.5 text-xs text-text-muted sm:text-sm">
              Aggregated dashboard of income, weekly expenditure, and daily trends.
            </p>
          </div>

          {/* Month / Year selectors */}
          <div className="flex flex-wrap gap-2 sm:flex-nowrap">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="h-9 flex-1 rounded-xl border border-border bg-card px-3 text-sm font-medium text-text focus:border-primary focus:outline-none sm:flex-none"
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
              className="h-9 w-24 rounded-xl border border-border bg-card px-3 text-sm font-medium text-text focus:border-primary focus:outline-none"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border/80 p-12 text-center text-sm text-text-muted glass-panel">
          Computing summary stats…
        </div>
      ) : (
        <div className="space-y-6">
          {/* ── Summary stat cards ────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Cash In */}
            <div className="glass-panel p-4 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] text-text-muted uppercase tracking-wider truncate">Total Cash In</p>
                <p className="text-lg font-bold font-mono text-success mt-0.5 sm:text-2xl">
                  {formatCurrency(stats.totalCashIn)}
                </p>
              </div>
              <div className="h-9 w-9 shrink-0 rounded-xl bg-success/15 flex items-center justify-center text-success">
                <ArrowDownCircle className="h-4 w-4" />
              </div>
            </div>

            {/* Cash Out */}
            <div className="glass-panel p-4 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] text-text-muted uppercase tracking-wider truncate">Expenditures</p>
                <p className="text-lg font-bold font-mono text-danger mt-0.5 sm:text-2xl">
                  {formatCurrency(stats.totalCashOut)}
                </p>
              </div>
              <div className="h-9 w-9 shrink-0 rounded-xl bg-danger/15 flex items-center justify-center text-danger">
                <ArrowUpCircle className="h-4 w-4" />
              </div>
            </div>

            {/* Net Balance */}
            <div className="glass-panel p-4 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] text-text-muted uppercase tracking-wider truncate">Net Balance</p>
                <p
                  className={cn(
                    "text-lg font-bold font-mono mt-0.5 sm:text-2xl",
                    stats.netBalance >= 0 ? "text-success" : "text-danger"
                  )}
                >
                  {formatCurrency(stats.netBalance)}
                </p>
              </div>
              <div
                className={cn(
                  "h-9 w-9 shrink-0 rounded-xl flex items-center justify-center",
                  stats.netBalance >= 0 ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
                )}
              >
                {stats.netBalance >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
            </div>

            {/* Weekly Average */}
            <div className="glass-panel p-4 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] text-text-muted uppercase tracking-wider truncate">Weekly Avg</p>
                <p className="text-lg font-bold font-mono text-primary mt-0.5 sm:text-2xl">
                  {formatCurrency(stats.averageWeeklyExpenditure)}
                </p>
              </div>
              <div className="h-9 w-9 shrink-0 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* ── Category Breakdown List ───────────────────────────────────── */}
          <div className="glass-panel p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-text">Category Breakdown</p>
                <p className="text-xs text-text-muted">
                  {pieMode === "CASH_OUT" ? "Expenditures" : "Income"} by category — {monthLabel} {selectedYear}
                </p>
              </div>

              {/* Expenditure / Income toggle */}
              <div className="flex rounded-xl border border-border/60 bg-card/50 p-0.5 text-xs font-medium">
                <button
                  onClick={() => setPieMode("CASH_OUT")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 transition-colors",
                    pieMode === "CASH_OUT"
                      ? "bg-danger/20 text-danger"
                      : "text-text-muted hover:text-text"
                  )}
                >
                  Expenditure
                </button>
                <button
                  onClick={() => setPieMode("CASH_IN")}
                  className={cn(
                    "rounded-lg px-3 py-1.5 transition-colors",
                    pieMode === "CASH_IN"
                      ? "bg-success/20 text-success"
                      : "text-text-muted hover:text-text"
                  )}
                >
                  Income
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {categoryBreakdown.length > 0 ? (
                categoryBreakdown.map((entry, index) => {
                  const total =
                    pieMode === "CASH_OUT" ? stats.totalCashOut : stats.totalCashIn;
                  const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0.0";
                  return (
                    <div
                      key={entry.category}
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-3 py-2"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                      />
                      <span className="flex-1 text-sm text-text truncate">{entry.name}</span>
                      <span className="text-xs text-text-muted shrink-0">{pct}%</span>
                      <span
                        className={cn(
                          "text-sm font-semibold shrink-0",
                          pieMode === "CASH_OUT" ? "text-danger" : "text-success"
                        )}
                      >
                        {formatCurrency(entry.value)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-border/60 px-3 py-4 text-sm text-text-muted text-center">
                  No {pieMode === "CASH_OUT" ? "expenditure" : "income"} categories logged for{" "}
                  {monthLabel} {selectedYear}.
                </div>
              )}
            </div>
          </div>

          {/* ── Charts Row ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Pie chart — Expenditure or Income by Category */}
            <ChartWrapper
              title={`${pieMode === "CASH_OUT" ? "Expenditure" : "Income"} by Category`}
              height={280}
            >
              {categoryBreakdown.length > 0 ? (
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={88}
                    innerRadius={50}
                    paddingAngle={2}
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell
                        key={entry.category}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span style={{ fontSize: 11, color: "#9BB8D4" }}>{value}</span>
                    )}
                  />
                </PieChart>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-text-muted pb-8">
                  No {pieMode === "CASH_OUT" ? "expenditure" : "income"} in {monthLabel} {selectedYear}
                </div>
              )}
            </ChartWrapper>

            {/* Weekly expenditure bar chart */}
            <ChartWrapper title="Weekly Expenditure" height={280}>
              {stats.totalCashOut > 0 ? (
                <BarChart
                  data={weeklyChartData}
                  margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.4)"
                    style={{ fontSize: "11px" }}
                    tick={{ fill: "rgba(255,255,255,0.5)" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.4)"
                    style={{ fontSize: "11px" }}
                    tick={{ fill: "rgba(255,255,255,0.5)" }}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => [formatCurrency(value), "Expenditure"]}
                    labelFormatter={(label) =>
                      weeklyChartData.find((w) => w.name === label)?.label ?? label
                    }
                  />
                  <Bar dataKey="amount" fill="#FF9D00" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-text-muted pb-8">
                  No expenditure in {monthLabel} {selectedYear}
                </div>
              )}
            </ChartWrapper>

            {/* Daily rise & fall line chart */}
            <ChartWrapper title="Daily Expenditure Trend" height={280}>
              {stats.totalCashOut > 0 ? (
                <LineChart
                  data={dailyChartData}
                  margin={{ top: 16, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="day"
                    stroke="rgba(255,255,255,0.4)"
                    style={{ fontSize: "10px" }}
                    tick={{ fill: "rgba(255,255,255,0.5)" }}
                    interval={4}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.4)"
                    style={{ fontSize: "11px" }}
                    tick={{ fill: "rgba(255,255,255,0.5)" }}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => [formatCurrency(value), "Expenditure"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#FFD23F"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "#FF9D00" }}
                  />
                </LineChart>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-text-muted pb-8">
                  No expenditure in {monthLabel} {selectedYear}
                </div>
              )}
            </ChartWrapper>
          </div>
        </div>
      )}

      {/* Extra spacing so content isn't hidden behind the mobile bottom nav */}
      <div className="h-24 lg:h-8" />
    </PageContainer>
  );
}
