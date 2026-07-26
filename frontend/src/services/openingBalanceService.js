import { apiRequest } from "./apiClient";
export const openingBalanceService = {
    set: (payload) => apiRequest("/opening-balance", { method: "POST", body: payload }),
};
