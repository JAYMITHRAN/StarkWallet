import { apiRequest } from "./apiClient";
import type { OpeningBalanceRequest, Transaction } from "@stark/shared/types/index";

export const openingBalanceService = {
  set: (payload: OpeningBalanceRequest) =>
    apiRequest<Transaction>("/opening-balance", { method: "POST", body: payload }),
};
