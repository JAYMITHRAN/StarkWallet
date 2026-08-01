import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootRedirect } from "@/pages/RootRedirect";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedLayout } from "@/layouts/ProtectedLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CreatePasswordPage } from "@/pages/auth/CreatePasswordPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { OpeningBalancePage } from "@/pages/onboarding/OpeningBalancePage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { CashInPage } from "@/pages/transactions/CashInPage";
import { CashOutPage } from "@/pages/transactions/CashOutPage";
import { HistoryPage } from "@/pages/history/HistoryPage";
import { MonthlySummaryPage } from "@/pages/summary/MonthlySummaryPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { ExportPage } from "@/pages/export/ExportPage";
import { NoteoutsPage } from "@/pages/noteouts/NoteoutsPage";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/create-password", element: <CreatePasswordPage /> },
      { path: "/login", element: <LoginPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          { path: "/onboarding", element: <OpeningBalancePage /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/cash-in", element: <CashInPage /> },
          { path: "/cash-out", element: <CashOutPage /> },
          { path: "/history", element: <HistoryPage /> },
          { path: "/summary", element: <MonthlySummaryPage /> },
          { path: "/settings", element: <SettingsPage /> },
          { path: "/export", element: <ExportPage /> },
          { path: "/noteouts", element: <NoteoutsPage /> },
        ],
      },
    ],
  },
  { path: "/", element: <RootRedirect /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);
