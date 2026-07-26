import { apiRequest } from "./apiClient";
import type { CreateTransactionRequest, Transaction, UpdateTransactionRequest, TransactionListQuery } from "@stark/shared/types/index";

function buildQueryString(query: Record<string, string | number | boolean | undefined>) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export const transactionService = {
  list: (query: TransactionListQuery = {}) => apiRequest<Transaction[]>(`/transactions${buildQueryString(query as Record<string, string | number | boolean | undefined>)}`, { auth: true }),
  create: (payload: CreateTransactionRequest) =>
    apiRequest<Transaction>("/transactions", { method: "POST", body: payload }),
  cashOut: (payload: CreateTransactionRequest) =>
    apiRequest<Transaction>("/transactions/cash-out", { method: "POST", body: payload }),
  update: (id: string, payload: UpdateTransactionRequest) =>
    apiRequest<Transaction>(`/transactions/${id}`, { method: "PUT", body: payload }),
  destroy: (id: string) => apiRequest<Transaction>(`/transactions/${id}`, { method: "DELETE" }),
  restore: (id: string) => apiRequest<Transaction>(`/transactions/${id}/restore`, { method: "POST" }),
  search: (query: string) => apiRequest<Transaction[]>(`/transactions/search${buildQueryString({ search: query })}`),
  filter: (query: TransactionListQuery) => apiRequest<Transaction[]>(`/transactions/filter${buildQueryString(query as Record<string, string | number | boolean | undefined>)}`),
  dashboard: () => apiRequest<{
    openingBalance: number;
    totalCashIn: number;
    totalCashOut: number;
    currentBalance: number;
    todayIncome: number;
    todayExpense: number;
    thisWeekExpense: number;
    thisMonthExpense: number;
    recentTransactions: Array<{
      id: string;
      type: string;
      amount: number;
      category: string;
      reason: string | null;
      note: string | null;
      occurredAt: string;
    }>;
  }>('/transactions/dashboard'),
};
