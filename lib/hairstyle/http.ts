import { isHttpError } from "@/lib/hairstyle/errors"

export function createErrorResponse(
  error: unknown,
  fallbackMessage = "Request failed"
): Response {
  if (isHttpError(error)) {
    return Response.json({ error: error.message }, { status: error.status })
  }

  const message =
    error instanceof Error && error.message.length > 0
      ? error.message
      : fallbackMessage

  return Response.json({ error: message }, { status: 500 })
}
