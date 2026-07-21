import { HttpError } from "../utils/httpError.js";

/** Phase 1 placeholder — implemented alongside Recurring Expenses in a later phase. */
export const recurringService = {
  async list(_userId: string): Promise<never> {
    throw HttpError.internal("Recurring expenses are not implemented yet.");
  },
};
