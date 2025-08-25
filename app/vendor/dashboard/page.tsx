"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { VendorSidebar } from "@/components/vendor-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, DollarSign, Clock, TrendingUp, Eye, Plus } from "lucide-react"

interface VendorStats {
  total_products: number
  total_orders: number
  total_revenue: number
  pending_orders: number
}

interface Vendor {
  id: number
  store_name: string
  store_description?: string
  is_active: boolean
  created_at?: string
}

export default function VendorDashboardPage() {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [stats, setStats] = useState<VendorStats | null>(null)
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchVendorData()
  }, [user, router])

  const fetchVendorData = async () => {
    try {
      const [vendorResponse, statsResponse] = await Promise.all([
        fetch("/api/vendor/profile"),
        fetch("/api/vendor/stats"),
      ])

      if (vendorResponse.status === 404) {
        router.push("/vendor/register")
        return
      }

      if (vendorResponse.ok) {
        const vendorData = await vendorResponse.json()
        setVendor(vendorData.vendor)
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }
    } catch (error) {
      console.error("Failed to fetch vendor data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <VendorSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="flex h-screen bg-background">
        <VendorSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Vendor profile not found</p>
            <Button onClick={() => router.push("/vendor/register")}>Register as Vendor</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <VendorSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-black text-foreground">Welcome back!</h1>
                <p className="text-muted-foreground mt-1">Here's what's happening with {vendor.store_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={vendor.is_active ? "default" : "secondary"}>
                  {vendor.is_active ? "Active" : "Inactive"}
                </Badge>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Store
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_products || 0}</div>
                <p className="text-xs text-muted-foreground">Active listings in your store</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_orders || 0}</div>
                <p className="text-xs text-muted-foreground">All-time order count</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.total_revenue?.toFixed(2) || "0.00"}</div>
                <p className="text-xs text-muted-foreground">Gross sales revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pending_orders || 0}</div>
                <p className="text-xs text-muted-foreground">Orders awaiting fulfillment</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Management
                </CardTitle>
                <CardDescription>Manage your product catalog and inventory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Products</span>
                  <span className="font-medium">{stats?.total_products || 0}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" asChild>
                    <Link href="/vendor/products/new">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Product
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                    <Link href="/vendor/products">View All</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates from your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Store created</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(vendor.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  {stats?.total_orders === 0 && (
                    <div className="text-sm text-muted-foreground">No orders yet. Start by adding some products!</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
