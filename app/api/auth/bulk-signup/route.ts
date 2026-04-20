import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { decrypt } from "@/lib/auth";
import { RowDataPacket } from "mysql2/promise";
import * as xlsx from "xlsx";

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
            return NextResponse.json({ error: "Forbidden: Only admins can perform bulk signup" }, { status: 403 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        
        if (!file) {
            return NextResponse.json({ error: "File not provided" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const workbook = xlsx.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Expected columns: name, email
        const data = xlsx.utils.sheet_to_json<{name: string, email: string}>(worksheet, { defval: "" });

        if (data.length === 0) {
            return NextResponse.json({ error: "File is empty or invalid format" }, { status: 400 });
        }

        let importedCount = 0;
        let skippedCount = 0;

        const hashedPassword = await bcrypt.hash("istc@12345", 10);

        for (const row of data) {
            const name = typeof row.name === 'string' ? row.name.trim() : row.name;
            const email = typeof row.email === 'string' ? row.email.trim() : row.email;
            
            if (!name || !email) {
                skippedCount++;
                continue;
            }

            const [existingUsers] = await db.query<RowDataPacket[]>(
                "SELECT id FROM users WHERE email = ?",
                [email]
            );

            if (existingUsers.length > 0) {
                skippedCount++;
                continue;
            }

            await db.query(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                [name, email, hashedPassword]
            );

            importedCount++;
        }

        return NextResponse.json({ 
            success: true, 
            message: `Imported ${importedCount} users. Skipped ${skippedCount} existing or invalid entries.` 
        }, { status: 201 });

    } catch (error) {
        console.error("Bulk signup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
