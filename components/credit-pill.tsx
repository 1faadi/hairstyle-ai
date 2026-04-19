import { type ReactElement } from "react"
import { CircleDollarSign } from "lucide-react"

import type { QuotaSnapshot } from "@/lib/hairstyle/types"

export type CreditPillProps = {
  quota: QuotaSnapshot | null
}

export function CreditPill({ quota }: CreditPillProps): ReactElement {
  const displayText =
    quota === null
      ? "--/3"
      : quota.mode === "user"
        ? "∞"
        : `${quota.remaining ?? "--"}/3`

  const label =
    quota === null
      ? "Loading shared guest credits for AI Hair and AI Nail Art."
      : quota.mode === "user"
        ? "Unlimited credits when signed in."
        : typeof quota.remaining === "number"
          ? `Shared guest credits for AI Hair and AI Nail Art, ${quota.remaining} of 3 remaining.`
          : "Shared guest credits for AI Hair and AI Nail Art."

  return (
    <div
      role="status"
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-100/90 px-3 py-1.5 dark:border-blue-800/60 dark:bg-blue-950/50"
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-sky-500"
        aria-hidden
      >
        <CircleDollarSign className="size-4" strokeWidth={2.25} />
      </span>
      <span className="text-base font-semibold tabular-nums text-blue-900 dark:text-blue-100">
        {displayText}
      </span>
    </div>
  )
}
