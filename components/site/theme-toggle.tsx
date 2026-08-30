"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/use-theme";

/** Sun/moon icon button — icon shown is the mode a click switches *to*, matching the Mail/User icons it sits beside in SiteNav. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-bone/75 transition-colors duration-500 hover:text-bone ${className}`}
    >
      {isDark ? (
        <Sun className="h-[1.05rem] w-[1.05rem]" aria-hidden />
      ) : (
        <Moon className="h-[1.05rem] w-[1.05rem]" aria-hidden />
      )}
    </button>
  );
}
