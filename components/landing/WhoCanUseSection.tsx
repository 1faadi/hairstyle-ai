"use client"

import {
  Briefcase,
  GraduationCap,
  Heart,
  Home,
  Scissors,
  Sparkles,
  User,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader"
import { springSoft } from "@/components/landing/motion-config"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WHO_INTRO, WHO_LINES } from "@/lib/landing-content"

const ROLE_ICONS: Record<string, LucideIcon> = {
  Brides: Heart,
  Men: User,
  "Stylish students": GraduationCap,
  Professionals: Briefcase,
  "Busy moms": Home,
  Teens: Sparkles,
  Stylists: Scissors,
}

export function WhoCanUseSection() {
  const reduceMotion = useReducedMotion()
  const transition = reduceMotion ? { duration: 0 } : springSoft

  return (
    <section id="who" className="scroll-mt-24 bg-secondary/35 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LandingSectionHeader eyebrow="For everyone" title="Who Can Use Our AI Hairstyle Tool?" description={WHO_INTRO} />

        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.06 } },
          }}
        >
          {WHO_LINES.map(({ role, text }) => {
            const Icon = ROLE_ICONS[role] ?? Sparkles
            return (
              <motion.div
                key={role}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={transition}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -4, transition: { type: "spring", stiffness: 400, damping: 24 } }
                }
              >
                <Card className="group h-full cursor-default border-border/80 bg-card/80 shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-lg">
                  <CardHeader className="space-y-3">
                    <motion.div
                      className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                      whileHover={reduceMotion ? undefined : { rotate: [0, -6, 6, 0] }}
                      transition={{ duration: 0.45 }}
                    >
                      <Icon className="size-5" aria-hidden />
                    </motion.div>
                    <CardTitle className="text-base font-semibold">{role}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{text}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
