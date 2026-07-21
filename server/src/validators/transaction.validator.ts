import { z } from "zod";

export const transactionTypeEnum = z.enum(["CASH_IN", "CASH_OUT", "OPENING_BALANCE"]);

export const transactionCategoryEnum = z.enum([
  "SALARY", "BUSINESS", "GIFT", "INVESTMENT_RETURN",
  "FOOD", "TRANSPORT", "RENT", "UTILITIES", "SHOPPING",
  "HEALTH", "ENTERTAINMENT", "EDUCATION", "SUBSCRIPTION",
  "BILLS", "TRAVEL", "INVESTMENT", "OTHER",
]);

export const createTransactionSchema = z.object({
  type: transactionTypeEnum,
  category: transactionCategoryEnum,
  amount: z.number().positive("Amount must be greater than zero"),
  reason: z.string().max(80).optional(),
  note: z.string().max(280).optional(),
  occurredAt: z.string().datetime().optional(),
});

export const updateTransactionSchema = z.object({
  type: transactionTypeEnum.optional(),
  category: transactionCategoryEnum.optional(),
  amount: z.number().positive("Amount must be greater than zero").optional(),
  reason: z.string().max(80).optional(),
  note: z.string().max(280).optional(),
  occurredAt: z.string().datetime().optional(),
});

export const listTransactionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  type: transactionTypeEnum.optional(),
  category: transactionCategoryEnum.optional(),
  search: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  sort: z.enum(["newest", "oldest", "highest", "lowest", "category"]).optional(),
  includeDeleted: z.coerce.boolean().optional(),
});

export const cashOutSchema = z.object({
  amount: z.number().positive("Amount must be greater than zero"),
  category: transactionCategoryEnum.default("OTHER"),
  reason: z.string().max(80).optional(),
  note: z.string().max(280).optional(),
  occurredAt: z.string().datetime().optional(),
});
