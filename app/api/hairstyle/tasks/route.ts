import { createAILabHairstyleTask } from "@/lib/ailab"
import { uploadImageToCloudinary } from "@/lib/cloudinary"
import { AILAB_HAIRSTYLE_SET } from "@/lib/hairstyle/ailab-presets"
import { GUEST_CREDIT_LIMIT } from "@/lib/hairstyle/constants"
import { HttpError, isHttpError } from "@/lib/hairstyle/errors"
import { createErrorResponse } from "@/lib/hairstyle/http"
import { toProviderTaskId } from "@/lib/hairstyle/provider-task"
import {
  createGenerationJobRecord,
  resolveRequestQuotaContext,
} from "@/lib/hairstyle/quota"
import type { QuotaSnapshot } from "@/lib/hairstyle/types"
import {
  getOptionalString,
  validateHttpUrl,
  validateImageFile,
} from "@/lib/hairstyle/validation"
import { createVModelHairstyleTask } from "@/lib/vmodel"

export const runtime = "nodejs"

function getUploadsFolder(type: "source" | "target"): string {
  const baseFolder = process.env.CLOUDINARY_UPLOADS_FOLDER?.trim() || "hairstyle-ai/uploads"
  return `${baseFolder}/${type}`
}

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

    const targetImage = validateImageFile(formData.get("targetImage"), "targetImage")
    const hairStyle = getOptionalString(formData.get("hairStyle"))
    const sourcePresetUrl = getOptionalString(formData.get("sourcePresetUrl"))
    const sourceImageEntry = formData.get("sourceImage")
    const color = getOptionalString(formData.get("color")) ?? undefined
    const imageSize = getOptionalString(formData.get("imageSize")) ?? "1"

    const hasCustomSource = sourceImageEntry instanceof File || !!sourcePresetUrl
    const provider = hasCustomSource ? "vmodel" : "ailab"

    if (hasCustomSource) {
      const sourceUrl =
        sourceImageEntry instanceof File
          ? await uploadImageToCloudinary(
              validateImageFile(sourceImageEntry, "sourceImage"),
              getUploadsFolder("source")
            )
          : validateHttpUrl(sourcePresetUrl as string, "sourcePresetUrl")

      const targetUrl = await uploadImageToCloudinary(
        targetImage,
        getUploadsFolder("target")
      )

      const task = await createVModelHairstyleTask({
        sourceUrl,
        targetUrl,
      })
      const scopedTaskId = toProviderTaskId("hair", "vmodel", task.taskId)

      await createGenerationJobRecord({
        taskId: scopedTaskId,
        provider: "vmodel",
        status: task.status,
        userId: quotaContext.userId,
        ipHash: quotaContext.ipHash,
      })

      return Response.json({
        taskId: scopedTaskId,
        status: task.status,
        provider: "vmodel",
        quota: getQuotaAfterTaskCreation({
          quota: quotaContext.quota,
          usedSuccessCount: quotaContext.usedSuccessCount,
          pendingCount: quotaContext.pendingCount,
        }),
      })
    }

    if (!hairStyle) {
      throw new HttpError(
        400,
        "Missing required field: hairStyle (or provide sourceImage/sourcePresetUrl for custom mode)"
      )
    }

    if (!AILAB_HAIRSTYLE_SET.has(hairStyle)) {
      throw new HttpError(400, "Unsupported hairStyle preset")
    }

    if (!["1", "2", "3", "4"].includes(imageSize)) {
      throw new HttpError(400, "imageSize must be one of: 1, 2, 3, 4")
    }

    const task = await createAILabHairstyleTask({
      image: targetImage,
      hairStyle,
      color,
      imageSize,
    })
    const scopedTaskId = toProviderTaskId("hair", "ailab", task.taskId)

    await createGenerationJobRecord({
      taskId: scopedTaskId,
      provider,
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
      !isHttpError(error) &&
      error instanceof Error &&
      error.message.toLowerCase().includes("not enough credits")
    ) {
      return Response.json(
        { error: "Provider credits are insufficient. Please top up your API credits." },
        { status: 402 }
      )
    }

    return createErrorResponse(error, "Failed to create hairstyle task")
  }
}
