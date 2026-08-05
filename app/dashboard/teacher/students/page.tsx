"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { Input } from "@/components/ui/input"

const nav = [
  { href: "/dashboard/teacher", label: "Overview" },
  { href: "/dashboard/teacher/students", label: "Students" },
  { href: "/dashboard/teacher/attendance", label: "Attendance" },
  { href: "/dashboard/teacher/grades", label: "Grades" },
]

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true)
      fetch(`/api/students?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((j) => {
          if (j.ok) setStudents(j.data)
        })
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(t)
  }, [q])

  return (
    <DashboardShell title="Teacher Portal" nav={nav}>
      <PageHeader title="My Students" description="Students in classes you teach or form" />
      <Input
        placeholder="Search by name or ID…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-4 max-w-sm"
      />
      {loading ? (
        <LoadingBlock />
      ) : students.length === 0 ? (
        <EmptyState message="No students found." />
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Student ID</th>
                <th className="px-4 py-3">Class</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  )
}
