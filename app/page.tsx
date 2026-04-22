"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/login")}
      className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer"
    >
      <div>
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