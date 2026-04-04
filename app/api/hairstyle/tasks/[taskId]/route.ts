import { createErrorResponse } from "@/lib/hairstyle/http"
import { getAILabTask } from "@/lib/ailab"

export const runtime = "nodejs"

type RouteContext = {
  params: Promise<{ taskId: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { taskId } = await context.params
    const task = await getAILabTask(taskId)

    return Response.json({
      taskId: task.taskId,
      status: task.status,
      error: task.error,
      resultPath:
        task.status === "succeeded"
          ? `/api/hairstyle/tasks/${encodeURIComponent(task.taskId)}/result`
          : null,
    })
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch hairstyle task")
  }
}
