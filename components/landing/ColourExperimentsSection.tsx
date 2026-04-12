import { Palette } from "lucide-react"
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { COLOUR_INTRO, COLOUR_LIST, COLOUR_OUTRO } from "@/lib/landing-content"
import { cn } from "@/lib/utils"

const COLOUR_SWATCHES = [
  "bg-gradient-to-br from-amber-100 to-amber-200 ring-1 ring-amber-300/60",
  "bg-gradient-to-br from-stone-400 to-stone-600",
  "bg-gradient-to-br from-amber-700 to-amber-900",
  "bg-gradient-to-br from-rose-800 to-red-950",
  "bg-gradient-to-br from-slate-300 to-slate-400",
  "bg-gradient-to-br from-orange-600 to-orange-800",
  "bg-gradient-to-br from-blue-500 to-blue-700",
  "bg-gradient-to-br from-purple-400 to-violet-700",
  "bg-gradient-to-br from-rose-300 to-amber-200",
  "bg-gradient-to-br from-pink-300 to-fuchsia-400",
] as const

export function ColourExperimentsSection() {
  return (
    <section id="colour" className="scroll-mt-24 bg-secondary/35 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LandingSectionHeader
          eyebrow="Colour"
          title="AI Hairstyle for Hair Colour Experiments"
          description={COLOUR_INTRO}
        />

        <Card className="overflow-hidden shadow-lg ring-1 ring-border/70">
          <CardHeader className="border-b border-border/60 bg-gradient-to-r from-primary/12 via-accent/10 to-transparent">
            <div className="flex items-center gap-2 text-primary">
              <Palette className="size-6" aria-hidden />
              <CardTitle className="text-xl">Popular shades to preview</CardTitle>
            </div>
            <CardDescription>Test bold or natural colours on your photo before any dye hits your hair.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            <div className="flex flex-wrap gap-3">
              {COLOUR_LIST.map((c, i) => (
                <Badge
                  key={c}
                  variant="secondary"
                  className="h-auto gap-2 rounded-lg py-1.5 pl-2 pr-3 text-xs font-medium"
                >
                  <span
                    className={cn("size-3 shrink-0 rounded-full shadow-inner", COLOUR_SWATCHES[i])}
                    aria-hidden
                  />
                  {c}
                </Badge>
              ))}
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground">{COLOUR_OUTRO}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
