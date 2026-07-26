import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useEffect } from "react";
export const ThemeContext = createContext({ theme: "dark" });
/**
 * Stark Glass ships dark-mode-only by design (see design brief). This
 * provider still exists as a real seam — not a stub — so a future phase
 * could add theme switching without restructuring the component tree.
 */
export function ThemeProvider({ children }) {
    useEffect(() => {
        document.documentElement.classList.add("dark");
    }, []);
    return _jsx(ThemeContext.Provider, { value: { theme: "dark" }, children: children });
}
