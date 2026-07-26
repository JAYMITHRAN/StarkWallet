import { apiRequest } from "./apiClient";
export const summaryService = {
    getForMonth: (year, month) => apiRequest(`/summary/${year}/${month}`, { auth: true }),
};
