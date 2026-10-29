"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label={`Switch to ${next} mode`}>
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
