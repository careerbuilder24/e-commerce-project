import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"

// Mock products data
const products = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    comparePrice: 39.99,
    image: "/premium-cotton-t-shirt.png",
    vendorName: "Urban Threads",
    rating: 4,
    reviewCount: 128,
  },
  {
    id: 2,
    name: "Vintage Denim Jacket",
    price: 89.99,
    image: "/vintage-denim-jacket.png",
    vendorName: "Retro Style Co.",
    rating: 5,
    reviewCount: 64,
  },
  {
    id: 3,
    name: "Minimalist Leather Bag",
    price: 149.99,
    comparePrice: 199.99,
    image: "/minimalist-leather-handbag.png",
    vendorName: "Craft & Co.",
    rating: 4,
    reviewCount: 89,
  },
  {
    id: 4,
    name: "Sustainable Sneakers",
    price: 119.99,
    image: "/sustainable-white-sneakers.png",
    vendorName: "EcoStep",
    rating: 4,
    reviewCount: 156,
  },
  {
    id: 5,
    name: "Silk Scarf Collection",
    price: 45.99,
    image: "/luxury-silk-scarf.png",
    vendorName: "Elegant Essentials",
    rating: 5,
    reviewCount: 73,
  },
  {
    id: 6,
    name: "Wool Blend Sweater",
    price: 79.99,
    comparePrice: 99.99,
    image: "/cozy-wool-sweater.png",
    vendorName: "Cozy Knits",
    rating: 4,
    reviewCount: 92,
  },
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-black text-foreground mb-2">All Products</h1>
          <p className="text-muted-foreground">Discover unique items from our community of independent vendors</p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <span className="text-sm text-muted-foreground">Showing {products.length} products</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
