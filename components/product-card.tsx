import Image from "next/image"
import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  id: number
  name: string
  price: number
  comparePrice?: number
  image: string
  vendorName: string
  rating?: number
  reviewCount?: number
  isFeatured?: boolean
}

export function ProductCard({
  id,
  name,
  price,
  comparePrice,
  image,
  vendorName,
  rating = 0,
  reviewCount = 0,
  isFeatured = false,
}: ProductCardProps) {
  const discountPercentage = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isFeatured && (
            <Badge variant="secondary" className="text-xs">
              Featured
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="text-xs">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <div className="text-xs text-muted-foreground">{vendorName}</div>

        <Link href={`/products/${id}`} className="block">
          <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2">{name}</h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">${price.toFixed(2)}</span>
          {comparePrice && (
            <span className="text-sm text-muted-foreground line-through">${comparePrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
