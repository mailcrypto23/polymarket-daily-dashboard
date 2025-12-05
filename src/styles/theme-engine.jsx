import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Load saved theme from localStorage or default to "glossy-dark"
    return localStorage.getItem("theme") || "glossy-dark";
  });

  useEffect(() => {
    // Apply theme attribute to <html>
    document.documentElement.setAttribute("data-theme", theme);
    // Save theme
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

