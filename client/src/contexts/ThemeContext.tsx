import { createContext, useEffect, type ReactNode } from "react";

interface ThemeContextValue {
  theme: "dark";
}

export const ThemeContext = createContext<ThemeContextValue>({ theme: "dark" });

/**
 * Stark Glass ships dark-mode-only by design (see design brief). This
 * provider still exists as a real seam — not a stub — so a future phase
 * could add theme switching without restructuring the component tree.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return <ThemeContext.Provider value={{ theme: "dark" }}>{children}</ThemeContext.Provider>;
}
