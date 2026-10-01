"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";
type Ctx = { theme: Theme; resolvedTheme: "light" | "dark"; setTheme: (t: Theme) => void };

const KEY = "theme";
const ThemeContext = React.createContext<Ctx>({ theme: "system", resolvedTheme: "light", setTheme: () => {} });

export const useTheme = () => React.useContext(ThemeContext);

const prefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system");
  const [resolvedTheme, setResolved] = React.useState<"light" | "dark">("light");

  const apply = React.useCallback((t: Theme) => {
    const dark = t === "dark" || (t === "system" && prefersDark());
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    setResolved(dark ? "dark" : "light");
  }, []);

  React.useEffect(() => {
    let saved: Theme = "system";
    try { saved = (localStorage.getItem(KEY) as Theme) || "system"; } catch {}
    setThemeState(saved);
    apply(saved);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let current = "system";
      try { current = localStorage.getItem(KEY) || "system"; } catch {}
      if (current === "system") apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [apply]);

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t);
    try { localStorage.setItem(KEY, t); } catch {}
    apply(t);
  }, [apply]);

  return <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>;
}
