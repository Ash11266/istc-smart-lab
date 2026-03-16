import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const [rows]: any = await db.query(
      "SELECT * FROM experiments WHERE uuid = ? OR name = ?",
      [id, id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Experiment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rows[0],
    });

  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      { success: false, message: "Database error" },
      { status: 500 }
    );
  }
}