import { apiRequest } from "./apiClient";
import type {
  AuthResponse,
  CreatePasswordRequest,
  LoginRequest,
  User,
} from "@stark/shared/types/index";

export const authService = {
  status: () => apiRequest<{ hasAccount: boolean }>("/auth/status", { auth: false }),

  createPassword: (payload: CreatePasswordRequest) =>
    apiRequest<AuthResponse>("/auth/create-password", { method: "POST", body: payload, auth: false }),

  login: (payload: LoginRequest) =>
    apiRequest<AuthResponse>("/auth/login", { method: "POST", body: payload, auth: false }),

  me: () => apiRequest<User>("/auth/me"),
};
