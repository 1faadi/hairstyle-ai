import { Gem, PartyPopper } from "lucide-react"
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WEDDINGS_ALSO, WEDDINGS_INTRO, WEDDINGS_PREVIEW } from "@/lib/landing-content"

export function WeddingsSection() {
  return (
    <section id="events" className="scroll-mt-24 bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LandingSectionHeader
          eyebrow="Events"
          title="AI Hairstyle for Weddings and Events"
          description={WEDDINGS_INTRO}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden shadow-md ring-1 ring-border/70">
            <CardHeader className="bg-gradient-to-r from-primary/15 to-transparent">
              <div className="flex items-center gap-2 text-primary">
                <Gem className="size-5" aria-hidden />
                <CardTitle className="text-lg">Preview looks</CardTitle>
              </div>
              <CardDescription>Plan hair for the aisle, stage, or camera—before you book the stylist.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {WEDDINGS_PREVIEW.map((item) => (
                  <Badge key={item} variant="secondary" className="rounded-lg px-2.5 py-1">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-md ring-1 ring-border/70">
            <CardHeader className="bg-gradient-to-r from-accent/15 to-transparent">
              <div className="flex items-center gap-2 text-primary">
                <PartyPopper className="size-5" aria-hidden />
                <CardTitle className="text-lg">Perfect for</CardTitle>
              </div>
              <CardDescription>
                This helps brides avoid last-minute styling stress—and works for celebrations beyond the wedding day.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {WEDDINGS_ALSO.map((item) => (
                  <Badge key={item} variant="outline" className="rounded-lg px-2.5 py-1">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
