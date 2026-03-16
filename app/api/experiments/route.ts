import { NextResponse } from "next/server";
import  db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM experiments
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