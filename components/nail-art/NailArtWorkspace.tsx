/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Download,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { HairstyleTaskStatus } from "@/lib/hairstyle/constants"
import { createBearerAuthHeaders } from "@/lib/hairstyle/auth-headers"
import { getTaskPollDelayMs } from "@/lib/hairstyle/poll-delay"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"
import type {
  QuotaSnapshot,
  TaskResponse,
  TaskStatusResponse,
} from "@/lib/hairstyle/types"

const MAX_POLL_ATTEMPTS = 72

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: unknown }
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error
    }
  } catch {
    // Ignore parse errors and fallback to status text below.
  }

  return `Request failed (${response.status})`
}

function createObjectPreview(file: File | null) {
  return file ? URL.createObjectURL(file) : null
}

function getReadableStatus(status: HairstyleTaskStatus | null): string {
  switch (status) {
    case "starting":
      return "Queued..."
    case "processing":
      return "Generating nail art..."
    case "succeeded":
      return "Generation complete."
    case "failed":
      return "Generation failed."
    case "canceled":
      return "Generation canceled."
    default:
      return "Ready to generate."
  }
}

export function NailArtWorkspace() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [quota, setQuota] = useState<QuotaSnapshot | null>(null)

  const [targetFile, setTargetFile] = useState<File | null>(null)
  const [targetPreview, setTargetPreview] = useState<string | null>(null)
  const [nailName, setNailName] = useState("")
  const [nailDescription, setNailDescription] = useState("")

  const [taskId, setTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<HairstyleTaskStatus | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  const pollTokenRef = useRef(0)

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => {
      setAccessToken(data.session?.access_token ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccessToken(session?.access_token ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [supabase])

  const authHeaders = useCallback(
    (): HeadersInit => createBearerAuthHeaders(accessToken),
    [accessToken]
  )

  useEffect(() => {
    let canceled = false
    fetch("/api/nail-art/quota", { cache: "no-store", headers: authHeaders() })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { quota?: QuotaSnapshot } | null) => {
        if (!canceled && data?.quota) setQuota(data.quota)
      })
      .catch((err: unknown) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("[NailArtWorkspace] Quota fetch failed", err)
        }
      })

    return () => {
      canceled = true
    }
  }, [authHeaders])

  useEffect(() => {
    const preview = createObjectPreview(targetFile)
    setTargetPreview(preview)

    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [targetFile])

  useEffect(() => {
    return () => {
      pollTokenRef.current += 1
    }
  }, [])

  async function pollTaskStatus(nextTaskId: string, token: number) {
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
      if (pollTokenRef.current !== token) return

      const response = await fetch(`/api/nail-art/tasks/${encodeURIComponent(nextTaskId)}`, {
        cache: "no-store",
        headers: authHeaders(),
      })

      if (!response.ok) {
        throw new Error(await getErrorMessage(response))
      }

      const data = (await response.json()) as TaskStatusResponse
      if (pollTokenRef.current !== token) return

      if (data.quota) setQuota(data.quota)
      setTaskStatus(data.status)

      if (data.status === "succeeded" && data.resultPath) {
        setResultUrl(`${data.resultPath}?t=${Date.now()}`)
        setErrorMessage(null)
        return
      }

      if (data.status === "failed" || data.status === "canceled") {
        setErrorMessage(data.error || "Generation failed. Please adjust your prompt and try again.")
        return
      }

      await sleep(getTaskPollDelayMs(attempt))
    }

    throw new Error("Generation timed out. Please try again.")
  }

  async function handleGenerate() {
    if (!targetFile) {
      setErrorMessage("Please upload a source hand photo first.")
      return
    }

    if (!nailName.trim()) {
      setErrorMessage("Please enter a nail design name.")
      return
    }

    if (!nailDescription.trim()) {
      setErrorMessage("Please enter a nail design description.")
      return
    }

    setIsGenerating(true)
    setErrorMessage(null)
    setResultUrl(null)
    setTaskId(null)
    setTaskStatus("starting")

    pollTokenRef.current += 1
    const token = pollTokenRef.current

    try {
      const formData = new FormData()
      formData.append("targetImage", targetFile)
      formData.append("nailName", nailName.trim())
      formData.append("nailDescription", nailDescription.trim())

      const response = await fetch("/api/nail-art/tasks", {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      })

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
          error?: string
          requiresAuth?: boolean
        }

        if (body.requiresAuth) {
          setErrorMessage(
            "You've used all 3 shared guest credits (AI Hair + AI Nail Art). Sign in for unlimited generations."
          )
          return
        }

        throw new Error(body.error || `Request failed (${response.status})`)
      }

      const data = (await response.json()) as TaskResponse
      setQuota(data.quota)
      setTaskId(data.taskId)
      setTaskStatus(data.status)

      await pollTaskStatus(data.taskId, token)
    } catch (error) {
      if (pollTokenRef.current === token) {
        const message =
          error instanceof Error ? error.message : "Failed to generate nail art result"
        setErrorMessage(message)
      }
    } finally {
      if (pollTokenRef.current === token) {
        setIsGenerating(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "gap-2 shrink-0",
              })}
            >
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
            <ThemeToggle />
          </div>

          <div className="min-w-0 text-right">
            <p className="text-xs text-muted-foreground">
              Supported: JPG, PNG, WEBP up to 10MB
            </p>
            <p className="text-xs font-medium text-foreground">
              {quota?.mode === "user"
                ? "Credits: Unlimited"
                : `Free credits left (shared): ${quota?.remaining ?? "--"}/3`}
            </p>
            <p className="text-[11px] text-muted-foreground">Shared across AI Hair + AI Nail Art</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-border/70 bg-card/90">
            <CardHeader>
              <CardTitle className="text-2xl">Try AI Nail Art</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="space-y-2">
                <h2 className="text-sm font-semibold">1. Upload Source Hand Photo</h2>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setTargetFile(event.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-semibold">2. Nail Design Name</h2>
                <input
                  type="text"
                  maxLength={500}
                  value={nailName}
                  onChange={(event) => setNailName(event.target.value)}
                  placeholder="Golden Butterfly Glow"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <p className="text-xs text-muted-foreground">{nailName.length}/500</p>
              </section>

              <section className="space-y-3">
                <h2 className="text-sm font-semibold">3. Nail Design Description</h2>
                <textarea
                  maxLength={1000}
                  value={nailDescription}
                  onChange={(event) => setNailDescription(event.target.value)}
                  placeholder="Champagne nude shimmer with gold butterfly accents for a soft, luxe finish."
                  className="min-h-28 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <p className="text-xs text-muted-foreground">{nailDescription.length}/1000</p>
              </section>

              <section className="space-y-3">
                {quota?.mode === "guest" && (
                  <div
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      quota.requiresAuth
                        ? "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
                    }`}
                  >
                    {quota.requiresAuth ? (
                      <p className="flex items-center gap-2">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>
                          Guest limit reached.{" "}
                          <Link
                            href="/auth?next=/nail-art"
                            className="font-semibold underline underline-offset-2"
                          >
                            Sign in
                          </Link>{" "}
                          for unlimited generations across AI Hair + AI Nail Art.
                        </span>
                      </p>
                    ) : (
                      <p>
                        <span className="font-medium">
                          {quota.remaining} shared guest credit
                          {quota.remaining === 1 ? "" : "s"} remaining.
                        </span>{" "}
                        <Link
                          href="/auth?next=/nail-art"
                          className="underline underline-offset-2"
                        >
                          Sign in
                        </Link>{" "}
                        for unlimited access to AI Hair + AI Nail Art.
                      </p>
                    )}
                  </div>
                )}

                <Button
                  type="button"
                  size="lg"
                  className="h-11 w-full gap-2"
                  disabled={isGenerating || quota?.requiresAuth === true}
                  onClick={handleGenerate}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Generate Nail Art
                    </>
                  )}
                </Button>

                <div className="rounded-lg border border-border/70 bg-secondary/30 px-3 py-2 text-sm">
                  <p className="flex items-center gap-2">
                    {taskStatus === "succeeded" ? (
                      <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                    ) : taskStatus === "failed" || taskStatus === "canceled" ? (
                      <AlertCircle className="size-4 text-destructive" />
                    ) : isGenerating ? (
                      <Loader2 className="size-4 animate-spin text-primary" />
                    ) : (
                      <Upload className="size-4 text-muted-foreground" />
                    )}
                    <span>{getReadableStatus(taskStatus)}</span>
                  </p>
                  {taskId && (
                    <p className="mt-1 text-xs text-muted-foreground">Task ID: {taskId}</p>
                  )}
                </div>

                {errorMessage && (
                  <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {errorMessage}
                  </p>
                )}
              </section>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90">
            <CardHeader>
              <CardTitle className="text-2xl">Result Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Source</p>
                  <div className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary/40">
                    {targetPreview ? (
                      <img
                        src={targetPreview}
                        alt="Uploaded source hand preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
                        Upload your source photo to preview it here.
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Prompt</p>
                  <div className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary/40">
                    <div className="flex h-full flex-col gap-2 overflow-auto p-4 text-sm">
                      <p className="font-semibold text-foreground">
                        {nailName.trim() || "No design name yet"}
                      </p>
                      <p className="text-muted-foreground">
                        {nailDescription.trim() || "Add a detailed description to guide the generated result."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Generated Nail Art</p>
                <div className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary/40">
                  {resultUrl ? (
                    <img
                      src={resultUrl}
                      alt="Generated nail art preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
                      Generated result appears here.
                    </div>
                  )}
                </div>
              </div>

              {resultUrl && (
                <a
                  href={`${resultUrl}&download=1`}
                  className={buttonVariants({
                    size: "lg",
                    className: "h-11 w-full gap-2",
                  })}
                >
                  <Download className="size-4" />
                  Download Result
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
