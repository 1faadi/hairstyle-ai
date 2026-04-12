import { getCachedHairstylePresets } from "@/lib/hairstyle/cached-presets"
import { createErrorResponse } from "@/lib/hairstyle/http"

export const runtime = "nodejs"

export async function GET() {
  try {
    const presets = await getCachedHairstylePresets()
    return Response.json({ presets })
  } catch (error) {
    return createErrorResponse(error, "Failed to load hairstyle presets")
  }
}
