import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

// Create a singleton SQL client
const sql = neon(process.env.DATABASE_URL)

export { sql }

// Database utility functions
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const result = await sql(query, params)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function to get products with pagination
export async function getProducts(
  options: {
    limit?: number
    offset?: number
    categoryId?: number
    vendorId?: number
    isActive?: boolean
    isFeatured?: boolean
    search?: string
  } = {},
) {
  const { limit = 20, offset = 0, categoryId, vendorId, isActive = true, isFeatured, search } = options

  let query = `
    SELECT 
      p.*,
      v.store_name as vendor_name,
      c.name as category_name,
      pi.image_url as primary_image
    FROM products p
    LEFT JOIN vendors v ON p.vendor_id = v.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
    WHERE p.is_active = $1
  `

  const params: any[] = [isActive]
  let paramIndex = 2

  if (categoryId) {
    query += ` AND p.category_id = $${paramIndex}`
    params.push(categoryId)
    paramIndex++
  }

  if (vendorId) {
    query += ` AND p.vendor_id = $${paramIndex}`
    params.push(vendorId)
    paramIndex++
  }

  if (isFeatured !== undefined) {
    query += ` AND p.is_featured = $${paramIndex}`
    params.push(isFeatured)
    paramIndex++
  }

  if (search) {
    query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`
    params.push(`%${search}%`)
    paramIndex++
  }

  query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
  params.push(limit, offset)

  return await executeQuery(query, params)
}

// Helper function to get product by ID with all details
export async function getProductById(id: number) {
  const query = `
    SELECT 
      p.*,
      v.store_name as vendor_name,
      v.id as vendor_id,
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
      ) as images,
      COALESCE(
        JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT(
            'id', pv.id,
            'name', pv.name,
            'sku', pv.sku,
            'price', pv.price,
            'inventory_quantity', pv.inventory_quantity,
            'option1_name', pv.option1_name,
            'option1_value', pv.option1_value,
            'option2_name', pv.option2_name,
            'option2_value', pv.option2_value
          )
        ) FILTER (WHERE pv.id IS NOT NULL), 
        '[]'
      ) as variants
    FROM products p
    LEFT JOIN vendors v ON p.vendor_id = v.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    LEFT JOIN product_variants pv ON p.id = pv.product_id AND pv.is_active = true
    WHERE p.id = $1 AND p.is_active = true
    GROUP BY p.id, v.store_name, v.id, c.name
  `

  const result = await executeQuery(query, [id])
  return result[0] || null
}

// Helper function to get categories with subcategories
export async function getCategories() {
  const query = `
    WITH RECURSIVE category_tree AS (
      SELECT id, name, slug, description, parent_id, sort_order, 0 as level
      FROM categories 
      WHERE parent_id IS NULL AND is_active = true
      
      UNION ALL
      
      SELECT c.id, c.name, c.slug, c.description, c.parent_id, c.sort_order, ct.level + 1
      FROM categories c
      INNER JOIN category_tree ct ON c.parent_id = ct.id
      WHERE c.is_active = true
    )
    SELECT * FROM category_tree ORDER BY level, sort_order, name
  `

  return await executeQuery(query)
}
