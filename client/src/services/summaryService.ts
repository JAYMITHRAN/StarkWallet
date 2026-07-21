import { apiRequest } from "./apiClient";

export interface CategoryBreakdown {
  category: string;
  cashIn: number;
  cashOut: number;
}

export interface MonthlySummaryResponse {
  year: number;
  month: number;
  totalCashIn: number;
  totalCashOut: number;
  netBalance: number;
  categoryBreakdown: CategoryBreakdown[];
}

export const summaryService = {
  getForMonth: (year: number, month: number) =>
    apiRequest<MonthlySummaryResponse>(`/summary/${year}/${month}`, { auth: true }),
};
