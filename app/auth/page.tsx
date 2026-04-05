import { Suspense } from "react"

import { AuthForm } from "@/components/auth/AuthForm"

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="px-4 py-10 text-sm text-muted-foreground">Loading...</div>}>
      <AuthForm />
    </Suspense>
  )
}
