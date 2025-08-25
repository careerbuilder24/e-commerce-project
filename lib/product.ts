import { executeQuery } from "./db"
import { getCurrentVendor } from "./vendor"

export interface Product {
  id: number
  vendor_id: number
  category_id?: number
  name: string
  slug: string
  description?: string
  short_description?: string
  sku?: string
  price: number
  compare_price?: number
  cost_price?: number
  track_inventory: boolean
  inventory_quantity: number
  low_stock_threshold: number
  weight?: number
  dimensions_length?: number
  dimensions_width?: number
  dimensions_height?: number
  is_active: boolean
  is_featured: boolean
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
  vendor_name?: string
  category_name?: string
  primary_image?: string
  images?: ProductImage[]
  variants?: ProductVariant[]
}

export interface ProductImage {
  id: number
  product_id: number
  image_url: string
  alt_text?: string
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface ProductVariant {
  id: number
  product_id: number
  name: string
  sku?: string
  price?: number
  compare_price?: number
  inventory_quantity: number
  weight?: number
  option1_name?: string
  option1_value?: string
  option2_name?: string
  option2_value?: string
  option3_name?: string
  option3_value?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parent_id?: number
  is_active: boolean
  sort_order: number
}

// Generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Create product
export async function createProduct(productData: {
  name: string
  description?: string
  short_description?: string
  category_id?: number
  price: number
  compare_price?: number
  cost_price?: number
  sku?: string
  track_inventory?: boolean
  inventory_quantity?: number
  low_stock_threshold?: number
  weight?: number
  is_active?: boolean
  is_featured?: boolean
  meta_title?: string
  meta_description?: string
}): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const vendor = await getCurrentVendor()
    if (!vendor) {
      return { success: false, error: "Vendor authentication required" }
    }

    const slug = generateSlug(productData.name)

    // Check if slug already exists for this vendor
    const existingProduct = await executeQuery("SELECT id FROM products WHERE vendor_id = $1 AND slug = $2", [
      vendor.id,
      slug,
    ])

    if (existingProduct.length > 0) {
      return { success: false, error: "A product with this name already exists" }
    }

    const result = await executeQuery(
      `INSERT INTO products (
        vendor_id, category_id, name, slug, description, short_description, sku,
        price, compare_price, cost_price, track_inventory, inventory_quantity,
        low_stock_threshold, weight, is_active, is_featured, meta_title, meta_description,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())
      RETURNING *`,
      [
        vendor.id,
        productData.category_id || null,
        productData.name,
        slug,
        productData.description || null,
        productData.short_description || null,
        productData.sku || null,
        productData.price,
        productData.compare_price || null,
        productData.cost_price || null,
        productData.track_inventory ?? true,
        productData.inventory_quantity ?? 0,
        productData.low_stock_threshold ?? 5,
        productData.weight || null,
        productData.is_active ?? true,
        productData.is_featured ?? false,
        productData.meta_title || null,
        productData.meta_description || null,
      ],
    )

    return { success: true, product: result[0] }
  } catch (error) {
    console.error("Create product error:", error)
    return { success: false, error: "Failed to create product" }
  }
}

// Get vendor products
export async function getVendorProducts(
  options: {
    limit?: number
    offset?: number
    search?: string
    category_id?: number
    is_active?: boolean
  } = {},
): Promise<Product[]> {
  try {
    const vendor = await getCurrentVendor()
    if (!vendor) return []

    const { limit = 20, offset = 0, search, category_id, is_active } = options

    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        pi.image_url as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE p.vendor_id = $1
    `

    const params: any[] = [vendor.id]
    let paramIndex = 2

    if (search) {
      query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    if (category_id) {
      query += ` AND p.category_id = $${paramIndex}`
      params.push(category_id)
      paramIndex++
    }

    if (is_active !== undefined) {
      query += ` AND p.is_active = $${paramIndex}`
      params.push(is_active)
      paramIndex++
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    return await executeQuery(query, params)
  } catch (error) {
    console.error("Get vendor products error:", error)
    return []
  }
}

// Get product by ID (vendor-owned)
export async function getVendorProductById(productId: number): Promise<Product | null> {
  try {
    const vendor = await getCurrentVendor()
    if (!vendor) return null

    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', pi.id,
              'image_url', pi.image_url,
              'alt_text', pi.alt_text,
              'is_primary', pi.is_primary,
              'sort_order', pi.sort_order
            )
          ) FILTER (WHERE pi.id IS NOT NULL), 
          '[]'
        ) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = $1 AND p.vendor_id = $2
      GROUP BY p.id, c.name
    `

    const result = await executeQuery(query, [productId, vendor.id])
    return result[0] || null
  } catch (error) {
    console.error("Get vendor product error:", error)
    return null
  }
}

// Update product
export async function updateProduct(
  productId: number,
  updates: Partial<Omit<Product, "id" | "vendor_id" | "created_at" | "updated_at">>,
): Promise<{ success: boolean; product?: Product; error?: string }> {
  try {
    const vendor = await getCurrentVendor()
    if (!vendor) {
      return { success: false, error: "Vendor authentication required" }
    }

    // Verify product ownership
    const product = await executeQuery("SELECT * FROM products WHERE id = $1 AND vendor_id = $2", [
      productId,
      vendor.id,
    ])

    if (product.length === 0) {
      return { success: false, error: "Product not found or access denied" }
    }

    // Generate new slug if name is being updated
    if (updates.name && updates.name !== product[0].name) {
      const newSlug = generateSlug(updates.name)
      const existingProduct = await executeQuery(
        "SELECT id FROM products WHERE vendor_id = $1 AND slug = $2 AND id != $3",
        [vendor.id, newSlug, productId],
      )

      if (existingProduct.length > 0) {
        return { success: false, error: "A product with this name already exists" }
      }

      updates.slug = newSlug
    }

    const updateFields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ")

    const values = [productId, ...Object.values(updates)]

    const result = await executeQuery(
      `UPDATE products SET ${updateFields}, updated_at = NOW() 
       WHERE id = $1 RETURNING *`,
      values,
    )

    return { success: true, product: result[0] }
  } catch (error) {
    console.error("Update product error:", error)
    return { success: false, error: "Failed to update product" }
  }
}

// Delete product
export async function deleteProduct(productId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const vendor = await getCurrentVendor()
    if (!vendor) {
      return { success: false, error: "Vendor authentication required" }
    }

    // Verify product ownership
    const product = await executeQuery("SELECT id FROM products WHERE id = $1 AND vendor_id = $2", [
      productId,
      vendor.id,
    ])

    if (product.length === 0) {
      return { success: false, error: "Product not found or access denied" }
    }

    await executeQuery("DELETE FROM products WHERE id = $1", [productId])

    return { success: true }
  } catch (error) {
    console.error("Delete product error:", error)
    return { success: false, error: "Failed to delete product" }
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const query = `
      SELECT id, name, slug, description, parent_id, is_active, sort_order
      FROM categories 
      WHERE is_active = true
      ORDER BY sort_order, name
    `

    return await executeQuery(query)
  } catch (error) {
    console.error("Get categories error:", error)
    return []
  }
}

// Add product image
export async function addProductImage(
  productId: number,
  imageUrl: string,
  altText?: string,
  isPrimary = false,
): Promise<{ success: boolean; image?: ProductImage; error?: string }> {
  try {
    const vendor = await getCurrentVendor()
    if (!vendor) {
      return { success: false, error: "Vendor authentication required" }
    }

    // Verify product ownership
    const product = await executeQuery("SELECT id FROM products WHERE id = $1 AND vendor_id = $2", [
      productId,
      vendor.id,
    ])

    if (product.length === 0) {
      return { success: false, error: "Product not found or access denied" }
    }

    // If this is primary, unset other primary images
    if (isPrimary) {
      await executeQuery("UPDATE product_images SET is_primary = false WHERE product_id = $1", [productId])
    }

    // Get next sort order
    const sortResult = await executeQuery(
      "SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM product_images WHERE product_id = $1",
      [productId],
    )
    const sortOrder = sortResult[0]?.next_order || 1

    const result = await executeQuery(
      `INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [productId, imageUrl, altText || null, sortOrder, isPrimary],
    )

    return { success: true, image: result[0] }
  } catch (error) {
    console.error("Add product image error:", error)
    return { success: false, error: "Failed to add product image" }
  }
}
