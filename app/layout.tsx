import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { cookies } from "next/headers";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

import { decrypt } from "@/lib/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactNode> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  let isLoggedIn = false;
  let isAdmin = false;

  if (token) {
    const session = await decrypt(token);
    if (session) {
      isLoggedIn = true;
      isAdmin = !!session.isAdmin;
    }
  }

  return (
    <html lang="en">
      <body className="h-screen overflow-hidden flex flex-col bg-[#e6edf3] text-black">

        {/* 🔷 HEADER */}
        <header className="w-full h-24 flex items-center justify-center relative bg-[#5dade2] border-b-[5px] border-orange-400 shadow-md">

          {/* LOGO */}
          <Link href="/" className="absolute left-6">
            <img
              src="/logo.png"
              alt="logo"
              className="h-14 w-14 bg-white rounded-md p-1 shadow hover:scale-105 transition-transform"
            />
          </Link>

          {/* TITLE */}
          <Link href="/">
            <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-wide hover:text-gray-100 transition-colors">
              Data Acquisition & Monitoring System
            </h1>
          </Link>

          {/* NAV LINKS */}
          <div className="absolute right-6 flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/experiments" className="text-white hover:underline font-medium">
                  Experiments
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition shadow-sm">
                    Admin Panel
                  </Link>
                )}
                <Link href="/profile" className="bg-white text-[#5dade2] hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition shadow-sm">
                  Profile
                </Link>
              </>
            ) : (
              <Link href="/login" className="bg-white text-[#5dade2] hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition shadow-sm">
                Login
              </Link>
            )}
          </div>

        </header>

        {/* 🔷 MAIN */}
        <main className="flex-1 relative overflow-y-auto">
          {children}
        </main>

        {/* 🔷 FOOTER */}
        <footer className="w-full h-14 flex items-center justify-center bg-[#5dade2] border-t-[5px] border-orange-400 text-white text-sm tracking-wide">
          Research Laboratory Interface
        </footer>

      </body>
    </html>
  );
}