import { NextResponse } from "next/server"
import { getCurrentVendor, getVendorStats } from "@/lib/vendor"

export async function GET() {
  try {
    const vendor = await getCurrentVendor()

    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 })
    }

    const stats = await getVendorStats(vendor.id)

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Get vendor stats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
