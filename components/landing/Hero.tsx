"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section className="relative overflow-x-clip border-b border-border/70 bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,oklch(0.9_0.06_230),transparent_40%),radial-gradient(circle_at_85%_10%,oklch(0.88_0.08_200),transparent_45%)]" />
      <div className="mx-auto grid min-w-0 max-w-7xl gap-10 px-3 py-12 sm:gap-12 sm:px-4 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="relative z-10 flex min-w-0 flex-col gap-5 text-center sm:gap-6 lg:text-left">
          <Badge className="mx-auto w-fit gap-1.5 border border-primary/20 bg-primary/10 text-primary lg:mx-0">
            <Sparkles className="size-3.5" />
            Free AI hairstyle try-on
          </Badge>

          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Try 150+ Hairstyles with Our
            <span className="block bg-gradient-to-r from-primary via-cyan-500 to-accent bg-clip-text text-transparent">
              Free AI Hairstyle Changer
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-pretty text-base text-muted-foreground sm:text-lg lg:mx-0">
            You can virtually try on 150+ hairstyles for free with the AI Hairstyle Changer. It offers a variety of
            styles, from short buzz cuts to long wavy hair, bobs, bangs, and curly looks. In just a few seconds, you can
            get more than 100 hairstyles for women and 50+ for men.
          </p>

          <div className="flex w-full min-w-0 max-w-xl flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
            <Link
              href="/try-on"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 w-full shrink-0 gap-2 px-6 text-base sm:w-auto sm:min-w-[12rem]"
              )}
            >
              <Upload className="size-5 shrink-0" />
              Try hairstyle AI
            </Link>
            <Link
              href="/nail-art"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-12 w-full shrink-0 gap-2 px-6 text-base sm:w-auto sm:min-w-[12rem]"
              )}
            >
              <Sparkles className="size-5 shrink-0" />
              Try AI Nail Art
            </Link>
            <Link
              href="#what-is"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-12 w-full shrink-0 gap-2 px-6 text-base sm:w-auto sm:min-w-[12rem]"
              )}
            >
              Learn how it works
              <ArrowRight className="size-4 shrink-0" />
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            JPG, PNG, or WebP. Results are often ready in 10–30 seconds, depending on your connection.
          </p>
        </div>

        <div className="relative z-10 min-w-0">
          <div className="relative aspect-[4/3] w-full max-w-full overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_24px_80px_-40px_oklch(0.45_0.06_230)] sm:rounded-3xl">
            <Image
              src="/images/hero-preview.png"
              alt="Virtual hairstyle preview showing before and after transformation"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-border/70 bg-background/88 p-3 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold">Live preview</p>
                  <p className="text-xs text-muted-foreground">AI Hairstyle Changer</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
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
