import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {

    const [rows] = await db.query(
      "SELECT uuid, name, description, components FROM experiments"
    );

    return NextResponse.json(rows);

  } catch (error) {

    console.error("Database error:", error);

    return NextResponse.json(
      { message: "Failed to fetch experiments" },
      { status: 500 }
    );

  }
}