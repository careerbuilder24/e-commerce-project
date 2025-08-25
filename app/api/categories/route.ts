import { NextResponse } from "next/server"
import { getCategories } from "@/lib/product"

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Get categories API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
