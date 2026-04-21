import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { decrypt } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const cookie = req.cookies.get("session")?.value;
        let isAdmin = false;
        
        if (cookie) {
             const session = await decrypt(cookie);
             if (session?.isAdmin) isAdmin = true;
        }

        const [rows]: any = await db.query(`
            SELECT e.*, u.name as created_by_name 
            FROM experiments e 
            LEFT JOIN users u ON e.created_by = u.id
            ORDER BY e.created_at DESC
        `);

        return NextResponse.json({ data: rows, isAdmin }); 
    } catch (error) {
        console.error("Fetch error:", error);
        return NextResponse.json({ message: "Failed to fetch experiments" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, description, components, dataValues } = body;

        const cookie = req.cookies.get("session")?.value;
        let userId = null;
        if (cookie) {
             const session = await decrypt(cookie);
             if (session?.userId) userId = session.userId;
        }

        const uuid = uuidv4();

        await db.query(
            `INSERT INTO experiments (uuid, name, description, components, dataValues, created_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [uuid, name, description, components, dataValues, userId]
        );

        return NextResponse.json({
            success: true,
            message: "Experiment created",
        });

    } catch (error) {
        console.error("Insert error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}