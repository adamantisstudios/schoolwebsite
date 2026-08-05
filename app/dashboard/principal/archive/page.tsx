"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { principalNav } from "@/components/dashboard/principal-nav"
import { Button } from "@/components/ui/button"

export default function ArchivePage() {
  const [students, setStudents] = useState<any[]>([])
  const [showArchived, setShowArchived] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  async function load() {
    setLoading(true)
    const url = showArchived ? "/api/archive?archived=1" : "/api/archive"
    const j = await fetch(url).then((r) => r.json())
    if (j.ok) setStudents(j.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [showArchived])

  async function toggleArchive(id: string, archived: boolean) {
    if (archived && !confirm("Archive this student record? This requires confirmation.")) return
    const res = await fetch("/api/archive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: "students", id, archived, confirm: archived }),
    })
    const json = await res.json()
    setMessage(json.ok ? (archived ? "Student archived." : "Student restored.") : json.error)
    if (json.ok) load()
  }

  return (
    <DashboardShell title="Principal Portal" nav={principalNav}>
      <PageHeader
        title="Archive centre"
        description="Archive or restore student records (logged in audit trail)"
        actions={
          <Button variant="outline" onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? "Hide archived" : "Show archived"}
          </Button>
        }
      />
      {message && <p className="mb-3 text-sm text-emerald-700">{message}</p>}

      {loading ? (
        <LoadingBlock />
      ) : students.length === 0 ? (
        <EmptyState message="No student records." />
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-left">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-3">
                    {s.first_name} {s.last_name}
                  </td>
                  <td className="px-4 py-3">{s.student_id}</td>
                  <td className="px-4 py-3">{s.classes?.name}</td>
                  <td className="px-4 py-3">{s.is_archived ? "Archived" : "Active"}</td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant={s.is_archived ? "outline" : "destructive"}
                      onClick={() => toggleArchive(s.id, !s.is_archived)}
                    >
                      {s.is_archived ? "Restore" : "Archive"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  )
}
