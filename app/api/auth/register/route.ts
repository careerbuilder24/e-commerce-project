import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const result = await createUser(email, password, name)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Set auth cookie
    const response = NextResponse.json({
      success: true,
      user: result.user,
    })

    if (result.token) {
      response.cookies.set("auth-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })
    }

    return response
  } catch (error) {
    console.error("Register API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
