"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { principalNav } from "@/components/dashboard/principal-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { downloadTablePdf } from "@/lib/pdf"

type ParentRow = { id: string; userId: string; name: string; email: string }

export default function PrincipalStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [parents, setParents] = useState<ParentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [q, setQ] = useState("")

  async function load() {
    setLoading(true)
    const url = q ? `/api/students?q=${encodeURIComponent(q)}` : "/api/students"
    const [s, p] = await Promise.all([
      fetch(url).then((r) => r.json()),
      fetch("/api/parents").then((r) => r.json()),
    ])
    if (s.ok) setStudents(s.data)
    if (p.ok) setParents(p.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function linkParent(studentId: string, parentTableId: string) {
    setMessage("")
    const res = await fetch("/api/students", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        parentId: parentTableId || null,
      }),
    })
    const json = await res.json()
    setMessage(json.ok ? "Student link updated." : json.error)
    if (json.ok) load()
  }

  function parentName(parentId?: string | null) {
    if (!parentId) return "—"
    const p = parents.find((x) => x.id === parentId)
    return p ? `${p.name} (${p.email})` : "Linked"
  }

  function exportPdf() {
    downloadTablePdf({
      title: "Student Registry",
      subtitle: `${students.length} active students`,
      filename: "students-registry.pdf",
      columns: [
        { header: "Name", key: "name" },
        { header: "Student ID", key: "sid" },
        { header: "Class", key: "class" },
        { header: "Parent", key: "parent" },
      ],
      rows: students.map((s) => ({
        name: `${s.first_name} ${s.last_name}`,
        sid: s.student_id,
        class: s.classes?.name || "—",
        parent: parentName(s.parent_id),
      })),
    })
  }

  return (
    <DashboardShell title="Principal Portal" nav={principalNav}>
      <PageHeader
        title="Student management"
        description="Link students to parent accounts and export registry"
        actions={
          <Button variant="outline" onClick={exportPdf}>
            Download PDF
          </Button>
        }
      />

      <div className="flex gap-2 mb-4">
        <Input placeholder="Search name or student ID…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="outline" onClick={load}>
          Search
        </Button>
      </div>

      {message && <p className="mb-3 text-sm text-emerald-700">{message}</p>}

      {loading ? (
        <LoadingBlock />
      ) : students.length === 0 ? (
        <EmptyState message="No students found." />
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-left">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3">Link parent</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-3">
                    {s.first_name} {s.last_name}
                  </td>
                  <td className="px-4 py-3">{s.student_id}</td>
                  <td className="px-4 py-3">{s.classes?.name || "—"}</td>
                  <td className="px-4 py-3">{parentName(s.parent_id)}</td>
                  <td className="px-4 py-3">
                    <select
                      className="border rounded-md px-2 py-1 text-sm max-w-[220px]"
                      defaultValue={s.parent_id || ""}
                      onChange={(e) => linkParent(s.id, e.target.value)}
                    >
                      <option value="">Unlinked</option>
                      {parents.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.email})
                        </option>
                      ))}
                    </select>
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
