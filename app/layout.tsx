import "./globals.css";
import LiveTime from "@/components/LiveTime";

export const metadata = {
  title: "Data Acquisition & Monitoring System",
  description: "Research Lab Interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#e6edf3] text-black">

        {/* HEADER */}
        <header
          className="w-full h-24 flex items-center justify-center relative shadow-md border-b-[5px] border-orange-400"
          style={{ backgroundColor: "#0B5D57" }}
        >
          <img
            src="/logo.png"
            alt="logo"
            className="h-14 w-14 absolute left-6 bg-white rounded-md p-1 shadow"
          />

          <h1 className="text-2xl md:text-4xl font-semibold text-white tracking-wide text-center">
            Data Acquisition & Monitoring System
          </h1>
        </header>

        {/* MAIN (NO SCROLL) */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>

        {/* FOOTER */}
        <footer
          className="w-full h-14 flex items-center justify-center text-white text-sm tracking-wide border-t-[5px] border-orange-400 gap-3"
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