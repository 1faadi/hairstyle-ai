"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Heart, Search, User } from "lucide-react"
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader"
import { fadeSlideVariants, springSnappy } from "@/components/landing/motion-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MEN_STYLES,
  MEN_STYLES_INTRO,
  TOP_STYLES_INTRO,
  WOMEN_STYLES,
  WOMEN_STYLES_INTRO,
} from "@/lib/landing-content"
import { cn } from "@/lib/utils"

type Gender = "women" | "men"

export function TopStylesSection() {
  const reduceMotion = useReducedMotion()
  const [gender, setGender] = useState<Gender>("women")
  const [query, setQuery] = useState("")
  const [highlighted, setHighlighted] = useState<string | null>(null)

  const pool = gender === "women" ? WOMEN_STYLES : MEN_STYLES
  const intro = gender === "women" ? WOMEN_STYLES_INTRO : MEN_STYLES_INTRO

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q === "") return [...pool]
    return pool.filter((s) => s.toLowerCase().includes(q))
  }, [pool, query])

  const transition = reduceMotion ? { duration: 0 } : springSnappy

  return (
    <section id="styles-2026" className="scroll-mt-24 overflow-x-clip bg-background py-16 sm:py-20 md:py-28">
      <div className="mx-auto min-w-0 max-w-7xl px-3 sm:px-4 lg:px-8">
        <LandingSectionHeader
          align="center"
          eyebrow="Style library"
          title="Top AI Hairstyles You Can Apply in 2026"
          description={TOP_STYLES_INTRO}
        />

        <Card className="min-w-0 max-w-full overflow-hidden border-border/80 shadow-xl ring-1 ring-primary/10">
          <CardHeader className="min-w-0 space-y-6 border-b border-border/60 bg-gradient-to-br from-primary/[0.08] via-background to-accent/[0.06] pb-6 sm:pb-8">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="inline-flex w-fit max-w-full shrink-0 rounded-xl border border-border/80 bg-background/80 p-1 shadow-inner">
                {(
                  [
                    { id: "women" as const, label: "Women", icon: Heart },
                    { id: "men" as const, label: "Men", icon: User },
                  ] as const
                ).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setGender(id)
                      setHighlighted(null)
                      setQuery("")
                    }}
                    className={cn(
                      "relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                      gender === id
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {gender === id ? (
                      <motion.span
                        layoutId="gender-pill"
                        className="absolute inset-0 rounded-lg bg-primary text-primary-foreground shadow-md"
                        transition={transition}
                        style={{ zIndex: 0 }}
                      />
                    ) : null}
                    <Icon className="relative z-10 size-4" aria-hidden />
                    <span className="relative z-10">{label}</span>
                  </button>
                ))}
              </div>

              <label className="relative flex min-w-0 w-full flex-1 items-center gap-2 sm:max-w-md">
                <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" aria-hidden />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter styles…"
                  className="h-11 w-full min-w-0 rounded-xl border border-border/80 bg-background pl-10 pr-4 text-sm shadow-sm outline-none ring-primary/30 transition-shadow placeholder:text-muted-foreground focus:border-primary/40 focus:ring-4"
                  autoComplete="off"
                />
              </label>
            </div>
            <div>
              <CardTitle className="text-lg">
                {gender === "women" ? "For Women" : "For Men"}
              </CardTitle>
              <CardDescription className="text-base">{intro}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="min-w-0 pt-6 sm:pt-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${gender}-${query}`}
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? {} : "visible"}
                exit={reduceMotion ? undefined : "hidden"}
                variants={fadeSlideVariants}
                transition={transition}
                className="min-h-[120px]"
              >
                {filtered.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No styles match &ldquo;{query}&rdquo;. Try another search or switch category.
                  </p>
                ) : (
                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial={reduceMotion ? false : "hidden"}
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: { staggerChildren: reduceMotion ? 0 : 0.02 },
                      },
                    }}
                  >
                    {filtered.map((s) => (
                      <motion.button
                        key={s}
                        type="button"
                        layout
                        variants={{
                          hidden: { opacity: 0, scale: 0.92 },
                          visible: { opacity: 1, scale: 1 },
                        }}
                        transition={transition}
                        onClick={() => setHighlighted((prev) => (prev === s ? null : s))}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-left text-xs font-medium transition-[transform,box-shadow]",
                          highlighted === s
                            ? "border-primary bg-primary/15 text-foreground shadow-md ring-2 ring-primary/30"
                            : "border-border/70 bg-secondary/50 text-muted-foreground hover:border-primary/30 hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        {s}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Click a style to highlight it — great for shortlisting before your try-on.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
