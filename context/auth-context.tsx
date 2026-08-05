"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import type { SessionUser } from "@/lib/roles"

type RegisterInput = {
  email: string
  password: string
  name: string
  phone?: string
  childStudentId?: string
}

type AuthState = {
  user: SessionUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ redirectTo: string }>
  register: (input: RegisterInput) => Promise<{ redirectTo: string; message?: string }>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" })
      const json = await res.json()
      if (json.ok) setUser(json.data.user)
      else setUser(null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
    const json = await res.json()
    if (!json.ok) throw new Error(json.error || "Login failed")
    setUser(json.data.user)
    return { redirectTo: json.data.redirectTo as string }
  }

  const register = async (input: RegisterInput) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(input),
    })
    const json = await res.json()
    if (!json.ok) throw new Error(json.error || "Registration failed")
    setUser(json.data.user)
    return {
      redirectTo: json.data.redirectTo as string,
      message: json.data.message as string | undefined,
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
