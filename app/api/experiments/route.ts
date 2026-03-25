import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
    try {
        const [rows] = await db.query(`
      SELECT id, uuid, name, description, components, dataValues
      FROM experiments
      ORDER BY id ASC
    `);

        return NextResponse.json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error("Database error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch items"
            },
            { status: 500 }
        );
    }
}