import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "@/services/authService";
import { sessionService } from "@/services/sessionService";
import { tokenStorage } from "@/services/apiClient";
export const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
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
            if (token)
                sessionService.setToken(token);
        }
        catch {
            sessionService.clearToken();
            tokenStorage.clear();
            setUser(null);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        void refreshUser();
    }, [refreshUser]);
    const setSession = useCallback((token, nextUser) => {
        sessionService.setToken(token);
        tokenStorage.set(token);
        setUser(nextUser);
    }, []);
    const logout = useCallback(() => {
        sessionService.clearToken();
        tokenStorage.clear();
        setUser(null);
    }, []);
    const value = useMemo(() => ({ user, isLoading, isAuthenticated: Boolean(user), setSession, logout, refreshUser }), [user, isLoading, setSession, logout, refreshUser]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
