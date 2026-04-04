export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
])

export const AILAB_CREATE_TASK_URL =
  "https://www.ailabapi.com/api/portrait/effects/hairstyle-editor-pro"
export const AILAB_GET_TASK_URL =
  "https://www.ailabapi.com/api/common/query-async-task-result"

export type HairstyleTaskStatus =
  | "starting"
  | "processing"
  | "succeeded"
  | "failed"
  | "canceled"
