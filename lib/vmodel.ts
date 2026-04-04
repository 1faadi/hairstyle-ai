import {
  DEFAULT_VMODEL_MODEL_VERSION,
  type HairstyleTaskStatus,
  VMODEL_CREATE_TASK_URL,
  VMODEL_GET_TASK_URL,
} from "@/lib/hairstyle/constants"
import { HttpError } from "@/lib/hairstyle/errors"

type VModelCreateTaskResponse = {
  code?: number
  result?: {
    task_id?: string
  }
  message?: unknown
}

type VModelGetTaskResponse = {
  code?: number
  result?: {
    task_id?: string
    status?: string
    output?: unknown
    error?: string | null
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

export function getVModelApiToken(): string {
  return requireEnv("VMODEL_API_TOKEN")
}

function getVModelModelVersion(): string {
  return process.env.VMODEL_MODEL_VERSION?.trim() || DEFAULT_VMODEL_MODEL_VERSION
}

function normalizeStatus(status: string | undefined): HairstyleTaskStatus {
  switch (status) {
    case "starting":
    case "processing":
    case "succeeded":
    case "failed":
    case "canceled":
      return status
    default:
      return "failed"
  }
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
        disable_safety_checker: false,
      },
    }),
  })

  const data = await parseJsonOrThrow<VModelCreateTaskResponse>(response)

  if (!response.ok) {
    throw new Error(
      `VModel create task request failed (${response.status}): ${JSON.stringify(data)}`
    )
  }

  if (data.code !== 200 || !data.result?.task_id) {
    throw new Error(`VModel create task response was invalid: ${JSON.stringify(data)}`)
  }

  return { taskId: data.result.task_id, status: "starting" }
}

export async function getVModelTask(taskId: string): Promise<NormalizedVModelTask> {
  const response = await fetch(
    `${VMODEL_GET_TASK_URL}/${encodeURIComponent(taskId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getVModelApiToken()}`,
      },
    }
  )

  const data = await parseJsonOrThrow<VModelGetTaskResponse>(response)

  if (!response.ok) {
    throw new Error(
      `VModel get task request failed (${response.status}): ${JSON.stringify(data)}`
    )
  }

  if (data.code !== 200 || !data.result?.task_id) {
    throw new Error(`VModel get task response was invalid: ${JSON.stringify(data)}`)
  }

  const output =
    Array.isArray(data.result.output) && typeof data.result.output[0] === "string"
      ? data.result.output[0]
      : null

  return {
    taskId: data.result.task_id,
    status: normalizeStatus(data.result.status),
    outputUrl: output,
    error: data.result.error ?? null,
  }
}
