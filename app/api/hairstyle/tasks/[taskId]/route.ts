import { createErrorResponse } from "@/lib/hairstyle/http"
import { parseProviderTaskId } from "@/lib/hairstyle/provider-task"
import {
  consumeGuestCreditOnSuccess,
  getQuotaForGenerationJob,
  resolveRequestQuotaContext,
  updateGenerationJobStatus,
} from "@/lib/hairstyle/quota"
import { getAILabTask } from "@/lib/ailab"
import { getVModelTask } from "@/lib/vmodel"

export const runtime = "nodejs"

type RouteContext = {
  params: Promise<{ taskId: string }>
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { taskId: scopedTaskId } = await context.params
    const parsed = parseProviderTaskId(scopedTaskId)
    const task =
      parsed.provider === "vmodel"
        ? await getVModelTask(parsed.taskId)
        : await getAILabTask(parsed.taskId)
    const job = await updateGenerationJobStatus(scopedTaskId, task.status)

    let quota = await getQuotaForGenerationJob(job)

    if (
      job &&
      !job.userId &&
      job.ipHash &&
      !job.creditConsumed &&
      task.status === "succeeded"
    ) {
      quota = await consumeGuestCreditOnSuccess(scopedTaskId, job.ipHash)
    }

    if (!quota) {
      const contextQuota = await resolveRequestQuotaContext(request)
      quota = contextQuota.quota
    }

    return Response.json({
      taskId: scopedTaskId,
      status: task.status,
      error: task.error,
      resultPath:
        task.status === "succeeded"
          ? `/api/hairstyle/tasks/${encodeURIComponent(scopedTaskId)}/result`
          : null,
      quota,
    })
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch hairstyle task")
  }
}
