"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Truck, Shield, Headphones, RefreshCw } from "lucide-react";
import { AutoCarousel } from "@/components/auto-carousel";

// Hero images
const heroImages = [
  "https://i.postimg.cc/pL1dZtzC/ijgi.avif",
  "https://i.postimg.cc/sxyfXfCj/ouh.avif",
  "https://i.postimg.cc/Yqd2rwn7/pijhi.avif",
  "https://i.postimg.cc/Vk5f5HpC/oij.avif",
];

// Mock data for demonstration
const featuredProducts = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    comparePrice: 39.99,
    image: "/premium-cotton-t-shirt.png",
    vendorName: "Urban Threads",
    rating: 4,
    reviewCount: 128,
    isFeatured: true,
  },
  {
    id: 2,
    name: "Vintage Denim Jacket",
    price: 89.99,
    image: "/vintage-denim-jacket.png",
    vendorName: "Retro Style Co.",
    rating: 5,
    reviewCount: 64,
    isFeatured: true,
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
    isFeatured: true,
  },
  {
    id: 4,
    name: "Sustainable Sneakers",
    price: 119.99,
    image: "/sustainable-white-sneakers.png",
    vendorName: "EcoStep",
    rating: 4,
    reviewCount: 156,
    isFeatured: true,
  },
];

const categories = [
  {
    name: "Clothing",
    image: "/fashion-clothing-collection.png",
    href: "/categories/clothing",
  },
  {
    name: "Accessories",
    image: "/fashion-accessories-jewelry.png",
    href: "/categories/accessories",
  },
  {
    name: "Footwear",
    image: "/stylish-shoes-collection.png",
    href: "/categories/footwear",
  },
  {
    name: "Bags",
    image: "/designer-bags-collection.png",
    href: "/categories/bags",
  },
];

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);

  // auto change hero images every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background Images */}
          <div className="absolute inset-0">
            {heroImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                  index === currentImage ? "opacity-100" : "opacity-0"
                }`}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))}
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center text-white max-w-3xl px-4 space-y-6">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white">
              New Collection Available
            </Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-black">
              Discover Unique Fashion from Independent Vendors
            </h1>
            <p className="text-lg max-w-2xl mx-auto text-gray-200">
              Shop curated collections from talented designers and vendors
              worldwide. Find your style with quality pieces that tell a story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-gray-500  bg-white/10"
              >
                Become a Vendor
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-black text-foreground mb-4">
                Shop by Category
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our diverse range of fashion categories, each curated by
                independent vendors
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-card border border-border hover:shadow-lg transition-shadow"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white font-heading font-bold text-lg">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals Carousel */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-heading font-black text-foreground mb-4">
                  Trending Categories
                </h2>
                <p className="text-muted-foreground">
                  Hot picks everyone’s shopping right now
                </p>
              </div>
            </div>
            <AutoCarousel items={categories} type="category" />
          </div>
        </section>

        {/* Trending Categories Carousel */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-heading font-black text-foreground mb-4">
                  Trending Categories
                </h2>
                <p className="text-muted-foreground">
                  Hot picks everyone’s shopping right now
                </p>
              </div>
            </div>
            <AutoCarousel items={categories} type="category" />
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-heading font-black text-foreground mb-4">
                  Featured Products
                </h2>
                <p className="text-muted-foreground">
                  Handpicked favorites from our vendor community
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground">
                  Free Shipping
                </h3>
                <p className="text-muted-foreground text-sm">
                  Free shipping on orders over $75
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground">
                  Secure Payment
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your payment information is safe with us
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground">
                  Easy Returns
                </h3>
                <p className="text-muted-foreground text-sm">
                  30-day return policy on all items
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground">
                  24/7 Support
                </h3>
                <p className="text-muted-foreground text-sm">
                  Get help whenever you need it
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* review */}
      {/* Reviews Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-black text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real stories from shoppers who discovered unique styles from our
              vendors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow hover:shadow-lg transition">
              <p className="text-muted-foreground italic mb-4">
                “Absolutely love the quality and design. The cotton T-shirt
                feels premium and I’ve already received compliments wearing it.”
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  alt="User 1"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-heading font-bold text-foreground">
                    Sophia L.
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Verified Buyer
                  </p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow hover:shadow-lg transition">
              <p className="text-muted-foreground italic mb-4">
                “The vintage denim jacket I bought is now my favorite outfit
                piece. Super stylish and fits perfectly.”
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://i.pravatar.cc/100?img=32"
                  alt="User 2"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-heading font-bold text-foreground">
                    Daniel M.
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Fashion Enthusiast
                  </p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow hover:shadow-lg transition">
              <p className="text-muted-foreground italic mb-4">
                “I was impressed by the eco-friendly sneakers. Comfortable,
                stylish, and great for the environment.”
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://i.pravatar.cc/100?img=45"
                  alt="User 3"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-heading font-bold text-foreground">
                    Amelia R.
                  </h4>
                  <p className="text-xs text-muted-foreground">Eco Shopper</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
