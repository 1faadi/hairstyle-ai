"use client"

import { useEffect, useState, type ReactElement } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle(): ReactElement {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="relative shrink-0 touch-manipulation"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="relative block size-5">
        <Sun
          className={cn(
            "absolute inset-0 size-5 transition-all",
            isDark ? "scale-0 opacity-0" : "scale-100 opacity-100"
          )}
          aria-hidden
        />
        <Moon
          className={cn(
            "absolute inset-0 size-5 transition-all",
            isDark ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
          aria-hidden
        />
      </span>
    </Button>
  )
}
