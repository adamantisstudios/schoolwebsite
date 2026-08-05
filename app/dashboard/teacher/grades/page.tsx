"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { downloadTablePdf } from "@/lib/pdf"

const nav = [
  { href: "/dashboard/teacher", label: "Overview" },
  { href: "/dashboard/teacher/students", label: "Students" },
  { href: "/dashboard/teacher/attendance", label: "Attendance" },
  { href: "/dashboard/teacher/grades", label: "Grades" },
]

export default function GradesPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [classId, setClassId] = useState("")
  const [courseId, setCourseId] = useState("")
  const [students, setStudents] = useState<any[]>([])
  const [scores, setScores] = useState<Record<string, string>>({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const [assessmentType, setAssessmentType] = useState("Quiz 1")
  const [term, setTerm] = useState("Term 1")
  const [academicYear, setAcademicYear] = useState("2025/2026")
  const [maxScore, setMaxScore] = useState("100")
  const [history, setHistory] = useState<any[]>([])
  const [summary, setSummary] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewStudentId, setReviewStudentId] = useState("")
  const [reviewText, setReviewText] = useState("")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    Promise.all([fetch("/api/classes").then((r) => r.json()), fetch("/api/teacher/overview").then((r) => r.json())]).then(
      ([c, o]) => {
        if (c.ok) {
          setClasses(c.data)
          if (c.data[0]) setClassId(c.data[0].id)
        }
        if (o.ok) {
          setCourses(o.data.courses || [])
          if (o.data.courses?.[0]) setCourseId(o.data.courses[0].id)
        }
        setLoading(false)
      }
    )
  }, [])

  useEffect(() => {
    if (!classId) return
    fetch(`/api/students?classId=${classId}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) {
          setStudents(j.data)
          const map: Record<string, string> = {}
          const commentMap: Record<string, string> = {}
          j.data.forEach((s: any) => {
            map[s.id] = ""
            commentMap[s.id] = ""
          })
          setScores(map)
          setComments(commentMap)
          if (j.data[0]) setReviewStudentId(j.data[0].id)
        }
      })
  }, [classId])

  useEffect(() => {
    if (!courseId || !classId) return
    fetch(`/api/performance?courseId=${courseId}&classId=${classId}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setHistory(j.data)
      })
    fetch(`/api/teacher/gradebook?courseId=${courseId}&classId=${classId}&term=${encodeURIComponent(term)}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setSummary(j.data.summary || [])
      })
    fetch(`/api/reviews?term=${encodeURIComponent(term)}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setReviews(j.data.filter((rv: any) => students.some((s) => s.id === rv.student_id)))
      })
  }, [courseId, classId, term, message, students])

  async function save() {
    setMessage("")
    const payload = {
      courseId,
      classId,
      assessmentType,
      term,
      academicYear,
      maxScore: Number(maxScore),
      scores: students
        .filter((s) => scores[s.id] !== "" && scores[s.id] != null)
        .map((s) => ({
          studentId: s.id,
          score: Number(scores[s.id]),
          comment: comments[s.id] || undefined,
        })),
    }
    if (payload.scores.length === 0) {
      setMessage("Enter at least one score.")
      return
    }
    const res = await fetch("/api/performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    setMessage(json.ok ? "Grades saved." : json.error)
  }

  async function saveReview(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")
    if (!reviewStudentId || reviewText.trim().length < 10) {
      setMessage("Review must be at least 10 characters.")
      return
    }
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: reviewStudentId,
        courseId,
        term,
        academicYear,
        reviewText: reviewText.trim(),
      }),
    })
    const json = await res.json()
    if (json.ok) {
      setReviewText("")
      setMessage("Review saved.")
    } else {
      setMessage(json.error)
    }
  }

  function printReport() {
    window.print()
  }

  function downloadReportPdf() {
    downloadTablePdf({
      title: "Class Report Card Summary",
      subtitle: `${assessmentType} · ${term} · ${academicYear}`,
      filename: `report-cards-${classId.slice(0, 8)}.pdf`,
      columns: [
        { header: "Student", key: "student" },
        { header: "ID", key: "id" },
        { header: "Average %", key: "avg" },
      ],
      rows: summary.map((s) => ({
        student: `${s.student?.first_name} ${s.student?.last_name}`,
        id: s.student?.student_id,
        avg: s.averagePercent,
      })),
    })
  }

  return (
    <DashboardShell title="Teacher Portal" nav={nav}>
      <PageHeader
        title="Grades & Performance"
        description="Enter scores for your assigned courses only"
        actions={
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" onClick={printReport}>
              Print report
            </Button>
            <Button variant="outline" onClick={downloadReportPdf}>
              Download PDF
            </Button>
            <Button className="bg-amber-500 hover:bg-amber-600" onClick={save}>
              Save grades
            </Button>
          </div>
        }
      />

      {loading ? (
        <LoadingBlock />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 print:hidden">
            <select className="border rounded-md px-3 py-2 text-sm" value={classId} onChange={(e) => setClassId(e.target.value)}>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select className="border rounded-md px-3 py-2 text-sm" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Input value={assessmentType} onChange={(e) => setAssessmentType(e.target.value)} placeholder="Assessment type" />
            <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Term" />
            <Input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="Academic year" />
            <Input value={maxScore} onChange={(e) => setMaxScore(e.target.value)} placeholder="Max score" type="number" />
          </div>

          {message && <p className="mb-3 text-sm text-emerald-700 print:hidden">{message}</p>}

          <div className="rounded-xl border bg-white overflow-hidden mb-8">
            <div className="hidden print:block p-4 text-center">
              <h1 className="font-serif text-xl font-bold">Montessori Bloom — Grade Report</h1>
              <p className="text-sm">
                {assessmentType} · {term} · {academicYear}
              </p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-left">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3 print:hidden">Comment</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-3">
                      {s.first_name} {s.last_name}
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        className="w-28"
                        value={scores[s.id] ?? ""}
                        onChange={(e) => setScores((m) => ({ ...m, [s.id]: e.target.value }))}
                      />
                    </td>
                    <td className="px-4 py-3 print:hidden">
                      <Input
                        className="w-full min-w-[160px]"
                        placeholder="Optional comment"
                        value={comments[s.id] ?? ""}
                        onChange={(e) => setComments((m) => ({ ...m, [s.id]: e.target.value }))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="font-serif text-lg font-semibold mb-3">Gradebook averages</h2>
          {summary.length === 0 ? (
            <EmptyState message="No grades to average yet for this class/course/term." />
          ) : (
            <div className="rounded-xl border bg-white overflow-hidden mb-8">
              <table className="w-full text-sm">
                <thead className="bg-emerald-50 text-left">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Average</th>
                    <th className="px-4 py-3">Entries</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((s, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-3">
                        {s.student?.first_name} {s.student?.last_name}
                      </td>
                      <td className="px-4 py-3">{s.averagePercent}%</td>
                      <td className="px-4 py-3">{s.entries}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h2 className="font-serif text-lg font-semibold mb-3 print:hidden">Student reviews</h2>
          <form onSubmit={saveReview} className="rounded-xl border bg-white p-4 space-y-3 mb-6 print:hidden">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Student</Label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={reviewStudentId}
                  onChange={(e) => setReviewStudentId(e.target.value)}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.first_name} {s.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Term / year</Label>
                <p className="text-sm text-muted-foreground pt-2">
                  {term} · {academicYear}
                </p>
              </div>
            </div>
            <div>
              <Label>Narrative review</Label>
              <Textarea
                required
                minLength={10}
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write a term review for the parent report card…"
              />
            </div>
            <Button type="submit" variant="outline">
              Save review
            </Button>
          </form>

          {reviews.length > 0 && (
            <div className="rounded-xl border bg-white overflow-hidden mb-8 print:hidden">
              <table className="w-full text-sm">
                <thead className="bg-emerald-50 text-left">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Term</th>
                    <th className="px-4 py-3">Review</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.slice(0, 20).map((rv) => (
                    <tr key={rv.id} className="border-t align-top">
                      <td className="px-4 py-3">
                        {rv.students?.first_name} {rv.students?.last_name}
                      </td>
                      <td className="px-4 py-3">{rv.term}</td>
                      <td className="px-4 py-3 text-muted-foreground">{rv.review_text}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h2 className="font-serif text-lg font-semibold mb-3">Recent entries</h2>
          {history.length === 0 ? (
            <EmptyState message="No grades recorded yet for this filter." />
          ) : (
            <div className="rounded-xl border bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-emerald-50 text-left">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Assessment</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Term</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 50).map((h) => (
                    <tr key={h.id} className="border-t">
                      <td className="px-4 py-3">
                        {h.students?.first_name} {h.students?.last_name}
                      </td>
                      <td className="px-4 py-3">{h.assessment_type}</td>
                      <td className="px-4 py-3">
                        {h.score}/{h.max_score}
                      </td>
                      <td className="px-4 py-3">{h.term}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </DashboardShell>
  )
}
