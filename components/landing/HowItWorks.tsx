"use client"

import Link from "next/link"
import { Download, Palette, Sparkles, Upload, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader"
import { springSoft } from "@/components/landing/motion-config"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HOW_IT_WORKS_INTRO, HOW_IT_WORKS_STEPS } from "@/lib/landing-content"
import { cn } from "@/lib/utils"

const STEP_ICONS: LucideIcon[] = [Upload, Users, Palette, Sparkles, Download]

export function HowItWorks() {
  const reduceMotion = useReducedMotion()
  const t = reduceMotion ? { duration: 0 } : springSoft

  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 overflow-hidden bg-background py-20 md:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.93_0.05_240),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <LandingSectionHeader
          align="center"
          eyebrow="How it works"
          title="How to Use Our AI Hairstyle Changer?"
          description={HOW_IT_WORKS_INTRO}
        />

        <div className="space-y-6">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? Sparkles
            return (
              <motion.div
                key={step.title}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ ...t, delay: reduceMotion ? 0 : index * 0.06 }}
              >
                <Card className="overflow-hidden border-border/80 shadow-md ring-1 ring-border/50 transition-shadow hover:shadow-lg">
                  <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:gap-8 md:p-8">
                    <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-center">
                      <motion.span
                        className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md"
                        whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: [0, -3, 3, 0] }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      >
                        <Icon className="size-7" aria-hidden />
                      </motion.span>
                    <span className="hidden text-xs font-bold uppercase tracking-wider text-muted-foreground sm:block">
                      {step.stepLabel}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary sm:hidden">{step.stepLabel}</p>
                    <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">{step.body}</p>
                    {step.bullets ? (
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {step.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm text-muted-foreground"
                          >
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                            {b}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {step.footnote ? (
                      <p className="rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                        {step.footnote}
                      </p>
                    ) : null}
                  </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/try-on"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 gap-2 bg-primary px-8 text-base text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
            )}
          >
            <Upload className="size-5" />
            Start AI Hairstyle Changer
          </Link>
        </div>
      </div>
    </section>
  )
}
