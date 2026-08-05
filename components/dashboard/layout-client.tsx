"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/context/auth-context"
import { LoadingBlock } from "@/components/dashboard/ui"

function Guard({ children, role }: { children: React.ReactNode; role: string }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== role)) {
      router.replace("/login")
    }
  }, [user, loading, role, router])

  if (loading || !user) return <div className="p-8"><LoadingBlock /></div>
  if (user.role !== role) return null
  return <>{children}</>
}

export function DashboardLayoutClient({
  role,
  children,
}: {
  role: string
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="p-8"><LoadingBlock /></div>}>
        <Guard role={role}>{children}</Guard>
      </Suspense>
    </AuthProvider>
  )
}
