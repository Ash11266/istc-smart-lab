import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ✅ Allow mobile app API routes without session
  if (
    path.startsWith("/api/experiments") ||
    path.startsWith("/api/chat")
  ) {
    return NextResponse.next();
  }

  // ✅ Protect only web pages / admin routes
  const isProtectedRoute =
    path === "/experiments/create" ||
    path === "/profile" ||
    path.startsWith("/admin");

  if (isProtectedRoute) {
    const cookie = req.cookies.get("session");
    const token = cookie?.value;

    let isAuth = false;

    if (token) {
      const session = await decrypt(token);

      if (session) {
        isAuth = true;

        // admin-only protection
        if (path.startsWith("/admin") && !session.isAdmin) {
          return NextResponse.redirect(new URL("/", req.nextUrl));
        }
      }
    }

    if (!isAuth) {
      const url = new URL("/login", req.nextUrl);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};