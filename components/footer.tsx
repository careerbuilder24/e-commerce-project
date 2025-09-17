import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-black text-black">StyleZ</h3>
            <p className="text-muted-foreground text-sm">
              Discover unique fashion from independent vendors worldwide. Quality, style, and authenticity in every
              piece.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-foreground">Shop</h4>
            <div className="space-y-2">
              <Link
                href="/products"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                All Products
              </Link>
              <Link
                href="/categories/clothing"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Clothing
              </Link>
              <Link
                href="/categories/accessories"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Accessories
              </Link>
              <Link
                href="/categories/footwear"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Footwear
              </Link>
              <Link
                href="/vendors"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                All Vendors
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-foreground">Customer Service</h4>
            <div className="space-y-2">
              <Link
                href="/contact"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Contact Us
              </Link>
              <Link
                href="/shipping"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Shipping Info
              </Link>
              <Link
                href="/returns"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Returns & Exchanges
              </Link>
              <Link
                href="/size-guide"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Size Guide
              </Link>
              <Link href="/faq" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                FAQ
              </Link>
            </div>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-foreground">Account</h4>
            <div className="space-y-2">
              <Link
                href="/account"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                My Account
              </Link>
              <Link href="/orders" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Order History
              </Link>
              <Link
                href="/wishlist"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Wishlist
              </Link>
              <Link
                href="/vendor/register"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Become a Vendor
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© 2024 StyleHub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
