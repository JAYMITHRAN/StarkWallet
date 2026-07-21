import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { NAV_ITEMS } from "@/components/layout/nav-items";

/**
 * Every route nested under this layout requires a valid session. It also
 * enforces the onboarding gate: an authenticated user who hasn't set an
 * opening balance yet is always redirected to /onboarding, no matter which
 * protected route they tried to hit.
 */
export function ProtectedLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <LoadingSpinner label="Loading Stark OS..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user && !user.hasCompletedOnboarding && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  const currentTitle = NAV_ITEMS.find((item) => location.pathname.startsWith(item.to))?.label ?? "Stark Wallet";

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNavigation title={currentTitle} />
      <main className="lg:pl-64">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}
