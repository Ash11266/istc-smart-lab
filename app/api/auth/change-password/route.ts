import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { decrypt } from "@/lib/auth";
import { RowDataPacket } from "mysql2/promise";

export async function POST(req: NextRequest) {
    try {
        const cookie = req.cookies.get("session");
        const token = cookie?.value;
        let userId = null;
        if (token) {
            const session = await decrypt(token);
            if (session?.userId) userId = session.userId;
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Both current and new passwords are required" }, { status: 400 });
        }
        
        if (currentPassword === newPassword) {
            return NextResponse.json({ error: "New password must be different from current password" }, { status: 400 });
        }

        // Fetch current password from DB
        const [users] = await db.query<RowDataPacket[]>(
            "SELECT password FROM users WHERE id = ?",
            [userId]
        );
        
        if (users.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        const user = users[0];
        
        // Verify current password
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password
        await db.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, userId]
        );

        return NextResponse.json({ success: true, message: "Password updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Change password error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
