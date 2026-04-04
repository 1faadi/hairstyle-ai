import type { HairstyleTaskStatus } from "@/lib/hairstyle/constants"

export type HairstylePreset = {
  id: string
  name: string
  thumbnailUrl: string
  sourceUrl: string
}

export type TaskResponse = {
  taskId: string
  status: HairstyleTaskStatus
}

export type TaskStatusResponse = {
  taskId: string
  status: HairstyleTaskStatus
  error: string | null
  resultPath: string | null
}
