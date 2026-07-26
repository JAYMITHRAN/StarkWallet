// ─────────────────────────────────────────────────────────────────────────────
// StarkMoneyWalletTracker — Import Validator
// ─────────────────────────────────────────────────────────────────────────────
import { z } from "zod";

export const confirmImportSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
  overrideDuplicates: z.boolean().default(false),
});

export type ConfirmImportRequest = z.infer<typeof confirmImportSchema>;
