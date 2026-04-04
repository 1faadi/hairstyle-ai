"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,oklch(0.9_0.06_230),transparent_40%),radial-gradient(circle_at_85%_10%,oklch(0.88_0.08_200),transparent_45%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="relative z-10 flex flex-col gap-6 text-center lg:text-left">
          <Badge className="mx-auto w-fit gap-1.5 border border-primary/20 bg-primary/10 text-primary lg:mx-0">
            <Sparkles className="size-3.5" />
            AI Hair Try-On
          </Badge>

          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Find Your Next Cut With
            <span className="block bg-gradient-to-r from-primary via-cyan-500 to-accent bg-clip-text text-transparent">
              AI Hair
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-pretty text-base text-muted-foreground sm:text-lg lg:mx-0">
            Upload one portrait, pick a style, and preview your new look in seconds.
            Clean, realistic, and made for decision-making before the salon.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <Link
              href="/try-on"
              className={cn(buttonVariants({ size: "lg" }), "h-12 gap-2 px-6 text-base")}
            >
              <Upload className="size-5" />
              Try AI Hair
            </Link>
            <Link
              href="#features"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-12 gap-2 px-6 text-base"
              )}
            >
              Explore Features
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            JPG, PNG, WEBP up to 10MB. Results usually in under 10 seconds.
          </p>
        </div>

        <div className="relative z-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/80 bg-card shadow-[0_24px_80px_-40px_oklch(0.45_0.06_230)]">
            <Image
              src="/images/hero-preview.png"
              alt="AI Hair preview showing before and after transformation"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-border/70 bg-background/88 p-3 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold">Live Generation</p>
                  <p className="text-xs text-muted-foreground">AI Hair model running now</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
