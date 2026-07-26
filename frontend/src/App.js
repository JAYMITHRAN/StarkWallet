import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/components/ui/Toast";
import { LoadingScreen } from "@/pages/LoadingScreen";
import { router } from "@/routes/router";
export function App() {
    const [bootComplete, setBootComplete] = useState(false);
    return (_jsx(ThemeProvider, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(AuthProvider, { children: _jsxs(ToastProvider, { children: [!bootComplete && _jsx(LoadingScreen, { onComplete: () => setBootComplete(true) }), bootComplete && _jsx(RouterProvider, { router: router })] }) }) }) }));
}
