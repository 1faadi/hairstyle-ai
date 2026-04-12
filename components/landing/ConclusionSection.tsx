"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CONCLUSION_TEXT } from "@/lib/landing-content"
import { cn } from "@/lib/utils"

export function ConclusionSection() {
  return (
    <section id="conclusion" className="scroll-mt-24 border-t border-border bg-gradient-to-b from-background to-secondary/30 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-primary/20 bg-card/90 shadow-[0_24px_80px_-48px_oklch(0.45_0.12_250)] ring-2 ring-primary/10">
          <CardContent className="space-y-8 p-8 text-center md:p-10">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
              <Sparkles className="size-7" aria-hidden />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Conclusion</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">{CONCLUSION_TEXT}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/try-on" className={cn(buttonVariants({ size: "lg" }), "h-12 min-w-[10rem] px-8 shadow-md")}>
                Start free try-on
              </Link>
              <Link
                href="#faq"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 min-w-[10rem] border-border/80 bg-background/80 px-8 backdrop-blur")}
              >
                Read FAQ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
