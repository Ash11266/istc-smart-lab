"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("/experiments") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/experiments");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">

      {/* 🔥 BLUR BACKGROUND */}
      <div className="absolute inset-0 backdrop-blur-lg bg-black/40"></div>

      {/* 🔥 LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border-4 border-orange-500">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-[#0B5D57] text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-600 text-center mb-6 text-sm">
          Sign in to access your smart lab
        </p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-sm border border-red-400">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="block text-[#0B5D57] font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-[#0B5D57] focus:ring-2 focus:ring-[#0B5D57] outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-[#0B5D57] font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-[#0B5D57] focus:ring-2 focus:ring-[#0B5D57] outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 🔥 BUTTON */}
          <button
  type="submit"
  disabled={loading}
  className="w-full mt-6 bg-orange-50 hover:bg-orange-600 text-orange py-3 rounded-xl font-bold text-lg shadow-xl border-2 border-orange-600 transition-all duration-200 active:scale-95"
>
  {loading ? "Signing..." : "LOGIN"}
</button>

        </form>
      </div>
    </div>
  );
}