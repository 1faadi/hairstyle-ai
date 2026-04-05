import type {
  HairstyleTaskProvider,
  HairstyleTaskStatus,
} from "@/lib/hairstyle/constants"
import { GUEST_CREDIT_LIMIT, GUEST_PENDING_STATUSES } from "@/lib/hairstyle/constants"
import { hashClientIp, resolveClientIp } from "@/lib/hairstyle/ip"
import type { QuotaSnapshot } from "@/lib/hairstyle/types"
import { getSupabaseServiceClient } from "@/lib/supabase/server"

type GuestUsage = {
  usedSuccessCount: number
  pendingCount: number
  quota: QuotaSnapshot
}

type GenerationJobDbRow = {
  task_id: string
  provider: HairstyleTaskProvider
  status: HairstyleTaskStatus
  user_id: string | null
  ip_hash: string | null
  credit_consumed: boolean
}

export type GenerationJobIdentity = {
  taskId: string
  provider: HairstyleTaskProvider
  status: HairstyleTaskStatus
  userId: string | null
  ipHash: string | null
  creditConsumed: boolean
}

export type RequestQuotaContext = {
  userId: string | null
  ipHash: string | null
  quota: QuotaSnapshot
  usedSuccessCount: number | null
  pendingCount: number | null
}

function toQuotaForGuest(usedSuccessCount: number, pendingCount: number): QuotaSnapshot {
  const consumedOrReserved = usedSuccessCount + pendingCount
  return {
    mode: "guest",
    pending: pendingCount,
    remaining: Math.max(0, GUEST_CREDIT_LIMIT - consumedOrReserved),
    requiresAuth: consumedOrReserved >= GUEST_CREDIT_LIMIT,
  }
}

function toQuotaForUser(): QuotaSnapshot {
  return {
    mode: "user",
    pending: null,
    remaining: null,
    requiresAuth: false,
  }
}

function toGenerationJobIdentity(row: GenerationJobDbRow): GenerationJobIdentity {
  return {
    taskId: row.task_id,
    provider: row.provider,
    status: row.status,
    userId: row.user_id,
    ipHash: row.ip_hash,
    creditConsumed: row.credit_consumed,
  }
}

function getBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization")
  if (!header) return null

  const [scheme, token] = header.split(" ", 2)
  if (!scheme || !token || scheme.toLowerCase() !== "bearer") {
    return null
  }

  return token.trim() || null
}

function getPendingStatuses(): string[] {
  return [...GUEST_PENDING_STATUSES]
}

async function getGuestUsageByIpHash(ipHash: string): Promise<GuestUsage> {
  const supabase = getSupabaseServiceClient()

  const [usageResult, pendingResult] = await Promise.all([
    supabase
      .from("guest_ip_usage")
      .select("used_success_count")
      .eq("ip_hash", ipHash)
      .maybeSingle(),
    supabase
      .from("generation_jobs")
      .select("task_id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .in("status", getPendingStatuses()),
  ])

  if (usageResult.error) {
    throw new Error(`Failed to read guest usage: ${usageResult.error.message}`)
  }
  if (pendingResult.error) {
    throw new Error(`Failed to read guest pending usage: ${pendingResult.error.message}`)
  }

  const usedSuccessCount = usageResult.data?.used_success_count ?? 0
  const pendingCount = pendingResult.count ?? 0

  return {
    usedSuccessCount,
    pendingCount,
    quota: toQuotaForGuest(usedSuccessCount, pendingCount),
  }
}

export async function getAuthenticatedUserIdFromRequest(
  request: Request
): Promise<string | null> {
  const token = getBearerToken(request)
  if (!token) return null

  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return null
  }

  return data.user.id
}

export async function resolveRequestQuotaContext(
  request: Request
): Promise<RequestQuotaContext> {
  const userId = await getAuthenticatedUserIdFromRequest(request)
  if (userId) {
    return {
      userId,
      ipHash: null,
      quota: toQuotaForUser(),
      usedSuccessCount: null,
      pendingCount: null,
    }
  }

  const ip = resolveClientIp(request)
  if (!ip) {
    return {
      userId: null,
      ipHash: null,
      quota: {
        mode: "guest",
        pending: 0,
        remaining: 0,
        requiresAuth: true,
      },
      usedSuccessCount: 0,
      pendingCount: 0,
    }
  }

  const ipHash = hashClientIp(ip)
  const usage = await getGuestUsageByIpHash(ipHash)

  return {
    userId: null,
    ipHash,
    quota: usage.quota,
    usedSuccessCount: usage.usedSuccessCount,
    pendingCount: usage.pendingCount,
  }
}

export async function getGuestQuotaByIpHash(ipHash: string): Promise<QuotaSnapshot> {
  const usage = await getGuestUsageByIpHash(ipHash)
  return usage.quota
}

export async function createGenerationJobRecord(input: {
  taskId: string
  provider: HairstyleTaskProvider
  status: HairstyleTaskStatus
  userId: string | null
  ipHash: string | null
}): Promise<void> {
  const supabase = getSupabaseServiceClient()
  const { error } = await supabase.from("generation_jobs").insert({
    task_id: input.taskId,
    provider: input.provider,
    status: input.status,
    user_id: input.userId,
    ip_hash: input.ipHash,
    credit_consumed: false,
  })

  if (error) {
    throw new Error(`Failed to record generation job: ${error.message}`)
  }
}

export async function getGenerationJobByTaskId(
  taskId: string
): Promise<GenerationJobIdentity | null> {
  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from("generation_jobs")
    .select("task_id,provider,status,user_id,ip_hash,credit_consumed")
    .eq("task_id", taskId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch generation job: ${error.message}`)
  }

  return data ? toGenerationJobIdentity(data as GenerationJobDbRow) : null
}

export async function updateGenerationJobStatus(
  taskId: string,
  status: HairstyleTaskStatus
): Promise<GenerationJobIdentity | null> {
  const supabase = getSupabaseServiceClient()

  const { data, error } = await supabase
    .from("generation_jobs")
    .update({ status })
    .eq("task_id", taskId)
    .select("task_id,provider,status,user_id,ip_hash,credit_consumed")
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to update generation status: ${error.message}`)
  }

  return data ? toGenerationJobIdentity(data as GenerationJobDbRow) : null
}

export async function consumeGuestCreditOnSuccess(
  taskId: string,
  ipHash: string
): Promise<QuotaSnapshot> {
  const supabase = getSupabaseServiceClient()
  const { error } = await supabase.rpc("consume_guest_credit_on_success", {
    p_task_id: taskId,
    p_ip_hash: ipHash,
  })

  if (error) {
    throw new Error(`Failed to consume guest credit: ${error.message}`)
  }

  return await getGuestQuotaByIpHash(ipHash)
}

export async function getQuotaForGenerationJob(
  job: GenerationJobIdentity | null
): Promise<QuotaSnapshot | null> {
  if (!job) return null
  if (job.userId) return toQuotaForUser()
  if (job.ipHash) return await getGuestQuotaByIpHash(job.ipHash)
  return null
}
