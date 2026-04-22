import "./globals.css";
import LiveTime from "@/components/LiveTime";
import BackgroundVideo from "./components/BackgroundVideo";

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
      <body className="h-screen overflow-hidden flex flex-col bg-[#e6edf3] text-black">

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