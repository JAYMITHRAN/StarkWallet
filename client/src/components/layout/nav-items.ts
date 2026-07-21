import { Home, ArrowDownCircle, ArrowUpCircle, History, PieChart, Settings, Download } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

// Primary navigation, ordered by frequency of use — Cash In / Cash Out
// sit closest to Dashboard because logging a transaction fast is the
// product's core promise ("under 5 seconds").
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: Home },
  { label: "Cash In", to: "/cash-in", icon: ArrowDownCircle },
  { label: "Cash Out", to: "/cash-out", icon: ArrowUpCircle },
  { label: "History", to: "/history", icon: History },
  { label: "Summary", to: "/summary", icon: PieChart },
  { label: "Export", to: "/export", icon: Download },
  { label: "Settings", to: "/settings", icon: Settings },
];

// Bottom nav (mobile) shows a focused subset; the rest live in Settings > More
// or are reachable from Dashboard shortcuts, keeping the tab bar uncluttered.
export const BOTTOM_NAV_ITEMS: NavItem[] = [
  NAV_ITEMS[0]!,
  NAV_ITEMS[1]!,
  NAV_ITEMS[2]!,
  NAV_ITEMS[3]!,
  NAV_ITEMS[6]!,
];
