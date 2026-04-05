import type {
  GenerationTaskFeature,
  HairstyleTaskProvider,
} from "@/lib/hairstyle/constants"
import { HttpError } from "@/lib/hairstyle/errors"

const PROVIDER_SEPARATOR = ":"

function isFeature(value: string): value is GenerationTaskFeature {
  return value === "hair" || value === "nail"
}

function isProvider(value: string): value is HairstyleTaskProvider {
  return value === "ailab" || value === "vmodel"
}

export function toProviderTaskId(
  feature: GenerationTaskFeature,
  provider: HairstyleTaskProvider,
  taskId: string
): string {
  return `${feature}${PROVIDER_SEPARATOR}${provider}${PROVIDER_SEPARATOR}${taskId}`
}

export function parseProviderTaskId(scopedTaskId: string): {
  feature: GenerationTaskFeature
  provider: HairstyleTaskProvider
  taskId: string
} {
  const segments = scopedTaskId.split(PROVIDER_SEPARATOR)

  if (segments.length >= 3 && isFeature(segments[0]) && isProvider(segments[1])) {
    const taskId = segments.slice(2).join(PROVIDER_SEPARATOR).trim()
    if (!taskId) {
      throw new HttpError(400, "Invalid task id")
    }

    return { feature: segments[0], provider: segments[1], taskId }
  }

  if (segments.length >= 2 && isProvider(segments[0])) {
    const taskId = segments.slice(1).join(PROVIDER_SEPARATOR).trim()
    if (!taskId) {
      throw new HttpError(400, "Invalid task id")
    }

    return { feature: "hair", provider: segments[0], taskId }
  }

  // Backward compatibility for old, unscoped task ids (AILab hair flow).
  return { feature: "hair", provider: "ailab", taskId: scopedTaskId }
}
