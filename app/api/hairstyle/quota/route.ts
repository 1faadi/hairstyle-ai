import { createErrorResponse } from "@/lib/hairstyle/http"
import { resolveRequestQuotaContext } from "@/lib/hairstyle/quota"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const context = await resolveRequestQuotaContext(request)
    return Response.json({ quota: context.quota })
  } catch (error) {
    return createErrorResponse(error, "Failed to load quota")
  }
}
