"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { downloadSimplePdf } from "@/lib/pdf"

const nav = [
  { href: "/dashboard/accountant", label: "Overview" },
  { href: "/dashboard/accountant/fees", label: "Student fees" },
  { href: "/dashboard/accountant/ledger", label: "Ledger" },
]

export default function FeesPage() {
  const [fees, setFees] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({
    studentId: "",
    amount: "",
    dueDate: new Date().toISOString().slice(0, 10),
    academicTerm: "Term 1",
    academicYear: "2025/2026",
    description: "Tuition",
  })

  async function load() {
    setLoading(true)
    const [f, s] = await Promise.all([
      fetch("/api/fees").then((r) => r.json()),
      fetch("/api/students").then((r) => r.json()),
    ])
    if (f.ok) setFees(f.data)
    if (s.ok) setStudents(s.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function createFee(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/fees", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: form.studentId,
        amount: Number(form.amount),
        dueDate: form.dueDate,
        academicTerm: form.academicTerm,
        academicYear: form.academicYear,
        description: form.description,
      }),
    })
    const json = await res.json()
    setMessage(json.ok ? "Fee created." : json.error)
    if (json.ok) load()
  }

  async function markPaid(feeId: string) {
    setMessage("")
    const res = await fetch("/api/fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feeId }),
    })
    const json = await res.json()
    setMessage(json.ok ? "Payment recorded." : json.error)
    if (json.ok) load()
  }

  function downloadReceipt(fee: any) {
    downloadSimplePdf(
      "Fee Receipt",
      [
        `Student: ${fee.students?.first_name || ""} ${fee.students?.last_name || ""} (${fee.students?.student_id || ""})`,
        `Amount: GHS ${fee.amount}`,
        `Term: ${fee.academic_term} ${fee.academic_year}`,
        `Due date: ${fee.due_date}`,
        `Paid date: ${fee.paid_date || "—"}`,
        `Status: ${fee.paid ? "PAID" : "OUTSTANDING"}`,
        `Description: ${fee.description || "School fee"}`,
      ],
      `receipt-${fee.students?.student_id || fee.id}.pdf`
    )
  }

  return (
    <DashboardShell title="Accountant Portal" nav={nav}>
      <PageHeader title="Student fees" description="Create fees, record payments, download receipts" />
      {message && <p className="mb-3 text-sm text-emerald-700">{message}</p>}

      <form onSubmit={createFee} className="rounded-xl border bg-white p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 max-w-4xl">
        <div>
          <Label>Student</Label>
          <select
            required
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          >
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.first_name} {s.last_name} ({s.student_id})
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Amount (GHS)</Label>
          <Input required type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <div>
          <Label>Due date</Label>
          <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        </div>
        <div>
          <Label>Term</Label>
          <Input value={form.academicTerm} onChange={(e) => setForm({ ...form, academicTerm: e.target.value })} />
        </div>
        <div>
          <Label>Year</Label>
          <Input value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} />
        </div>
        <div>
          <Label>Description</Label>
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <Button type="submit" className="sm:col-span-2 lg:col-span-3 bg-amber-500 hover:bg-amber-600">
          Create fee
        </Button>
      </form>

      {loading ? (
        <LoadingBlock />
      ) : fees.length === 0 ? (
        <EmptyState message="No fees found." />
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-left">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="px-4 py-3">
                    {f.students?.first_name} {f.students?.last_name}
                  </td>
                  <td className="px-4 py-3">GHS {f.amount}</td>
                  <td className="px-4 py-3">{f.paid ? `Paid ${f.paid_date || ""}` : "Outstanding"}</td>
                  <td className="px-4 py-3 space-x-2">
                    {!f.paid && (
                      <Button size="sm" onClick={() => markPaid(f.id)}>
                        Mark paid
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => downloadReceipt(f)}>
                      PDF receipt
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
