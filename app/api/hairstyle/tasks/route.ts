import { uploadImageToCloudinary } from "@/lib/cloudinary"
import { createVModelHairstyleTask } from "@/lib/vmodel"
import { HttpError } from "@/lib/hairstyle/errors"
import { createErrorResponse } from "@/lib/hairstyle/http"
import {
  getOptionalString,
  validateHttpUrl,
  validateImageFile,
} from "@/lib/hairstyle/validation"

export const runtime = "nodejs"

const SOURCE_UPLOAD_FOLDER = "hairstyle-ai/user-source"
const TARGET_UPLOAD_FOLDER = "hairstyle-ai/user-target"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const targetImage = validateImageFile(formData.get("targetImage"), "targetImage")
    const sourcePresetUrl = getOptionalString(formData.get("sourcePresetUrl"))
    const sourceImageEntry = formData.get("sourceImage")

    let sourceUrl: string
    if (sourcePresetUrl) {
      sourceUrl = validateHttpUrl(sourcePresetUrl, "sourcePresetUrl")
    } else {
      if (sourceImageEntry === null) {
        throw new HttpError(
          400,
          "Provide either sourcePresetUrl or sourceImage for hairstyle source"
        )
      }

      const sourceImage = validateImageFile(sourceImageEntry, "sourceImage")
      sourceUrl = await uploadImageToCloudinary(sourceImage, SOURCE_UPLOAD_FOLDER)
    }

    const targetUrl = await uploadImageToCloudinary(targetImage, TARGET_UPLOAD_FOLDER)
    const task = await createVModelHairstyleTask({ sourceUrl, targetUrl })

    return Response.json(task)
  } catch (error) {
    return createErrorResponse(error, "Failed to create hairstyle task")
  }
}
