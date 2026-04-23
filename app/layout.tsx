import "./globals.css";
import LiveTime from "@/components/LiveTime";
import BackgroundVideo from "./components/BackgroundVideo";
import Link from "next/link";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

export const metadata = {
  title: "Data Acquisition & Monitoring System",
  description: "Research Lab Interface",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  let isLoggedIn = false;
  let isAdmin = false;

  if (sessionCookie) {
    const session = await decrypt(sessionCookie);
    if (session) {
      isLoggedIn = true;
      if (session.isAdmin) {
        isAdmin = true;
      }
    }
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#e6edf3] text-black">

        <header
          className="w-full h-24 flex items-center justify-between px-6 relative shadow-md border-b-[5px] border-orange-400"
          style={{ backgroundColor: "#0B5D57" }}
        >
          <div className="flex items-center gap-4">
            <Link href="/">
              <img
                src="/logo.png"
                alt="logo"
                className="h-14 w-14 bg-white rounded-md p-1 shadow hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          <h1 className="text-xl md:text-3xl font-semibold text-white tracking-wide text-center absolute left-1/2 transform -translate-x-1/2">
            Data Acquisition & Monitoring System
          </h1>

          <nav className="flex items-center gap-4 z-10">
            {isLoggedIn && (
              <Link
                href="/experiments"
                className="px-4 py-2 text-sm font-semibold text-white border-2 border-white/20 rounded-lg hover:bg-white/10 hover:border-white/40 transition-all"
              >
                Experiments
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 border-2 border-orange-500 rounded-lg hover:bg-orange-600 hover:border-orange-600 transition-all shadow-md shadow-orange-500/20"
              >
                Admin Panel
              </Link>
            )}
            <Link
              href="/profile"
              className="px-4 py-2 text-sm font-semibold text-[#0B5D57] bg-white rounded-lg hover:bg-orange-50 transition-colors shadow-sm"
            >
              {isLoggedIn ? "Profile" : "Login"}
            </Link>
          </nav>
        </header>

        {/* MAIN (NO SCROLL) */}
        <main className="flex-1 overflow-hidden relative flex flex-col min-h-0">
          <BackgroundVideo />

          {/* PAGE CONTENT */}
          <div className="relative z-10 w-full flex-1 flex flex-col min-h-0">
            {children}
          </div>
        </main>

        {/* FOOTER */}
        <footer
          className="w-full h-14 flex items-center justify-center text-white text-sm tracking-wide border-t-[5px] border-orange-400 gap-3 relative z-20"
          style={{ backgroundColor: "#0B5D57" }}
        >
          <span>Research Laboratory Interface</span>
          <span>|</span>
          <span>
            Time:{" "}
            <span className="font-semibold text-yellow-300">
              <LiveTime />
            </span>
          </span>
        </footer>

      </body>
    </html>
  );
}