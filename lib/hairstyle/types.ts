import type {
  HairstyleTaskProvider,
  HairstyleTaskStatus,
} from "@/lib/hairstyle/constants"

export type HairstylePreset = {
  id: string
  name: string
  hairStyle: string
  gender: "male" | "female"
  thumbnailUrl: string
}

export type QuotaSnapshot = {
  mode: "guest" | "user"
  remaining: number | null
  pending: number | null
  requiresAuth: boolean
}

export type TaskResponse = {
  taskId: string
  status: HairstyleTaskStatus
  provider: HairstyleTaskProvider
  quota: QuotaSnapshot
}

export type TaskStatusResponse = {
  taskId: string
  status: HairstyleTaskStatus
  error: string | null
  resultPath: string | null
  quota: QuotaSnapshot | null
}
