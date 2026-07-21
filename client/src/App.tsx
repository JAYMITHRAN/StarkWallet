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

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            {!bootComplete && <LoadingScreen onComplete={() => setBootComplete(true)} />}
            {bootComplete && <RouterProvider router={router} />}
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
