import { jsx as _jsx } from "react/jsx-runtime";
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
export const router = createBrowserRouter([
    {
        element: _jsx(AuthLayout, {}),
        children: [
            { path: "/create-password", element: _jsx(CreatePasswordPage, {}) },
            { path: "/login", element: _jsx(LoginPage, {}) },
        ],
    },
    {
        element: _jsx(ProtectedRoute, {}),
        children: [
            {
                element: _jsx(ProtectedLayout, {}),
                children: [
                    { path: "/onboarding", element: _jsx(OpeningBalancePage, {}) },
                    { path: "/dashboard", element: _jsx(DashboardPage, {}) },
                    { path: "/cash-in", element: _jsx(CashInPage, {}) },
                    { path: "/cash-out", element: _jsx(CashOutPage, {}) },
                    { path: "/history", element: _jsx(HistoryPage, {}) },
                    { path: "/summary", element: _jsx(MonthlySummaryPage, {}) },
                    { path: "/settings", element: _jsx(SettingsPage, {}) },
                    { path: "/export", element: _jsx(ExportPage, {}) },
                ],
            },
        ],
    },
    { path: "/", element: _jsx(RootRedirect, {}) },
    { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) },
]);
