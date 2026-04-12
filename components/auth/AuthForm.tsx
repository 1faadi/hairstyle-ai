"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Loader2,
  Mail,
  Sparkles,
  User,
} from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { SITE_LOGO_PATH, SITE_SHORT_NAME } from "@/lib/site"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"
import { cn } from "@/lib/utils"

type AuthMode = "signin" | "signup"

const authFieldClassName = cn(
  "h-11 w-full rounded-lg border border-input bg-background pl-10 text-sm text-foreground outline-none",
  "placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
)

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextParam = searchParams.get("next")
  const redirectTo =
    nextParam && nextParam.startsWith("/") ? nextParam : "/"

  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin"
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = useMemo(() => getSupabaseBrowserClient(), [])

  function buildPostAuthRedirect(kind: "signin" | "signup"): string {
    const basePath = kind === "signup" ? "/" : redirectTo

    try {
      const url = new URL(basePath, window.location.origin)
      url.searchParams.set("welcome", kind)
      return `${url.pathname}${url.search}${url.hash}`
    } catch {
      return `${basePath}${basePath.includes("?") ? "&" : "?"}welcome=${kind}`
    }
  }

  useEffect(() => {
    if (!supabase) return

    let canceled = false
    supabase.auth.getSession().then(({ data }) => {
      if (canceled) return
      if (data.session?.user) {
        router.replace(buildPostAuthRedirect("signin"))
      }
    })

    return () => {
      canceled = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, router])

  function switchMode(next: AuthMode) {
    if (next === mode) return
    setMode(next)
    setError(null)
    setMessage(null)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setMessage(null)

    try {
      if (!supabase) {
        setError("Supabase is not configured. Check NEXT_PUBLIC_SUPABASE_* env vars.")
        return
      }

      if (mode === "signup") {
        if (!fullName.trim()) {
          setError("Please enter your name.")
          return
        }
        if (password !== confirmPassword) {
          setError("Password and confirm password do not match.")
          return
        }
      }

      if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (err) {
          setError(err.message)
          return
        }
        router.push(buildPostAuthRedirect("signin"))
        router.refresh()
        return
      }

      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: fullName.trim(),
            full_name: fullName.trim(),
          },
        },
      })
      if (err) {
        setError(err.message)
        return
      }
      if (data.session) {
        router.push(buildPostAuthRedirect("signup"))
        router.refresh()
        return
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (signInError) {
        setError(signInError.message)
        return
      }
      router.push(buildPostAuthRedirect("signup"))
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/50 via-background to-background p-4">
      <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-[900px]">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card shadow-xl lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="relative hidden min-h-[280px] flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-500 to-blue-800 p-10 text-white lg:flex">
            <div
              className="pointer-events-none absolute -left-14 -top-14 size-[200px] rounded-full bg-white/10 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-10 -right-10 size-60 rounded-full bg-sky-300/15 blur-3xl"
              aria-hidden
            />

            <div className="relative z-10 flex items-center gap-3">
              <Image
                src={SITE_LOGO_PATH}
                alt={SITE_SHORT_NAME}
                width={72}
                height={72}
                priority
                className="size-[72px] shrink-0 rounded-2xl border border-white/25 bg-white/10 object-cover shadow-md"
              />
              <span className="text-lg font-semibold tracking-tight">{SITE_SHORT_NAME}</span>
            </div>

            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md">
                <Sparkles size={12} />
                Powered by AI
              </div>
              <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight">
                Transform your
                <br />
                hairstyle in seconds.
              </h1>
              <p className="max-w-[240px] text-sm leading-relaxed text-white/75">
                Sign in to unlock unlimited generations without guest limits.
              </p>
            </div>

            <div className="relative z-10">
              <div className="mb-4 h-px bg-white/20" />
              <ul className="flex flex-col gap-2.5 text-sm text-white/80">
                {[
                  "Unlimited try-ons after sign in",
                  "Preset & custom hairstyle support",
                  "Fast generation & instant download",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0 text-white/60" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col bg-card p-8 sm:p-10">
            <div className="mb-6 flex justify-center lg:hidden">
              <Image
                src={SITE_LOGO_PATH}
                alt={SITE_SHORT_NAME}
                width={80}
                height={80}
                className="size-20 rounded-2xl border border-border bg-muted/30 object-cover shadow-sm"
              />
            </div>
            <div className="mb-7">
              <h2 className="mb-1 text-2xl font-bold tracking-tight text-foreground">
                {mode === "signin" ? "Welcome back" : "Create an account"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === "signin"
                  ? "Sign in to your account to continue."
                  : "Sign up to remove guest limits and keep generating."}
              </p>
            </div>

            <div className="mb-7 grid grid-cols-2 gap-1 rounded-[10px] border border-border bg-muted/60 p-1">
              {(["signin", "signup"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => switchMode(tab)}
                  className={cn(
                    "rounded-md py-2 text-sm font-medium transition-colors",
                    mode === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {mode === "signup" ? (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="auth-name" className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <input
                      id="auth-name"
                      type="text"
                      required={mode === "signup"}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className={cn(authFieldClassName, "pr-3.5")}
                    />
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="auth-email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={cn(authFieldClassName, "pr-3.5")}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="auth-password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  {mode === "signup" ? (
                    <span className="text-xs text-muted-foreground">Min. 6 characters</span>
                  ) : null}
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signin" ? "Your password" : "Create a password"}
                    className={cn(authFieldClassName, "pr-11")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded p-0.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {mode === "signup" ? (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="auth-confirm-password" className="text-sm font-medium text-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <input
                      id="auth-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      required={mode === "signup"}
                      minLength={6}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className={cn(authFieldClassName, "pr-11")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded p-0.5 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ) : null}

              {error ? (
                <div
                  className="flex gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
                  role="alert"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
                  <span>{error}</span>
                </div>
              ) : null}

              {message ? (
                <div className="flex gap-2.5 rounded-lg border border-emerald-600/25 bg-emerald-500/10 px-3.5 py-2.5 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-200">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  <span>{message}</span>
                </div>
              ) : null}

              <Button type="submit" className="h-11 w-full" disabled={isSubmitting || !supabase}>
                {isSubmitting ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    {mode === "signin" ? "Signing you in…" : "Creating your account…"}
                  </span>
                ) : mode === "signin" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-auto pt-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Back to{" "}
                <Link href="/try-on" className="font-medium text-primary underline-offset-4 hover:underline">
                  Try-On
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
