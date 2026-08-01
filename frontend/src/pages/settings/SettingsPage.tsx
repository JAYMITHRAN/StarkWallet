import { Settings as SettingsIcon, LogOut, Shield, Palette, Coins, BookText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

const settingsRows = [
  { icon: Coins, label: "Currency", value: "INR" },
  { icon: Palette, label: "Theme", value: "Stark Glass (Dark)" },
  { icon: Shield, label: "Security", value: "Password protected" },
];

export function SettingsPage() {
  const { logout } = useAuth();

  return (
    <PageContainer className="max-w-lg space-y-4">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-5 w-5 text-accent" aria-hidden />
        <h1 className="text-lg font-semibold text-text">Settings</h1>
      </div>

      {/* Noteouts Ledger Entry Point */}
      <Card className="overflow-hidden border-purple-500/30 bg-purple-500/5">
        <Link
          to="/noteouts"
          id="settings-noteouts-link"
          className="group flex items-center justify-between p-4 transition-colors hover:bg-purple-500/10"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
              <BookText className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-text group-hover:text-purple-300 transition-colors">
                Noteouts Ledger
              </p>
              <p className="text-xs text-text-muted">
                Off-book notebook for private transaction tracking
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-purple-400">
            <span>Open</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <ul className="divide-y divide-border">
          {settingsRows.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <span className="flex items-center gap-3 text-sm text-text">
                <Icon className="h-4 w-4 text-text-muted" aria-hidden />
                {label}
              </span>
              <span className="text-sm text-text-muted">{value}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Button variant="black" className="w-full text-danger" onClick={logout}>
        <LogOut className="h-4 w-4" aria-hidden />
        Lock Wallet
      </Button>
    </PageContainer>
  );
}
