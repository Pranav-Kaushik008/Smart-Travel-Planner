import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const savedSettings = localStorage.getItem("user_app_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.theme) return parsed.theme;
      }
    } catch (e) { /* ignore */ }
    return localStorage.getItem("app_theme") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      body.classList.add("dark");
      body.classList.remove("light");
      // Set direct styles as fallback for immediate visual change
      body.style.backgroundColor = "#020617";
      body.style.color = "#e2e8f0";
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      body.classList.remove("dark");
      body.classList.add("light");
      body.style.backgroundColor = "#f8fafc";
      body.style.color = "#1e293b";
    }

    localStorage.setItem("app_theme", theme);

    // Sync into user_app_settings
    try {
      const savedSettings = localStorage.getItem("user_app_settings");
      let settingsObj = savedSettings ? JSON.parse(savedSettings) : {};
      settingsObj.theme = theme;
      localStorage.setItem("user_app_settings", JSON.stringify(settingsObj));
    } catch (e) { /* ignore */ }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
