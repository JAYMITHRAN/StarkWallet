import { NavLink } from "react-router-dom";
import { BOTTOM_NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/80 backdrop-blur-glass lg:hidden">
      <div className="flex items-center justify-around px-2 py-2" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {BOTTOM_NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors",
                isActive ? "text-accent" : "text-text-muted"
              )
            }
          >
            <Icon className="h-5 w-5" aria-hidden />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
