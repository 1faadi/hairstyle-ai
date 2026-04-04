import type { HairstyleTaskStatus } from "@/lib/hairstyle/constants"

export type HairstylePreset = {
  id: string
  name: string
  hairStyle: string
  gender: "male" | "female"
  thumbnailUrl: string
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
