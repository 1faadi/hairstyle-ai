"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion"
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader"
import { fadeSlideVariants, springSnappy, springSoft } from "@/components/landing/motion-config"
import { WHY_LOVE_BLOCKS, WHY_LOVE_INTRO } from "@/lib/landing-content"
import { cn } from "@/lib/utils"

export function WhyLoveSection() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const block = useMemo(() => WHY_LOVE_BLOCKS[active], [active])

  const transition = reduceMotion ? { duration: 0 } : springSnappy
  const panelTransition = reduceMotion ? { duration: 0 } : springSoft

  return (
    <section
      id="why-love"
      className="scroll-mt-24 overflow-x-clip border-y border-border/60 bg-secondary/35 py-16 sm:py-20 md:py-28"
    >
      <div className="mx-auto min-w-0 max-w-7xl px-3 sm:px-4 lg:px-8">
        <LandingSectionHeader
          eyebrow="Benefits"
          title="What Makes People Love AI Hairstyle Tools?"
          description={WHY_LOVE_INTRO}
        />

        <div className="mt-8 min-w-0 grid gap-6 sm:mt-10 lg:grid-cols-12 lg:gap-10">
          {/* Mobile / tablet: native select — no horizontal overflow */}
          <div className="min-w-0 lg:hidden">
            <label htmlFor="why-love-pick" className="mb-2 block text-xs font-medium text-muted-foreground">
              Choose a benefit
            </label>
            <select
              id="why-love-pick"
              value={active}
              onChange={(e) => setActive(Number(e.target.value))}
              className="h-12 w-full min-w-0 max-w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm outline-none ring-primary/20 focus:border-primary/40 focus:ring-4"
            >
              {WHY_LOVE_BLOCKS.map((b, i) => (
                <option key={b.title} value={i}>
                  {i + 1}. {b.title}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop: pick list */}
          <div className="hidden min-w-0 lg:col-span-5 lg:block">
            <LayoutGroup id="why-love-nav">
              <nav className="flex flex-col gap-1.5" aria-label="Benefit categories">
                {WHY_LOVE_BLOCKS.map((b, i) => (
                  <button
                    key={b.title}
                    type="button"
                    onClick={() => setActive(i)}
                    className={cn(
                      "relative rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                      i === active
                        ? "border-primary/50 bg-card text-foreground shadow-md"
                        : "border-transparent bg-transparent text-muted-foreground hover:bg-card/60 hover:text-foreground"
                    )}
                  >
                    {i === active ? (
                      <motion.span
                        layoutId="why-love-active"
                        className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-primary/15 to-transparent"
                        transition={transition}
                      />
                    ) : null}
                    <span className="mr-2 inline-flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    {b.title}
                  </button>
                ))}
              </nav>
            </LayoutGroup>
          </div>

          {/* Detail panel */}
          <div className="min-w-0 lg:col-span-7">
            <div className="relative min-h-[240px] w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card/90 p-4 shadow-xl ring-1 ring-primary/10 sm:min-h-[280px] sm:p-6 md:min-h-[320px] md:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={block.title}
                  initial={reduceMotion ? false : "hidden"}
                  animate={reduceMotion ? {} : "visible"}
                  exit={reduceMotion ? {} : "hidden"}
                  variants={fadeSlideVariants}
                  transition={panelTransition}
                  className="space-y-4 sm:space-y-5"
                >
                  <div className="flex min-w-0 items-start gap-3 lg:hidden">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                      {active + 1}
                    </span>
                    <h3 className="min-w-0 break-words text-lg font-semibold leading-snug text-foreground">
                      {block.title}
                    </h3>
                  </div>
                  <h3 className="hidden break-words text-xl font-semibold text-foreground lg:block">{block.title}</h3>
                  <p className="break-words leading-relaxed text-muted-foreground">{block.body}</p>
                  {block.bullets ? (
                    <motion.ul
                      className="grid min-w-0 gap-2 sm:grid-cols-2"
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: reduceMotion ? 0 : 0.08, ...panelTransition }}
                    >
                      {block.bullets.map((item, j) => (
                        <motion.li
                          key={item}
                          initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.04 * j, ...springSoft }}
                          className="min-w-0 break-words rounded-lg border border-border/50 bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground"
                        >
                          <span className="mr-2 inline-block size-1.5 shrink-0 rounded-full bg-primary align-middle" aria-hidden />
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground lg:text-left">
              On mobile, pick a benefit from the dropdown; on large screens, use the list beside this card.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
