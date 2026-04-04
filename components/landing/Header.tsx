"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Scissors, X } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"

const navLinks = [
  { label: "AI Hair", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-sm">
            <Scissors className="size-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">AI Hair</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            Sign In
          </Button>
          <Link
            href="/try-on"
            className={buttonVariants({
              size: "sm",
              className: "hidden sm:inline-flex",
            })}
          >
            Try AI Hair
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/80 bg-background/95 px-4 py-4 lg:hidden">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              Sign In
            </Button>
            <Link
              href="/try-on"
              className={buttonVariants({ size: "sm", className: "flex-1" })}
              onClick={() => setMobileOpen(false)}
            >
              Try AI Hair
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
