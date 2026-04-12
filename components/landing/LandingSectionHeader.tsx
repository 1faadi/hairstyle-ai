import type { JSX, ReactNode } from "react"
import { cn } from "@/lib/utils"

export type LandingSectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: ReactNode
  align?: "left" | "center"
}

export function LandingSectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: LandingSectionHeaderProps): JSX.Element {
  return (
    <div
      className={cn(
        "mb-12 min-w-0 max-w-full sm:max-w-3xl",
        align === "center" && "mx-auto text-center",
        align === "center" && description && "max-w-2xl"
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {description ? (
        <div className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{description}</div>
      ) : null}
    </div>
  )
}
