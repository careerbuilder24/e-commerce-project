// import { executeQuery } from "./db"
// import { getCurrentUser } from "./auth"

export interface Vendor {
  id: number
  user_id: string
  store_name: string
  store_description?: string
  store_logo?: string
  store_banner?: string
  contact_email?: string
  contact_phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  is_active: boolean
  commission_rate: number
  created_at: string
  updated_at: string
}

export interface VendorStats {
  total_products: number
  total_orders: number
  total_revenue: number
  pending_orders: number
}

// Create vendor profile
export async function createVendor(vendorData: {
  store_name: string
  store_description?: string
  contact_email?: string
  contact_phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
}): Promise<{ success: boolean; vendor?: Vendor; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Check if user already has a vendor profile
    const existingVendor = await executeQuery("SELECT id FROM vendors WHERE user_id = $1", [user.id])

    if (existingVendor.length > 0) {
      return { success: false, error: "Vendor profile already exists" }
    }

    const result = await executeQuery(
      `INSERT INTO vendors (
        user_id, store_name, store_description, contact_email, contact_phone,
        address, city, state, country, postal_code, is_active, commission_rate,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
      RETURNING *`,
      [
        user.id,
        vendorData.store_name,
        vendorData.store_description || null,
        vendorData.contact_email || null,
        vendorData.contact_phone || null,
        vendorData.address || null,
        vendorData.city || null,
        vendorData.state || null,
        vendorData.country || null,
        vendorData.postal_code || null,
        true,
        10.0,
      ],
    )

    return { success: true, vendor: result[0] }
  } catch (error) {
    console.error("Create vendor error:", error)
    return { success: false, error: "Failed to create vendor profile" }
  }
}

// Get vendor by user ID
export async function getVendorByUserId(userId: string): Promise<Vendor | null> {
  try {
    const result = await executeQuery("SELECT * FROM vendors WHERE user_id = $1", [userId])
    return result[0] || null
  } catch (error) {
    console.error("Get vendor error:", error)
    return null
  }
}

// Get current user's vendor profile
export async function getCurrentVendor(): Promise<Vendor | null> {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    return await getVendorByUserId(user.id)
  } catch (error) {
    console.error("Get current vendor error:", error)
    return null
  }
}

// Update vendor profile
export async function updateVendor(
  vendorId: number,
  updates: Partial<Omit<Vendor, "id" | "user_id" | "created_at" | "updated_at">>,
): Promise<{ success: boolean; vendor?: Vendor; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Verify vendor ownership
    const vendor = await executeQuery("SELECT * FROM vendors WHERE id = $1 AND user_id = $2", [vendorId, user.id])

    if (vendor.length === 0) {
      return { success: false, error: "Vendor not found or access denied" }
    }

    const updateFields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ")

    const values = [vendorId, ...Object.values(updates)]

    const result = await executeQuery(
      `UPDATE vendors SET ${updateFields}, updated_at = NOW() 
       WHERE id = $1 RETURNING *`,
      values,
    )

    return { success: true, vendor: result[0] }
  } catch (error) {
    console.error("Update vendor error:", error)
    return { success: false, error: "Failed to update vendor profile" }
  }
}

// Get vendor statistics
export async function getVendorStats(vendorId: number): Promise<VendorStats> {
  try {
    const [productsResult, ordersResult, revenueResult, pendingResult] = await Promise.all([
      executeQuery("SELECT COUNT(*) as count FROM products WHERE vendor_id = $1", [vendorId]),
      executeQuery("SELECT COUNT(*) as count FROM order_items WHERE vendor_id = $1", [vendorId]),
      executeQuery("SELECT COALESCE(SUM(total_price), 0) as total FROM order_items WHERE vendor_id = $1", [vendorId]),
      executeQuery(
        `SELECT COUNT(*) as count FROM order_items oi 
         JOIN orders o ON oi.order_id = o.id 
         WHERE oi.vendor_id = $1 AND o.status = 'pending'`,
        [vendorId],
      ),
    ])

    return {
      total_products: Number.parseInt(productsResult[0]?.count || "0"),
      total_orders: Number.parseInt(ordersResult[0]?.count || "0"),
      total_revenue: Number.parseFloat(revenueResult[0]?.total || "0"),
      pending_orders: Number.parseInt(pendingResult[0]?.count || "0"),
    }
  } catch (error) {
    console.error("Get vendor stats error:", error)
    return {
      total_products: 0,
      total_orders: 0,
      total_revenue: 0,
      pending_orders: 0,
    }
  }
}
