import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
/**
 * Entry point for "/". Figures out which of the three first-run states
 * applies — no account yet, account exists but logged out, or already
 * authenticated — and redirects accordingly.
 */
export function RootRedirect() {
    const { isAuthenticated, isLoading: authLoading, user } = useAuth();
    const [hasAccount, setHasAccount] = useState(null);
    useEffect(() => {
        if (!isAuthenticated) {
            authService
                .status()
                .then((res) => setHasAccount(res.hasAccount))
                .catch(() => setHasAccount(true));
        }
    }, [isAuthenticated]);
    if (authLoading) {
        return (_jsx("div", { className: "flex h-screen items-center justify-center bg-background", children: _jsx(LoadingSpinner, { label: "Loading Stark OS..." }) }));
    }
    if (isAuthenticated) {
        return _jsx(Navigate, { to: user?.hasCompletedOnboarding ? "/dashboard" : "/onboarding", replace: true });
    }
    if (hasAccount === null) {
        return (_jsx("div", { className: "flex h-screen items-center justify-center bg-background", children: _jsx(LoadingSpinner, { label: "Loading Stark OS..." }) }));
    }
    return _jsx(Navigate, { to: hasAccount ? "/login" : "/create-password", replace: true });
}
