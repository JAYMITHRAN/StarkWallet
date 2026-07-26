// ─────────────────────────────────────────────────────────────────────────────
// StarkMoneyWalletTracker — Import Service
// Handles Excel/CSV parsing, category detection, validation, dedup & batch insert
// ─────────────────────────────────────────────────────────────────────────────
import * as XLSX from "xlsx";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/httpError.js";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RawImportRow {
  rowIndex: number;      // 1-based for user display
  date: string;          // raw cell value
  notes: string;
  cashIn: number | null;
  cashOut: number | null;
}

export interface ParsedImportRow extends RawImportRow {
  parsedDate: Date | null;
  type: "CASH_IN" | "CASH_OUT" | null;
  amount: number | null;
  category: string;
  reason: string;
  isValid: boolean;
  errors: string[];
  isDuplicate: boolean;
}

export interface ImportSummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  importedRows: number;
  skippedRows: number;
  cashInTotal: number;
  cashOutTotal: number;
  netBalance: number;
  estimatedOpeningBalance: number;
}

// In-memory session store (cleared on server restart — acceptable for single-user app)
const sessionStore = new Map<string, ParsedImportRow[]>();

function sessionKey(userId: string, sessionId: string) {
  return `${userId}:${sessionId}`;
}

// ── Category Detection ────────────────────────────────────────────────────────

const CATEGORY_MAP: Array<{ category: string; keywords: string[] }> = [
  {
    category: "FOOD",
    keywords: ["food", "breakfast", "lunch", "dinner", "tea", "coffee", "juice", "snack", "meal", "eat", "restaurant", "hotel", "biryani", "rice", "bread", "bakery", "sweet"],
  },
  {
    category: "TRANSPORT",
    keywords: ["bus", "train", "taxi", "fuel", "petrol", "uber", "auto", "ride", "cab", "metro", "ola", "ticket", "fare", "toll", "diesel"],
  },
  {
    category: "BILLS",
    keywords: ["internet", "wifi", "recharge", "electricity", "water", "bill", "broadband", "mobile", "phone", "airtel", "jio", "bsnl", "postpaid"],
  },
  {
    category: "RENT",
    keywords: ["rent", "landlord", "house", "room", "pg", "flat", "lease"],
  },
  {
    category: "HEALTH",
    keywords: ["medicine", "hospital", "clinic", "doctor", "pharmacy", "medical", "health", "tablet", "injection", "test", "lab", "scan"],
  },
  {
    category: "EDUCATION",
    keywords: ["book", "stationery", "college", "school", "tuition", "course", "fees", "exam", "study", "class", "pen", "notebook"],
  },
  {
    category: "SHOPPING",
    keywords: ["shopping", "clothes", "cloth", "shirt", "shoe", "dress", "pant", "trouser", "saree", "amazon", "flipkart", "myntra", "market"],
  },
  {
    category: "ENTERTAINMENT",
    keywords: ["movie", "games", "cinema", "netflix", "youtube", "spotify", "game", "theatre", "show", "concert", "outing", "fun"],
  },
  {
    category: "INVESTMENT",
    keywords: ["investment", "mutual fund", "sip", "stock", "share", "fd", "fixed deposit", "gold", "crypto", "savings"],
  },
  {
    category: "GIFT",
    keywords: ["gift", "present", "birthday", "anniversary", "wedding", "donation", "charity"],
  },
  {
    category: "SALARY",
    keywords: ["salary", "pay", "stipend", "wage", "income", "freelance", "payment received", "credited"],
  },
];

export function detectCategory(notes: string): string {
  const lower = (notes || "").toLowerCase().trim();
  if (!lower) return "OTHER";

  for (const entry of CATEGORY_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.category;
    }
  }
  return "OTHER";
}

// ── Excel / CSV Parsing ───────────────────────────────────────────────────────

/**
 * Tries multiple heuristics to find the Date/Notes/CashIn/CashOut columns.
 * Column headers may vary; we normalise to lowercase and strip spaces.
 */
function normalise(s: unknown): string {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[\s_\-]+/g, "");
}

function isCashInHeader(h: string) {
  return ["cashin", "in", "credit", "income", "received"].includes(h);
}

function isCashOutHeader(h: string) {
  return ["cashout", "out", "debit", "expense", "paid", "withdrawal", "spent"].includes(h);
}

function isDateHeader(h: string) {
  return ["date", "transactiondate", "txndate", "valuedate"].includes(h);
}

function isNotesHeader(h: string) {
  return ["notes", "note", "description", "narration", "particulars", "remarks", "reason", "details", "reference"].includes(h);
}

/** Convert Excel serial date OR string to JS Date. Returns null on failure. */
function parseExcelDate(raw: unknown): Date | null {
  if (raw === null || raw === undefined || raw === "") return null;

  if (typeof raw === "number") {
    // XLSX serial date
    const parsed = XLSX.SSF.parse_date_code(raw);
    if (parsed) {
      return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
    }
  }

  if (typeof raw === "string") {
    const s = raw.trim();
    if (s.toLowerCase() === "undefined" || s === "") return null;

    // Try common formats: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, MM/DD/YYYY
    const patterns = [
      /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/, // DD/MM/YYYY or MM/DD/YYYY
      /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,  // YYYY-MM-DD
    ];

    for (const pattern of patterns) {
      const m = s.match(pattern);
      if (m) {
        const [, a, b, c] = m;
        const aNum = parseInt(a!, 10);
        const bNum = parseInt(b!, 10);
        const cNum = parseInt(c!, 10);

        let year: number, month: number, day: number;
        if (aNum > 31) {
          // YYYY-MM-DD
          year = aNum; month = bNum; day = cNum;
        } else {
          // DD/MM/YYYY (prefer Indian format)
          day = aNum; month = bNum; year = cNum;
        }

        const d = new Date(Date.UTC(year, month - 1, day));
        if (!isNaN(d.getTime()) && d.getFullYear() > 2000) return d;
      }
    }

    // Fallback: native Date parse
    const fallback = new Date(s);
    if (!isNaN(fallback.getTime())) {
      return new Date(Date.UTC(fallback.getFullYear(), fallback.getMonth(), fallback.getDate()));
    }
  }

  if (raw instanceof Date) {
    return new Date(Date.UTC(raw.getFullYear(), raw.getMonth(), raw.getDate()));
  }

  return null;
}

function safeNumber(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === "") return null;
  const n = typeof raw === "number" ? raw : parseFloat(String(raw).replace(/[,₹$\s]/g, ""));
  return isNaN(n) ? null : n;
}

export function parseFileBuffer(buffer: Buffer, mimetype: string): RawImportRow[] {
  let workbook: XLSX.WorkBook;

  const type = mimetype.includes("csv") ? "csv" : "buffer";

  if (type === "csv") {
    const csvStr = buffer.toString("utf8");
    workbook = XLSX.read(csvStr, { type: "string", raw: true });
  } else {
    workbook = XLSX.read(buffer, { type: "buffer", cellDates: true, raw: true });
  }

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw HttpError.badRequest("The file contains no sheets.");

  const sheet = workbook.Sheets[sheetName]!;
  const rows = (XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  }) as unknown) as unknown[][];

  if (rows.length < 2) {
    throw HttpError.badRequest("The file must contain at least one header row and one data row.");
  }

  // Find header row — first row where we recognise column headers
  let headerRowIdx = 0;
  let headers: string[] = [];

  for (let i = 0; i < Math.min(5, rows.length); i++) {
    const row = rows[i];
    if (!row || !Array.isArray(row)) continue;
    const candidateHeaders = row.map((h) => normalise(h));
    if (candidateHeaders.some(isDateHeader) || candidateHeaders.some(isCashInHeader)) {
      headerRowIdx = i;
      headers = candidateHeaders;
      break;
    }
  }

  if (!headers.length && rows[0] && Array.isArray(rows[0])) {
    // Fallback: treat row 0 as headers
    headers = rows[0].map((h) => normalise(h));
    headerRowIdx = 0;
  }

  // Map column indices
  const dateCol = headers.findIndex(isDateHeader);
  const notesCol = headers.findIndex(isNotesHeader);
  const cashInCol = headers.findIndex(isCashInHeader);
  const cashOutCol = headers.findIndex(isCashOutHeader);

  if (dateCol === -1) throw HttpError.badRequest("Could not find a Date column. Expected header: Date.");
  if (cashInCol === -1 && cashOutCol === -1) {
    throw HttpError.badRequest("Could not find Cash In or Cash Out columns.");
  }

  const rawRows: RawImportRow[] = [];

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i] as unknown[];
    if (!row || !Array.isArray(row)) continue;

    const dateRaw = row[dateCol] ?? "";
    const notesRaw = notesCol !== -1 ? row[notesCol] ?? "" : "";
    const cashInRaw = cashInCol !== -1 ? row[cashInCol] : null;
    const cashOutRaw = cashOutCol !== -1 ? row[cashOutCol] : null;

    const cashIn = safeNumber(cashInRaw);
    const cashOut = safeNumber(cashOutRaw);

    // Skip completely empty rows
    if (!dateRaw && cashIn === null && cashOut === null) continue;

    // Skip row if it doesn't contain a valid date representation (e.g. metadata/footers/headers)
    const isDateEmpty = !dateRaw || String(dateRaw).trim() === "" || String(dateRaw).toLowerCase() === "undefined";
    if (isDateEmpty) continue;

    rawRows.push({
      rowIndex: i + 1, // 1-based (Excel row number visible to user)
      date: String(dateRaw),
      notes: String(notesRaw).trim(),
      cashIn: cashIn !== null && cashIn > 0 ? cashIn : null,
      cashOut: cashOut !== null && cashOut > 0 ? cashOut : null,
    });
  }

  return rawRows;
}

// ── Validation ────────────────────────────────────────────────────────────────

export function validateAndEnrichRows(rawRows: RawImportRow[]): ParsedImportRow[] {
  return rawRows.map((row) => {
    const errors: string[] = [];

    // Parse date
    const parsedDate = parseExcelDate(row.date);
    if (!parsedDate) {
      errors.push(`Invalid date: "${row.date}"`);
    } else if (parsedDate > new Date()) {
      errors.push("Date is in the future.");
    }

    // Determine type and amount
    let type: "CASH_IN" | "CASH_OUT" | null = null;
    let amount: number | null = null;

    if (row.cashIn !== null && row.cashIn > 0) {
      type = "CASH_IN";
      amount = row.cashIn;
    } else if (row.cashOut !== null && row.cashOut > 0) {
      type = "CASH_OUT";
      amount = row.cashOut;
    } else {
      errors.push("No valid Cash In or Cash Out amount found.");
    }

    if (amount !== null && amount <= 0) {
      errors.push("Amount must be greater than zero.");
    }

    // Check for row with both cashIn and cashOut (ambiguous)
    if (row.cashIn !== null && row.cashOut !== null && row.cashIn > 0 && row.cashOut > 0) {
      errors.push("Row has both Cash In and Cash Out — ambiguous.");
      type = null;
      amount = null;
    }

    const category = detectCategory(row.notes);
    const reason = row.notes || "";
    const isValid = errors.length === 0 && type !== null && amount !== null;

    return {
      ...row,
      parsedDate: parsedDate,
      type,
      amount,
      category,
      reason,
      isValid,
      errors,
      isDuplicate: false, // will be set in detectDuplicates
    };
  });
}

// ── Duplicate Detection ───────────────────────────────────────────────────────

export async function detectDuplicates(
  userId: string,
  parsedRows: ParsedImportRow[]
): Promise<ParsedImportRow[]> {
  // Fetch all non-deleted transactions for this user (amount + type + day)
  const existingTx = await prisma.transaction.findMany({
    where: { userId, isDeleted: false },
    select: { occurredAt: true, amount: true, type: true },
  });

  // Build a Set of "YYYY-MM-DD|amount|type" keys for O(1) lookup
  const existingKeys = new Set<string>();
  for (const tx of existingTx) {
    const d = tx.occurredAt;
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}|${tx.amount}|${tx.type}`;
    existingKeys.add(key);
  }

  // Also track duplicates within the import batch itself
  const batchKeys = new Set<string>();

  return parsedRows.map((row) => {
    if (!row.isValid || !row.parsedDate || !row.amount || !row.type) {
      return row;
    }

    const d = row.parsedDate;
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}|${row.amount}|${row.type}`;

    if (existingKeys.has(key) || batchKeys.has(key)) {
      return { ...row, isDuplicate: true };
    }

    batchKeys.add(key);
    return row;
  });
}

// ── Session Store ─────────────────────────────────────────────────────────────

export function storeSession(userId: string, sessionId: string, rows: ParsedImportRow[]) {
  sessionStore.set(sessionKey(userId, sessionId), rows);
}

export function getSession(userId: string, sessionId: string): ParsedImportRow[] | undefined {
  return sessionStore.get(sessionKey(userId, sessionId));
}

export function clearSession(userId: string, sessionId: string) {
  sessionStore.delete(sessionKey(userId, sessionId));
}

// ── Batch Insert ──────────────────────────────────────────────────────────────

export async function batchInsert(
  userId: string,
  rows: ParsedImportRow[],
  overrideDuplicates: boolean
): Promise<{ importedCount: number; skippedCount: number }> {
  const toInsert = rows.filter((row) => {
    if (!row.isValid) return false;
    if (row.isDuplicate && !overrideDuplicates) return false;
    return true;
  });

  if (toInsert.length === 0) {
    return { importedCount: 0, skippedCount: rows.length };
  }

  // Single atomic transaction — if any insert fails, all roll back
  await prisma.$transaction(
    toInsert.map((row) =>
      prisma.transaction.create({
        data: {
          userId,
          type: row.type!,
          category: row.category,
          amount: row.amount!,
          reason: row.reason || null,
          note: null,
          occurredAt: row.parsedDate!,
        },
      })
    )
  );

  const skippedCount = rows.length - toInsert.length;
  return { importedCount: toInsert.length, skippedCount };
}

// ── Build Summary ─────────────────────────────────────────────────────────────

export function buildSummary(rows: ParsedImportRow[], overrideDuplicates: boolean): ImportSummary {
  const valid = rows.filter((r) => r.isValid);
  const invalid = rows.filter((r) => !r.isValid);
  const duplicates = rows.filter((r) => r.isDuplicate);

  const toImport = valid.filter((r) => !r.isDuplicate || overrideDuplicates);

  const cashInTotal = toImport
    .filter((r) => r.type === "CASH_IN")
    .reduce((sum, r) => sum + (r.amount ?? 0), 0);

  const cashOutTotal = toImport
    .filter((r) => r.type === "CASH_OUT")
    .reduce((sum, r) => sum + (r.amount ?? 0), 0);

  const netBalance = cashInTotal - cashOutTotal;

  return {
    totalRows: rows.length,
    validRows: valid.length,
    invalidRows: invalid.length,
    duplicateRows: duplicates.length,
    importedRows: toImport.length,
    skippedRows: rows.length - toImport.length,
    cashInTotal,
    cashOutTotal,
    netBalance,
    estimatedOpeningBalance: 0, // not calculated here — user already set opening balance
  };
}

// ── Import History (in-memory log) ───────────────────────────────────────────

interface ImportHistoryEntry {
  sessionId: string;
  userId: string;
  importedAt: string;
  importedRows: number;
  skippedRows: number;
  totalRows: number;
}

const importHistory: ImportHistoryEntry[] = [];

export function logImportHistory(entry: ImportHistoryEntry) {
  importHistory.unshift(entry);
  if (importHistory.length > 50) importHistory.pop();
}

export function getImportHistory(userId: string): ImportHistoryEntry[] {
  return importHistory.filter((e) => e.userId === userId);
}
