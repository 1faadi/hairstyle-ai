import type { ReactElement } from "react"

import { cn } from "@/lib/utils"

export type LoadingIndicatorProps = {
  size?: "sm" | "md" | "lg"
  className?: string
  /** Announced to assistive tech; default "Loading". */
  label?: string
}

const SIZE_CLASSES = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
} as const

export function LoadingIndicator({
  size = "md",
  className,
  label = "Loading",
}: LoadingIndicatorProps): ReactElement {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("relative inline-flex shrink-0 items-center justify-center", SIZE_CLASSES[size], className)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-20%] rounded-full bg-primary/20 blur-md dark:bg-primary/25"
      />
      <span
        aria-hidden
        className="loading-indicator-track absolute inset-0 rounded-full border-2 border-primary/25 dark:border-primary/35"
      />
      <span
        aria-hidden
        className="loading-indicator-arc absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/55 shadow-[0_0_14px_-3px_var(--color-primary)] dark:border-r-primary/40"
      />
    </span>
  )
}

export function PageLoadingFallback(): ReactElement {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 py-10">
      <LoadingIndicator size="lg" label="Loading page" />
      <span className="sr-only">Loading</span>
    </div>
  )
}
