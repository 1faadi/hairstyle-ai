import { listCloudinaryPresets } from "@/lib/cloudinary"
import { createErrorResponse } from "@/lib/hairstyle/http"

export const runtime = "nodejs"

export async function GET() {
  try {
    const presets = await listCloudinaryPresets()
    return Response.json({ presets })
  } catch (error) {
    return createErrorResponse(error, "Failed to load hairstyle presets")
  }
}
