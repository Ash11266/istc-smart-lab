import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

export async function POST(req: NextRequest) {
    try {
        const { name, contactNumber, email, password } = await req.json();

        if (!name || !contactNumber || !email || !password) {
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
            "INSERT INTO users (name, contact_no, email, password) VALUES (?, ?, ?, ?)",
            [name, contactNumber, email, hashedPassword]
        );

        return NextResponse.json({ success: true, message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
