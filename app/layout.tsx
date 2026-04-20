import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}>) {
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
      <body className={`${inter.className} antialiased flex flex-col min-h-screen bg-slate-50`}>
        {/* Government Bar / Top Banner */}
        <div className="bg-slate-900 text-white text-xs py-1 px-4 sm:px-6 lg:px-8 w-full font-medium">
          <div className="container mx-auto">
            An official platform of the ISTC Smart Lab
          </div>
        </div>

        {/* Global Navigation Bar */}
        <header className="w-full bg-[#003366] text-white border-b-4 border-amber-500">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:h-20 items-start md:items-center justify-between py-4 md:py-0">
              <div className="flex items-center mb-4 md:mb-0">
                <Link href="/" className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-white text-[#003366] font-bold text-xl rounded-sm">
                    S
                  </div>
                  <div>
                    <span className="block text-2xl font-bold tracking-tight">
                      ISTC Smart Lab
                    </span>
                    <span className="block text-xs uppercase tracking-wider text-slate-200">
                      Research & Development
                    </span>
                  </div>
                </Link>
              </div>
              <nav className="flex items-center space-x-6">
                <Link href="/experiments" className="text-sm font-semibold uppercase hover:underline underline-offset-4 tracking-wider">
                  Experiments
                </Link>
                {isLoggedIn ? (
                  <>
                    {isAdmin && (
                      <Link href="/admin" className="text-sm font-semibold uppercase hover:underline underline-offset-4 tracking-wider bg-amber-500 text-white px-4 py-2 border-2 border-transparent hover:bg-amber-600 transition-colors">
                        Admin Panel
                      </Link>
                    )}
                    <Link href="/experiments/create" className="text-sm font-semibold uppercase hover:underline underline-offset-4 tracking-wider bg-white text-[#003366] px-4 py-2 border-2 border-transparent hover:bg-slate-100 transition-colors">
                      Create Experiment
                    </Link>
                    <Link href="/profile" className="text-sm font-semibold uppercase hover:underline underline-offset-4 tracking-wider text-white">
                      Profile
                    </Link>
                  </>
                ) : (
                  <Link href="/login" className="text-sm font-semibold uppercase hover:underline underline-offset-4 tracking-wider bg-white text-[#003366] px-4 py-2 border-2 border-transparent hover:bg-slate-100 transition-colors">
                    Login
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </header>

        {/* 🔷 MAIN (SCROLL ENABLED) */}
        <main className="flex-1 overflow-y-auto">
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