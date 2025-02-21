"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  color: string;
  setColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [color, setColor] = useState<string>("#000000"); // اللون الافتراضي

  useEffect(() => {
    const storedColor = localStorage.getItem("themeColor");
    if (storedColor) {
      setColor(storedColor);
    }
  }, []);
  useEffect(() => {
    document.body.style.backgroundColor = color; // تطبيق اللون على الـ body
    localStorage.setItem("themeColor", color); // حفظ اللون المختار في localStorage
  }, [color]);

  return (
    <ThemeContext.Provider value={{ color, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
