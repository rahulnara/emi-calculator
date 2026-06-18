import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("emi-theme") || "light");
  const [compactView, setCompactView] = useState(() => localStorage.getItem("emi-compact") === "true");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("emi-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.compact = String(compactView);
    localStorage.setItem("emi-compact", String(compactView));
  }, [compactView]);

  const value = useMemo(
    () => ({
      theme,
      compactView,
      toggleTheme: () => setTheme((current) => (current === "light" ? "dark" : "light")),
      toggleCompactView: () => setCompactView((current) => !current)
    }),
    [theme, compactView]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
