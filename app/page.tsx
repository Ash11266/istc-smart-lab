import Link from "next/link";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const isLoggedIn = !!token;

  return (
    <div className="h-full w-full relative">

      {/* 🎥 VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      >
        <source src="/animation.mp4" type="video/mp4" />
      </video>

      {/* LIGHT OVERLAY */}
      <div className="absolute inset-0 bg-white/20"></div>

      {/* CENTER TEXT LINK */}
      <Link
        href={isLoggedIn ? "/experiments" : "/login"}
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
      >
        <p className="mt-6 text-xl md:text-2xl font-semibold text-black animate-pulse tracking-wide drop-shadow-md">
          {isLoggedIn ? "Click anywhere to continue" : "Click anywhere to login"}
        </p>
      </Link>

    </div>
  );
}