import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { encrypt } from "@/lib/auth";
import { RowDataPacket } from "mysql2/promise";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user
    const [users] = await db.query<RowDataPacket[]>(
      "SELECT id, email, password, is_admin FROM users WHERE email = ?",
      [email]
    );

    const user = users[0];

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create session token
    const token = await encrypt({ userId: user.id, email: user.email, isAdmin: !!user.is_admin });

    // Set cookie
    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: false, // Set to true only if serving over HTTPS
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
