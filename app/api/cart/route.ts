import { NextRequest } from "next/server"
import { z } from "zod"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { isAuthResult, jsonError, jsonOk, requireAuth } from "@/lib/api"
import { getRequestMeta, writeAuditLog } from "@/lib/audit"

async function getParentId(userId: string) {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase.from("parents").select("id").eq("user_id", userId).single()
  return data?.id ?? null
}

async function getOrCreateCart(parentId: string) {
  const supabase = getSupabaseAdmin()
  const { data: existing } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("parent_id", parentId)
    .eq("status", "PENDING")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing) return existing

  const { data: created, error } = await supabase
    .from("orders")
    .insert({ parent_id: parentId, total_amount: 0, status: "PENDING" })
    .select("*, order_items(*, products(*))")
    .single()

  if (error) throw new Error(error.message)
  return created
}

async function recalcOrderTotal(orderId: string) {
  const supabase = getSupabaseAdmin()
  const { data: items } = await supabase.from("order_items").select("quantity, price").eq("order_id", orderId)
  const total = (items || []).reduce((s, i) => s + i.quantity * i.price, 0)
  await supabase.from("orders").update({ total_amount: total }).eq("id", orderId)
  return total
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PARENT"], permission: "shop:order" })
  if (!isAuthResult(auth)) return auth

  const parentId = await getParentId(auth.user.id)
  if (!parentId) return jsonError("Parent profile not found", 404)

  try {
    const cart = await getOrCreateCart(parentId)
    return jsonOk(cart)
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Failed to load cart", 500)
  }
}

const addSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive().max(50).default(1),
})

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PARENT"], permission: "shop:order" })
  if (!isAuthResult(auth)) return auth

  const parsed = addSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jsonError("Invalid cart item", 400)

  const parentId = await getParentId(auth.user.id)
  if (!parentId) return jsonError("Parent profile not found", 404)

  const supabase = getSupabaseAdmin()
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", parsed.data.productId)
    .eq("is_active", true)
    .single()

  if (!product) return jsonError("Product not found", 404)
  if (product.stock < parsed.data.quantity) return jsonError("Insufficient stock", 400)

  const cart = await getOrCreateCart(parentId)
  const existing = (cart.order_items || []).find((i: { product_id: string }) => i.product_id === parsed.data.productId)

  if (existing) {
    const newQty = existing.quantity + parsed.data.quantity
    if (product.stock < newQty) return jsonError("Insufficient stock", 400)
    await supabase.from("order_items").update({ quantity: newQty }).eq("id", existing.id)
  } else {
    await supabase.from("order_items").insert({
      order_id: cart.id,
      product_id: product.id,
      quantity: parsed.data.quantity,
      price: product.price,
    })
  }

  const total = await recalcOrderTotal(cart.id)
  const updated = await getOrCreateCart(parentId)

  const meta = getRequestMeta(req)
  await writeAuditLog({
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    actorRole: auth.user.role,
    action: "CART_ADD",
    resource: "orders",
    resourceId: cart.id,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
    details: { productId: parsed.data.productId, quantity: parsed.data.quantity, total },
  })

  return jsonOk(updated)
}

const updateSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(0).max(50),
})

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PARENT"], permission: "shop:order" })
  if (!isAuthResult(auth)) return auth

  const body = await req.json().catch(() => null)

  if (body?.action === "checkout") {
    const orderId = body.orderId as string
    const parentId = await getParentId(auth.user.id)
    if (!parentId) return jsonError("Parent profile not found", 404)

    const supabase = getSupabaseAdmin()
    const { data: order } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .eq("parent_id", parentId)
      .eq("status", "PENDING")
      .single()

    if (!order) return jsonError("Cart not found", 404)
    if (!order.order_items?.length) return jsonError("Cart is empty", 400)

    for (const item of order.order_items) {
      const { data: product } = await supabase.from("products").select("stock").eq("id", item.product_id).single()
      if (!product || product.stock < item.quantity) {
        return jsonError("Stock changed — update cart before checkout", 409)
      }
    }

    for (const item of order.order_items) {
      const { data: product } = await supabase.from("products").select("stock").eq("id", item.product_id).single()
      if (product) {
        await supabase.from("products").update({ stock: product.stock - item.quantity }).eq("id", item.product_id)
      }
    }

    const { data: paid, error } = await supabase
      .from("orders")
      .update({ status: "PAID" })
      .eq("id", order.id)
      .select("*, order_items(*, products(name))")
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
      details: { total: order.total_amount },
    })

    return jsonOk(paid)
  }

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return jsonError("Invalid cart update", 400)

  const parentId = await getParentId(auth.user.id)
  if (!parentId) return jsonError("Parent profile not found", 404)

  const cart = await getOrCreateCart(parentId)
  const supabase = getSupabaseAdmin()

  if (parsed.data.quantity === 0) {
    await supabase
      .from("order_items")
      .delete()
      .eq("order_id", cart.id)
      .eq("product_id", parsed.data.productId)
  } else {
    const { data: product } = await supabase.from("products").select("stock, price").eq("id", parsed.data.productId).single()
    if (!product || product.stock < parsed.data.quantity) return jsonError("Insufficient stock", 400)

    const { data: existing } = await supabase
      .from("order_items")
      .select("id")
      .eq("order_id", cart.id)
      .eq("product_id", parsed.data.productId)
      .maybeSingle()

    if (existing) {
      await supabase.from("order_items").update({ quantity: parsed.data.quantity }).eq("id", existing.id)
    } else {
      await supabase.from("order_items").insert({
        order_id: cart.id,
        product_id: parsed.data.productId,
        quantity: parsed.data.quantity,
        price: product.price,
      })
    }
  }

  await recalcOrderTotal(cart.id)
  const updated = await getOrCreateCart(parentId)
  return jsonOk(updated)
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req, { roles: ["PARENT"], permission: "shop:order" })
  if (!isAuthResult(auth)) return auth

  const productId = new URL(req.url).searchParams.get("productId")
  if (!productId) return jsonError("productId required", 400)

  const parentId = await getParentId(auth.user.id)
  if (!parentId) return jsonError("Parent profile not found", 404)

  const cart = await getOrCreateCart(parentId)
  const supabase = getSupabaseAdmin()
  await supabase.from("order_items").delete().eq("order_id", cart.id).eq("product_id", productId)
  await recalcOrderTotal(cart.id)
  const updated = await getOrCreateCart(parentId)
  return jsonOk(updated)
}
