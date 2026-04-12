const POLL_BASE_MS = 2500
const POLL_MAX_MS = 8000
const POLL_BACKOFF_FACTOR = 1.2

/**
 * Delay before the next task status poll. Grows with attempt index (capped) to reduce
 * request volume while jobs are still running.
 */
export function getTaskPollDelayMs(attemptIndex: number): number {
  const scaled = POLL_BASE_MS * POLL_BACKOFF_FACTOR ** attemptIndex
  return Math.min(POLL_MAX_MS, Math.round(scaled))
}
