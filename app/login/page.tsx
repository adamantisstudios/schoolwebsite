import { Suspense } from "react"
import LoginPage from "./login-form"

export default function LoginRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sage-600">Loading…</div>}>
      <LoginPage />
    </Suspense>
  )
}
