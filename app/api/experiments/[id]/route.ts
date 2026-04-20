import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";
import { decrypt } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Convert slug → keyword
    const keyword = id.replace(/-/g, " ");

    const [rows]: any = await db.query(
      `SELECT uuid, name, description, components, dataValues
       FROM experiments
       WHERE uuid = ?
       OR LOWER(name) LIKE LOWER(?)`,
      [id, `%${keyword}%`]
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
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookie = req.cookies.get("session")?.value;
    let isAdmin = false;

    if (cookie) {
      const session = await decrypt(cookie);
      if (session?.isAdmin) isAdmin = true;
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    const { id } = await params;
    
    await db.query("DELETE FROM experiments WHERE uuid = ?", [id]);

    return NextResponse.json({ success: true, message: "Experiment deleted" }, { status: 200 });
  } catch (error) {
    console.error("Experiment delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}