import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (email === adminEmail && password === adminPassword) {
      const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")

      return NextResponse.json(
        {
          token,
          user: { id: "1", email, name: "Admin User" },
        },
        {
          status: 200,
          headers: {
            "Set-Cookie": `auth_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
          },
        },
      )
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
