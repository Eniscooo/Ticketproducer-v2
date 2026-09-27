"use client";

import { Moon, Sun } from "lucide-react";
import { IconSwap } from "@/components/ui/primitives";
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
      className={`pressable flex h-9 w-9 items-center justify-center rounded-full text-bone/75 hover:bg-bone/8 hover:text-bone ${className}`}
    >
      <IconSwap
        active={isDark}
        className="h-[1.05rem] w-[1.05rem]"
        off={<Moon className="h-[1.05rem] w-[1.05rem]" />}
        on={<Sun className="h-[1.05rem] w-[1.05rem]" />}
      />
    </button>
  );
}
