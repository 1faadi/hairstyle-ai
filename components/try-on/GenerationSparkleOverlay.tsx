"use client"

import type { ReactElement } from "react"
import { Sparkles } from "lucide-react"

/** Deterministic layout — stable across SSR/hydration */
const PARTICLES: ReadonlyArray<{
  left: string
  top: string
  delay: string
  scale: "sm" | "md"
}> = [
  { left: "6%", top: "8%", delay: "0s", scale: "sm" },
  { left: "18%", top: "22%", delay: "0.12s", scale: "md" },
  { left: "32%", top: "6%", delay: "0.24s", scale: "sm" },
  { left: "48%", top: "18%", delay: "0.08s", scale: "md" },
  { left: "62%", top: "9%", delay: "0.32s", scale: "sm" },
  { left: "78%", top: "24%", delay: "0.16s", scale: "md" },
  { left: "88%", top: "11%", delay: "0.4s", scale: "sm" },
  { left: "12%", top: "42%", delay: "0.2s", scale: "md" },
  { left: "28%", top: "55%", delay: "0.44s", scale: "sm" },
  { left: "44%", top: "38%", delay: "0.04s", scale: "md" },
  { left: "58%", top: "52%", delay: "0.28s", scale: "sm" },
  { left: "72%", top: "44%", delay: "0.36s", scale: "md" },
  { left: "92%", top: "48%", delay: "0.52s", scale: "sm" },
  { left: "8%", top: "68%", delay: "0.14s", scale: "md" },
  { left: "24%", top: "78%", delay: "0.48s", scale: "sm" },
  { left: "38%", top: "88%", delay: "0.06s", scale: "md" },
  { left: "52%", top: "72%", delay: "0.34s", scale: "sm" },
  { left: "66%", top: "82%", delay: "0.22s", scale: "md" },
  { left: "82%", top: "68%", delay: "0.56s", scale: "sm" },
  { left: "94%", top: "78%", delay: "0.1s", scale: "md" },
  { left: "50%", top: "58%", delay: "0.26s", scale: "sm" },
  { left: "16%", top: "58%", delay: "0.38s", scale: "md" },
]

export function GenerationSparkleOverlay(): ReactElement {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/25 via-primary/8 to-primary/20" />
      <div className="generation-sparkle-vignette absolute inset-0" />
      <Sparkles
        className="generation-sparkle-icon absolute -left-1 top-2 size-9 text-primary/50 sm:size-10"
        strokeWidth={1.25}
        aria-hidden
      />
      <Sparkles
        className="generation-sparkle-icon generation-sparkle-icon--delay absolute -right-1 bottom-4 size-8 text-primary/40 sm:size-9"
        strokeWidth={1.25}
        aria-hidden
      />
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={
            p.scale === "sm"
              ? "generation-sparkle-particle absolute size-1 rounded-full bg-primary shadow-[0_0_10px_2px_var(--color-primary)]"
              : "generation-sparkle-particle absolute size-1.5 rounded-full bg-primary shadow-[0_0_12px_3px_var(--color-primary)]"
          }
          style={{ left: p.left, top: p.top, animationDelay: p.delay }}
        />
      ))}
    </div>
  )
}
