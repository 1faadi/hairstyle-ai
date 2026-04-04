import { X, Check } from "lucide-react"

const pairs = [
  {
    problem: "Fear of Making the Wrong Haircut Choice",
    solution: "Risk-Free Virtual Hairstyle Try On",
  },
  {
    problem: "Uncertainty About New Hairstyle Options",
    solution: "Instant Hairstyle Preview Technology",
  },
  {
    problem: "Wondering How Different Hair Colors Look",
    solution: "Instant Hair Color Experimentation",
  },
  {
    problem: "Expensive Salon Consultation and Regret",
    solution: "Free AI Hairstyle Changer Preview",
  },
]

export function ProblemSolution() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">The Problem</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Changing your hairstyle shouldn&apos;t be a gamble
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            We solve every worry that stops you from getting the haircut you actually want.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Problems column header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="size-6 rounded-full bg-red-100 flex items-center justify-center">
              <X className="size-3 text-red-600" />
            </div>
            <span className="text-sm font-semibold text-foreground uppercase tracking-wide">Before AI Hair</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="size-6 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="size-3 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-foreground uppercase tracking-wide">With AI Hair</span>
          </div>

          {pairs.map(({ problem, solution }) => (
            <>
              {/* Problem card */}
              <div
                key={`problem-${problem}`}
                className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100/50 transition-colors"
              >
                <div className="size-7 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="size-3.5 text-red-600" />
                </div>
                <p className="text-sm font-medium text-foreground">{problem}</p>
              </div>

              {/* Solution card */}
              <div
                key={`solution-${solution}`}
                className="flex items-start gap-3 p-4 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100/50 transition-colors"
              >
                <div className="size-7 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="size-3.5 text-green-600" />
                </div>
                <p className="text-sm font-medium text-foreground">{solution}</p>
              </div>
            </>
          ))}
        </div>
      </div>
    </section>
  )
}
