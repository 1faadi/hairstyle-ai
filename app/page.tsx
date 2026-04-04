import { Header } from "@/components/landing/Header"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { StatsHighlight } from "@/components/landing/StatsHighlight"
import { ProblemSolution } from "@/components/landing/ProblemSolution"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Testimonials } from "@/components/landing/Testimonials"
import { FAQ } from "@/components/landing/FAQ"
import { Footer } from "@/components/landing/Footer"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <StatsHighlight />
        <ProblemSolution />
        <HowItWorks />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
