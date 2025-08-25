"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, ShoppingCart, Settings, BarChart3, Store, Users } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/vendor/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/vendor/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/vendor/orders",
    icon: ShoppingCart,
  },
  {
    name: "Analytics",
    href: "/vendor/analytics",
    icon: BarChart3,
  },
  {
    name: "Customers",
    href: "/vendor/customers",
    icon: Users,
  },
  {
    name: "Store Settings",
    href: "/vendor/settings",
    icon: Settings,
  },
]

export function VendorSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-card border-r border-border min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Store className="h-6 w-6 text-primary" />
          <span className="font-heading font-black text-lg">Vendor Portal</span>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
