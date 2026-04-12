"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { CheckCircle2, Sparkles } from "lucide-react"
import { springSoft } from "@/components/landing/motion-config"
import { Card, CardContent } from "@/components/ui/card"
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader"
import { WHAT_IS_BENEFITS, WHAT_IS_BODY, WHAT_IS_LEAD } from "@/lib/landing-content"
import { cn } from "@/lib/utils"

export function WhatIsSection() {
  const reduceMotion = useReducedMotion()
  const [pinned, setPinned] = useState<string | null>(null)
  const transition = reduceMotion ? { duration: 0 } : springSoft

  return (
    <section id="what-is" className="relative scroll-mt-24 overflow-x-clip bg-background py-16 sm:py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,oklch(0.92_0.06_240),transparent_45%),radial-gradient(circle_at_10%_60%,oklch(0.94_0.04_200),transparent_40%)]"
        aria-hidden
      />
      <div className="relative mx-auto min-w-0 max-w-7xl px-3 sm:px-4 lg:px-8">
        <LandingSectionHeader
          eyebrow="Overview"
          title="What Is an AI Hairstyle Tool?"
          description="Smart previews that map real salon cuts, colours, and textures onto your photo—so you can decide with confidence."
        />

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={transition}
            >
              <Card
                className={cn(
                  "border-border/80 bg-gradient-to-br from-card via-card to-secondary/40",
                  "shadow-[0_20px_60px_-40px_oklch(0.45_0.08_240)] ring-1 ring-border/60"
                )}
              >
                <CardContent className="space-y-5 p-6 md:p-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Sparkles className="size-3.5" aria-hidden />
                    How it works
                  </div>
                  <p className="text-lg leading-relaxed text-muted-foreground">{WHAT_IS_LEAD}</p>
                  <p className="leading-relaxed text-muted-foreground">{WHAT_IS_BODY}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <p className="mb-4 text-sm font-medium text-foreground">What you get — tap to focus</p>
            <motion.div
              className="grid gap-3 sm:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: reduceMotion ? 0 : 0.04 },
                },
              }}
            >
              {WHAT_IS_BENEFITS.map((item) => (
                <motion.button
                  key={item}
                  type="button"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={transition}
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  onClick={() => setPinned((p) => (p === item ? null : item))}
                  className={cn(
                    "flex gap-3 rounded-xl border bg-card/80 p-4 text-left shadow-sm ring-1 ring-foreground/[0.04] transition-[box-shadow,border-color]",
                    pinned === item
                      ? "border-primary/50 shadow-lg ring-2 ring-primary/25"
                      : "border-border/80 hover:border-primary/30 hover:shadow-md"
                  )}
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <span className="text-sm leading-snug text-foreground">{item}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
