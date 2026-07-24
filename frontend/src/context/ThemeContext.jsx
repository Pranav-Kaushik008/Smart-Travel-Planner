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

  const [accentColor, setAccentColor] = useState(() => {
    try {
      const savedSettings = localStorage.getItem("user_app_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.accentColor) return parsed.accentColor;
      }
    } catch (e) { /* ignore */ }
    return localStorage.getItem("app_accent") || "sky";
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      body.classList.add("dark");
      body.classList.remove("light");
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

    try {
      const savedSettings = localStorage.getItem("user_app_settings");
      let settingsObj = savedSettings ? JSON.parse(savedSettings) : {};
      settingsObj.theme = theme;
      localStorage.setItem("user_app_settings", JSON.stringify(settingsObj));
    } catch (e) { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accentColor);
    localStorage.setItem("app_accent", accentColor);

    try {
      const savedSettings = localStorage.getItem("user_app_settings");
      let settingsObj = savedSettings ? JSON.parse(savedSettings) : {};
      settingsObj.accentColor = accentColor;
      localStorage.setItem("user_app_settings", JSON.stringify(settingsObj));
    } catch (e) { /* ignore */ }
  }, [accentColor]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
