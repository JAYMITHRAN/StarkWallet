import { z } from "zod";

export const noteoutTypeEnum = z.enum(["IN", "OUT"]);

export const createNoteoutSchema = z.object({
  type: noteoutTypeEnum,
  amount: z.number().positive("Amount must be greater than zero"),
  reason: z.string().min(1, "Reason is required").max(200),
  note: z.string().max(280).optional(),
  occurredAt: z.string().datetime().optional(),
});

export const updateNoteoutSchema = z.object({
  type: noteoutTypeEnum.optional(),
  amount: z.number().positive("Amount must be greater than zero").optional(),
  reason: z.string().min(1).max(200).optional(),
  note: z.string().max(280).optional(),
  occurredAt: z.string().datetime().optional(),
});
