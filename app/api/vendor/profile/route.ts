import { NextResponse } from "next/server"
import { getCurrentVendor } from "@/lib/vendor"

export async function GET() {
  try {
    const vendor = await getCurrentVendor()

    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }

    return NextResponse.json({ vendor })
  } catch (error) {
    console.error("Get vendor profile API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
