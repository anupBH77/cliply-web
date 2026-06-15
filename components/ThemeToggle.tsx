"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../lib/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
      title="Toggle Theme"
    >
      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
