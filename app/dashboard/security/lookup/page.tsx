"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, PageHeader } from "@/components/dashboard/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const nav = [
  { href: "/dashboard/security", label: "Gate log" },
  { href: "/dashboard/security/lookup", label: "Student lookup" },
]

export default function SecurityLookupPage() {
  const [studentId, setStudentId] = useState("")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function lookup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)
    const res = await fetch(`/api/students?studentId=${encodeURIComponent(studentId)}`)
    const json = await res.json()
    if (!json.ok) setError(json.error)
    else if (!json.data) setError("No student found with that ID.")
    else setResult(json.data)
    setLoading(false)
  }

  return (
    <DashboardShell title="Security Portal" nav={nav}>
      <PageHeader title="Student verification" description="Lookup basic student identity by admission number" />
      <form onSubmit={lookup} className="flex gap-2 max-w-md mb-6">
        <Input required placeholder="e.g. MBS-2024-001" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        <Button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600">
          {loading ? "…" : "Lookup"}
        </Button>
      </form>
      {error && <EmptyState message={error} />}
      {result && (
        <div className="rounded-xl border bg-white p-6 max-w-md">
          <p className="font-serif text-xl font-bold">
            {result.first_name} {result.last_name}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{result.student_id}</p>
          <p className="text-sm mt-3">Class: {result.classes?.name || "—"}</p>
        </div>
      )}
    </DashboardShell>
  )
}
