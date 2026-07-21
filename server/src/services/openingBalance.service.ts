import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/httpError.js";
import type { OpeningBalanceInput } from "../validators/openingBalance.validator.js";

export const openingBalanceService = {
  async setOpeningBalance(userId: string, input: OpeningBalanceInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw HttpError.notFound("User not found.");
    }
    if (user.hasCompletedOnboarding) {
      throw HttpError.conflict("Opening balance has already been set for this account.");
    }

    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId,
          type: "OPENING_BALANCE",
          category: "OTHER",
          amount: input.amount,
          note: "Opening balance",
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { hasCompletedOnboarding: true },
      }),
    ]);

    return transaction;
  },
};
