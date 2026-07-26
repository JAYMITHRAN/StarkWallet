import type { FastifyReply, FastifyRequest } from "fastify";
import { openingBalanceService } from "../services/openingBalance.service.js";
import { openingBalanceSchema } from "../validators/openingBalance.validator.js";
import type { ApiSuccess, Transaction } from "../shared/types/index.js";

export const openingBalanceController = {
  async set(request: FastifyRequest, reply: FastifyReply) {
    const input = openingBalanceSchema.parse(request.body);
    const { userId } = request.user;
    const transaction = await openingBalanceService.setOpeningBalance(userId, input);

    const body: ApiSuccess<Transaction> = {
      success: true,
      data: {
        id: transaction.id,
        userId: transaction.userId,
        type: transaction.type as Transaction["type"],
        category: transaction.category as Transaction["category"],
        amount: transaction.amount,
        reason: transaction.reason ?? null,
        note: transaction.note,
        occurredAt: transaction.occurredAt.toISOString(),
        isDeleted: transaction.isDeleted,
        deletedAt: transaction.deletedAt ? transaction.deletedAt.toISOString() : null,
        createdAt: transaction.createdAt.toISOString(),
        updatedAt: transaction.updatedAt.toISOString(),
      },
    };
    return reply.status(201).send(body);
  },
};
