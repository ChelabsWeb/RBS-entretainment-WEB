"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeColors = {
  primary: string;
  secondary: string;
  text: string;
};

type ThemeContextType = {
  theme: ThemeColors;
  setTheme: (colors: ThemeColors) => void;
};

const defaultTheme: ThemeColors = {
  primary: "#4f5ea7", // New Corporate Blue
  secondary: "#000000",
  text: "#000000",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);

  useEffect(() => {
    // Update CSS variables on the root element
    const root = document.documentElement;
    root.style.setProperty("--theme-primary", theme.primary);
    root.style.setProperty("--theme-secondary", theme.secondary);
    root.style.setProperty("--theme-text", theme.text);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
