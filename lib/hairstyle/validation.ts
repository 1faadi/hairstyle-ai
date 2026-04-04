import { ALLOWED_IMAGE_MIME_TYPES, MAX_UPLOAD_BYTES } from "@/lib/hairstyle/constants"
import { HttpError } from "@/lib/hairstyle/errors"

export function validateImageFile(
  entry: FormDataEntryValue | null,
  fieldName: string
): File {
  if (!(entry instanceof File)) {
    throw new HttpError(400, `Missing required file: ${fieldName}`)
  }

  if (entry.size === 0) {
    throw new HttpError(400, `${fieldName} is empty`)
  }

  if (entry.size > MAX_UPLOAD_BYTES) {
    throw new HttpError(
      400,
      `${fieldName} is too large. Max size is ${Math.floor(MAX_UPLOAD_BYTES / (1024 * 1024))}MB`
    )
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.has(entry.type)) {
    throw new HttpError(
      400,
      `${fieldName} has unsupported type. Allowed: jpg, jpeg, png`
    )
  }

  return entry
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
