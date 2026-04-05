import { createHash } from "node:crypto"

import { getGuestIpHashSalt } from "@/lib/supabase/env"

function firstForwardedIp(value: string): string | null {
  const first = value.split(",")[0]?.trim()
  return first || null
}

function normalizeIp(ip: string): string {
  const trimmed = ip.trim()
  if (trimmed.startsWith("::ffff:")) {
    return trimmed.slice("::ffff:".length)
  }
  return trimmed
}

export function resolveClientIp(request: Request): string | null {
  const xForwardedFor = request.headers.get("x-forwarded-for")
  if (xForwardedFor) {
    const forwardedIp = firstForwardedIp(xForwardedFor)
    if (forwardedIp) {
      return normalizeIp(forwardedIp)
    }
  }

  const xRealIp = request.headers.get("x-real-ip")
  if (xRealIp) {
    return normalizeIp(xRealIp)
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip")
  if (cfConnectingIp) {
    return normalizeIp(cfConnectingIp)
  }

  if (process.env.NODE_ENV !== "production") {
    return "127.0.0.1"
  }

  return null
}

export function hashClientIp(ip: string): string {
  return createHash("sha256")
    .update(`${getGuestIpHashSalt()}:${ip}`)
    .digest("hex")
}
