import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./components/LogoutButton";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ISTC Smart Lab",
  description: "IoT and SQL powered system for managing and monitoring laboratory experiments.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("session");

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
                    <Link href="/experiments/create" className="text-sm font-semibold uppercase hover:underline underline-offset-4 tracking-wider bg-white text-[#003366] px-4 py-2 border-2 border-transparent hover:bg-slate-100 transition-colors">
                      Create Experiment
                    </Link>
                    <LogoutButton />
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

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto bg-white px-4 sm:px-6 lg:px-8 py-8 md:py-12 border-x border-b border-slate-200 shadow-sm">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="w-full bg-slate-800 mt-auto text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <span className="block text-xl font-bold mb-2">ISTC Smart Lab</span>
                <p className="text-sm text-slate-300">
                  IoT and SQL powered laboratory management platform.
                </p>
              </div>
              <div className="md:text-right text-sm text-slate-400 flex flex-col justify-end">
                <p>© {new Date().getFullYear()} CSIO Smart Lab</p>
                <div className="mt-2 space-x-4">
                  <a href="#" className="hover:text-white underline text-slate-300">Privacy Policy</a>
                  <a href="#" className="hover:text-white underline text-slate-300">Accessibility</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
