import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, description, components } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `
      INSERT INTO experiments (name, description, components)
      VALUES (?, ?, ?)
      `,
      [name, description || null, components || null]
    );

    return NextResponse.json({
      success: true,
      message: "Experiment created",
      insertId: result.insertId
    });

  } catch (error: any) {
    console.error("DB ERROR:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { success: false, message: "Experiment name must be unique" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create experiment" },
      { status: 500 }
    );
  }
}