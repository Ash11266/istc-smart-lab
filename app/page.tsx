"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/login")}
      className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-pointer"
    >

      {/* 🎥 VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/animation.mp4" type="video/mp4" />
      </video>

      {/* 🔥 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* ✨ CENTER CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">

        <h1 className="text-white text-3xl md:text-5xl font-bold mb-6">
          Click Anywhere to Login
        </h1>

        <div className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold rounded-xl shadow-lg transition">
          Enter System
        </div>

      </div>
    </div>
  );
}