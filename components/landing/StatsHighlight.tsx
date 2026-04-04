import Image from "next/image"
import { Scissors, Zap, Shield, Users } from "lucide-react"

const stats = [
  {
    icon: Scissors,
    value: "500+",
    label: "Professional Hairstyles",
    description: "Trained on styles from top salons worldwide",
  },
  {
    icon: Zap,
    value: "<10s",
    label: "Processing Time",
    description: "Lightning-fast AI transformations",
  },
  {
    icon: Users,
    value: "50K+",
    label: "Happy Users",
    description: "Trusted by people worldwide",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Privacy & Security",
    description: "No images stored or shared, ever",
  },
]

export function StatsHighlight() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl border border-border">
            <Image
              src="/images/stats-compare.png"
              alt="Before and after hairstyle AI comparison"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur rounded-lg px-4 py-2 shadow-lg">
              <p className="text-xs font-semibold text-foreground">Real AI Results</p>
              <p className="text-xs text-muted-foreground">Photorealistic transformations</p>
            </div>
          </div>

          {/* Right: stats grid */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Why Choose Us</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                The most accurate hairstyle AI available
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our AI is trained on thousands of real salon photos to deliver the most realistic previews possible.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="group p-4 rounded-xl border border-border bg-secondary/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
                  >
                    <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{stat.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
