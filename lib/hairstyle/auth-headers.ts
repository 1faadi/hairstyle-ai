/** Shared Authorization header for browser fetch calls to quota/task APIs. */
export function createBearerAuthHeaders(accessToken: string | null): HeadersInit {
  if (!accessToken) {
    return {}
  }
  return { Authorization: `Bearer ${accessToken}` }
}
