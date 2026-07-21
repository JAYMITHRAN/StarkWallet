import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/httpError.js";
import type { CreateTransactionRequest, UpdateTransactionRequest, TransactionListQuery } from "../../../shared/types/index.js";

interface DashboardSummary {
  openingBalance: number;
  totalCashIn: number;
  totalCashOut: number;
  currentBalance: number;
  todayIncome: number;
  todayExpense: number;
  thisWeekExpense: number;
  thisMonthExpense: number;
  recentTransactions: Array<{
    id: string;
    type: string;
    amount: number;
    category: string;
    reason: string | null;
    note: string | null;
    occurredAt: Date;
  }>;
}

function parseDate(value?: string) {
  return value ? new Date(value) : undefined;
}

export const transactionService = {
  async list(userId: string, options: TransactionListQuery = {}) {
    const { type, category, search, from, to, sort = "newest", includeDeleted = false } = options;
    const where: Record<string, unknown> = { userId };
    if (!includeDeleted) where.isDeleted = false;
    if (type) where.type = type;
    if (category) where.category = category;
    if (from || to) {
      where.occurredAt = {} as Record<string, unknown>;
      if (from) (where.occurredAt as Record<string, Date>).gte = new Date(from);
      if (to) (where.occurredAt as Record<string, Date>).lte = new Date(to);
    }
    if (search) {
      where.OR = [
        { reason: { contains: search } },
        { note: { contains: search } },
        { category: { contains: search } },
      ];
    }

    const orderBy = sort === "oldest"
      ? { occurredAt: "asc" as const }
      : sort === "highest"
        ? { amount: "desc" as const }
        : sort === "lowest"
          ? { amount: "asc" as const }
          : sort === "category"
            ? { category: "asc" as const }
            : { occurredAt: "desc" as const };

    return prisma.transaction.findMany({ where, orderBy });
  },

  async create(userId: string, input: CreateTransactionRequest) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw HttpError.notFound("User not found.");

    return prisma.transaction.create({
      data: {
        userId,
        type: input.type,
        category: input.category,
        amount: input.amount,
        reason: input.reason ?? null,
        note: input.note ?? null,
        occurredAt: input.occurredAt ? new Date(input.occurredAt) : new Date(),
      },
    });
  },

  async update(userId: string, transactionId: string, input: UpdateTransactionRequest) {
    const existing = await prisma.transaction.findFirst({ where: { id: transactionId, userId } });
    if (!existing) throw HttpError.notFound("Transaction not found.");

    return prisma.transaction.update({
      where: { id: transactionId },
      data: {
        ...(input.type ? { type: input.type } : {}),
        ...(input.category ? { category: input.category } : {}),
        ...(typeof input.amount === "number" ? { amount: input.amount } : {}),
        ...(input.reason !== undefined ? { reason: input.reason || null } : {}),
        ...(input.note !== undefined ? { note: input.note || null } : {}),
        ...(input.occurredAt ? { occurredAt: new Date(input.occurredAt) } : {}),
      },
    });
  },

  async destroy(userId: string, transactionId: string) {
    const existing = await prisma.transaction.findFirst({ where: { id: transactionId, userId } });
    if (!existing) throw HttpError.notFound("Transaction not found.");

    return prisma.transaction.update({
      where: { id: transactionId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  },

  async restore(userId: string, transactionId: string) {
    const existing = await prisma.transaction.findFirst({ where: { id: transactionId, userId } });
    if (!existing) throw HttpError.notFound("Transaction not found.");

    return prisma.transaction.update({
      where: { id: transactionId },
      data: { isDeleted: false, deletedAt: null },
    });
  },

  async getDashboardSummary(userId: string): Promise<DashboardSummary> {
    const [user, transactions] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.transaction.findMany({
        where: { userId, isDeleted: false },
        orderBy: { occurredAt: "desc" },
      }),
    ]);

    if (!user) throw HttpError.notFound("User not found.");

    const openingBalance = transactions.filter((tx) => tx.type === "OPENING_BALANCE").reduce((sum, tx) => sum + tx.amount, 0);
    const totalCashIn = transactions.filter((tx) => tx.type === "CASH_IN").reduce((sum, tx) => sum + tx.amount, 0);
    const totalCashOut = transactions.filter((tx) => tx.type === "CASH_OUT").reduce((sum, tx) => sum + tx.amount, 0);
    const currentBalance = openingBalance + totalCashIn - totalCashOut;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 6);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayIncome = transactions
      .filter((tx) => tx.type === "CASH_IN" && tx.occurredAt >= startOfToday)
      .reduce((sum, tx) => sum + tx.amount, 0);
    const todayExpense = transactions
      .filter((tx) => tx.type === "CASH_OUT" && tx.occurredAt >= startOfToday)
      .reduce((sum, tx) => sum + tx.amount, 0);
    const thisWeekExpense = transactions
      .filter((tx) => tx.type === "CASH_OUT" && tx.occurredAt >= startOfWeek)
      .reduce((sum, tx) => sum + tx.amount, 0);
    const thisMonthExpense = transactions
      .filter((tx) => tx.type === "CASH_OUT" && tx.occurredAt >= startOfMonth)
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      openingBalance,
      totalCashIn,
      totalCashOut,
      currentBalance,
      todayIncome,
      todayExpense,
      thisWeekExpense,
      thisMonthExpense,
      recentTransactions: transactions.slice(0, 8).map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        category: tx.category,
        reason: tx.reason,
        note: tx.note,
        occurredAt: tx.occurredAt,
      })),
    };
  },
};
