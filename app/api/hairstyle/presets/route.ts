import { listCloudinaryPresets } from "@/lib/cloudinary"
import { AILAB_PRESET_CATALOG } from "@/lib/hairstyle/ailab-presets"
import { createErrorResponse } from "@/lib/hairstyle/http"

export const runtime = "nodejs"

export async function GET() {
  try {
    const assets = await listCloudinaryPresets(500)
    const assetBySlug = new Map<string, string>()

    for (const asset of assets) {
      const slug = asset.publicId.split("/").at(-1)
      if (slug) {
        assetBySlug.set(slug, asset.thumbnailUrl)
      }
    }

    const presets = AILAB_PRESET_CATALOG.map((item) => ({
      id: item.id,
      name: item.name,
      hairStyle: item.hairStyle,
      gender: item.gender,
      thumbnailUrl: assetBySlug.get(item.thumbnailSlug) ?? null,
    }))

    return Response.json({ presets })
  } catch (error) {
    return createErrorResponse(error, "Failed to load hairstyle presets")
  }
}
