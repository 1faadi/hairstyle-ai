import { unstable_cache } from "next/cache"

import { listCloudinaryPresets } from "@/lib/cloudinary"
import { AILAB_PRESET_CATALOG } from "@/lib/hairstyle/ailab-presets"
import type { HairstylePreset } from "@/lib/hairstyle/types"

async function buildHairstylePresetsList(): Promise<HairstylePreset[]> {
  const assets = await listCloudinaryPresets(500)
  const assetBySlug = new Map<string, string>()

  for (const asset of assets) {
    const slug = asset.publicId.split("/").at(-1)
    if (slug) {
      assetBySlug.set(slug, asset.thumbnailUrl)
    }
  }

  return AILAB_PRESET_CATALOG.map((item) => ({
    id: item.id,
    name: item.name,
    hairStyle: item.hairStyle,
    gender: item.gender,
    thumbnailUrl: assetBySlug.get(item.thumbnailSlug) ?? null,
  }))
}

/** Cloudinary search is expensive; cache merged catalog for a few minutes. */
export const getCachedHairstylePresets = unstable_cache(
  buildHairstylePresetsList,
  ["hairstyle-presets-with-thumbnails"],
  { revalidate: 120 }
)
