"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const { redirectTo } = await login(email, password)
      const next = searchParams.get("next")
      router.push(next && next.startsWith("/dashboard") ? next : redirectTo)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold text-emerald-800">
            Montessori Bloom
          </Link>
          <Link href="/" className="text-sm text-emerald-700 hover:text-emerald-900">
            Back to site
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-emerald-950">Staff & Parent Portal</h1>
            <p className="mt-2 text-emerald-800/70">Sign in to access your school dashboard</p>
          </div>

          <form
            onSubmit={onSubmit}
            className="bg-white border border-emerald-100 shadow-sm rounded-xl p-8 space-y-5"
          >
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <p className="text-center text-sm text-emerald-800/80">
              Parents:{" "}
              <Link href="/register" className="font-medium text-emerald-700 hover:text-emerald-900 underline">
                Create an account
              </Link>
            </p>
          </form>

          <p className="mt-6 text-center text-xs text-emerald-700/60">
            Authorized users only. All access attempts are logged.
          </p>
        </div>
      </div>
    </div>
  )
}
