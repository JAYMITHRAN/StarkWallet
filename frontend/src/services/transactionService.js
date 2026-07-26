import { apiRequest } from "./apiClient";
function buildQueryString(query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== "")
            params.set(key, String(value));
    });
    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
}
export const transactionService = {
    list: (query = {}) => apiRequest(`/transactions${buildQueryString(query)}`, { auth: true }),
    create: (payload) => apiRequest("/transactions", { method: "POST", body: payload }),
    cashOut: (payload) => apiRequest("/transactions/cash-out", { method: "POST", body: payload }),
    update: (id, payload) => apiRequest(`/transactions/${id}`, { method: "PUT", body: payload }),
    destroy: (id) => apiRequest(`/transactions/${id}`, { method: "DELETE" }),
    restore: (id) => apiRequest(`/transactions/${id}/restore`, { method: "POST" }),
    search: (query) => apiRequest(`/transactions/search${buildQueryString({ search: query })}`),
    filter: (query) => apiRequest(`/transactions/filter${buildQueryString(query)}`),
    dashboard: () => apiRequest('/transactions/dashboard'),
};
