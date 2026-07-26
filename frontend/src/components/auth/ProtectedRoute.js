import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
export function ProtectedRoute() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return (_jsx("div", { className: "flex h-screen items-center justify-center bg-background", children: _jsx(LoadingSpinner, { label: "Verifying session..." }) }));
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true, state: { from: location } });
    }
    if (user && !user.hasCompletedOnboarding && location.pathname !== "/onboarding") {
        return _jsx(Navigate, { to: "/onboarding", replace: true });
    }
    return _jsx(Outlet, {});
}
