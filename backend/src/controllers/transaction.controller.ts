import type { FastifyReply, FastifyRequest } from "fastify";
import { transactionService } from "../services/transaction.service.js";
import { cashOutSchema, createTransactionSchema, updateTransactionSchema } from "../validators/transaction.validator.js";
import type { ApiSuccess, CreateTransactionRequest, Transaction, UpdateTransactionRequest } from "../shared/types/index.js";

function serializeTransaction(transaction: any): Transaction {
  return {
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
  };
}

export const transactionController = {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const query = request.query as Record<string, string | undefined>;
    const transactions = await transactionService.list(userId, {
      type: query.type as any,
      category: query.category as any,
      search: query.search,
      from: query.from,
      to: query.to,
      sort: query.sort as any,
      includeDeleted: query.includeDeleted === "true",
    });
    const body: ApiSuccess<Transaction[]> = { success: true, data: transactions.map(serializeTransaction) };
    return reply.status(200).send(body);
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const input = createTransactionSchema.parse(request.body);
    const { userId } = request.user;
    const transaction = await transactionService.create(userId, input as CreateTransactionRequest);
    const body: ApiSuccess<Transaction> = { success: true, data: serializeTransaction(transaction) };
    return reply.status(201).send(body);
  },

  async cashOut(request: FastifyRequest, reply: FastifyReply) {
    const input = cashOutSchema.parse(request.body);
    const { userId } = request.user;
    const transaction = await transactionService.create(userId, {
      type: "CASH_OUT",
      category: input.category as Transaction["category"],
      amount: input.amount,
      reason: input.reason,
      note: input.note,
      occurredAt: input.occurredAt,
    } as CreateTransactionRequest);
    const body: ApiSuccess<Transaction> = { success: true, data: serializeTransaction(transaction) };
    return reply.status(201).send(body);
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const input = updateTransactionSchema.parse(request.body);
    const { userId } = request.user;
    const transaction = await transactionService.update(userId, id, input as UpdateTransactionRequest);
    const body: ApiSuccess<Transaction> = { success: true, data: serializeTransaction(transaction) };
    return reply.status(200).send(body);
  },

  async destroy(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { userId } = request.user;
    const transaction = await transactionService.destroy(userId, id);
    const body: ApiSuccess<Transaction> = { success: true, data: serializeTransaction(transaction) };
    return reply.status(200).send(body);
  },

  async restore(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { userId } = request.user;
    const transaction = await transactionService.restore(userId, id);
    const body: ApiSuccess<Transaction> = { success: true, data: serializeTransaction(transaction) };
    return reply.status(200).send(body);
  },

  async search(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const query = request.query as Record<string, string | undefined>;
    const transactions = await transactionService.list(userId, { search: query.search, type: query.type as any, category: query.category as any, sort: query.sort as any });
    const body: ApiSuccess<Transaction[]> = { success: true, data: transactions.map(serializeTransaction) };
    return reply.status(200).send(body);
  },

  async filter(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const query = request.query as Record<string, string | undefined>;
    const transactions = await transactionService.list(userId, {
      type: query.type as any,
      category: query.category as any,
      from: query.from,
      to: query.to,
      sort: query.sort as any,
    });
    const body: ApiSuccess<Transaction[]> = { success: true, data: transactions.map(serializeTransaction) };
    return reply.status(200).send(body);
  },

  async dashboard(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.user;
    const summary = await transactionService.getDashboardSummary(userId);
    return reply.status(200).send({ success: true, data: summary });
  },
};
