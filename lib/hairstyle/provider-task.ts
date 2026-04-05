import type { HairstyleTaskProvider } from "@/lib/hairstyle/constants"
import { HttpError } from "@/lib/hairstyle/errors"

const PROVIDER_SEPARATOR = ":"

export function toProviderTaskId(
  provider: HairstyleTaskProvider,
  taskId: string
): string {
  return `${provider}${PROVIDER_SEPARATOR}${taskId}`
}

export function parseProviderTaskId(scopedTaskId: string): {
  provider: HairstyleTaskProvider
  taskId: string
} {
  const [provider, ...taskIdParts] = scopedTaskId.split(PROVIDER_SEPARATOR)
  const taskId = taskIdParts.join(PROVIDER_SEPARATOR).trim()

  if (provider === "ailab" || provider === "vmodel") {
    if (!taskId) {
      throw new HttpError(400, "Invalid task id")
    }

    return { provider, taskId }
  }

  // Backward compatibility for old, unscoped task ids (AILab-only flow).
  return { provider: "ailab", taskId: scopedTaskId }
}
