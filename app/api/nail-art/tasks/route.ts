import { createAILabNailArtTask } from "@/lib/ailab"
import { GUEST_CREDIT_LIMIT } from "@/lib/hairstyle/constants"
import { HttpError } from "@/lib/hairstyle/errors"
import { createErrorResponse } from "@/lib/hairstyle/http"
import { toProviderTaskId } from "@/lib/hairstyle/provider-task"
import {
  createGenerationJobRecord,
  resolveRequestQuotaContext,
} from "@/lib/hairstyle/quota"
import type { QuotaSnapshot } from "@/lib/hairstyle/types"
import {
  getOptionalString,
  validateNailArtImageFile,
} from "@/lib/hairstyle/validation"

export const runtime = "nodejs"

function getQuotaAfterTaskCreation(input: {
  quota: QuotaSnapshot
  usedSuccessCount: number | null
  pendingCount: number | null
}): QuotaSnapshot {
  if (input.quota.mode === "user") {
    return input.quota
  }

  const used = input.usedSuccessCount ?? 0
  const pending = (input.pendingCount ?? 0) + 1
  const consumedOrReserved = used + pending

  return {
    mode: "guest",
    pending,
    remaining: Math.max(0, GUEST_CREDIT_LIMIT - consumedOrReserved),
    requiresAuth: consumedOrReserved >= GUEST_CREDIT_LIMIT,
  }
}

export async function POST(request: Request) {
  try {
    const quotaContext = await resolveRequestQuotaContext(request)

    if (quotaContext.quota.mode === "guest" && quotaContext.quota.requiresAuth) {
      return Response.json(
        {
          error: "Guest limit reached. Please sign in to continue.",
          code: "GUEST_LIMIT_REACHED",
          requiresAuth: true,
          remaining: 0,
          quota: quotaContext.quota,
        },
        { status: 429 }
      )
    }

    if (quotaContext.quota.mode === "guest" && !quotaContext.ipHash) {
      return Response.json(
        {
          error: "Unable to verify guest usage. Please sign in to continue.",
          code: "GUEST_LIMIT_REACHED",
          requiresAuth: true,
          remaining: 0,
          quota: quotaContext.quota,
        },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const targetImage = validateNailArtImageFile(formData.get("targetImage"), "targetImage")
    const referenceImage = validateNailArtImageFile(
      formData.get("referenceImage"),
      "referenceImage"
    )
    const resolution = getOptionalString(formData.get("resolution")) ?? "1K"

    if (!["1K", "2K"].includes(resolution)) {
      throw new HttpError(400, "resolution must be one of: 1K, 2K")
    }

    const task = await createAILabNailArtTask({
      image: targetImage,
      referenceImage,
      resolution: resolution as "1K" | "2K",
    })
    const scopedTaskId = toProviderTaskId("nail", "ailab", task.taskId)

    await createGenerationJobRecord({
      taskId: scopedTaskId,
      provider: "ailab",
      status: task.status,
      userId: quotaContext.userId,
      ipHash: quotaContext.ipHash,
    })

    return Response.json({
      taskId: scopedTaskId,
      status: task.status,
      provider: "ailab",
      quota: getQuotaAfterTaskCreation({
        quota: quotaContext.quota,
        usedSuccessCount: quotaContext.usedSuccessCount,
        pendingCount: quotaContext.pendingCount,
      }),
    })
  } catch (error) {
    if (
      !(error instanceof HttpError) &&
      error instanceof Error &&
      error.message.toLowerCase().includes("not enough credits")
    ) {
      return Response.json(
        { error: "Provider credits are insufficient. Please top up your API credits." },
        { status: 402 }
      )
    }

    return createErrorResponse(error, "Failed to create nail art task")
  }
}
