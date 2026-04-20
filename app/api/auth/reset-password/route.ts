import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { decrypt } from "@/lib/auth";

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
            return NextResponse.json({ error: "Forbidden: Only admins can reset passwords" }, { status: 403 });
        }

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Hash default password
        const hashedPassword = await bcrypt.hash("istc@12345", 10);

        // Update user
        const [result] = await db.query(
            "UPDATE users SET password = ? WHERE email = ?",
            [hashedPassword, email]
        ) as any[];

        if (result.affectedRows === 0) {
           return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: `Password for ${email} reset to default.` }, { status: 200 });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
