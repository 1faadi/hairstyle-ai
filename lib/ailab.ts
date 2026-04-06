import {
  AILAB_CREATE_TASK_URL,
  AILAB_GET_TASK_URL,
  AILAB_NAIL_ART_CREATE_TASK_URL,
  type HairstyleTaskStatus,
} from "@/lib/hairstyle/constants"
import { HttpError } from "@/lib/hairstyle/errors"

type AILabCreateTaskResponse = {
  error_code?: number
  error_msg?: string
  task_id?: string
}

type AILabGetTaskResponse = {
  error_code?: number
  error_msg?: string
  task_status?: number
  data?: {
    images?: unknown
  }
}

export type NormalizedAILabTask = {
  taskId: string
  status: HairstyleTaskStatus
  outputUrl: string | null
  error: string | null
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new HttpError(500, `Missing required environment variable: ${name}`)
  }
  return value
}

function getAILabApiKey(): string {
  return requireEnv("AILABAPI_API_KEY")
}

function toNormalizedStatus(taskStatus: number | undefined): HairstyleTaskStatus {
  if (taskStatus === 0) return "starting"
  if (taskStatus === 1) return "processing"
  if (taskStatus === 2) return "succeeded"
  return "failed"
}

async function parseJsonOrThrow<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T
  } catch {
    throw new Error("Provider returned a non-JSON response")
  }
}

export async function createAILabHairstyleTask(input: {
  image: File
  hairStyle: string
  color?: string
  imageSize?: string
}): Promise<{ taskId: string; status: HairstyleTaskStatus }> {
  const formData = new FormData()
  formData.append("task_type", "async")
  formData.append("auto", "1")
  formData.append("image", input.image, input.image.name || "portrait.jpg")
  formData.append("hair_style", input.hairStyle)
  if (input.color) {
    formData.append("color", input.color)
  }
  if (input.imageSize) {
    formData.append("image_size", input.imageSize)
  }

  const response = await fetch(AILAB_CREATE_TASK_URL, {
    method: "POST",
    headers: {
      "ailabapi-api-key": getAILabApiKey(),
    },
    body: formData,
  })

  const data = await parseJsonOrThrow<AILabCreateTaskResponse>(response)

  if (!response.ok) {
    throw new Error(
      `AILab create task request failed (${response.status}): ${JSON.stringify(data)}`
    )
  }

  if (data.error_code !== 0 || !data.task_id) {
    throw new Error(
      `AILab create task response was invalid: ${data.error_msg || JSON.stringify(data)}`
    )
  }

  return { taskId: data.task_id, status: "starting" }
}

export async function createAILabNailArtTask(input: {
  image: File
  nailName: string
  nailDescription: string
}): Promise<{ taskId: string; status: HairstyleTaskStatus }> {
  const formData = new FormData()
  formData.append("task_type", "async")
  formData.append("image", input.image, input.image.name || "hand.jpg")
  formData.append("nail_name", input.nailName)
  formData.append("nail_desc", input.nailDescription)

  const response = await fetch(AILAB_NAIL_ART_CREATE_TASK_URL, {
    method: "POST",
    headers: {
      "ailabapi-api-key": getAILabApiKey(),
    },
    body: formData,
  })

  const data = await parseJsonOrThrow<AILabCreateTaskResponse>(response)

  if (!response.ok) {
    throw new Error(
      `AILab nail art create task request failed (${response.status}): ${JSON.stringify(data)}`
    )
  }

  if (data.error_code !== 0 || !data.task_id) {
    throw new Error(
      `AILab nail art create task response was invalid: ${data.error_msg || JSON.stringify(data)}`
    )
  }

  return { taskId: data.task_id, status: "starting" }
}

export async function getAILabTask(taskId: string): Promise<NormalizedAILabTask> {
  const response = await fetch(
    `${AILAB_GET_TASK_URL}?task_id=${encodeURIComponent(taskId)}`,
    {
      method: "GET",
      headers: {
        "ailabapi-api-key": getAILabApiKey(),
      },
      cache: "no-store",
    }
  )

  const data = await parseJsonOrThrow<AILabGetTaskResponse>(response)

  if (!response.ok) {
    throw new Error(
      `AILab get task request failed (${response.status}): ${JSON.stringify(data)}`
    )
  }

  if (data.error_code !== 0) {
    throw new Error(
      `AILab get task response error: ${data.error_msg || JSON.stringify(data)}`
    )
  }

  const status = toNormalizedStatus(data.task_status)
  const images = Array.isArray(data.data?.images)
    ? data.data?.images.filter((item): item is string => typeof item === "string")
    : []
  const outputUrl = images[0] ?? null

  return {
    taskId,
    status: status === "succeeded" && !outputUrl ? "failed" : status,
    outputUrl,
    error:
      status === "succeeded" && !outputUrl
        ? "Task completed but no image URL was returned."
        : data.error_msg || null,
  }
}
