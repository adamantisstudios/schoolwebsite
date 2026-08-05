import { NextRequest } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PARENT", "PRINCIPAL", "ACCOUNTANT"] })
  if (!isAuthResult(auth)) return auth

  const supabase = getSupabaseAdmin()
  const category = new URL(req.url).searchParams.get("category")

  // Product catalog is readable by parents/principal/accountant when authenticated
  let query = supabase.from("products").select("*").eq("is_active", true).order("name")
  if (category) query = query.eq("category", category)
  const { data, error } = await query
  if (error) return jsonError(error.message, 500)
  return jsonOk(data)
}

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive().max(50),
      })
    )
    .min(1)
    .max(50),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PARENT"], permission: "shop:order" })
  if (!isAuthResult(auth)) return auth

  const parsed = orderSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid order payload", 400)

  const supabase = getSupabaseAdmin()
  const { data: parent } = await supabase.from("parents").select("id").eq("user_id", auth.user.id).single()
  if (!parent) return jsonError("Parent profile not found", 404)

  const productIds = parsed.data.items.map((i) => i.productId)
  const { data: products, error: pErr } = await supabase.from("products").select("*").in("id", productIds).eq("is_active", true)
  if (pErr) return jsonError(pErr.message, 500)

  const productMap = new Map((products || []).map((p) => [p.id, p]))
  let total = 0
  const lineItems: { product_id: string; quantity: number; price: number }[] = []

  for (const item of parsed.data.items) {
    const product = productMap.get(item.productId)
    if (!product) return jsonError(`Product not found: ${item.productId}`, 400)
    if (product.stock < item.quantity) return jsonError(`Insufficient stock for ${product.name}`, 400)
    total += product.price * item.quantity
    lineItems.push({ product_id: product.id, quantity: item.quantity, price: product.price })
  }

  const { data: order, error: oErr } = await supabase
    .from("orders")
    .insert({ parent_id: parent.id, total_amount: total, status: "PENDING" })
    .select()
    .single()
  if (oErr) return jsonError(oErr.message, 500)

  const { error: iErr } = await supabase.from("order_items").insert(
    lineItems.map((li) => ({ ...li, order_id: order.id }))
  )
  if (iErr) return jsonError(iErr.message, 500)

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "ORDER_CREATE",
    resource: "orders",
    resourceId: order.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    details: { total, itemCount: lineItems.length },
  })

  return jsonOk(order, 201)
}

const checkoutSchema = z.object({
  orderId: z.string().uuid(),
})

/** Mock payment — marks order PAID and decrements stock */
export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PARENT"], permission: "shop:order" })
  if (!isAuthResult(auth)) return auth

  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid checkout payload", 400)

  const supabase = getSupabaseAdmin()
  const { data: parent } = await supabase.from("parents").select("id").eq("user_id", auth.user.id).single()
  if (!parent) return jsonError("Parent profile not found", 404)

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", parsed.data.orderId)
    .eq("parent_id", parent.id)
    .single()

  if (!order) return jsonError("Order not found", 404)
  if (order.status !== "PENDING") return jsonError("Order is not pending", 400)

  for (const item of order.order_items || []) {
    const { data: product } = await supabase.from("products").select("stock").eq("id", item.product_id).single()
    if (!product || product.stock < item.quantity) {
      return jsonError("Stock changed — unable to complete payment", 409)
    }
    await supabase
      .from("products")
      .update({ stock: product.stock - item.quantity })
      .eq("id", item.product_id)
  }

  const { data: updated, error } = await supabase
    .from("orders")
    .update({ status: "PAID" })
    .eq("id", order.id)
    .select()
    .single()
  if (error) return jsonError(error.message, 500)

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "ORDER_PAID",
    resource: "orders",
    resourceId: order.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    severity: "INFO",
    details: { total: order.total_amount },
  })

  return jsonOk(updated)
}
