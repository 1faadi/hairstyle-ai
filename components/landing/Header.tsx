"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Menu, Scissors, X } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

const navLinks = [
  { label: "AI Hair", href: "#features" },
  { label: "AI Nail Art", href: "/nail-art" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])

  useEffect(() => {
    if (!supabase) return

    const applySession = (session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]) => {
      const user = session?.user
      setIsAuthenticated(Boolean(user))
      const name =
        (typeof user?.user_metadata?.name === "string" && user.user_metadata.name.trim()) ||
        (typeof user?.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()) ||
        (user?.email?.split("@")[0] ?? null)
      setUserName(name)
    }

    supabase.auth.getSession().then(({ data }) => applySession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => applySession(session))
    return () => data.subscription.unsubscribe()
  }, [supabase])

  async function handleSignOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    setMobileOpen(false)
  }

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
          {isAuthenticated && userName ? (
            <span className="hidden rounded-md border border-border bg-secondary px-3 py-1 text-sm font-medium text-foreground sm:inline-flex">
              {userName}
            </span>
          ) : (
            <Link
              href="/auth?next=/try-on"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "hidden sm:inline-flex",
              })}
            >
              Sign In
            </Link>
          )}
          <Link
            href="/try-on"
            className={buttonVariants({
              size: "sm",
              className: "hidden sm:inline-flex",
            })}
          >
            Try AI Hair
          </Link>
          <Link
            href="/nail-art"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "hidden sm:inline-flex",
            })}
          >
            Try AI Nail Art
          </Link>
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleSignOut}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "hidden sm:inline-flex",
              })}
            >
              Sign Out
            </button>
          )}
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
            {isAuthenticated && userName ? (
              <span className="flex flex-1 items-center justify-center rounded-md border border-border bg-secondary px-2 text-sm font-medium text-foreground">
                {userName}
              </span>
            ) : (
              <Link
                href="/auth?next=/try-on"
                className={buttonVariants({ variant: "outline", size: "sm", className: "flex-1" })}
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            )}
            <Link
              href="/try-on"
              className={buttonVariants({ size: "sm", className: "flex-1" })}
              onClick={() => setMobileOpen(false)}
            >
              Try AI Hair
            </Link>
          </div>
          <Link
            href="/nail-art"
            className={buttonVariants({ variant: "outline", size: "sm", className: "mt-2 w-full" })}
            onClick={() => setMobileOpen(false)}
          >
            Try AI Nail Art
          </Link>
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleSignOut}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "mt-2 w-full",
              })}
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  )
}
