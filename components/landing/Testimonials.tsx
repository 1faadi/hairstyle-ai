"use client"

import { useCallback, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react"
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader"
import { fadeSlideVariants, springSnappy } from "@/components/landing/motion-config"
import { Card, CardContent } from "@/components/ui/card"
import { LANDING_TESTIMONIALS, USER_FEEDBACK_INTRO } from "@/lib/landing-content"
import { cn } from "@/lib/utils"

function initialsFromDisplayName(name: string): string {
  const parts = name
    .replace(/\./g, "")
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0)
  if (parts.length === 0) {
    return "?"
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  const first = parts[0][0]
  const last = parts[parts.length - 1][0]
  return `${first}${last}`.toUpperCase()
}

export function Testimonials() {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const count = LANDING_TESTIMONIALS.length

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % count)
  }, [count])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count)
  }, [count])

  const transition = reduceMotion ? { duration: 0 } : springSnappy
  const t = LANDING_TESTIMONIALS[index]

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 bg-secondary/20 py-20 md:py-28"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev()
        if (e.key === "ArrowRight") next()
      }}
      tabIndex={0}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <LandingSectionHeader
          align="center"
          eyebrow="User feedback"
          title="What is User Feedback About Our Tool?"
          description={USER_FEEDBACK_INTRO}
        />

        <div className="relative mt-10">
          <div
            className="touch-pan-y"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return
              const dx = e.changedTouches[0].clientX - touchStartX.current
              touchStartX.current = null
              if (dx > 50) prev()
              if (dx < -50) next()
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={t.name}
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? {} : "visible"}
                exit={reduceMotion ? undefined : "hidden"}
                variants={fadeSlideVariants}
                transition={transition}
              >
                <Card className="relative overflow-hidden border-border/80 bg-gradient-to-b from-card to-secondary/30 shadow-2xl ring-1 ring-primary/15">
                  <div className="pointer-events-none absolute right-6 top-6 text-primary/15">
                    <Quote className="size-24" aria-hidden />
                  </div>
                  <CardContent className="relative flex flex-col gap-6 p-8 md:p-10">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={`${t.name}-star-${j}`} className="size-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <blockquote className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <footer className="flex items-center gap-4 border-t border-border/60 pt-6">
                      <div
                        className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/25 text-base font-bold text-primary"
                        aria-hidden
                      >
                        {initialsFromDisplayName(t.name)}
                      </div>
                      <cite className="not-italic">
                        <span className="block text-base font-semibold text-foreground">{t.name}</span>
                      </cite>
                    </footer>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                className="inline-flex size-11 items-center justify-center rounded-full border border-border/80 bg-card text-foreground shadow-sm transition-[transform,box-shadow] hover:scale-105 hover:shadow-md active:scale-95"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={next}
                className="inline-flex size-11 items-center justify-center rounded-full border border-border/80 bg-card text-foreground shadow-sm transition-[transform,box-shadow] hover:scale-105 hover:shadow-md active:scale-95"
                aria-label="Next testimonial"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
            <div className="flex gap-2" role="tablist" aria-label="Choose testimonial">
              {LANDING_TESTIMONIALS.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2.5 rounded-full transition-all",
                    i === index ? "w-8 bg-primary" : "w-2.5 bg-muted-foreground/35 hover:bg-muted-foreground/55"
                  )}
                />
              ))}
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Swipe on mobile, use arrows or dots — or press ← → when this section is focused.
          </p>
        </div>
      </div>
    </section>
  )
}
