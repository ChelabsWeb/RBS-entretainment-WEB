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
    // Helper to convert hex to rgb for opacity-based effects
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "79, 94, 167";
    };

    root.style.setProperty("--theme-primary", theme.primary);
    root.style.setProperty("--theme-primary-rgb", hexToRgb(theme.primary));
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
