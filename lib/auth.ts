// import { executeQuery } from "./db"
// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"
// import { cookies } from "next/headers"

// const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
// const JWT_EXPIRES_IN = "7d"

// export interface User {
//   id: string
//   email: string
//   name: string
//   created_at: string
//   updated_at: string
// }

// export interface AuthResult {
//   success: boolean
//   user?: User
//   error?: string
//   token?: string
// }

// // Hash password
// export async function hashPassword(password: string): Promise<string> {
//   return bcrypt.hash(password, 12)
// }

// // Verify password
// export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
//   return bcrypt.compare(password, hashedPassword)
// }

// // Generate JWT token
// export function generateToken(userId: string): string {
//   return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
// }

// // Verify JWT token
// export function verifyToken(token: string): { userId: string } | null {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
//     return decoded
//   } catch {
//     return null
//   }
// }

// // Create user
// export async function createUser(email: string, password: string, name: string): Promise<AuthResult> {
//   try {
//     // Check if user already exists
//     const existingUser = await executeQuery("SELECT id FROM users_sync WHERE email = $1", [email])

//     if (existingUser.length > 0) {
//       return { success: false, error: "User already exists with this email" }
//     }

//     // Hash password and create user
//     const hashedPassword = await hashPassword(password)
//     const userId = crypto.randomUUID()

//     const result = await executeQuery(
//       `INSERT INTO users_sync (id, email, name, raw_json, created_at, updated_at) 
//        VALUES ($1, $2, $3, $4, NOW(), NOW()) 
//        RETURNING id, email, name, created_at, updated_at`,
//       [userId, email, name, JSON.stringify({ password: hashedPassword })],
//     )

//     const user = result[0]
//     const token = generateToken(user.id)

//     return { success: true, user, token }
//   } catch (error) {
//     console.error("Create user error:", error)
//     return { success: false, error: "Failed to create user" }
//   }
// }

// // Authenticate user
// export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
//   try {
//     const result = await executeQuery(
//       "SELECT id, email, name, raw_json, created_at, updated_at FROM users_sync WHERE email = $1",
//       [email],
//     )

//     if (result.length === 0) {
//       return { success: false, error: "Invalid email or password" }
//     }

//     const user = result[0]
//     const userData = user.raw_json as { password: string }

//     if (!userData.password) {
//       return { success: false, error: "Invalid account setup" }
//     }

//     const isValidPassword = await verifyPassword(password, userData.password)

//     if (!isValidPassword) {
//       return { success: false, error: "Invalid email or password" }
//     }

//     const token = generateToken(user.id)
//     const { raw_json, ...userWithoutPassword } = user

//     return { success: true, user: userWithoutPassword, token }
//   } catch (error) {
//     console.error("Authentication error:", error)
//     return { success: false, error: "Authentication failed" }
//   }
// }

// // Get user by ID
// export async function getUserById(userId: string): Promise<User | null> {
//   try {
//     const result = await executeQuery("SELECT id, email, name, created_at, updated_at FROM users_sync WHERE id = $1", [
//       userId,
//     ])

//     return result[0] || null
//   } catch (error) {
//     console.error("Get user error:", error)
//     return null
//   }
// }

// // Get current user from request
// export async function getCurrentUser(): Promise<User | null> {
//   try {
//     const cookieStore = cookies()
//     const token = cookieStore.get("auth-token")?.value

//     if (!token) {
//       return null
//     }

//     const decoded = verifyToken(token)
//     if (!decoded) {
//       return null
//     }

//     return await getUserById(decoded.userId)
//   } catch (error) {
//     console.error("Get current user error:", error)
//     return null
//   }
// }

// // Set auth cookie
// export function setAuthCookie(token: string) {
//   const cookieStore = cookies()
//   cookieStore.set("auth-token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//     path: "/",
//   })
// }

// // Clear auth cookie
// export function clearAuthCookie() {
//   const cookieStore = cookies()
//   cookieStore.delete("auth-token")
// }
