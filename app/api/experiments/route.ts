import { NextResponse } from "next/server";
import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";


// ✅ GET ALL EXPERIMENTS
export async function GET() {
    try {
        const [rows]: any = await db.query("SELECT * FROM experiments");

        return NextResponse.json(rows); // 🔥 IMPORTANT

    } catch (error) {
        console.error("Fetch error:", error);

        return NextResponse.json(
            { message: "Failed to fetch experiments" },
            { status: 500 }
        );
    }
}


// ✅ CREATE EXPERIMENT
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, description, components, dataValues } = body;

        const uuid = uuidv4();

        await db.query(
            `INSERT INTO experiments (uuid, name, description, components, dataValues)
       VALUES (?, ?, ?, ?, ?)`,
            [uuid, name, description, components, dataValues]
        );

        return NextResponse.json({
            success: true,
            message: "Experiment created",
        });

    } catch (error) {
        console.error("Insert error:", error);

        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}