/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"
import { type ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CircleDollarSign,
  CloudUpload,
  Download,
  Loader2,
  Upload,
  Wand2,
} from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { MAX_UPLOAD_BYTES, type HairstyleTaskStatus } from "@/lib/hairstyle/constants"
import type {
  HairstylePreset,
  QuotaSnapshot,
  TaskResponse,
  TaskStatusResponse,
} from "@/lib/hairstyle/types"
import { AILAB_PRESET_CATALOG } from "@/lib/hairstyle/ailab-presets"
import { createBearerAuthHeaders } from "@/lib/hairstyle/auth-headers"
import { CELEBRITY_PORTRAITS, type CelebrityRegion } from "@/lib/hairstyle/celebrities"
import { getTaskPollDelayMs } from "@/lib/hairstyle/poll-delay"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"
import { toast } from "sonner"

const TARGET_UPLOAD_INPUT_ID = "try-on-target-upload"

const MAX_POLL_ATTEMPTS = 72

const GENERATION_ERROR_TOAST_MS = 7000

function notifyGenerationError(message: string): void {
  toast.error("Couldn't generate hairstyle", {
    description: message,
    duration: GENERATION_ERROR_TOAST_MS,
  })
}

const LOCAL_PRESET_SHELLS: HairstylePreset[] = AILAB_PRESET_CATALOG.map((item) => ({
  id: item.id,
  name: item.name,
  hairStyle: item.hairStyle,
  gender: item.gender,
  thumbnailUrl: null,
}))

type HairColorOption = {
  value: string
  label: string
  description: string
  swatch: string
}

const HAIR_COLOR_OPTIONS: HairColorOption[] = [
  { value: "blonde", label: "Blonde", description: "Blonde hair", swatch: "#f0d59a" },
  { value: "platinumBlonde", label: "Platinum Blonde", description: "Platinum blonde hair", swatch: "#f4efdf" },
  { value: "brown", label: "Brown", description: "Brown hair", swatch: "#6b4423" },
  { value: "lightBrown", label: "Light Brown", description: "Light brown hair", swatch: "#a16b47" },
  { value: "blue", label: "Blue", description: "Blue hair", swatch: "#2563eb" },
  { value: "lightBlue", label: "Light Blue", description: "Light blue hair", swatch: "#7dd3fc" },
  { value: "purple", label: "Purple", description: "Purple hair", swatch: "#7e22ce" },
  { value: "lightPurple", label: "Light Purple", description: "Light purple hair", swatch: "#c4b5fd" },
  { value: "pink", label: "Pink", description: "Pink hair", swatch: "#ec4899" },
  { value: "black", label: "Black", description: "Black hair", swatch: "#111827" },
  { value: "white", label: "White", description: "White hair", swatch: "#f8fafc" },
  { value: "grey", label: "Grey", description: "Grey hair", swatch: "#9ca3af" },
  { value: "silver", label: "Silver", description: "Silver hair", swatch: "#c0c0c0" },
  { value: "red", label: "Red", description: "Red hair", swatch: "#dc2626" },
  { value: "orange", label: "Orange", description: "Orange hair", swatch: "#f97316" },
  { value: "green", label: "Green", description: "Green hair", swatch: "#16a34a" },
  {
    value: "gradient",
    label: "Gradient",
    description: "Gradient hair",
    swatch: "linear-gradient(135deg, #f97316 0%, #eab308 30%, #16a34a 60%, #2563eb 100%)",
  },
  {
    value: "multicolored",
    label: "Multicolored",
    description: "Multicolored hair",
    swatch: "conic-gradient(from 45deg, #dc2626, #f97316, #eab308, #16a34a, #2563eb, #7e22ce, #ec4899, #dc2626)",
  },
  { value: "darkBlue", label: "Dark Blue", description: "Dark blue hair", swatch: "#1e3a8a" },
  { value: "burgundy", label: "Burgundy", description: "Burgundy hair", swatch: "#7f1d1d" },
  { value: "darkGreen", label: "Dark Green", description: "Dark green hair", swatch: "#14532d" },
]

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
      return "Applying selected style..."
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

const PRESET_CATEGORY_IDS = ["all", "short", "medium", "long", "curly", "straight"] as const

type PresetCategoryId = (typeof PRESET_CATEGORY_IDS)[number]

/** Client-side UX filter only — matches preset names / API style keys to category chips. */
function presetMatchesCategory(preset: HairstylePreset, category: PresetCategoryId): boolean {
  if (category === "all") return true
  const text = `${preset.name} ${preset.hairStyle}`.toLowerCase()

  switch (category) {
    case "short":
      return /\b(short|pixie|buzz|fade|bowl|crop|spiky|faux|comb|two block|blunt|pageboy|pigtail|space bun|stacked|graduated|twintail|neat bob|pixie)\b/i.test(
        text
      )
    case "long":
      return /\b(long|ponytail|braid|dread|man bun|hime|curtain|fishtail|cornrow|box braid|locks|tail|length|afro)\b/i.test(
        text
      )
    case "curly":
      return /\b(curly|afro|wave|wavy|perm|shag|spiral|curl|loose)\b/i.test(text)
    case "straight":
      return /\b(straight|sleek|slick|smooth)\b/i.test(text)
    case "medium":
      return /\b(bob|shoulder|lob|chignon|updo|fringe|layer|french|messy|middle|side part|comb-?over|wavy french|ballerina|finger)\b/i.test(
        text
      )
    default:
      return true
  }
}

function validateTargetImageFile(file: File): string | null {
  if (file.type !== "image/jpeg" && file.type !== "image/png") {
    return "Please use a JPG or PNG image."
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "Image must be 5MB or smaller."
  }
  return null
}

type CreditPillProps = {
  quota: QuotaSnapshot | null
}

function CreditPill({ quota }: CreditPillProps): ReactElement {
  const displayText =
    quota === null
      ? "--/3"
      : quota.mode === "user"
        ? "∞"
        : `${quota.remaining ?? "--"}/3`

  const label =
    quota === null
      ? "Loading shared guest credits for AI Hair and AI Nail Art."
      : quota.mode === "user"
        ? "Unlimited credits when signed in."
        : typeof quota.remaining === "number"
          ? `Shared guest credits for AI Hair and AI Nail Art, ${quota.remaining} of 3 remaining.`
          : "Shared guest credits for AI Hair and AI Nail Art."

  return (
    <div
      role="status"
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-100/90 px-3 py-1.5 dark:border-blue-800/60 dark:bg-blue-950/50"
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-sky-500"
        aria-hidden
      >
        <CircleDollarSign className="size-4" strokeWidth={2.25} />
      </span>
      <span className="text-base font-semibold tabular-nums text-blue-900 dark:text-blue-100">
        {displayText}
      </span>
    </div>
  )
}

export function TryOnWorkspace() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [quota, setQuota] = useState<QuotaSnapshot | null>(null)

  const [presets, setPresets] = useState<HairstylePreset[]>(LOCAL_PRESET_SHELLS)
  const [presetGender, setPresetGender] = useState<"male" | "female">("female")
  const [loadedPresetIds, setLoadedPresetIds] = useState<Set<string>>(new Set())
  const [brokenPresetIds, setBrokenPresetIds] = useState<Set<string>>(new Set())
  const [presetsLoading, setPresetsLoading] = useState(true)
  const [presetsError, setPresetsError] = useState<string | null>(null)

  const [styleMode, setStyleMode] = useState<"preset" | "custom" | "celebrity">("preset")
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    LOCAL_PRESET_SHELLS[0]?.id ?? null
  )
  const [customSourceFile, setCustomSourceFile] = useState<File | null>(null)
  const [customSourcePreview, setCustomSourcePreview] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState("")
  const [targetFile, setTargetFile] = useState<File | null>(null)
  const [targetPreview, setTargetPreview] = useState<string | null>(null)

  const [taskId, setTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<HairstyleTaskStatus | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [presetCategory, setPresetCategory] = useState<PresetCategoryId>("all")
  const [targetUploadError, setTargetUploadError] = useState<string | null>(null)
  const [customUploadError, setCustomUploadError] = useState<string | null>(null)
  const [isDraggingTarget, setIsDraggingTarget] = useState(false)
  const [celebrityRegionFilter, setCelebrityRegionFilter] = useState<"all" | CelebrityRegion>("all")
  const [selectedCelebrityReferenceId, setSelectedCelebrityReferenceId] = useState<string | null>(null)
  const [celebrityReferenceFile, setCelebrityReferenceFile] = useState<File | null>(null)
  const [celebrityReferencePreview, setCelebrityReferencePreview] = useState<string | null>(null)
  const [loadingCelebrityId, setLoadingCelebrityId] = useState<string | null>(null)

  const pollTokenRef = useRef(0)
  const targetFileInputRef = useRef<HTMLInputElement>(null)
  const customFileInputRef = useRef<HTMLInputElement>(null)

  // Sync Supabase session token so API calls can authenticate the user
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

  // Load quota on mount (and whenever auth state changes)
  useEffect(() => {
    let canceled = false
    fetch("/api/hairstyle/quota", { cache: "no-store", headers: authHeaders() })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { quota?: QuotaSnapshot } | null) => {
        if (!canceled && data?.quota) setQuota(data.quota)
      })
      .catch((err: unknown) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("[TryOnWorkspace] Quota fetch failed", err)
        }
      })
    return () => {
      canceled = true
    }
  }, [authHeaders])

  const selectedPreset = useMemo(
    () => presets.find((preset) => preset.id === selectedPresetId) ?? null,
    [presets, selectedPresetId]
  )

  const filteredPresets = useMemo(() => {
    return presets.filter((preset) => preset.gender === presetGender)
  }, [presets, presetGender])

  const displayPresets = useMemo(() => {
    return filteredPresets.filter((preset) => presetMatchesCategory(preset, presetCategory))
  }, [filteredPresets, presetCategory])

  useEffect(() => {
    if (filteredPresets.length === 0) return
    const pool = displayPresets.length > 0 ? displayPresets : filteredPresets
    const isSelectedVisible = pool.some((preset) => preset.id === selectedPresetId)
    if (!isSelectedVisible) {
      setSelectedPresetId(pool[0].id)
    }
  }, [filteredPresets, displayPresets, selectedPresetId])

  const filteredCelebrityPortraits = useMemo(() => {
    if (celebrityRegionFilter === "all") return [...CELEBRITY_PORTRAITS]
    return CELEBRITY_PORTRAITS.filter((p) => p.region === celebrityRegionFilter)
  }, [celebrityRegionFilter])

  function assignTargetFile(file: File | null): void {
    setTargetUploadError(null)
    if (!file) {
      setTargetFile(null)
      setResultUrl(null)
      return
    }
    const err = validateTargetImageFile(file)
    if (err) {
      setTargetUploadError(err)
      return
    }
    setTargetFile(file)
    setResultUrl(null)
  }

  async function applyCelebrityReference(portrait: (typeof CELEBRITY_PORTRAITS)[number]): Promise<void> {
    setLoadingCelebrityId(portrait.id)
    try {
      const response = await fetch(portrait.imageSrc, { cache: "force-cache" })
      if (!response.ok) {
        throw new Error(`Could not load image (${response.status})`)
      }
      const blob = await response.blob()
      const mime = blob.type === "image/png" || blob.type === "image/jpeg" ? blob.type : "image/jpeg"
      const extension = mime === "image/png" ? "png" : "jpg"
      const file = new File([blob], `${portrait.id}-reference.${extension}`, { type: mime })
      const validationError = validateTargetImageFile(file)
      if (validationError) {
        toast.error("Couldn’t use this reference photo", {
          description: validationError,
          duration: 6000,
        })
        return
      }
      setSelectedCelebrityReferenceId(portrait.id)
      setCelebrityReferenceFile(file)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error while loading portrait"
      toast.error("Couldn’t load celebrity photo", {
        description: message,
        duration: 6000,
      })
    } finally {
      setLoadingCelebrityId(null)
    }
  }

  function assignCustomFile(file: File | null): void {
    setCustomUploadError(null)
    if (!file) {
      setCustomSourceFile(null)
      return
    }
    const err = validateTargetImageFile(file)
    if (err) {
      setCustomUploadError(err)
      return
    }
    setCustomSourceFile(file)
  }

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
        setLoadedPresetIds(new Set())
        setBrokenPresetIds(new Set())
        setSelectedPresetId((current) => {
          if (current && nextPresets.some((preset) => preset.id === current)) {
            return current
          }
          return nextPresets[0]?.id ?? null
        })
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
    const preview = createObjectPreview(customSourceFile)
    setCustomSourcePreview(preview)

    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [customSourceFile])

  useEffect(() => {
    const preview = createObjectPreview(celebrityReferenceFile)
    setCelebrityReferencePreview(preview)

    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [celebrityReferenceFile])

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
        return
      }

      if (data.status === "failed" || data.status === "canceled") {
        notifyGenerationError(
          data.error || "Generation failed. Please try another style."
        )
        return
      }

      await sleep(getTaskPollDelayMs(attempt))
    }

    throw new Error("Generation timed out. Please try again.")
  }

  async function handleGenerate() {
    if (!targetFile) {
      notifyGenerationError("Please upload your photo first.")
      return
    }

    if (styleMode === "preset" && !selectedPreset) {
      notifyGenerationError("Please choose a hairstyle preset.")
      return
    }
    if (styleMode === "custom" && !customSourceFile) {
      notifyGenerationError("Please upload a custom hairstyle reference image.")
      return
    }
    if (styleMode === "celebrity" && !celebrityReferenceFile) {
      notifyGenerationError("Please choose a celebrity hairstyle reference.")
      return
    }

    setIsGenerating(true)
    setResultUrl(null)
    setTaskId(null)
    setTaskStatus("starting")

    pollTokenRef.current += 1
    const token = pollTokenRef.current

    try {
      const formData = new FormData()
      formData.append("targetImage", targetFile)

      if (styleMode === "custom" && customSourceFile) {
        formData.append("sourceImage", customSourceFile)
      } else if (styleMode === "celebrity" && celebrityReferenceFile) {
        formData.append("sourceImage", celebrityReferenceFile)
      } else if (selectedPreset) {
        formData.append("hairStyle", selectedPreset.hairStyle)
        formData.append("imageSize", "1")
        if (selectedColor.trim()) {
          formData.append("color", selectedColor.trim())
        }
      }

      const response = await fetch("/api/hairstyle/tasks", {
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
          notifyGenerationError(
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
          error instanceof Error ? error.message : "Failed to generate hairstyle result"
        notifyGenerationError(message)
      }
    } finally {
      if (pollTokenRef.current === token) {
        setIsGenerating(false)
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="try-on-ambient-layer" aria-hidden>
        <div
          className="try-on-ambient-blob bg-primary/25 dark:bg-primary/20"
          style={{
            top: "-15%",
            left: "5%",
            width: "min(42rem, 90vw)",
            height: "min(36rem, 55vh)",
          }}
        />
        <div
          className="try-on-ambient-blob try-on-ambient-blob--b bg-accent/20 dark:bg-accent/15"
          style={{
            bottom: "-10%",
            right: "0%",
            width: "min(38rem, 85vw)",
            height: "min(32rem, 50vh)",
          }}
        />
      </div>
      <main className="relative z-10 mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
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

          <div className="flex min-w-0 shrink-0 items-center justify-end">
            <CreditPill quota={quota} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">
          <Card className="min-w-0 border-border/70 bg-card/90 lg:col-span-7">
            <CardHeader>
              <CardTitle className="text-2xl">{resultUrl ? "Your result" : "Upload your photo"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                id={TARGET_UPLOAD_INPUT_ID}
                ref={targetFileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="sr-only"
                onChange={(event) => assignTargetFile(event.target.files?.[0] ?? null)}
              />

              {!targetPreview ? (
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      targetFileInputRef.current?.click()
                    }
                  }}
                  onClick={() => targetFileInputRef.current?.click()}
                  onDragOver={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setIsDraggingTarget(true)
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setIsDraggingTarget(false)
                  }}
                  onDrop={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setIsDraggingTarget(false)
                    const file = event.dataTransfer.files?.[0]
                    if (file) assignTargetFile(file)
                  }}
                  className={cn(
                    "relative flex min-h-[min(50vh,22rem)] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-6 text-center transition-colors",
                    isDraggingTarget
                      ? "border-primary bg-primary/5"
                      : "border-border/80 bg-secondary/15 hover:border-primary/40 hover:bg-secondary/25"
                  )}
                >
                  <div className="relative z-10 flex max-w-sm flex-col items-center gap-3">
                    <CloudUpload className="size-12 text-muted-foreground" aria-hidden />
                    <p className="text-sm font-medium text-foreground">
                      Drag and drop your photo here, or tap to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Clear face, good lighting — JPG or PNG, max 5MB
                    </p>
                    <span
                      className={buttonVariants({
                        size: "default",
                        className: "pointer-events-none mt-1 gap-2",
                      })}
                    >
                      <Upload className="size-4" />
                      Upload
                    </span>
                  </div>
                </div>
              ) : null}

              {targetPreview ? (
                <>
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        targetFileInputRef.current?.click()
                      }
                    }}
                    onClick={() => targetFileInputRef.current?.click()}
                    onDragOver={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      setIsDraggingTarget(true)
                    }}
                    onDragLeave={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      setIsDraggingTarget(false)
                    }}
                    onDrop={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      setIsDraggingTarget(false)
                      const file = event.dataTransfer.files?.[0]
                      if (file) assignTargetFile(file)
                    }}
                    className={cn(
                      "relative w-full cursor-pointer overflow-hidden rounded-xl border-2 transition-colors",
                      isDraggingTarget
                        ? "border-primary bg-primary/5"
                        : "border-solid border-border/80 hover:border-primary/40"
                    )}
                  >
                    <div className="aspect-square w-full overflow-hidden bg-secondary/40">
                      <img
                        src={resultUrl ?? targetPreview}
                        alt={
                          resultUrl
                            ? "Generated hairstyle preview"
                            : "Your uploaded portrait preview"
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  {resultUrl ? (
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
                  ) : (
                    <p className="text-center text-xs text-muted-foreground">
                      Tap or drop another photo to replace
                    </p>
                  )}
                </>
              ) : null}
              {targetUploadError ? (
                <p className="text-sm text-destructive" role="alert">
                  {targetUploadError}
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="flex min-h-0 min-w-0 flex-col border-border/70 bg-card/90 lg:col-span-5">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl">Style &amp; generate</CardTitle>
              <p className="text-sm text-muted-foreground">
                Upload your portrait on the left, then pick how we match the hairstyle: preset, your own
                reference photo, or a celebrity look.
              </p>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-5">
              <div
                className="inline-flex w-full max-w-full rounded-lg border border-border bg-muted/40 p-1"
                role="group"
                aria-label="Style source"
              >
                <button
                  type="button"
                  onClick={() => setStyleMode("preset")}
                  className={cn(
                    "min-h-11 min-w-0 flex-1 rounded-md px-2 py-2 text-sm font-medium transition-colors sm:min-h-10 sm:px-3",
                    styleMode === "preset"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Preset
                </button>
                <button
                  type="button"
                  onClick={() => setStyleMode("custom")}
                  className={cn(
                    "min-h-11 min-w-0 flex-1 rounded-md px-2 py-2 text-sm font-medium transition-colors sm:min-h-10 sm:px-3",
                    styleMode === "custom"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Custom
                </button>
                <button
                  type="button"
                  onClick={() => setStyleMode("celebrity")}
                  className={cn(
                    "min-h-11 min-w-0 flex-1 rounded-md px-2 py-2 text-sm font-medium transition-colors sm:min-h-10 sm:px-3",
                    styleMode === "celebrity"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Celebrity
                </button>
              </div>

              {presetsLoading ? (
                <p className="text-sm text-muted-foreground">Loading presets...</p>
              ) : null}
              {presetsError ? (
                <p className="text-sm text-destructive">Could not load presets: {presetsError}</p>
              ) : null}

              {styleMode === "preset" && presets.length > 0 ? (
                <div
                  className="inline-flex w-full max-w-full rounded-lg border border-border bg-muted/40 p-1"
                  role="group"
                  aria-label="Preset gender"
                >
                  <button
                    type="button"
                    onClick={() => setPresetGender("female")}
                    className={cn(
                      "min-h-11 flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors sm:min-h-10",
                      presetGender === "female"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Women
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetGender("male")}
                    className={cn(
                      "min-h-11 flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors sm:min-h-10",
                      presetGender === "male"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Men
                  </button>
                </div>
              ) : null}

              {styleMode === "preset" && !presetsLoading && presets.length > 0 ? (
                <div className="flex flex-wrap gap-2" role="group" aria-label="Preset length or type">
                  {PRESET_CATEGORY_IDS.map((id) => {
                    const label =
                      id === "all"
                        ? "All"
                        : id.charAt(0).toUpperCase() + id.slice(1)
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPresetCategory(id)}
                        className={cn(
                          "min-h-10 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:min-h-9",
                          presetCategory === id
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        )}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              ) : null}

              <div className="min-h-0 flex-1 space-y-3">
                {styleMode === "preset" && !presetsLoading && presets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No AILab presets available right now.</p>
                ) : null}
                {styleMode === "preset" &&
                !presetsLoading &&
                presets.length > 0 &&
                filteredPresets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No presets available for this filter.</p>
                ) : null}
                {styleMode === "preset" &&
                !presetsLoading &&
                presets.length > 0 &&
                filteredPresets.length > 0 &&
                displayPresets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No presets match this category. Try another chip or choose All.
                  </p>
                ) : null}
                {styleMode === "preset" && filteredPresets.length > 0 && displayPresets.length > 0 ? (
                  <div className="try-on-thumb-scroll">
                    <div className="try-on-thumb-scroll-inner">
                      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                      {displayPresets.map((preset) => {
                        const isActive = preset.id === selectedPresetId
                        const hasThumbnail =
                          typeof preset.thumbnailUrl === "string" &&
                          preset.thumbnailUrl.length > 0 &&
                          !brokenPresetIds.has(preset.id)
                        const isThumbnailLoaded = loadedPresetIds.has(preset.id)
                        const showInlineLoader = hasThumbnail && !isThumbnailLoaded
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setSelectedPresetId(preset.id)}
                            aria-label={preset.name}
                            className={cn(
                              "min-w-0 overflow-hidden rounded-lg border-2 border-white text-left shadow-sm transition-colors hover:opacity-95",
                              isActive
                                ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                                : "hover:border-white/90"
                            )}
                          >
                            <div className="relative aspect-[3/4] w-full bg-secondary/35">
                              {hasThumbnail ? (
                                <img
                                  src={preset.thumbnailUrl as string}
                                  alt={preset.name}
                                  loading="lazy"
                                  decoding="async"
                                  className={cn(
                                    "h-full w-full object-cover transition-opacity duration-200",
                                    isThumbnailLoaded ? "opacity-100" : "opacity-0"
                                  )}
                                  onLoad={() =>
                                    setLoadedPresetIds((current) => {
                                      if (current.has(preset.id)) return current
                                      const next = new Set(current)
                                      next.add(preset.id)
                                      return next
                                    })
                                  }
                                  onError={() =>
                                    setBrokenPresetIds((current) => {
                                      if (current.has(preset.id)) return current
                                      const next = new Set(current)
                                      next.add(preset.id)
                                      return next
                                    })
                                  }
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-[11px] text-muted-foreground">
                                  {presetsLoading ? "Loading..." : "No preview"}
                                </div>
                              )}
                              {showInlineLoader ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/45">
                                  <Loader2 className="size-4 animate-spin text-primary" />
                                </div>
                              ) : null}
                            </div>
                          </button>
                        )
                      })}
                      </div>
                    </div>
                  </div>
                ) : null}

                {styleMode === "custom" ? (
                  <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-3">
                    <input
                      ref={customFileInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      className="sr-only"
                      id="try-on-custom-upload"
                      onChange={(event) => assignCustomFile(event.target.files?.[0] ?? null)}
                    />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full min-h-11 sm:w-auto sm:min-h-10"
                        onClick={() => customFileInputRef.current?.click()}
                      >
                        <Upload className="size-4" />
                        Choose reference
                      </Button>
                      <label htmlFor="try-on-custom-upload" className="sr-only">
                        Custom hairstyle reference image
                      </label>
                      <p className="text-sm text-muted-foreground">
                        JPG or PNG, max 5MB — same limits as your portrait upload.
                      </p>
                    </div>
                    {customUploadError ? (
                      <p className="text-sm text-destructive" role="alert">
                        {customUploadError}
                      </p>
                    ) : null}
                    {customSourcePreview ? (
                      <img
                        src={customSourcePreview}
                        alt="Custom hairstyle reference preview"
                        loading="lazy"
                        decoding="async"
                        className="h-32 w-full rounded-lg border border-border object-cover"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Upload a hairstyle reference image to use custom transfer mode.
                      </p>
                    )}
                  </div>
                ) : null}

                {styleMode === "celebrity" ? (
                  <div className="space-y-3 rounded-lg border border-border/70 bg-secondary/15 p-3">
                    <p className="text-sm text-muted-foreground">
                      Choose whose hairstyle to use as the reference for{" "}
                      <span className="font-medium text-foreground">your uploaded photo</span>.
                    </p>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Celebrity region">
                      {(
                        [
                          ["all", "All"],
                          ["hollywood", "Hollywood"],
                          ["bollywood", "Bollywood"],
                        ] as const
                      ).map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setCelebrityRegionFilter(id)}
                          className={cn(
                            "min-h-10 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:min-h-9",
                            celebrityRegionFilter === id
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      Photos are from Wikimedia Commons (CC licenses). See{" "}
                      <a
                        href="/celebrities/ATTRIBUTION.md"
                        className="font-medium text-primary underline underline-offset-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ATTRIBUTION.md
                      </a>
                      .
                    </p>
                    <div className="try-on-thumb-scroll">
                      <div className="try-on-celeb-thumb-scroll-inner">
                        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {filteredCelebrityPortraits.map((portrait) => {
                          const isActive =
                            selectedCelebrityReferenceId === portrait.id && celebrityReferenceFile !== null
                          const isLoading = loadingCelebrityId === portrait.id
                          return (
                            <button
                              key={portrait.id}
                              type="button"
                              onClick={() => void applyCelebrityReference(portrait)}
                              disabled={isLoading}
                              aria-label={portrait.name}
                              title={portrait.name}
                              className={cn(
                                "min-w-0 overflow-hidden rounded-lg border-2 border-white text-left shadow-sm transition-colors hover:opacity-95 disabled:opacity-60",
                                isActive
                                  ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                                  : "hover:border-white/90"
                              )}
                            >
                              <div className="relative aspect-[3/4] w-full bg-secondary/35">
                                <img
                                  src={portrait.imageSrc}
                                  alt={portrait.name}
                                  loading="lazy"
                                  decoding="async"
                                  className="h-full w-full object-cover"
                                />
                                {isLoading ? (
                                  <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                                    <Loader2 className="size-6 animate-spin text-primary" />
                                  </div>
                                ) : null}
                              </div>
                              <span className="block truncate px-1.5 py-1 text-center text-[11px] font-medium text-foreground">
                                {portrait.name}
                              </span>
                            </button>
                          )
                        })}
                        </div>
                      </div>
                    </div>
                    {celebrityReferencePreview ? (
                      <div className="space-y-1 border-t border-border/60 pt-3">
                        <p className="text-xs font-medium text-foreground">Selected reference</p>
                        <img
                          src={celebrityReferencePreview}
                          alt="Selected celebrity hairstyle reference"
                          loading="lazy"
                          decoding="async"
                          className="h-28 w-full rounded-lg border border-border object-cover"
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {styleMode === "preset" ? (
                  <p className="text-center text-sm text-muted-foreground">
                    Not your style?{" "}
                    <button
                      type="button"
                      className="font-medium text-primary underline underline-offset-4"
                      onClick={() => setStyleMode("custom")}
                    >
                      Custom reference
                    </button>{" "}
                    or{" "}
                    <button
                      type="button"
                      className="font-medium text-primary underline underline-offset-4"
                      onClick={() => setStyleMode("celebrity")}
                    >
                      Celebrity look
                    </button>
                  </p>
                ) : null}
              </div>

              {styleMode === "preset" ? (
                <section className="space-y-3 border-t border-border/60 pt-4">
                  <h2 className="text-sm font-semibold">Optional hair color</h2>
                  <div className="grid max-h-[min(40vh,20rem)] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 [scrollbar-gutter:stable]">
                    <button
                      type="button"
                      onClick={() => setSelectedColor("")}
                      aria-pressed={selectedColor === ""}
                      className={cn(
                        "flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors sm:min-h-10",
                        selectedColor === ""
                          ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                          : "border-border bg-background hover:border-primary/40"
                      )}
                    >
                      <span className="size-4 shrink-0 rounded-full border border-border bg-background" />
                      <span className="text-xs font-medium">No color override</span>
                    </button>

                    {HAIR_COLOR_OPTIONS.map((option) => {
                      const isSelected = selectedColor === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSelectedColor(option.value)}
                          aria-pressed={isSelected}
                          className={cn(
                            "flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors sm:min-h-10",
                            isSelected
                              ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                              : "border-border bg-background hover:border-primary/40"
                          )}
                        >
                          <span
                            className="size-4 shrink-0 rounded-full border border-black/10"
                            style={{ background: option.swatch }}
                            aria-hidden
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-medium">{option.label}</span>
                            <span className="block truncate text-[11px] text-muted-foreground">
                              {option.description}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </section>
              ) : null}

              <section className="mt-auto space-y-3 border-t border-border/60 pt-4">
                {quota?.mode === "guest" ? (
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
                          <Link href="/auth?next=/try-on" className="font-semibold underline underline-offset-2">
                            Sign in
                          </Link>{" "}
                          for unlimited generations across AI Hair + AI Nail Art.
                        </span>
                      </p>
                    ) : (
                      <p>
                        <span className="font-medium">
                          {quota.remaining} shared guest credit{quota.remaining === 1 ? "" : "s"} remaining.
                        </span>{" "}
                        <Link href="/auth?next=/try-on" className="underline underline-offset-2">
                          Sign in
                        </Link>{" "}
                        for unlimited access to AI Hair + AI Nail Art.
                      </p>
                    )}
                  </div>
                ) : null}

                <Button
                  type="button"
                  size="lg"
                  className="h-12 w-full min-h-12 gap-2 sm:h-11 sm:min-h-11"
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
                      <Wand2 className="size-4" />
                      Generate Hairstyle
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
                  {taskId ? (
                    <p className="mt-1 text-xs text-muted-foreground">Task ID: {taskId}</p>
                  ) : null}
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
