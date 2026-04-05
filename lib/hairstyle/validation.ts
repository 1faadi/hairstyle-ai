import { ALLOWED_IMAGE_MIME_TYPES, MAX_UPLOAD_BYTES } from "@/lib/hairstyle/constants"
import { HttpError } from "@/lib/hairstyle/errors"

const NAIL_ART_ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
])
const NAIL_ART_MAX_UPLOAD_BYTES = 10 * 1024 * 1024

function validateImageFileWithOptions(
  entry: FormDataEntryValue | null,
  fieldName: string,
  options: {
    maxUploadBytes: number
    allowedMimeTypes: Set<string>
    allowedTypesLabel: string
  }
): File {
  if (!(entry instanceof File)) {
    throw new HttpError(400, `Missing required file: ${fieldName}`)
  }

  if (entry.size === 0) {
    throw new HttpError(400, `${fieldName} is empty`)
  }

  if (entry.size > options.maxUploadBytes) {
    throw new HttpError(
      400,
      `${fieldName} is too large. Max size is ${Math.floor(options.maxUploadBytes / (1024 * 1024))}MB`
    )
  }

  if (!options.allowedMimeTypes.has(entry.type)) {
    throw new HttpError(
      400,
      `${fieldName} has unsupported type. Allowed: ${options.allowedTypesLabel}`
    )
  }

  return entry
}

export function validateImageFile(
  entry: FormDataEntryValue | null,
  fieldName: string
): File {
  return validateImageFileWithOptions(entry, fieldName, {
    maxUploadBytes: MAX_UPLOAD_BYTES,
    allowedMimeTypes: ALLOWED_IMAGE_MIME_TYPES,
    allowedTypesLabel: "jpg, jpeg, png",
  })
}

export function validateNailArtImageFile(
  entry: FormDataEntryValue | null,
  fieldName: string
): File {
  return validateImageFileWithOptions(entry, fieldName, {
    maxUploadBytes: NAIL_ART_MAX_UPLOAD_BYTES,
    allowedMimeTypes: NAIL_ART_ALLOWED_IMAGE_MIME_TYPES,
    allowedTypesLabel: "jpg, jpeg, png, webp",
  })
}

export function getOptionalString(entry: FormDataEntryValue | null): string | null {
  if (typeof entry !== "string") {
    return null
  }

  const value = entry.trim()
  return value.length > 0 ? value : null
}

export function validateHttpUrl(value: string, fieldName: string): string {
  let parsed: URL

  try {
    parsed = new URL(value)
  } catch {
    throw new HttpError(400, `${fieldName} must be a valid URL`)
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new HttpError(400, `${fieldName} must start with http:// or https://`)
  }

  return parsed.toString()
}
