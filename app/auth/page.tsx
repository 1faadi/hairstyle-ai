import { Suspense } from "react"

import { AuthForm } from "@/components/auth/AuthForm"
import { PageLoadingFallback } from "@/components/ui/loading-indicator"

export default function AuthPage() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <AuthForm />
    </Suspense>
  )
}
