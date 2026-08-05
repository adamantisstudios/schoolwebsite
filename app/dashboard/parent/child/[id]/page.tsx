"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { Button } from "@/components/ui/button"
import { downloadWardReportPdf } from "@/lib/pdf"

const nav = [
  { href: "/dashboard/parent", label: "Children" },
  { href: "/dashboard/parent/shop", label: "School shop" },
  { href: "/dashboard/parent/orders", label: "Orders" },
]

export default function ChildDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [student, setStudent] = useState<any>(null)
  const [attendance, setAttendance] = useState<any[]>([])
  const [grades, setGrades] = useState<any[]>([])
  const [fees, setFees] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/students").then((r) => r.json()),
      fetch(`/api/attendance?studentId=${id}`).then((r) => r.json()),
      fetch(`/api/performance?studentId=${id}`).then((r) => r.json()),
      fetch(`/api/fees?studentId=${id}`).then((r) => r.json()),
      fetch(`/api/reviews?studentId=${id}`).then((r) => r.json()),
    ]).then(([s, a, p, f, r]) => {
      if (s.ok) setStudent((s.data || []).find((c: any) => c.id === id) || null)
      if (a.ok) setAttendance(a.data || [])
      if (p.ok) setGrades(p.data || [])
      if (f.ok) setFees(f.data || [])
      if (r.ok) setReviews(r.data || [])
      setLoading(false)
    })
  }, [id])

  function downloadPdf() {
    const name = student ? `${student.first_name} ${student.last_name}` : "Student"
    downloadWardReportPdf({
      studentName: name,
      studentId: student?.student_id || id,
      className: student?.classes?.name,
      filename: `ward-report-${student?.student_id || id}.pdf`,
      sections: [
        {
          heading: "Attendance (recent)",
          lines: attendance.slice(0, 30).map(
            (a) => `${a.date} · ${a.status}${a.classes?.name ? ` · ${a.classes.name}` : ""}`
          ),
        },
        {
          heading: "Grades & assessments",
          lines: grades.map(
            (g) =>
              `${g.courses?.name || "Subject"} · ${g.assessment_type}: ${g.score}/${g.max_score} (${g.term})${
                g.teacher_comment ? ` — ${g.teacher_comment}` : ""
              }`
          ),
        },
        {
          heading: "Teacher reviews",
          lines: reviews.map(
            (rv) =>
              `${rv.term} ${rv.academic_year}${rv.courses?.name ? ` · ${rv.courses.name}` : ""}: ${rv.review_text}`
          ),
        },
        {
          heading: "Fees",
          lines: fees.map(
            (fee) =>
              `${fee.description || fee.academic_term || "Fee"} · GHS ${fee.amount} · due ${fee.due_date} · ${
                fee.paid ? "Paid" : "Outstanding"
              }`
          ),
        },
      ],
    })
  }

  return (
    <DashboardShell title="Parent Portal" nav={nav}>
      <PageHeader
        title={student ? `${student.first_name} ${student.last_name}` : "Child details"}
        description="Academic, attendance, reviews, and fee information"
        actions={
          !loading && (
            <Button variant="outline" onClick={downloadPdf}>
              Download PDF report
            </Button>
          )
        }
      />
      {loading ? (
        <LoadingBlock />
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="font-serif text-lg font-semibold mb-3">Recent attendance</h2>
            {attendance.length === 0 ? (
              <EmptyState message="No attendance records yet." />
            ) : (
              <div className="rounded-xl border bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-emerald-50 text-left">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.slice(0, 30).map((a) => (
                      <tr key={a.id} className="border-t">
                        <td className="px-4 py-3">{a.date}</td>
                        <td className="px-4 py-3">{a.status}</td>
                        <td className="px-4 py-3">{a.classes?.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold mb-3">Performance</h2>
            {grades.length === 0 ? (
              <EmptyState message="No grades available yet." />
            ) : (
              <div className="rounded-xl border bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-emerald-50 text-left">
                    <tr>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Assessment</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Term</th>
                      <th className="px-4 py-3">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((g) => (
                      <tr key={g.id} className="border-t">
                        <td className="px-4 py-3">{g.courses?.name}</td>
                        <td className="px-4 py-3">{g.assessment_type}</td>
                        <td className="px-4 py-3">
                          {g.score}/{g.max_score}
                        </td>
                        <td className="px-4 py-3">{g.term}</td>
                        <td className="px-4 py-3 text-muted-foreground">{g.teacher_comment || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold mb-3">Teacher reviews</h2>
            {reviews.length === 0 ? (
              <EmptyState message="No teacher reviews yet for this term." />
            ) : (
              <div className="space-y-3">
                {reviews.map((rv) => (
                  <div key={rv.id} className="rounded-xl border bg-white p-4 text-sm">
                    <p className="font-medium text-emerald-900">
                      {rv.term} · {rv.academic_year}
                      {rv.courses?.name ? ` · ${rv.courses.name}` : ""}
                    </p>
                    <p className="mt-2 text-muted-foreground whitespace-pre-wrap">{rv.review_text}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold mb-3">Fees</h2>
            {fees.length === 0 ? (
              <EmptyState message="No fee records." />
            ) : (
              <div className="rounded-xl border bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-emerald-50 text-left">
                    <tr>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Due</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((f) => (
                      <tr key={f.id} className="border-t">
                        <td className="px-4 py-3">{f.description || `${f.academic_term} tuition`}</td>
                        <td className="px-4 py-3">GHS {f.amount}</td>
                        <td className="px-4 py-3">{f.due_date}</td>
                        <td className="px-4 py-3">{f.paid ? "Paid" : "Outstanding"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </DashboardShell>
  )
}
