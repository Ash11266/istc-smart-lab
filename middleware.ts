import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Protect create page, admin panel, profile, and non-GET APIs
  const isProtectedRoute = path === '/experiments/create' || path === '/profile' || path.startsWith('/admin') || (path.startsWith('/api/experiments') && req.method !== 'GET');

  if (isProtectedRoute) {
    const cookie = req.cookies.get('session');
    let token = cookie?.value;
    
    // Check Authorization header for mobile app fallback
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    let isAuth = false;
    if (token) {
      const session = await decrypt(token);
      if (session) {
        isAuth = true;

        if (path.startsWith('/admin') && !session.isAdmin) {
          return NextResponse.redirect(new URL("/", req.nextUrl));
        }
      }
    }

    if (!isAuth) {
      // If it's an API route, return 401
      if (path.startsWith('/api')) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // Otherwise, redirect to login
      const url = new URL("/login", req.nextUrl);
      // Optional: attach the return url to redirect back after login
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
