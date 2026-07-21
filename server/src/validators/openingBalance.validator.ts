import { z } from "zod";

export const openingBalanceSchema = z.object({
  amount: z.number().min(0, "Opening balance cannot be negative"),
});

export type OpeningBalanceInput = z.infer<typeof openingBalanceSchema>;
