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
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      authService
        .status()
        .then((res) => setHasAccount(res.hasAccount))
        .catch(() => setHasAccount(true));
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <LoadingSpinner label="Loading Stark OS..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={user?.hasCompletedOnboarding ? "/dashboard" : "/onboarding"} replace />;
  }

  if (hasAccount === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <LoadingSpinner label="Loading Stark OS..." />
      </div>
    );
  }

  return <Navigate to={hasAccount ? "/login" : "/create-password"} replace />;
}
