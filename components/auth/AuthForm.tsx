"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Scissors,
  Sparkles,
  User,
} from "lucide-react"

import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

type AuthMode = "signin" | "signup"

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("next") || "/try-on"

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
        router.push(redirectTo)
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
        router.push(redirectTo)
        router.refresh()
        return
      }
      setMessage("Check your email to confirm your account before signing in.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background:
          "linear-gradient(135deg, oklch(0.97 0.005 230) 0%, oklch(0.94 0.01 230) 100%)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            overflow: "hidden",
            borderRadius: "16px",
            border: "1px solid oklch(0.9 0.02 230)",
            backgroundColor: "oklch(1 0 0)",
            boxShadow: "0 20px 60px -10px rgba(0,0,0,0.12), 0 8px 20px -6px rgba(0,0,0,0.08)",
          }}
          className="lg-two-col"
        >
          <div
            className="auth-left-panel"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              padding: "2.5rem",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-60px",
                left: "-60px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-40px",
                right: "-40px",
                width: "240px",
                height: "240px",
                borderRadius: "50%",
                background: "rgba(147,197,253,0.12)",
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Scissors size={18} />
              </div>
              <span style={{ fontWeight: 600, fontSize: "1.1rem", letterSpacing: "-0.01em" }}>
                AI Hair
              </span>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "100px",
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  marginBottom: "16px",
                }}
              >
                <Sparkles size={12} />
                Powered by AI
              </div>
              <h1
                style={{
                  fontSize: "1.875rem",
                  fontWeight: 700,
                  lineHeight: 1.25,
                  marginBottom: "12px",
                  letterSpacing: "-0.02em",
                }}
              >
                Transform your
                <br />
                hairstyle in seconds.
              </h1>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.6,
                  maxWidth: "240px",
                }}
              >
                Sign in to unlock unlimited generations without guest limits.
              </p>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.2)", marginBottom: "16px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  "Unlimited try-ons after sign in",
                  "Preset & custom hairstyle support",
                  "Fast generation & instant download",
                ].map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    <CheckCircle2 size={16} style={{ flexShrink: 0, color: "rgba(255,255,255,0.6)" }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "oklch(1 0 0)",
            }}
          >
            <div style={{ marginBottom: "1.75rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "oklch(0.22 0.02 245)",
                  marginBottom: "4px",
                }}
              >
                {mode === "signin" ? "Welcome back" : "Create an account"}
              </h2>
              <p style={{ fontSize: "0.875rem", color: "oklch(0.5 0.02 245)" }}>
                {mode === "signin"
                  ? "Sign in to your account to continue."
                  : "Sign up to remove guest limits and keep generating."}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4px",
                padding: "4px",
                borderRadius: "10px",
                border: "1px solid oklch(0.9 0.02 230)",
                background: "oklch(0.965 0.01 230)",
                marginBottom: "1.75rem",
              }}
            >
              {(["signin", "signup"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => switchMode(tab)}
                  style={{
                    padding: "8px 0",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    borderRadius: "7px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    background: mode === tab ? "oklch(1 0 0)" : "transparent",
                    color: mode === tab ? "oklch(0.22 0.02 245)" : "oklch(0.5 0.02 245)",
                    boxShadow: mode === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {tab === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {mode === "signup" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label
                    htmlFor="auth-name"
                    style={{ fontSize: "0.875rem", fontWeight: 500, color: "oklch(0.22 0.02 245)" }}
                  >
                    Name
                  </label>
                  <div style={{ position: "relative" }}>
                    <User
                      size={16}
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "oklch(0.5 0.02 245)",
                        pointerEvents: "none",
                        flexShrink: 0,
                      }}
                    />
                    <input
                      id="auth-name"
                      type="text"
                      required={mode === "signup"}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      style={{
                        width: "100%",
                        height: "42px",
                        paddingLeft: "40px",
                        paddingRight: "14px",
                        paddingTop: "0",
                        paddingBottom: "0",
                        fontSize: "0.875rem",
                        border: "1px solid oklch(0.9 0.02 230)",
                        borderRadius: "8px",
                        outline: "none",
                        background: "transparent",
                        color: "oklch(0.22 0.02 245)",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  htmlFor="auth-email"
                  style={{ fontSize: "0.875rem", fontWeight: 500, color: "oklch(0.22 0.02 245)" }}
                >
                  Email
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={16}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "oklch(0.5 0.02 245)",
                      pointerEvents: "none",
                      flexShrink: 0,
                    }}
                  />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      width: "100%",
                      height: "42px",
                      paddingLeft: "40px",
                      paddingRight: "14px",
                      paddingTop: "0",
                      paddingBottom: "0",
                      fontSize: "0.875rem",
                      border: "1px solid oklch(0.9 0.02 230)",
                      borderRadius: "8px",
                      outline: "none",
                      background: "transparent",
                      color: "oklch(0.22 0.02 245)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label
                    htmlFor="auth-password"
                    style={{ fontSize: "0.875rem", fontWeight: 500, color: "oklch(0.22 0.02 245)" }}
                  >
                    Password
                  </label>
                  {mode === "signup" && (
                    <span style={{ fontSize: "0.75rem", color: "oklch(0.5 0.02 245)" }}>Min. 6 characters</span>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={16}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "oklch(0.5 0.02 245)",
                      pointerEvents: "none",
                      flexShrink: 0,
                    }}
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
                    style={{
                      width: "100%",
                      height: "42px",
                      paddingLeft: "40px",
                      paddingRight: "44px",
                      paddingTop: "0",
                      paddingBottom: "0",
                      fontSize: "0.875rem",
                      border: "1px solid oklch(0.9 0.02 230)",
                      borderRadius: "8px",
                      outline: "none",
                      background: "transparent",
                      color: "oklch(0.22 0.02 245)",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "oklch(0.5 0.02 245)",
                      padding: "2px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label
                    htmlFor="auth-confirm-password"
                    style={{ fontSize: "0.875rem", fontWeight: 500, color: "oklch(0.22 0.02 245)" }}
                  >
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock
                      size={16}
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "oklch(0.5 0.02 245)",
                        pointerEvents: "none",
                        flexShrink: 0,
                      }}
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
                      style={{
                        width: "100%",
                        height: "42px",
                        paddingLeft: "40px",
                        paddingRight: "44px",
                        paddingTop: "0",
                        paddingBottom: "0",
                        fontSize: "0.875rem",
                        border: "1px solid oklch(0.9 0.02 230)",
                        borderRadius: "8px",
                        outline: "none",
                        background: "transparent",
                        color: "oklch(0.22 0.02 245)",
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "oklch(0.5 0.02 245)",
                        padding: "2px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid oklch(0.577 0.245 27.325 / 0.3)",
                    background: "oklch(0.577 0.245 27.325 / 0.08)",
                    color: "oklch(0.5 0.2 27)",
                    fontSize: "0.875rem",
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #bbf7d0",
                    background: "#f0fdf4",
                    color: "#166534",
                    fontSize: "0.875rem",
                  }}
                >
                  <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: "1px", color: "#16a34a" }} />
                  <span>{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !supabase}
                style={{
                  width: "100%",
                  height: "42px",
                  borderRadius: "8px",
                  border: "none",
                  background: isSubmitting || !supabase ? "oklch(0.75 0.1 244)" : "oklch(0.61 0.18 244)",
                  color: "white",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: isSubmitting || !supabase ? "not-allowed" : "pointer",
                  transition: "background 0.15s ease, transform 0.1s ease",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && supabase) {
                    e.currentTarget.style.background = "oklch(0.54 0.18 244)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && supabase) {
                    e.currentTarget.style.background = "oklch(0.61 0.18 244)"
                  }
                }}
              >
                {isSubmitting
                  ? mode === "signin"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode === "signin"
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>

            <div style={{ marginTop: "auto", paddingTop: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                <div style={{ flex: 1, height: "1px", background: "oklch(0.9 0.02 230)" }} />
                <span style={{ fontSize: "0.75rem", color: "oklch(0.5 0.02 245)" }}>or</span>
                <div style={{ flex: 1, height: "1px", background: "oklch(0.9 0.02 230)" }} />
              </div>
              <p style={{ textAlign: "center", fontSize: "0.875rem", color: "oklch(0.5 0.02 245)" }}>
                Back to{" "}
                <Link
                  href="/try-on"
                  style={{ color: "oklch(0.61 0.18 244)", fontWeight: 500, textDecoration: "none" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = "underline"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = "none"
                  }}
                >
                  Try-On
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg-two-col {
            grid-template-columns: 420px 1fr !important;
          }
          .auth-left-panel {
            display: flex !important;
          }
        }
        @media (max-width: 1023px) {
          .auth-left-panel {
            display: none !important;
          }
        }
        #auth-name::placeholder,
        #auth-email::placeholder,
        #auth-password::placeholder,
        #auth-confirm-password::placeholder {
          color: oklch(0.65 0.015 245);
        }
        #auth-name:focus,
        #auth-email:focus,
        #auth-password:focus,
        #auth-confirm-password:focus {
          border-color: oklch(0.61 0.18 244);
          box-shadow: 0 0 0 3px oklch(0.61 0.18 244 / 0.15);
        }
      `}</style>
    </div>
  )
}
