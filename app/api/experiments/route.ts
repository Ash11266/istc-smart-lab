import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // 👈 params is Promise now
) {
    try {
        const { id } = await params; // 👈 MUST await

        const [rows]: any = await db.query(
            "SELECT uuid, name, description, components, dataValues FROM experiments WHERE uuid = ?",
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { message: "Experiment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);

    } catch (error) {
        console.error("Database error:", error);

        return NextResponse.json(
            { message: "Database error" },
            { status: 500 }
        );
    }
}