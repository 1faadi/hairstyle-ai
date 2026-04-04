import { createAILabHairstyleTask } from "@/lib/ailab"
import { AILAB_HAIRSTYLE_SET } from "@/lib/hairstyle/ailab-presets"
import { HttpError, isHttpError } from "@/lib/hairstyle/errors"
import { createErrorResponse } from "@/lib/hairstyle/http"
import {
  getOptionalString,
  validateImageFile,
} from "@/lib/hairstyle/validation"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const targetImage = validateImageFile(formData.get("targetImage"), "targetImage")
    const hairStyle = getOptionalString(formData.get("hairStyle"))
    const color = getOptionalString(formData.get("color")) ?? undefined
    const imageSize = getOptionalString(formData.get("imageSize")) ?? "1"

    if (!hairStyle) {
      throw new HttpError(400, "Missing required field: hairStyle")
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

    return Response.json(task)
  } catch (error) {
    if (
      !isHttpError(error) &&
      error instanceof Error &&
      error.message.toLowerCase().includes("not enough credits")
    ) {
      return Response.json(
        { error: "Provider credits are insufficient. Please top up AILab credits." },
        { status: 402 }
      )
    }

    return createErrorResponse(error, "Failed to create hairstyle task")
  }
}
