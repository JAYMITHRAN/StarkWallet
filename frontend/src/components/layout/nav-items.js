import { Home, ArrowDownCircle, ArrowUpCircle, History, PieChart, Settings, Download } from "lucide-react";
// Primary navigation, ordered by frequency of use — Cash In / Cash Out
// sit closest to Dashboard because logging a transaction fast is the
// product's core promise ("under 5 seconds").
export const NAV_ITEMS = [
    { label: "Dashboard", to: "/dashboard", icon: Home },
    { label: "Cash In", to: "/cash-in", icon: ArrowDownCircle },
    { label: "Cash Out", to: "/cash-out", icon: ArrowUpCircle },
    { label: "History", to: "/history", icon: History },
    { label: "Summary", to: "/summary", icon: PieChart },
    { label: "Export", to: "/export", icon: Download },
    { label: "Settings", to: "/settings", icon: Settings },
];
// Bottom nav (mobile): Dashboard · Cash In · Cash Out · History · Summary
// Settings is reachable via the gear icon in the mobile TopNavigation header
// and from the desktop sidebar, keeping the tab bar focused on core actions.
export const BOTTOM_NAV_ITEMS = [
    NAV_ITEMS[0], // Dashboard
    NAV_ITEMS[1], // Cash In
    NAV_ITEMS[2], // Cash Out
    NAV_ITEMS[3], // History
    NAV_ITEMS[4],
];
