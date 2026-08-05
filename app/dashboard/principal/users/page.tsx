"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { EmptyState, LoadingBlock, PageHeader } from "@/components/dashboard/ui"
import { principalNav } from "@/components/dashboard/principal-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    role: "TEACHER",
    employeeId: "",
    badgeNumber: "",
  })

  async function load() {
    setLoading(true)
    const j = await fetch("/api/users").then((r) => r.json())
    if (j.ok) setUsers(j.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function createUser(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const json = await res.json()
    setMessage(json.ok ? "User created." : json.error)
    if (json.ok) {
      setForm({ email: "", password: "", name: "", phone: "", role: "TEACHER", employeeId: "", badgeNumber: "" })
      load()
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !isActive }),
    })
    const json = await res.json()
    setMessage(json.ok ? "User updated." : json.error)
    if (json.ok) load()
  }

  return (
    <DashboardShell title="Principal Portal" nav={principalNav}>
      <PageHeader title="User management" description="Create staff/parent accounts and reset access" />
      {message && <p className="mb-3 text-sm text-emerald-700">{message}</p>}

      <form onSubmit={createUser} className="rounded-xl border bg-white p-4 grid sm:grid-cols-2 gap-3 mb-8">
        <div>
          <Label>Name</Label>
          <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label>Email</Label>
          <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <Label>Password (min 10)</Label>
          <Input required minLength={10} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div>
          <Label>Role</Label>
          <select className="w-full border rounded-md px-3 py-2 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="TEACHER">Teacher</option>
            <option value="SECURITY">Security</option>
            <option value="PARENT">Parent</option>
            <option value="ACCOUNTANT">Accountant</option>
            <option value="PRINCIPAL">Principal</option>
          </select>
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        {form.role === "TEACHER" && (
          <div>
            <Label>Employee ID</Label>
            <Input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
          </div>
        )}
        {form.role === "SECURITY" && (
          <div>
            <Label>Badge number</Label>
            <Input value={form.badgeNumber} onChange={(e) => setForm({ ...form, badgeNumber: e.target.value })} />
          </div>
        )}
        <Button type="submit" className="sm:col-span-2 bg-amber-500 hover:bg-amber-600">
          Create user
        </Button>
      </form>

      {loading ? (
        <LoadingBlock />
      ) : users.length === 0 ? (
        <EmptyState message="No users." />
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">{u.is_active ? "Active" : "Disabled"}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" onClick={() => toggleActive(u.id, u.is_active)}>
                      {u.is_active ? "Disable" : "Enable"}
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
