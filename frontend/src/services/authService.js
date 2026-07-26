import { apiRequest } from "./apiClient";
export const authService = {
    status: () => apiRequest("/auth/status", { auth: false }),
    createPassword: (payload) => apiRequest("/auth/create-password", { method: "POST", body: payload, auth: false }),
    login: (payload) => apiRequest("/auth/login", { method: "POST", body: payload, auth: false }),
    me: () => apiRequest("/auth/me"),
};
