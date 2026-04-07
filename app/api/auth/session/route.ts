import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('session');
  if (cookie?.value) {
    const session = await decrypt(cookie.value);
    if (session) {
      return NextResponse.json({ authenticated: true, user: session });
    }
  }
  return NextResponse.json({ authenticated: false });
}
