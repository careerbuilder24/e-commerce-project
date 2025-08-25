import { type NextRequest, NextResponse } from "next/server"
import { createVendor } from "@/lib/vendor"

export async function POST(request: NextRequest) {
  try {
    const vendorData = await request.json()

    if (!vendorData.store_name) {
      return NextResponse.json({ error: "Store name is required" }, { status: 400 })
    }

    const result = await createVendor(vendorData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      vendor: result.vendor,
    })
  } catch (error) {
    console.error("Vendor register API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
