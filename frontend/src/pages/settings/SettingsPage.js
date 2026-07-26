import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(PageContainer, { className: "max-w-lg", children: [_jsxs("div", { className: "mb-6 flex items-center gap-2", children: [_jsx(SettingsIcon, { className: "h-5 w-5 text-accent", "aria-hidden": true }), _jsx("h1", { className: "text-lg font-semibold text-text", children: "Settings" })] }), _jsxs(Card, { className: "mb-4", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Preferences" }) }), _jsx("ul", { className: "divide-y divide-border", children: settingsRows.map(({ icon: Icon, label, value }) => (_jsxs("li", { className: "flex items-center justify-between py-3 first:pt-0 last:pb-0", children: [_jsxs("span", { className: "flex items-center gap-3 text-sm text-text", children: [_jsx(Icon, { className: "h-4 w-4 text-text-muted", "aria-hidden": true }), label] }), _jsx("span", { className: "text-sm text-text-muted", children: value })] }, label))) })] }), _jsxs(Button, { variant: "black", className: "w-full text-danger", onClick: logout, children: [_jsx(LogOut, { className: "h-4 w-4", "aria-hidden": true }), "Lock Wallet"] })] }));
}
