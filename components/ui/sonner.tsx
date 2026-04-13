"use client"

import type { ReactElement } from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

export function Toaster(): ReactElement {
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      position="top-center"
      richColors
      closeButton
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        classNames: {
          toast:
            "group-[.toaster]:border-border group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:shadow-lg",
          title: "group-[.toast]:font-medium",
          description: "group-[.toast]:text-muted-foreground",
        },
      }}
    />
  )
}
