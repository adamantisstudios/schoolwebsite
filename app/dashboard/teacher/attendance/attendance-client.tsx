"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { downloadTablePdf } from "@/lib/pdf"

const nav = [
  { href: "/dashboard/teacher", label: "Overview" },
  { href: "/dashboard/teacher/students", label: "Students" },
  { href: "/dashboard/teacher/attendance", label: "Attendance" },
  { href: "/dashboard/teacher/grades", label: "Grades" },
]

type Status = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
type Tab = "mark" | "history"

export default function AttendancePage() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>("mark")
  const [classes, setClasses] = useState<any[]>([])
  const [classId, setClassId] = useState(searchParams.get("classId") || "")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [from, setFrom] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return d.toISOString().slice(0, 10)
  })
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10))
  const [students, setStudents] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [statusMap, setStatusMap] = useState<Record<string, Status>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/classes")
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) {
          setClasses(j.data)
          if (!classId && j.data[0]) setClassId(j.data[0].id)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!classId || tab !== "mark") return
    setLoading(true)
    fetch(`/api/students?classId=${classId}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) {
          setStudents(j.data)
          const initial: Record<string, Status> = {}
          j.data.forEach((s: any) => {
            initial[s.id] = "PRESENT"
          })
          setStatusMap(initial)
        }
      })
      .finally(() => setLoading(false))
  }, [classId, tab])

  useEffect(() => {
    if (!classId || tab !== "history") return
    setLoading(true)
    fetch(`/api/attendance?classId=${classId}&from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setHistory(j.data)
      })
      .finally(() => setLoading(false))
  }, [classId, from, to, tab])

  const allPresent = useMemo(() => Object.values(statusMap).every((s) => s === "PRESENT"), [statusMap])

  function markAllPresent() {
    const next: Record<string, Status> = {}
    students.forEach((s) => {
      next[s.id] = "PRESENT"
    })
    setStatusMap(next)
  }

  async function save() {
    setSaving(true)
    setMessage("")
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classId,
        date,
        records: students.map((s) => ({ studentId: s.id, status: statusMap[s.id] || "PRESENT" })),
      }),
    })
    const json = await res.json()
    setMessage(json.ok ? "Attendance saved." : json.error)
    setSaving(false)
  }

  function exportPdf() {
    const rows = (tab === "history" ? history : students.map((s) => ({
      students: s,
      date,
      status: statusMap[s.id] || "PRESENT",
    }))).map((r: any) => ({
      date: r.date || date,
      student: `${r.students?.first_name || r.first_name} ${r.students?.last_name || r.last_name}`,
      id: r.students?.student_id || r.student_id,
      status: r.status,
    }))

    downloadTablePdf({
      title: tab === "history" ? "Attendance History" : "Attendance Sheet",
      subtitle: `${classes.find((c) => c.id === classId)?.name || ""} · ${from} to ${to}`,
      filename: `attendance-${classId.slice(0, 8)}.pdf`,
      columns: [
        { header: "Date", key: "date" },
        { header: "Student", key: "student" },
        { header: "ID", key: "id" },
        { header: "Status", key: "status" },
      ],
      rows,
    })
  }

  return (
    <DashboardShell title="Teacher Portal" nav={nav}>
      <PageHeader
        title="Attendance"
        description="Record daily attendance or review history by date range"
        actions={
          <div className="flex gap-2">
            <Button variant={tab === "mark" ? "default" : "outline"} onClick={() => setTab("mark")}>
              Mark today
            </Button>
            <Button variant={tab === "history" ? "default" : "outline"} onClick={() => setTab("history")}>
              History
            </Button>
            <Button variant="outline" onClick={exportPdf}>
              Download PDF
            </Button>
            {tab === "mark" && (
              <>
                <Button variant="outline" onClick={markAllPresent} disabled={allPresent}>
                  All present
                </Button>
                <Button className="bg-amber-500 hover:bg-amber-600" onClick={save} disabled={saving || !classId}>
                  {saving ? "Saving…" : "Save"}
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {tab === "mark" ? (
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" />
        ) : (
          <>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-auto" />
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-auto" />
          </>
        )}
      </div>

      {message && <p className="mb-3 text-sm text-emerald-700">{message}</p>}

      {loading ? (
        <LoadingBlock />
      ) : tab === "history" ? (
        history.length === 0 ? (
          <EmptyState message="No attendance records for this range." />
        ) : (
          <div className="rounded-xl border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-left">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-t">
                    <td className="px-4 py-3">{h.date}</td>
                    <td className="px-4 py-3">
                      {h.students?.first_name} {h.students?.last_name}
                    </td>
                    <td className="px-4 py-3">{h.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : students.length === 0 ? (
        <EmptyState message="No students in this class." />
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-left">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-3">
                    {s.first_name} {s.last_name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.student_id}</td>
                  <td className="px-4 py-3">
                    <select
                      className="border rounded px-2 py-1"
                      value={statusMap[s.id] || "PRESENT"}
                      onChange={(e) => setStatusMap((m) => ({ ...m, [s.id]: e.target.value as Status }))}
                    >
                      <option value="PRESENT">Present</option>
                      <option value="ABSENT">Absent</option>
                      <option value="LATE">Late</option>
                      <option value="EXCUSED">Excused</option>
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
