import { HttpError } from "@/lib/hairstyle/errors"

function requireEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new HttpError(500, `Missing required environment variable: ${name}`)
  }
  return value
}

export function getSupabaseUrl(): string {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL")
}

export function getSupabaseAnonKey(): string {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (anonKey) return anonKey

  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim()
  if (publishableKey) return publishableKey

  throw new HttpError(
    500,
    "Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)"
  )
}

export function getSupabaseServiceRoleKey(): string {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY")
}

export function getGuestIpHashSalt(): string {
  return requireEnv("GUEST_IP_HASH_SALT")
}
