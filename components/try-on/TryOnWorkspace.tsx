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
  QuotaSnapshot,
  TaskResponse,
  TaskStatusResponse,
} from "@/lib/hairstyle/types"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

const POLL_INTERVAL_MS = 2500
const MAX_POLL_ATTEMPTS = 72

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

export function TryOnWorkspace() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [quota, setQuota] = useState<QuotaSnapshot | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [showWelcomeCard, setShowWelcomeCard] = useState(false)

  const [presets, setPresets] = useState<HairstylePreset[]>([])
  const [presetGender, setPresetGender] = useState<"male" | "female">("female")
  const [brokenPresetIds, setBrokenPresetIds] = useState<Set<string>>(new Set())
  const [presetsLoading, setPresetsLoading] = useState(true)
  const [presetsError, setPresetsError] = useState<string | null>(null)

  const [styleMode, setStyleMode] = useState<"preset" | "custom">("preset")
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [customSourceFile, setCustomSourceFile] = useState<File | null>(null)
  const [customSourcePreview, setCustomSourcePreview] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState("")
  const [targetFile, setTargetFile] = useState<File | null>(null)
  const [targetPreview, setTargetPreview] = useState<string | null>(null)

  const [taskId, setTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<HairstyleTaskStatus | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  const pollTokenRef = useRef(0)

  function getDisplayNameFromSession(session: { user?: { email?: string | null; user_metadata?: Record<string, unknown> } } | null): string | null {
    const metadata = session?.user?.user_metadata
    const name =
      (typeof metadata?.name === "string" && metadata.name.trim()) ||
      (typeof metadata?.full_name === "string" && metadata.full_name.trim()) ||
      (session?.user?.email?.split("@")[0] ?? null)
    return name
  }

  // Sync Supabase session token so API calls can authenticate the user
  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => {
      setAccessToken(data.session?.access_token ?? null)
      setUserName(getDisplayNameFromSession(data.session))
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccessToken(session?.access_token ?? null)
      setUserName(getDisplayNameFromSession(session))
    })

    return () => listener.subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (params.get("welcome") !== "1") return
    if (!accessToken) return
    setShowWelcomeCard(true)
    const timer = setTimeout(() => setShowWelcomeCard(false), 6000)
    return () => clearTimeout(timer)
  }, [accessToken])

  function authHeaders(): HeadersInit {
    if (!accessToken) return {}
    return { Authorization: `Bearer ${accessToken}` }
  }

  // Load quota on mount (and whenever auth state changes)
  useEffect(() => {
    let canceled = false
    fetch("/api/hairstyle/quota", { cache: "no-store", headers: authHeaders() })
      .then((r) => r.ok ? r.json() : null)
      .then((data: { quota?: QuotaSnapshot } | null) => {
        if (!canceled && data?.quota) setQuota(data.quota)
      })
      .catch(() => {/* non-critical */})
    return () => { canceled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  const selectedPreset = useMemo(
    () => presets.find((preset) => preset.id === selectedPresetId) ?? null,
    [presets, selectedPresetId]
  )

  const filteredPresets = useMemo(() => {
    return presets.filter((preset) => preset.gender === presetGender)
  }, [presets, presetGender])

  function getFallbackThumbnail(gender: "male" | "female"): string {
    return gender === "male" ? "/images/hairstyle-boy.jpg" : "/images/hairstyle-woman.jpg"
  }

  useEffect(() => {
    if (filteredPresets.length === 0) return
    const isSelectedVisible = filteredPresets.some((preset) => preset.id === selectedPresetId)
    if (!isSelectedVisible) {
      setSelectedPresetId(filteredPresets[0].id)
    }
  }, [filteredPresets, selectedPresetId])

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
        setErrorMessage(null)
        return
      }

      if (data.status === "failed" || data.status === "canceled") {
        setErrorMessage(data.error || "Generation failed. Please try another style.")
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

    if (styleMode === "preset" && !selectedPreset) {
      setErrorMessage("Please choose a hairstyle preset.")
      return
    }
    if (styleMode === "custom" && !customSourceFile) {
      setErrorMessage("Please upload a custom hairstyle reference image.")
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

      if (styleMode === "custom" && customSourceFile) {
        formData.append("sourceImage", customSourceFile)
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
          setErrorMessage("You've used all 3 guest credits. Sign in for unlimited generations.")
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
        {showWelcomeCard && (
          <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-primary">
            <p className="text-sm font-semibold">
              Welcome{userName ? `, ${userName}` : ""}! Your account is ready.
            </p>
            <p className="text-xs text-primary/90">You now have unlimited try-ons while signed in.</p>
          </div>
        )}

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

          <div className="text-right">
            <p className="text-xs text-muted-foreground">Supported: JPG and PNG up to 5MB</p>
            <p className="text-xs font-medium text-foreground">
              {quota?.mode === "user"
                ? "Credits: Unlimited"
                : `Free credits left: ${quota?.remaining ?? "--"}/3`}
            </p>
          </div>
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
                  accept="image/jpeg,image/png"
                  onChange={(event) => setTargetFile(event.target.files?.[0] ?? null)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </section>

              <section className="space-y-3">
                <h2 className="text-sm font-semibold">2. Choose a Style Preset</h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={styleMode === "preset" ? "default" : "outline"}
                    onClick={() => setStyleMode("preset")}
                  >
                    Presets
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={styleMode === "custom" ? "default" : "outline"}
                    onClick={() => setStyleMode("custom")}
                  >
                    Custom
                  </Button>
                </div>
                {presetsLoading && (
                  <p className="text-sm text-muted-foreground">Loading presets...</p>
                )}
                {presetsError && (
                  <p className="text-sm text-destructive">Could not load presets: {presetsError}</p>
                )}
                {styleMode === "preset" && !presetsLoading && presets.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={presetGender === "female" ? "default" : "outline"}
                      onClick={() => setPresetGender("female")}
                    >
                      Women
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={presetGender === "male" ? "default" : "outline"}
                      onClick={() => setPresetGender("male")}
                    >
                      Men
                    </Button>
                  </div>
                )}
                {styleMode === "preset" && !presetsLoading && presets.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No AILab presets available right now.
                  </p>
                )}
                {styleMode === "preset" && !presetsLoading && presets.length > 0 && filteredPresets.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No presets available for this filter.
                  </p>
                )}
                {styleMode === "preset" && !presetsLoading && filteredPresets.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {filteredPresets.map((preset) => {
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
                            src={
                              brokenPresetIds.has(preset.id)
                                ? getFallbackThumbnail(preset.gender)
                                : preset.thumbnailUrl
                            }
                            alt={preset.name}
                            className="h-24 w-full object-cover"
                            onError={() =>
                              setBrokenPresetIds((current) => {
                                if (current.has(preset.id)) return current
                                const next = new Set(current)
                                next.add(preset.id)
                                return next
                              })
                            }
                          />
                          <div className="px-2 py-1.5 text-xs font-medium">{preset.name}</div>
                        </button>
                      )
                    })}
                  </div>
                )}
                {styleMode === "custom" && (
                  <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-3">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) =>
                        setCustomSourceFile(event.target.files?.[0] ?? null)
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                    {customSourcePreview ? (
                      <img
                        src={customSourcePreview}
                        alt="Custom hairstyle reference preview"
                        className="h-32 w-full rounded-lg border border-border object-cover"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Upload a hairstyle reference image to use custom transfer mode.
                      </p>
                    )}
                  </div>
                )}
              </section>

              {styleMode === "preset" && (
                <section className="space-y-3">
                  <h2 className="text-sm font-semibold">3. Optional Hair Color</h2>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setSelectedColor("")}
                      aria-pressed={selectedColor === ""}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
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
                            "flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
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
              )}

              <section className="space-y-3">
                {/* Guest quota badge */}
                {quota?.mode === "guest" && (
                  <div className={`rounded-lg border px-3 py-2 text-sm ${
                    quota.requiresAuth
                      ? "border-destructive/40 bg-destructive/10 text-destructive"
                      : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
                  }`}>
                    {quota.requiresAuth ? (
                      <p className="flex items-center gap-2">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>
                          Guest limit reached.{" "}
                          <Link href="/auth?next=/try-on" className="font-semibold underline underline-offset-2">
                            Sign in
                          </Link>{" "}
                          for unlimited generations.
                        </span>
                      </p>
                    ) : (
                      <p>
                        <span className="font-medium">{quota.remaining} guest credit{quota.remaining === 1 ? "" : "s"} remaining.</span>{" "}
                        <Link href="/auth?next=/try-on" className="underline underline-offset-2">
                          Sign in
                        </Link>{" "}
                        for unlimited access.
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
