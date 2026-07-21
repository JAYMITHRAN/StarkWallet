import { Settings as SettingsIcon, LogOut, Shield, Palette, Coins } from "lucide-react";
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
    <PageContainer className="max-w-lg">
      <div className="mb-6 flex items-center gap-2">
        <SettingsIcon className="h-5 w-5 text-accent" aria-hidden />
        <h1 className="text-lg font-semibold text-text">Settings</h1>
      </div>

      <Card className="mb-4">
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
