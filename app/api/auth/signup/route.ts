import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { decrypt } from "@/lib/auth";
import { RowDataPacket } from "mysql2/promise";

export async function POST(req: NextRequest) {
    try {
        const cookie = req.cookies.get("session");
        const token = cookie?.value;
        
        let isAdmin = false;
        if (token) {
            const session = await decrypt(token);
            if (session?.isAdmin) isAdmin = true;
        }

        if (!isAdmin) {
            return NextResponse.json({ error: "Forbidden: Only admins can create users" }, { status: 403 });
        }

        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Check if user already exists
        const [existingUsers] = await db.query<RowDataPacket[]>(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await db.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        return NextResponse.json({ success: true, message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
