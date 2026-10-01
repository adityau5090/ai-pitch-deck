"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button variant="outline" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      {/* Pure CSS swap, so there is no hydration mismatch before the theme is known */}
      <Sun className="hidden h-[1.2rem] w-[1.2rem] dark:block" />
      <Moon className="h-[1.2rem] w-[1.2rem] dark:hidden" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
