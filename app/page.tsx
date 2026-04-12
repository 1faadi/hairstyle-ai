import { ColourExperimentsSection } from "@/components/landing/ColourExperimentsSection"
import { ConclusionSection } from "@/components/landing/ConclusionSection"
import { FaceShapeSection } from "@/components/landing/FaceShapeSection"
import { FAQ } from "@/components/landing/FAQ"
import { Footer } from "@/components/landing/Footer"
import { Header } from "@/components/landing/Header"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { SalonVisitsSection } from "@/components/landing/SalonVisitsSection"
import { Testimonials } from "@/components/landing/Testimonials"
import { TopStylesSection } from "@/components/landing/TopStylesSection"
import { WeddingsSection } from "@/components/landing/WeddingsSection"
import { WhatIsSection } from "@/components/landing/WhatIsSection"
import { WhoCanUseSection } from "@/components/landing/WhoCanUseSection"
import { WhyLoveSection } from "@/components/landing/WhyLoveSection"

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-w-0 flex-1 overflow-x-clip">
        <Hero />
        <WhatIsSection />
        <WhyLoveSection />
        <HowItWorks />
        <TopStylesSection />
        <FaceShapeSection />
        <WeddingsSection />
        <ColourExperimentsSection />
        <SalonVisitsSection />
        <WhoCanUseSection />
        <Testimonials />
        <FAQ />
        <ConclusionSection />
      </main>
      <Footer />
    </>
  )
}
