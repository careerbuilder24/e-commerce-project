"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingBag, User, Menu, X, LogOut, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-heading font-black text-black">
            StyleZ
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-foreground hover:text-primary transition-colors">
              All Products
            </Link>
            <Link href="/categories/clothing" className="text-foreground hover:text-primary transition-colors">
              Clothing
            </Link>
            <Link href="/categories/accessories" className="text-foreground hover:text-primary transition-colors">
              Accessories
            </Link>
            <Link href="/categories/footwear" className="text-foreground hover:text-primary transition-colors">
              Footwear
            </Link>
            <Link href="/vendors" className="text-foreground hover:text-primary transition-colors">
              Vendors
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input type="search" placeholder="Search products..." className="pl-10 bg-muted border-border" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Order History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/vendor/dashboard">
                      <Store className="mr-2 h-4 w-4" />
                      Vendor Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input type="search" placeholder="Search products..." className="pl-10 bg-muted border-border" />
              </div>
              <nav className="flex flex-col space-y-2">
                <Link href="/products" className="text-foreground hover:text-primary transition-colors py-2">
                  All Products
                </Link>
                <Link href="/categories/clothing" className="text-foreground hover:text-primary transition-colors py-2">
                  Clothing
                </Link>
                <Link
                  href="/categories/accessories"
                  className="text-foreground hover:text-primary transition-colors py-2"
                >
                  Accessories
                </Link>
                <Link href="/categories/footwear" className="text-foreground hover:text-primary transition-colors py-2">
                  Footwear
                </Link>
                <Link href="/vendors" className="text-foreground hover:text-primary transition-colors py-2">
                  Vendors
                </Link>
                {user ? (
                  <>
                    <Link href="/account" className="text-foreground hover:text-primary transition-colors py-2">
                      My Account
                    </Link>
                    <Link
                      href="/vendor/dashboard"
                      className="text-foreground hover:text-primary transition-colors py-2"
                    >
                      Vendor Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-left text-foreground hover:text-primary transition-colors py-2"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-foreground hover:text-primary transition-colors py-2">
                      Sign In
                    </Link>
                    <Link href="/register" className="text-foreground hover:text-primary transition-colors py-2">
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
