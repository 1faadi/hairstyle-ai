import { Check, Scissors } from "lucide-react"
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SALON_BULLETS, SALON_INTRO } from "@/lib/landing-content"

export function SalonVisitsSection() {
  return (
    <section id="salon" className="scroll-mt-24 bg-background py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <LandingSectionHeader
          eyebrow="Salon ready"
          title="Why Are AI Hairstyle Free Tools Great for Salon Visits?"
        />

        <Card className="overflow-hidden shadow-lg ring-1 ring-border/70">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent">
            <div className="flex items-center gap-2 text-primary">
              <Scissors className="size-6" aria-hidden />
              <CardTitle className="text-xl">Walk in with a plan</CardTitle>
            </div>
            <CardDescription className="text-base">{SALON_INTRO}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-8 sm:grid-cols-2">
            {SALON_BULLETS.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 shadow-sm"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                  <Check className="size-4" aria-hidden />
                </span>
                <span className="text-sm font-medium leading-snug text-foreground">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
