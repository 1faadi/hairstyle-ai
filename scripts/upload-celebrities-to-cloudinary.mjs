/**
 * One-time / maintenance upload: push `public/celebrities/*.{jpg,jpeg,png}` to Cloudinary.
 *
 * Usage (from repo root, Node 20+):
 *   node --env-file=.env.local scripts/upload-celebrities-to-cloudinary.mjs
 *
 * Requires: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * Optional: CLOUDINARY_CELEBRITIES_FOLDER (default: hairstyle-ai/celebrities)
 */

import { readdir, readFile } from "node:fs/promises"
import { dirname, extname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { v2 as cloudinary } from "cloudinary"

const __dirname = dirname(fileURLToPath(import.meta.url))

function requireEnv(name) {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

const cloudName = requireEnv("CLOUDINARY_CLOUD_NAME")

cloudinary.config({
  cloud_name: cloudName,
  api_key: requireEnv("CLOUDINARY_API_KEY"),
  api_secret: requireEnv("CLOUDINARY_API_SECRET"),
  secure: true,
})

const folder = process.env.CLOUDINARY_CELEBRITIES_FOLDER?.trim() || "hairstyle-ai/celebrities"
const celebritiesDir = join(__dirname, "..", "public", "celebrities")

const files = (await readdir(celebritiesDir)).filter((name) => {
  const ext = extname(name).toLowerCase()
  return ext === ".jpg" || ext === ".jpeg" || ext === ".png"
})

if (files.length === 0) {
  console.warn(`No images found in ${celebritiesDir}`)
  process.exit(0)
}

for (const filename of files) {
  const buffer = await readFile(join(celebritiesDir, filename))
  const publicId = filename.replace(/\.[^.]+$/, "")

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        overwrite: true,
        invalidate: true,
      },
      (error, res) => {
        if (error) reject(error)
        else resolve(res)
      }
    )
    stream.end(buffer)
  })

  console.log(`${filename} -> ${result.secure_url}`)
}

console.log("\nSet in .env.local (match upload folder for delivery URLs):")
console.log(`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${cloudName}`)
console.log(`NEXT_PUBLIC_CLOUDINARY_CELEBRITIES_FOLDER=${folder}`)
