"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Sparkles } from "lucide-react"

import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

type WelcomeKind = "signup" | "signin"

function toDisplayName(session: {
  user?: {
    email?: string | null
    user_metadata?: Record<string, unknown>
  }
} | null): string | null {
  const metadata = session?.user?.user_metadata
  return (
    (typeof metadata?.name === "string" && metadata.name.trim()) ||
    (typeof metadata?.full_name === "string" && metadata.full_name.trim()) ||
    (session?.user?.email?.split("@")[0] ?? null)
  )
}

export function AuthGreetingCard() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const welcome = searchParams.get("welcome")

  const [visible, setVisible] = useState(false)
  const [name, setName] = useState<string | null>(null)
  const [kind, setKind] = useState<WelcomeKind>("signin")
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (!supabase) return
    if (welcome !== "signup" && welcome !== "signin") return

    let canceled = false
    supabase.auth.getSession().then(({ data }) => {
      if (canceled) return
      if (!data.session?.user) return

      setName(toDisplayName(data.session))
      setKind(welcome)
      setIsExiting(false)
      setVisible(true)

      const nextParams = new URLSearchParams(searchParams.toString())
      nextParams.delete("welcome")
      const nextUrl = nextParams.toString()
        ? `${pathname}?${nextParams.toString()}`
        : pathname
      router.replace(nextUrl)
    })

    return () => {
      canceled = true
    }
  }, [supabase, welcome, searchParams, pathname, router])

  useEffect(() => {
    if (!visible) return

    const exitTimer = setTimeout(() => setIsExiting(true), 1700)
    const hideTimer = setTimeout(() => setVisible(false), 2000)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(hideTimer)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(2, 6, 23, 0.55)",
        backdropFilter: "blur(2px)",
        animation: isExiting
          ? "greet-overlay-out 220ms ease-in forwards"
          : "greet-overlay-in 180ms ease-out forwards",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.18)",
          background:
            "radial-gradient(120% 120% at 10% 0%, rgba(59,130,246,0.35) 0%, rgba(30,64,175,0.88) 40%, rgba(15,23,42,0.96) 100%)",
          color: "white",
          padding: "1.5rem",
          boxShadow: "0 30px 90px -28px rgba(0,0,0,0.65)",
          animation: isExiting
            ? "greet-card-out 220ms ease-in forwards"
            : "greet-card-in 260ms cubic-bezier(0.22,1,0.36,1) forwards",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
          <div
            style={{
              marginTop: "0.125rem",
              borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.2)",
              padding: "0.625rem",
              display: "flex",
            }}
          >
            {kind === "signup" ? <Sparkles size={20} /> : <CheckCircle2 size={20} />}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "1.125rem", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
              {kind === "signup"
                ? `Welcome${name ? `, ${name}` : ""}!`
                : `Welcome back${name ? `, ${name}` : ""}!`}
            </p>
            <p style={{ marginTop: "0.4rem", fontSize: "0.95rem", color: "rgba(219,234,254,0.96)", lineHeight: 1.5 }}>
              {kind === "signup"
                ? "Your account is ready. Start exploring AI Hair and AI Nail Art."
                : "Great to see you again. You now have full access to AI Hair and AI Nail Art."}
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes greet-overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes greet-overlay-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes greet-card-in {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes greet-card-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(8px) scale(0.97); }
        }
      `}</style>
    </div>
  )
}
