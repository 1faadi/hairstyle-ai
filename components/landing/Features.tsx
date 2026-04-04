import Image from "next/image"
import { Scissors, Zap, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Scissors,
    title: "Choose from Hundreds of Styles",
    description:
      "Browse our extensive collection of 500+ professional hairstyles sourced from top salons worldwide. From classic cuts to trending styles.",
    image: "/images/feature-select.png",
  },
  {
    icon: Zap,
    title: "Lightning-Fast Results in Under 10 Seconds",
    description:
      "Our advanced AI processes your photo and delivers photorealistic hairstyle transformations in under 10 seconds.",
    image: "/images/stats-compare.png",
  },
  {
    icon: Heart,
    title: "Supports All Hair Types and Styles",
    description:
      "Whether you have straight, wavy, or curly hair — our AI works beautifully across all hair textures and skin tones.",
    image: null,
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Everything you need to find your perfect hairstyle
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Trained on over 500+ professional hairstyles from top salons worldwide.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="group hover:shadow-lg transition-shadow border border-border overflow-hidden">
                {feature.image && (
                  <div className="relative h-48 w-full bg-secondary overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                {!feature.image && (
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-2 p-4">
                      {["Short", "Long", "Color", "Trendy"].map((tag) => (
                        <div key={tag} className="bg-background/80 rounded-lg px-3 py-2 text-xs font-medium text-foreground text-center shadow-sm">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base text-foreground leading-tight">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
