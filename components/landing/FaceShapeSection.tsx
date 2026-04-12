import { ScanFace, Sparkles } from "lucide-react"
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FACE_EXAMPLES, FACE_SHAPE_INTRO, FACE_TYPES } from "@/lib/landing-content"

export function FaceShapeSection() {
  return (
    <section id="face-shape" className="scroll-mt-24 bg-secondary/35 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LandingSectionHeader
          eyebrow="Face match"
          title="How AI Helps You Find the Perfect Hairstyle for Your Face?"
          description={FACE_SHAPE_INTRO}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-sm ring-1 ring-border/70">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <ScanFace className="size-5" aria-hidden />
                <CardTitle className="text-lg">The AI checks</CardTitle>
              </div>
              <CardDescription>Your face shape and features guide which cuts will read best on camera.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {FACE_TYPES.map((f) => (
                  <Badge key={f} variant="outline" className="rounded-lg px-3 py-1 text-sm font-normal">
                    {f}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm ring-1 ring-border/70">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="size-5" aria-hidden />
                <CardTitle className="text-lg">Example pairings</CardTitle>
              </div>
              <CardDescription>Illustrative matches—your preview will be personalised to your photo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {FACE_EXAMPLES.map((line, i) => (
                <div
                  key={line}
                  className="flex gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{line}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
