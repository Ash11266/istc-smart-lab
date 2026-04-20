import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#e6edf3] text-black">

        {/* 🔷 HEADER */}
        <header className="w-full h-24 flex items-center justify-center relative bg-[#5dade2] border-b-[5px] border-orange-400 shadow-md">

          {/* LOGO */}
          <img
            src="/logo.png"
            alt="logo"
            className="h-14 w-14 absolute left-6 bg-white rounded-md p-1 shadow"
          />

          {/* TITLE */}
          <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-wide">
            Data Acquisition & Monitoring System
          </h1>

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