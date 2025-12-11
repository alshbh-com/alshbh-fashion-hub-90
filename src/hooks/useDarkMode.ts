import { useState, useEffect, useCallback } from "react";

const DARK_MODE_KEY = "alshbh_dark_mode";

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load dark mode preference on mount
  useEffect(() => {
    const savedMode = localStorage.getItem(DARK_MODE_KEY);
    if (savedMode !== null) {
      setIsDark(savedMode === "true");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
    }
    setIsLoaded(true);
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (isLoaded) {
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem(DARK_MODE_KEY, String(isDark));
    }
  }, [isDark, isLoaded]);

  // Toggle dark mode
  const toggle = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return {
    isDark,
    toggle,
    isLoaded,
  };
};
