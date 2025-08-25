import { type NextRequest, NextResponse } from "next/server"
import { createProduct, getVendorProducts } from "@/lib/product"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 20
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : 0
    const search = searchParams.get("search") || undefined
    const category_id = searchParams.get("category_id") ? Number.parseInt(searchParams.get("category_id")!) : undefined
    const is_active = searchParams.get("is_active") ? searchParams.get("is_active") === "true" : undefined

    const products = await getVendorProducts({
      limit,
      offset,
      search,
      category_id,
      is_active,
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Get vendor products API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    if (!productData.name || !productData.price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 })
    }

    const result = await createProduct(productData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      product: result.product,
    })
  } catch (error) {
    console.error("Create product API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
