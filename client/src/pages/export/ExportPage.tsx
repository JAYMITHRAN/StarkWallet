// ─────────────────────────────────────────────────────────────────────────────
// Export Page — Download transactions as PDF or Excel
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Calendar, Filter, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { transactionService } from "@/services/transactionService";
import { cn } from "@/lib/utils";
import { TransactionType } from "@stark/shared/types/index";

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function ExportPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "CASH_IN" | "CASH_OUT">("");
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [lastExported, setLastExported] = useState<"pdf" | "excel" | null>(null);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions-export", fromDate, toDate, typeFilter],
    queryFn: () =>
      transactionService.list({
        type: (typeFilter as TransactionType) || undefined,
        from: fromDate || undefined,
        to: toDate || undefined,
        sort: "oldest",
      }),
  });

  const filteredRows = transactions.filter((tx) => tx.type !== "OPENING_BALANCE");

  const totalIn = filteredRows.filter((t) => t.type === "CASH_IN").reduce((s, t) => s + t.amount, 0);
  const totalOut = filteredRows.filter((t) => t.type === "CASH_OUT").reduce((s, t) => s + t.amount, 0);
  const net = totalIn - totalOut;

  // ── PDF Export ──────────────────────────────────────────────────────────────
  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      doc.text("StarkMoneyWalletTracker", 40, 45);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Transaction Report", 40, 62);

      const dateRange = fromDate || toDate
        ? `${fromDate ? fmtDate(fromDate) : "Start"} – ${toDate ? fmtDate(toDate) : "Today"}`
        : "All time";
      doc.text(`Period: ${dateRange}`, 40, 76);
      doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 40, 90);

      // Summary boxes
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const summaryY = 108;
      [
        { label: "Cash In", value: fmt(totalIn), color: [22, 163, 74] as [number, number, number] },
        { label: "Cash Out", value: fmt(totalOut), color: [220, 38, 38] as [number, number, number] },
        { label: "Net Balance", value: fmt(net), color: net >= 0 ? [22, 163, 74] as [number, number, number] : [220, 38, 38] as [number, number, number] },
        { label: "Transactions", value: String(filteredRows.length), color: [99, 102, 241] as [number, number, number] },
      ].forEach(({ label, value, color }, i) => {
        const x = 40 + i * 130;
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(x, summaryY, 122, 40, 4, 4, "F");
        doc.setTextColor(...color);
        doc.setFontSize(12);
        doc.text(value, x + 8, summaryY + 16);
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8);
        doc.text(label, x + 8, summaryY + 30);
      });

      // Table
      autoTable(doc, {
        startY: summaryY + 56,
        head: [["#", "Date", "Notes / Reason", "Category", "Type", "Amount (₹)"]],
        body: filteredRows.map((tx, i) => [
          i + 1,
          fmtDate(tx.occurredAt),
          tx.reason || tx.note || "—",
          tx.category,
          tx.type === "CASH_IN" ? "Cash In" : "Cash Out",
          tx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
        ]),
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 9, fontStyle: "bold" },
        bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 24 },
          1: { cellWidth: 70 },
          2: { cellWidth: 160 },
          3: { cellWidth: 75 },
          4: { cellWidth: 60 },
          5: { cellWidth: 72, halign: "right" },
        },
        margin: { left: 40, right: 40 },
      });

      // Footer
      const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`Page ${i} of ${pageCount} — StarkMoneyWalletTracker`, 40, doc.internal.pageSize.height - 20);
      }

      doc.save(`StarkWallet_Transactions_${new Date().toISOString().split("T")[0]}.pdf`);
      setLastExported("pdf");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // ── Excel Export ────────────────────────────────────────────────────────────
  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      const rows = filteredRows.map((tx, i) => ({
        "#": i + 1,
        Date: fmtDate(tx.occurredAt),
        "Notes / Reason": tx.reason || tx.note || "",
        Category: String(tx.category),
        Type: tx.type === "CASH_IN" ? "Cash In" : "Cash Out",
        "Amount (₹)": tx.amount,
      }));

      // Summary rows
      rows.push({} as typeof rows[0]);
      rows.push({ "#": "" as unknown as number, Date: "SUMMARY", "Notes / Reason": "", Category: "", Type: "Total Cash In", "Amount (₹)": totalIn });
      rows.push({ "#": "" as unknown as number, Date: "", "Notes / Reason": "", Category: "", Type: "Total Cash Out", "Amount (₹)": totalOut });
      rows.push({ "#": "" as unknown as number, Date: "", "Notes / Reason": "", Category: "", Type: "Net Balance", "Amount (₹)": net });

      const ws = XLSX.utils.json_to_sheet(rows);
      ws["!cols"] = [{ wch: 5 }, { wch: 14 }, { wch: 40 }, { wch: 16 }, { wch: 12 }, { wch: 14 }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transactions");
      XLSX.writeFile(wb, `StarkWallet_Transactions_${new Date().toISOString().split("T")[0]}.xlsx`);
      setLastExported("excel");
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
            <Download className="h-5 w-5 text-primary" />
          </span>
          Export Transactions
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Download your transaction history as a PDF report or Excel spreadsheet.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-panel p-5 mb-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Filter className="h-4 w-4 text-text-muted" />
          <span className="text-sm font-medium text-text">Filter Export</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-text-muted mb-1 block flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-text focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-text focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "" | "CASH_IN" | "CASH_OUT")}
              className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-text focus:border-primary focus:outline-none"
            >
              <option value="">All Transactions</option>
              <option value="CASH_IN">Cash In Only</option>
              <option value="CASH_OUT">Cash Out Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview stats */}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Transactions", value: filteredRows.length, color: "text-text" },
            { label: "Cash In", value: fmt(totalIn), color: "text-success" },
            { label: "Cash Out", value: fmt(totalOut), color: "text-danger" },
            { label: "Net Balance", value: fmt(net), color: net >= 0 ? "text-success" : "text-danger" },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-panel p-4 text-center">
              <p className={cn("text-lg font-bold font-mono", color)}>{value}</p>
              <p className="text-xs text-text-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Export buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PDF */}
        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15">
              <FileText className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-text">PDF Report</p>
              <p className="text-xs text-text-muted">Professional formatted report</p>
            </div>
          </div>
          <ul className="space-y-1.5 text-xs text-text-muted">
            {["A4 printable layout", "Colour-coded summary header", "Alternating row table", "Page numbers & footer"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Button
            id="btn-export-pdf"
            variant="primary"
            size="lg"
            onClick={handleExportPdf}
            isLoading={isExportingPdf}
            disabled={filteredRows.length === 0 || isLoading}
            className="w-full mt-auto"
          >
            <FileText className="h-4 w-4" />
            {isExportingPdf ? "Generating PDF…" : `Export as PDF (${filteredRows.length} rows)`}
          </Button>
        </div>

        {/* Excel */}
        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/15">
              <FileSpreadsheet className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-text">Excel Spreadsheet</p>
              <p className="text-xs text-text-muted">Re-importable .xlsx file</p>
            </div>
          </div>
          <ul className="space-y-1.5 text-xs text-text-muted">
            {["Column-optimised widths", "Summary totals at bottom", "Compatible with Google Sheets", "Filter & sort ready"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-success flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Button
            id="btn-export-excel"
            variant="black"
            size="lg"
            onClick={handleExportExcel}
            isLoading={isExportingExcel}
            disabled={filteredRows.length === 0 || isLoading}
            className="w-full mt-auto"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {isExportingExcel ? "Generating Excel…" : `Export as Excel (${filteredRows.length} rows)`}
          </Button>
        </div>
      </div>

      {/* Success notice */}
      {lastExported && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 p-4 animate-slide-up">
          <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
          <p className="text-sm text-success font-medium">
            {lastExported === "pdf" ? "PDF report" : "Excel spreadsheet"} downloaded successfully!
          </p>
        </div>
      )}

      <div className="h-24 lg:h-8" />
    </PageContainer>
  );
}
