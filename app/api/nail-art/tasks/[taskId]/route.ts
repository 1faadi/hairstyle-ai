import { getAILabTask } from "@/lib/ailab"
import { HttpError } from "@/lib/hairstyle/errors"
import { createErrorResponse } from "@/lib/hairstyle/http"
import { parseProviderTaskId } from "@/lib/hairstyle/provider-task"
import {
  consumeGuestCreditOnSuccess,
  getQuotaForGenerationJob,
  resolveRequestQuotaContext,
  updateGenerationJobStatus,
} from "@/lib/hairstyle/quota"

export const runtime = "nodejs"

type RouteContext = {
  params: Promise<{ taskId: string }>
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { taskId: scopedTaskId } = await context.params
    const parsed = parseProviderTaskId(scopedTaskId)
    if (parsed.feature !== "nail" || parsed.provider !== "ailab") {
      throw new HttpError(400, "Invalid nail art task id")
    }

    const task = await getAILabTask(parsed.taskId)
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
          ? `/api/nail-art/tasks/${encodeURIComponent(scopedTaskId)}/result`
          : null,
      quota,
    })
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch nail art task")
  }
}
