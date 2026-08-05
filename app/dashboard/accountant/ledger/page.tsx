"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { downloadTablePdf } from "@/lib/pdf"

const nav = [
  { href: "/dashboard/accountant", label: "Overview" },
  { href: "/dashboard/accountant/fees", label: "Student fees" },
  { href: "/dashboard/accountant/ledger", label: "Ledger" },
]

export default function LedgerPage() {
  const [tx, setTx] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ type: "INCOME", amount: "", description: "", date: new Date().toISOString().slice(0, 10) })
  const [message, setMessage] = useState("")

  async function load() {
    setLoading(true)
    const j = await fetch("/api/finance").then((r) => r.json())
    if (j.ok) setTx(j.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/finance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: form.type,
        amount: Number(form.amount),
        description: form.description,
        date: form.date,
      }),
    })
    const json = await res.json()
    setMessage(json.ok ? "Entry saved." : json.error)
    if (json.ok) {
      setForm({ ...form, amount: "", description: "" })
      load()
    }
  }

  function exportCsv() {
    const rows = [["Date", "Type", "Amount", "Description"], ...tx.map((t) => [t.date, t.type, t.amount, `"${t.description}"`])]
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ledger.csv"
    a.click()
  }

  function exportPdf() {
    downloadTablePdf({
      title: "General Ledger",
      subtitle: `${tx.length} transactions`,
      filename: "ledger.pdf",
      columns: [
        { header: "Date", key: "date" },
        { header: "Type", key: "type" },
        { header: "Amount", key: "amount" },
        { header: "Description", key: "description" },
      ],
      rows: tx.map((t) => ({
        date: t.date,
        type: t.type,
        amount: `GHS ${t.amount}`,
        description: t.description,
      })),
    })
  }

  return (
    <DashboardShell title="Accountant Portal" nav={nav}>
      <PageHeader
        title="General ledger"
        description="Income and expense entries"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCsv}>
              Export CSV
            </Button>
            <Button variant="outline" onClick={exportPdf}>
              Download PDF
            </Button>
          </div>
        }
      />

      <form onSubmit={add} className="rounded-xl border bg-white p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div>
          <Label>Type</Label>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>
        <div>
          <Label>Amount</Label>
          <Input required type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="sm:col-span-2 lg:col-span-2">
          <Label>Description</Label>
          <Input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <Button type="submit" className="bg-amber-500 hover:bg-amber-600 sm:col-span-2 lg:col-span-5">
          Add entry
        </Button>
      </form>

      {message && <p className="mb-3 text-sm text-emerald-700">{message}</p>}

      {loading ? (
        <LoadingBlock />
      ) : tx.length === 0 ? (
        <EmptyState message="No transactions yet." />
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-left">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {tx.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-3">{t.date}</td>
                  <td className="px-4 py-3">{t.type}</td>
                  <td className="px-4 py-3">GHS {t.amount}</td>
                  <td className="px-4 py-3">{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  )
}
