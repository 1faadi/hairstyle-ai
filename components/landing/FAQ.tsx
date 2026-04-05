"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How accurate is the hairstyle AI?",
    answer:
      "Our AI delivers highly realistic results by analyzing your facial structure, skin tone, and existing hair. It's trained on 500+ professional styles and produces photorealistic previews that closely reflect how the hairstyle will look on you.",
  },
  {
    question: "What types of photos work best?",
    answer:
      "A clear, well-lit front-facing photo works best. Avoid heavy filters, sunglasses, or hats. Natural lighting with your face fully visible gives the most accurate results.",
  },
  {
    question: "Is my photo data safe?",
    answer:
      "Absolutely. All photos are securely encrypted and processed in real-time. We do not store, share, or use your photos for any training purposes. Images are automatically deleted after processing.",
  },
  {
    question: "Can I try multiple hairstyles?",
    answer:
      "Yes. Guests can try up to 3 generations total per IP address. Sign in to continue with unlimited try-ons.",
  },
  {
    question: "Do you offer styles for men and women?",
    answer:
      "Yes, we have an extensive collection for both men and women — including short cuts, long styles, braids, color options, fades, undercuts, and much more.",
  },
  {
    question: "How much does it cost?",
    answer:
      "You can start free with 3 guest tries per IP. Create an account to remove the guest limit.",
  },
  {
    question: "Can I use it on mobile?",
    answer:
      "Yes! AI Hair is fully mobile-optimized and works in any modern browser on iOS and Android. No app download required.",
  },
  {
    question: "What if I don't like the results?",
    answer:
      "We recommend trying a few different angles and lighting conditions for best results. If you're not satisfied, our support team is happy to help — reach us at support@hairstyleai.ai.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Header */}
          <div className="sticky top-24">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Everything you need to know about AI Hair. Can&apos;t find the answer? Reach us at{" "}
              <a
                href="mailto:support@hairstyleai.ai"
                className="text-primary hover:underline"
              >
                support@hairstyleai.ai
              </a>
            </p>
          </div>

          {/* Right: Accordion */}
          <Accordion className="w-full space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={i}
                className="border border-border rounded-lg px-4 data-[panel-open]:bg-secondary/30"
              >
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
