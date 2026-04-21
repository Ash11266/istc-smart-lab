"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-300">

      <h1 className="text-3xl font-extrabold text-[#003366] mb-2 text-center">
        Welcome Back
      </h1>

      <p className="text-slate-600 text-center mb-8 text-sm">
        Sign in to access your smart lab data
      </p>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block text-[#003366] text-sm font-bold mb-1.5 uppercase">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#003366]"
            placeholder="name@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-[#003366] text-sm font-bold mb-1.5 uppercase">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#003366]"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#003366] hover:bg-slate-900 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 mt-4"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}