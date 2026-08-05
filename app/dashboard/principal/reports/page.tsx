"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { principalNav } from "@/components/dashboard/principal-nav"
import { Button } from "@/components/ui/button"
import { downloadTablePdf } from "@/lib/pdf"

export default function ReportsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [fees, setFees] = useState<any[]>([])
  const [visitors, setVisitors] = useState<any[]>([])
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/students").then((r) => r.json()),
      fetch("/api/fees").then((r) => r.json()),
      fetch("/api/visitors").then((r) => r.json()),
      fetch("/api/performance").then((r) => r.json()),
    ]).then(([s, f, v, g]) => {
      if (s.ok) setStudents(s.data)
      if (f.ok) setFees(f.data)
      if (v.ok) setVisitors(v.data)
      if (g.ok) setGrades(g.data)
      setLoading(false)
    })
  }, [])

  function exportStudentsPdf() {
    downloadTablePdf({
      title: "Class List",
      filename: "class-list.pdf",
      columns: [
        { header: "Name", key: "name" },
        { header: "ID", key: "id" },
        { header: "Class", key: "class" },
      ],
      rows: students.map((s) => ({
        name: `${s.first_name} ${s.last_name}`,
        id: s.student_id,
        class: s.classes?.name || "",
      })),
    })
  }

  function exportFeesPdf() {
    downloadTablePdf({
      title: "Fee Status Report",
      filename: "fees-report.pdf",
      columns: [
        { header: "Student", key: "student" },
        { header: "Amount", key: "amount" },
        { header: "Paid", key: "paid" },
      ],
      rows: fees.map((f) => ({
        student: `${f.students?.first_name} ${f.students?.last_name}`,
        amount: `GHS ${f.amount}`,
        paid: f.paid ? "Yes" : "No",
      })),
    })
  }

  function printSection(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const w = window.open("", "_blank")
    if (!w) return
    w.document.write(`
      <html><head><title>Montessori Bloom Report</title>
      <style>
        body{font-family:Georgia,serif;padding:32px;color:#111}
        h1{font-size:22px;margin:0 0 4px}
        table{width:100%;border-collapse:collapse;margin-top:16px;font-size:12px}
        th,td{border:1px solid #ddd;padding:8px;text-align:left}
        th{background:#ecfdf5}
      </style></head>
      <body>
        <h1>Montessori Bloom</h1>
        <p>Official school report</p>
        ${el.innerHTML}
      </body></html>
    `)
    w.document.close()
    w.print()
  }

  function exportCsv(filename: string, rows: string[][]) {
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
  }

  return (
    <DashboardShell title="Principal Portal" nav={principalNav}>
      <PageHeader title="Print centre & reports" description="Export class lists, fees, visitors, and grades" />
      {loading ? (
        <LoadingBlock />
      ) : (
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg font-semibold">Class list</h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    exportCsv("students.csv", [
                      ["Name", "ID", "Class"],
                      ...students.map((s) => [`${s.first_name} ${s.last_name}`, s.student_id, s.classes?.name || ""]),
                    ])
                  }
                >
                  CSV
                </Button>
                <Button size="sm" variant="outline" onClick={exportStudentsPdf}>
                  PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => printSection("report-students")}>
                  Print
                </Button>
              </div>
            </div>
            <div id="report-students" className="rounded-xl border bg-white overflow-hidden">
              {students.length === 0 ? (
                <EmptyState message="No students." />
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-emerald-50 text-left">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">ID</th>
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
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg font-semibold">Fees</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={exportFeesPdf}>
                  PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => printSection("report-fees")}>
                  Print
                </Button>
              </div>
            </div>
            <div id="report-fees" className="rounded-xl border bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-emerald-50 text-left">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f) => (
                    <tr key={f.id} className="border-t">
                      <td className="px-4 py-3">
                        {f.students?.first_name} {f.students?.last_name}
                      </td>
                      <td className="px-4 py-3">GHS {f.amount}</td>
                      <td className="px-4 py-3">{f.paid ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg font-semibold">Visitor history</h2>
              <Button size="sm" variant="outline" onClick={() => printSection("report-visitors")}>
                Print
              </Button>
            </div>
            <div id="report-visitors" className="rounded-xl border bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-emerald-50 text-left">
                  <tr>
                    <th className="px-4 py-3">Visitor</th>
                    <th className="px-4 py-3">Purpose</th>
                    <th className="px-4 py-3">Check-in</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((v) => (
                    <tr key={v.id} className="border-t">
                      <td className="px-4 py-3">{v.visitor_name}</td>
                      <td className="px-4 py-3">{v.purpose}</td>
                      <td className="px-4 py-3">{new Date(v.check_in).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg font-semibold">Academic performance</h2>
              <Button size="sm" variant="outline" onClick={() => printSection("report-grades")}>
                Print
              </Button>
            </div>
            <div id="report-grades" className="rounded-xl border bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-emerald-50 text-left">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Term</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.slice(0, 100).map((g) => (
                    <tr key={g.id} className="border-t">
                      <td className="px-4 py-3">
                        {g.students?.first_name} {g.students?.last_name}
                      </td>
                      <td className="px-4 py-3">{g.courses?.name}</td>
                      <td className="px-4 py-3">
                        {g.score}/{g.max_score}
                      </td>
                      <td className="px-4 py-3">{g.term}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </DashboardShell>
  )
}
