import { Outlet } from "react-router-dom";
import { Wallet } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-glow">
          <Wallet className="h-6 w-6 text-white" aria-hidden />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-text">StarkMoneyWalletTracker</p>
          <p className="text-xs text-text-muted">Stark Glass · Secure Ledger</p>
        </div>
      </div>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
