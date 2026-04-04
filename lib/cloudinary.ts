import { randomUUID } from "node:crypto"
import { v2 as cloudinary } from "cloudinary"

import { HttpError } from "@/lib/hairstyle/errors"

type CloudinaryImageResource = {
  asset_id: string
  public_id: string
  secure_url: string
  version?: number
}

export type CloudinaryPresetAsset = {
  id: string
  publicId: string
  name: string
  thumbnailUrl: string
  sourceUrl: string
}

let isConfigured = false

function requireEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new HttpError(500, `Missing required environment variable: ${name}`)
  }
  return value
}

function getCloudinary() {
  if (!isConfigured) {
    cloudinary.config({
      cloud_name: requireEnv("CLOUDINARY_CLOUD_NAME"),
      api_key: requireEnv("CLOUDINARY_API_KEY"),
      api_secret: requireEnv("CLOUDINARY_API_SECRET"),
      secure: true,
    })
    isConfigured = true
  }

  return cloudinary
}

function getPresetsFolder(): string {
  return requireEnv("CLOUDINARY_PRESETS_FOLDER")
}

function toPresetName(publicId: string): string {
  const slug = publicId.split("/").at(-1) ?? publicId
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export async function listCloudinaryPresets(
  limit = 500
): Promise<CloudinaryPresetAsset[]> {
  const client = getCloudinary()
  const folder = getPresetsFolder()

  const searchResult = await client.search
    .expression(`folder="${folder}" AND resource_type:image`)
    .sort_by("public_id", "desc")
    .max_results(limit)
    .execute()

  const resources = (searchResult.resources ?? []) as CloudinaryImageResource[]

  return resources.map((resource) => ({
    id: resource.asset_id || resource.public_id,
    publicId: resource.public_id,
    name: toPresetName(resource.public_id),
    thumbnailUrl: client.url(resource.public_id, {
      secure: true,
      version: resource.version,
      transformation: [
        { width: 500, height: 500, crop: "fill", gravity: "auto" },
        { quality: "auto", fetch_format: "auto" },
      ],
    }),
    sourceUrl: resource.secure_url,
  }))
}

export async function uploadImageToCloudinary(
  file: File,
  folder: string
): Promise<string> {
  const client = getCloudinary()
  const bytes = Buffer.from(await file.arrayBuffer())

  return await new Promise<string>((resolve, reject) => {
    const upload = client.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        public_id: `${Date.now()}-${randomUUID()}`,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`))
          return
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary upload did not return a secure URL"))
          return
        }

        resolve(result.secure_url)
      }
    )

    upload.end(bytes)
  })
}
