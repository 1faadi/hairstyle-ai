/**
 * Delivery URL for try-on celebrity reference thumbnails and fetch-to-File flow.
 * When `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set, images load from Cloudinary CDN.
 * Otherwise falls back to files in `public/celebrities/` (local dev).
 */
export function getCelebrityPortraitDeliveryUrl(filename: string): string {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim()
  const folder =
    process.env.NEXT_PUBLIC_CLOUDINARY_CELEBRITIES_FOLDER?.trim() ?? "hairstyle-ai/celebrities"

  if (!cloud) {
    return `/celebrities/${filename}`
  }

  const normalizedFolder = folder.replace(/^\/+|\/+$/g, "")
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto/${normalizedFolder}/${filename}`
}
