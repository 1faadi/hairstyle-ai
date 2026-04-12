"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"
import { SITE_LOGO_PATH, SITE_SHORT_NAME } from "@/lib/site"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "What it is", href: "#what-is" },
  { label: "AI Nail Art", href: "/nail-art" },
  { label: "How it works", href: "#how-it-works" },
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
    <header className="sticky top-0 z-50 w-full min-w-0 border-b border-border/80 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 max-w-[min(100%,18rem)] flex-1 items-center gap-2 sm:max-w-none sm:flex-none lg:max-w-[min(100%,20rem)]"
        >
          <span className="relative size-9 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
            <Image
              src={SITE_LOGO_PATH}
              alt={SITE_SHORT_NAME}
              width={36}
              height={36}
              className="object-cover"
              priority
            />
          </span>
          <span className="truncate text-sm font-semibold leading-tight tracking-tight sm:text-base">
            {SITE_SHORT_NAME}
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 justify-center lg:flex">
          <div className="flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground xl:px-3"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Desktop / large tablet only: inline actions stay off small screens to avoid overflow */}
        <div className="hidden min-w-0 shrink-0 items-center gap-1.5 lg:flex xl:gap-2">
          <ThemeToggle />
          {isAuthenticated && userName ? (
            <span className="max-w-[8rem] truncate rounded-md border border-border bg-secondary px-2 py-1 text-xs font-medium text-foreground xl:max-w-[12rem] xl:px-3 xl:text-sm">
              {userName}
            </span>
          ) : (
            <Link
              href="/auth?next=/try-on"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "shrink-0",
              })}
            >
              Sign In
            </Link>
          )}
          <Link href="/try-on" className={buttonVariants({ size: "sm", className: "shrink-0 whitespace-nowrap" })}>
            Try hairstyle AI
          </Link>
          <Link
            href="/nail-art"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "shrink-0 whitespace-nowrap",
            })}
          >
            Try AI Nail Art
          </Link>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleSignOut}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "shrink-0",
              })}
            >
              Sign Out
            </button>
          ) : null}
        </div>

        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "shrink-0 lg:hidden",
            "size-10 touch-manipulation"
          )}
          onClick={() => setMobileOpen((value) => !value)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-nav-panel"
          className="border-t border-border/80 bg-background/98 px-4 py-4 shadow-lg lg:hidden"
        >
          <nav className="space-y-1" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:bg-secondary/80"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-2">
            <div className="flex justify-center pb-1">
              <ThemeToggle />
            </div>
            {isAuthenticated && userName ? (
              <span className="rounded-lg border border-border bg-secondary px-3 py-2 text-center text-sm font-medium text-foreground">
                {userName}
              </span>
            ) : (
              <Link
                href="/auth?next=/try-on"
                className={buttonVariants({ variant: "outline", size: "default", className: "w-full justify-center" })}
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            )}
            <Link
              href="/try-on"
              className={buttonVariants({ size: "default", className: "w-full justify-center" })}
              onClick={() => setMobileOpen(false)}
            >
              Try hairstyle AI
            </Link>
            <Link
              href="/nail-art"
              className={buttonVariants({
                variant: "outline",
                size: "default",
                className: "w-full justify-center",
              })}
              onClick={() => setMobileOpen(false)}
            >
              Try AI Nail Art
            </Link>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleSignOut}
                className={buttonVariants({
                  variant: "outline",
                  size: "default",
                  className: "w-full justify-center",
                })}
              >
                Sign Out
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
