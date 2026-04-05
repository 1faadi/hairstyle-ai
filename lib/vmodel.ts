import {
  DEFAULT_VMODEL_MODEL_VERSION,
  VMODEL_CREATE_TASK_URL,
  VMODEL_GET_TASK_URL,
  type HairstyleTaskStatus,
} from "@/lib/hairstyle/constants"
import { HttpError } from "@/lib/hairstyle/errors"

type VModelCreateTaskResponse = {
  code?: number
  result?: {
    task_id?: string
  }
  message?: {
    en?: string
  }
}

type VModelGetTaskResponse = {
  code?: number
  result?: {
    task_id?: string
    status?: string
    output?: unknown
    error?: string | null
  }
  message?: {
    en?: string
  }
}

export type NormalizedVModelTask = {
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

function getVModelApiToken(): string {
  return requireEnv("VMODEL_API_TOKEN")
}

export function getVModelModelVersion(): string {
  return process.env.VMODEL_MODEL_VERSION?.trim() || DEFAULT_VMODEL_MODEL_VERSION
}

function toNormalizedStatus(status: string | undefined): HairstyleTaskStatus {
  if (status === "starting") return "starting"
  if (status === "processing") return "processing"
  if (status === "succeeded") return "succeeded"
  if (status === "canceled") return "canceled"
  return "failed"
}

function getMessage(data: { message?: { en?: string } }): string | null {
  const value = data.message?.en
  return value && value.trim() ? value.trim() : null
}

async function parseJsonOrThrow<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T
  } catch {
    throw new Error("Provider returned a non-JSON response")
  }
}

export async function createVModelHairstyleTask(input: {
  sourceUrl: string
  targetUrl: string
}): Promise<{ taskId: string; status: HairstyleTaskStatus }> {
  const response = await fetch(VMODEL_CREATE_TASK_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getVModelApiToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: getVModelModelVersion(),
      input: {
        source: input.sourceUrl,
        target: input.targetUrl,
      },
    }),
    cache: "no-store",
  })

  const data = await parseJsonOrThrow<VModelCreateTaskResponse>(response)

  if (!response.ok) {
    throw new Error(
      `VModel create task request failed (${response.status}): ${
        getMessage(data) || JSON.stringify(data)
      }`
    )
  }

  const taskId = data.result?.task_id
  if (data.code !== 200 || !taskId) {
    throw new Error(
      `VModel create task response was invalid: ${getMessage(data) || JSON.stringify(data)}`
    )
  }

  return { taskId, status: "starting" }
}

export async function getVModelTask(taskId: string): Promise<NormalizedVModelTask> {
  const response = await fetch(`${VMODEL_GET_TASK_URL}/${encodeURIComponent(taskId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getVModelApiToken()}`,
    },
    cache: "no-store",
  })

  const data = await parseJsonOrThrow<VModelGetTaskResponse>(response)

  if (!response.ok) {
    throw new Error(
      `VModel get task request failed (${response.status}): ${
        getMessage(data) || JSON.stringify(data)
      }`
    )
  }

  if (data.code !== 200) {
    throw new Error(
      `VModel get task response error: ${getMessage(data) || JSON.stringify(data)}`
    )
  }

  const result = data.result ?? {}
  const status = toNormalizedStatus(result.status)
  const outputs = Array.isArray(result.output)
    ? result.output.filter((item): item is string => typeof item === "string")
    : []
  const outputUrl = outputs[0] ?? null

  return {
    taskId,
    status: status === "succeeded" && !outputUrl ? "failed" : status,
    outputUrl,
    error:
      status === "succeeded" && !outputUrl
        ? "Task completed but no image URL was returned."
        : result.error || null,
  }
}

export function getVModelAuthHeader(): string {
  return `Bearer ${getVModelApiToken()}`
}
