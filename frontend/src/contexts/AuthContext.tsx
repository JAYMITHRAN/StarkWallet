import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@stark/shared/types/index";
import { authService } from "@/services/authService";
import { sessionService } from "@/services/sessionService";
import { tokenStorage } from "@/services/apiClient";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = sessionService.getToken() ?? tokenStorage.get();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const me = await authService.me();
      setUser(me);
      if (token) sessionService.setToken(token);
    } catch {
      sessionService.clearToken();
      tokenStorage.clear();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const setSession = useCallback((token: string, nextUser: User) => {
    sessionService.setToken(token);
    tokenStorage.set(token);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    sessionService.clearToken();
    tokenStorage.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated: Boolean(user), setSession, logout, refreshUser }),
    [user, isLoading, setSession, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
