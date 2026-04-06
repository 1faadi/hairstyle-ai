export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
])

export const AILAB_CREATE_TASK_URL =
  "https://www.ailabapi.com/api/portrait/effects/hairstyle-editor-pro"
export const AILAB_NAIL_ART_CREATE_TASK_URL =
  "https://www.ailabapi.com/api/image/editing/ai-nail-art"
export const AILAB_GET_TASK_URL =
  "https://www.ailabapi.com/api/common/query-async-task-result"
export const VMODEL_CREATE_TASK_URL = "https://api.vmodel.ai/api/tasks/v1/create"
export const VMODEL_GET_TASK_URL = "https://api.vmodel.ai/api/tasks/v1/get"
export const DEFAULT_VMODEL_MODEL_VERSION =
  "5c0440717a995b0bbd93377bd65dbb4fe360f67967c506aa6bd8f6b660733a7e"
export const GUEST_CREDIT_LIMIT = 3
export const GUEST_PENDING_STATUSES: HairstyleTaskStatus[] = [
  "starting",
  "processing",
]

export type HairstyleTaskStatus =
  | "starting"
  | "processing"
  | "succeeded"
  | "failed"
  | "canceled"

export type HairstyleTaskProvider = "ailab" | "vmodel"
export type GenerationTaskFeature = "hair" | "nail"
