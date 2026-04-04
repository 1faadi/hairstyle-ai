"use client"

import Link from "next/link"
import { Upload, Grid, Wand2, Download } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your Photo",
    description:
      "Take or upload a clear front-facing photo. Supports JPEG, PNG, and WebP up to 10MB.",
  },
  {
    step: "02",
    icon: Grid,
    title: "Browse and Select Hairstyles",
    description:
      "Explore 500+ styles by category — short, long, braids, color, and more. Pick one or try multiple.",
  },
  {
    step: "03",
    icon: Wand2,
    title: "Watch the AI Magic Happen",
    description:
      "Our AI analyzes your face shape and applies the hairstyle with photorealistic accuracy in seconds.",
  },
  {
    step: "04",
    icon: Download,
    title: "Save and Share Your Results",
    description:
      "Download your new look in high quality and share it with friends or your stylist.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Your new look in 4 simple steps
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            No app download needed. Works entirely in your browser.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.step} className="relative flex flex-col items-center text-center gap-4">
                {/* Connector line (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+2rem)] right-[-calc(50%-2rem)] h-px bg-border" />
                )}

                {/* Step circle */}
                <div className="relative size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="size-6 text-primary" />
                  <div className="absolute -top-2 -right-2 size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground text-base mb-1.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-14">
          <Link
            href="/try-on"
            className={buttonVariants({
              size: "lg",
              className: "bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 px-8 text-base",
            })}
          >
            <Upload className="size-5" />
            Start Your Hairstyle Try On
          </Link>
        </div>
      </div>
    </section>
  )
}
