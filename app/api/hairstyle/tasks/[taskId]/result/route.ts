import { HttpError } from "@/lib/hairstyle/errors"
import { createErrorResponse } from "@/lib/hairstyle/http"
import { getVModelTask, getVModelApiToken } from "@/lib/vmodel"

export const runtime = "nodejs"

type RouteContext = {
  params: Promise<{ taskId: string }>
}

function getExtensionFromContentType(contentType: string): string {
  if (contentType.includes("png")) return "png"
  if (contentType.includes("jpeg")) return "jpg"
  if (contentType.includes("webp")) return "webp"
  return "bin"
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { taskId } = await context.params
    const task = await getVModelTask(taskId)

    if (task.status !== "succeeded") {
      throw new HttpError(409, "Task is not ready yet")
    }

    if (!task.outputUrl) {
      throw new HttpError(502, "Task succeeded but no output URL was returned")
    }

    const providerResponse = await fetch(task.outputUrl, {
      headers: {
        Authorization: `Bearer ${getVModelApiToken()}`,
      },
      cache: "no-store",
    })

    if (!providerResponse.ok || !providerResponse.body) {
      throw new HttpError(
        502,
        `Failed to fetch generated image from provider (${providerResponse.status})`
      )
    }

    const contentType = providerResponse.headers.get("content-type") ?? "image/webp"
    const extension = getExtensionFromContentType(contentType)
    const shouldDownload = new URL(request.url).searchParams.get("download") === "1"

    const headers = new Headers()
    headers.set("Content-Type", contentType)
    headers.set("Cache-Control", "no-store")
    headers.set(
      "Content-Disposition",
      `${shouldDownload ? "attachment" : "inline"}; filename="hairstyle-${taskId}.${extension}"`
    )

    return new Response(providerResponse.body, {
      status: 200,
      headers,
    })
  } catch (error) {
    return createErrorResponse(error, "Failed to stream generated result")
  }
}
