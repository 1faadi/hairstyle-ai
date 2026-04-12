"use client"

import { HelpCircle } from "lucide-react"
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"

const faqs = [
  {
    question: "Is it hairstyling for both men and women?",
    answer:
      "Yes, we offer hundreds of hairstyles for men and women within our virtual hairstyle tool. There are short ones and long ones, pixie cuts to fade and curls to layers, classic styles to trendy.",
  },
  {
    question: "Is my photo data safe with your hairstyle AI?",
    answer:
      "Yes, we take privacy seriously. All photos are processed in a secure, isolated environment and automatically deleted after 24 hours from our servers. We do not save, share, or use your images for training.",
  },
  {
    question: "How accurate is the hairstyle AI actually?",
    answer:
      "Results are designed to look highly realistic and work well as a planning guide—but your natural texture, thickness, and styling can still change the final look. We recommend sharing the AI preview with your stylist.",
  },
  {
    question: "Can I test several hairstyles with a single photo?",
    answer:
      "Yes. Once you upload a photo, you can try many cuts, lengths, and colours on the same image. Guests share a limited number of free generations per IP address across AI Hairstyle and AI Nail Art; sign in for additional access.",
  },
  {
    question: "What is the cost of using the AI hairstyle?",
    answer:
      "You can start with free try-outs. Guests receive a limited number of generations per IP (shared with AI Nail Art). Creating an account unlocks more consistent access; optional paid credits may apply for heavy use—see the app for current details.",
  },
  {
    question: "What types of photos work best with the hairstyle AI?",
    answer:
      "Use a clear front-facing photo with good lighting. Avoid sunglasses, hats, or anything covering your hairline. The AI analyses your face shape and current hairstyle and works best with a clear view of both.",
  },
  {
    question: "Is the hairstyle AI mobile-friendly?",
    answer:
      "Yes. Our virtual hairstyle changer works on smartphones, tablets, and computers. Uploading photos and browsing styles is optimised for mobile devices.",
  },
  {
    question: "What if I don't like the hairstyle I got from AI?",
    answer:
      "You can mix and match styles until you find a look you love—there are many options to explore. If you need help with your account, reach us at support@hairstyleai.ai.",
  },
] as const

export function FAQ() {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-border/60 bg-secondary/25 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <HelpCircle className="size-3.5" aria-hidden />
              We&apos;re here to help
            </div>
            <LandingSectionHeader
              title="Frequently Asked Questions"
              description={
                <>
                  Common questions about the AI Hairstyle Changer. Can&apos;t find the answer? Email{" "}
                  <a href="mailto:support@hairstyleai.ai" className="font-medium text-primary underline-offset-4 hover:underline">
                    support@hairstyleai.ai
                  </a>
                  .
                </>
              }
            />
          </div>

          <Card className="border-border/80 p-2 shadow-lg ring-1 ring-border/60">
            <Accordion className="w-full gap-1">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${i}`}
                  className="rounded-xl border border-transparent px-3 data-open:border-border data-open:bg-secondary/40"
                >
                  <AccordionTrigger className="py-4 text-left text-sm font-medium text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </div>
    </section>
  )
}
