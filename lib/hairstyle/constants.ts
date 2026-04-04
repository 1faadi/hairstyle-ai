export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
])

export const DEFAULT_VMODEL_MODEL_VERSION =
  "5c0440717a995b0bbd93377bd65dbb4fe360f67967c506aa6bd8f6b660733a7e"

export const VMODEL_CREATE_TASK_URL = "https://api.vmodel.ai/api/tasks/v1/create"
export const VMODEL_GET_TASK_URL = "https://api.vmodel.ai/api/tasks/v1/get"

export type HairstyleTaskStatus =
  | "starting"
  | "processing"
  | "succeeded"
  | "failed"
  | "canceled"
