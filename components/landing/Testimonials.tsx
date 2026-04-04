import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    name: "Sarah M.",
    role: "Fashion Blogger",
    quote:
      "I was nervous about cutting my long hair, but the hairstyle AI showed me exactly how I'd look with a bob. Went to the salon with full confidence!",
    avatar: "/images/avatar-sarah.jpg",
    rating: 5,
  },
  {
    name: "Mike T.",
    role: "College Student",
    quote:
      "As a guy who's always had the same haircut, I wanted to try something new. Found an awesome undercut that looks great on me — couldn't have done it without this tool.",
    avatar: "/images/avatar-mike.jpg",
    rating: 5,
  },
  {
    name: "Emma L.",
    role: "Working Professional",
    quote:
      "I needed a professional hairstyle for my new job but didn't want to risk a bad cut. The AI helped me find the perfect style that still looks polished.",
    avatar: "/images/avatar-emma.jpg",
    rating: 5,
  },
  {
    name: "James R.",
    role: "Creative Designer",
    quote:
      "The hairstyle AI is incredibly realistic. My friends couldn't believe how accurate the preview was — it's exactly what I look like now!",
    avatar: "/images/avatar-james.jpg",
    rating: 5,
  },
  {
    name: "Lisa K.",
    role: "Busy Mom",
    quote:
      "The AI hairstyle changer saved me so much time! Tried 10 different styles in minutes and found the perfect look without any salon guesswork.",
    avatar: "/images/avatar-lisa.jpg",
    rating: 5,
  },
  {
    name: "Carlos D.",
    role: "Fitness Trainer",
    quote:
      "I wanted a hairstyle that would work well for my active lifestyle. The AI previews helped me pick something practical that still looks sharp.",
    avatar: "/images/avatar-carlos.jpg",
    rating: 5,
  },
]

// Unsplash avatars as fallbacks
const unsplashAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Loved by thousands of users
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Real stories from people who found their perfect hairstyle.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={t.name} className="border border-border hover:shadow-md transition-shadow bg-background">
              <CardContent className="p-6 flex flex-col gap-4">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="size-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div className="relative size-10 rounded-full overflow-hidden bg-secondary shrink-0">
                    <Image
                      src={unsplashAvatars[i]}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
