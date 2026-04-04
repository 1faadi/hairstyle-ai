/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Download,
  Loader2,
  Upload,
  Wand2,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { HairstyleTaskStatus } from "@/lib/hairstyle/constants"
import type {
  HairstylePreset,
  TaskResponse,
  TaskStatusResponse,
} from "@/lib/hairstyle/types"

const POLL_INTERVAL_MS = 2500
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
      return "Starting generation..."
    case "processing":
      return "Applying hairstyle..."
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

export function TryOnWorkspace() {
  const [presets, setPresets] = useState<HairstylePreset[]>([])
  const [presetsLoading, setPresetsLoading] = useState(true)
  const [presetsError, setPresetsError] = useState<string | null>(null)

  const [sourceMode, setSourceMode] = useState<"preset" | "custom">("preset")
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [targetFile, setTargetFile] = useState<File | null>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)

  const [targetPreview, setTargetPreview] = useState<string | null>(null)
  const [sourcePreview, setSourcePreview] = useState<string | null>(null)

  const [taskId, setTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<HairstyleTaskStatus | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  const pollTokenRef = useRef(0)

  const selectedPreset = useMemo(
    () => presets.find((preset) => preset.id === selectedPresetId) ?? null,
    [presets, selectedPresetId]
  )

  useEffect(() => {
    let canceled = false

    const loadPresets = async () => {
      setPresetsLoading(true)
      setPresetsError(null)

      try {
        const response = await fetch("/api/hairstyle/presets", { cache: "no-store" })
        if (!response.ok) {
          throw new Error(await getErrorMessage(response))
        }

        const data = (await response.json()) as { presets?: HairstylePreset[] }
        const nextPresets = Array.isArray(data.presets) ? data.presets : []

        if (canceled) return

        setPresets(nextPresets)
        setSelectedPresetId(nextPresets[0]?.id ?? null)

        if (nextPresets.length === 0) {
          setSourceMode("custom")
        }
      } catch (error) {
        if (canceled) return
        const message =
          error instanceof Error ? error.message : "Failed to load hairstyle presets"
        setPresetsError(message)
      } finally {
        if (!canceled) setPresetsLoading(false)
      }
    }

    void loadPresets()

    return () => {
      canceled = true
    }
  }, [])

  useEffect(() => {
    const preview = createObjectPreview(targetFile)
    setTargetPreview(preview)

    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [targetFile])

  useEffect(() => {
    const preview = createObjectPreview(sourceFile)
    setSourcePreview(preview)

    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [sourceFile])

  useEffect(() => {
    return () => {
      pollTokenRef.current += 1
    }
  }, [])

  async function pollTaskStatus(nextTaskId: string, token: number) {
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
      if (pollTokenRef.current !== token) return

      const response = await fetch(`/api/hairstyle/tasks/${encodeURIComponent(nextTaskId)}`, {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(await getErrorMessage(response))
      }

      const data = (await response.json()) as TaskStatusResponse

      if (pollTokenRef.current !== token) return

      setTaskStatus(data.status)

      if (data.status === "succeeded" && data.resultPath) {
        setResultUrl(`${data.resultPath}?t=${Date.now()}`)
        setErrorMessage(null)
        return
      }

      if (data.status === "failed" || data.status === "canceled") {
        setErrorMessage(data.error || "Generation failed. Please try another image.")
        return
      }

      await sleep(POLL_INTERVAL_MS)
    }

    throw new Error("Generation timed out. Please try again.")
  }

  async function handleGenerate() {
    if (!targetFile) {
      setErrorMessage("Please upload your photo first.")
      return
    }

    if (sourceMode === "preset" && !selectedPreset) {
      setErrorMessage("Please choose a hairstyle preset.")
      return
    }

    if (sourceMode === "custom" && !sourceFile) {
      setErrorMessage("Please upload a hairstyle reference image.")
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

      if (sourceMode === "preset" && selectedPreset) {
        formData.append("sourcePresetUrl", selectedPreset.sourceUrl)
      } else if (sourceMode === "custom" && sourceFile) {
        formData.append("sourceImage", sourceFile)
      }

      const response = await fetch("/api/hairstyle/tasks", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(await getErrorMessage(response))
      }

      const data = (await response.json()) as TaskResponse
      setTaskId(data.taskId)
      setTaskStatus(data.status)

      await pollTaskStatus(data.taskId, token)
    } catch (error) {
      if (pollTokenRef.current === token) {
        const message =
          error instanceof Error ? error.message : "Failed to generate hairstyle result"
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
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "gap-2",
            })}
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>

          <p className="text-xs text-muted-foreground">Supported: JPG, PNG, WEBP up to 10MB</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-border/70 bg-card/90">
            <CardHeader>
              <CardTitle className="text-2xl">Try a New Hairstyle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="space-y-2">
                <h2 className="text-sm font-semibold">1. Upload Your Photo</h2>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setTargetFile(event.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </section>

              <section className="space-y-3">
                <h2 className="text-sm font-semibold">2. Choose Hairstyle Source</h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={sourceMode === "preset" ? "default" : "outline"}
                    size="sm"
                    disabled={presets.length === 0}
                    onClick={() => setSourceMode("preset")}
                  >
                    Preset Gallery
                  </Button>
                  <Button
                    type="button"
                    variant={sourceMode === "custom" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSourceMode("custom")}
                  >
                    Custom Upload
                  </Button>
                </div>

                {sourceMode === "preset" && (
                  <div className="space-y-2">
                    {presetsLoading && (
                      <p className="text-sm text-muted-foreground">Loading presets...</p>
                    )}
                    {presetsError && (
                      <p className="text-sm text-destructive">
                        Could not load presets: {presetsError}
                      </p>
                    )}
                    {!presetsLoading && presets.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No curated presets found. Switch to Custom Upload to continue.
                      </p>
                    )}
                    {!presetsLoading && presets.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {presets.map((preset) => {
                          const isActive = preset.id === selectedPresetId
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setSelectedPresetId(preset.id)}
                              className={cn(
                                "overflow-hidden rounded-lg border text-left transition-colors",
                                isActive
                                  ? "border-primary ring-2 ring-primary/30"
                                  : "border-border hover:border-primary/40"
                              )}
                            >
                              <img
                                src={preset.thumbnailUrl}
                                alt={preset.name}
                                className="h-24 w-full object-cover"
                              />
                              <div className="px-2 py-1.5 text-xs font-medium">{preset.name}</div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {sourceMode === "custom" && (
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => setSourceFile(event.target.files?.[0] ?? null)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                )}
              </section>

              <section className="space-y-3">
                <Button
                  type="button"
                  size="lg"
                  className="h-11 w-full gap-2"
                  disabled={isGenerating}
                  onClick={handleGenerate}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="size-4" />
                      Generate Hairstyle
                    </>
                  )}
                </Button>

                <div className="rounded-lg border border-border/70 bg-secondary/30 px-3 py-2 text-sm">
                  <p className="flex items-center gap-2">
                    {taskStatus === "succeeded" ? (
                      <CheckCircle2 className="size-4 text-green-600" />
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
                  <p className="text-sm font-medium">Before</p>
                  <div className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary/40">
                    {targetPreview ? (
                      <img
                        src={targetPreview}
                        alt="Uploaded target preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
                        Upload your photo to preview it here.
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">After</p>
                  <div className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary/40">
                    {resultUrl ? (
                      <img
                        src={resultUrl}
                        alt="Generated hairstyle preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
                        Generated result appears here.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {sourceMode === "custom" && sourcePreview && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Custom Hairstyle Reference</p>
                  <div className="max-w-[200px] overflow-hidden rounded-lg border border-border">
                    <img
                      src={sourcePreview}
                      alt="Custom hairstyle reference"
                      className="h-32 w-full object-cover"
                    />
                  </div>
                </div>
              )}

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
