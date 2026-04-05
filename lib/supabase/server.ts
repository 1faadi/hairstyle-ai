import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase/env"

let serviceClient: SupabaseClient | null = null

export function getSupabaseServiceClient(): SupabaseClient {
  if (serviceClient) {
    return serviceClient
  }

  serviceClient = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return serviceClient
}
