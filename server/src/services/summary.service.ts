import { prisma } from "../lib/prisma.js";

/** Computes dynamic monthly aggregation from transactions table. */
export const summaryService = {
  async getForMonth(userId: string, year: number, month: number) {
    const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0));

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        isDeleted: false,
        occurredAt: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    });

    const totalCashIn = transactions
      .filter((tx) => tx.type === "CASH_IN")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalCashOut = transactions
      .filter((tx) => tx.type === "CASH_OUT")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const categoryTotalsMap: Record<string, { category: string; cashIn: number; cashOut: number }> = {};

    for (const tx of transactions) {
      if (tx.type === "OPENING_BALANCE") continue;
      const cat = tx.category || "OTHER";
      if (!categoryTotalsMap[cat]) {
        categoryTotalsMap[cat] = { category: cat, cashIn: 0, cashOut: 0 };
      }
      if (tx.type === "CASH_IN") {
        categoryTotalsMap[cat]!.cashIn += tx.amount;
      } else if (tx.type === "CASH_OUT") {
        categoryTotalsMap[cat]!.cashOut += tx.amount;
      }
    }

    const categoryBreakdown = Object.values(categoryTotalsMap);

    return {
      year,
      month,
      totalCashIn,
      totalCashOut,
      netBalance: totalCashIn - totalCashOut,
      categoryBreakdown,
    };
  },
};
