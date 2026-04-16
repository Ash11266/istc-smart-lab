"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contactNumber, email, password }),
      });

      if (res.ok) {
        // Automatically log in or redirect to login
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 min-h-[calc(100vh-200px)] items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-sm border border-slate-300">
        <h1 className="text-3xl font-extrabold text-[#003366] mb-2 text-center tracking-tight">Create Account</h1>
        <p className="text-slate-600 text-center mb-8 text-sm">Join the smart lab platform</p>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#003366] text-sm font-bold mb-1.5 uppercase tracking-wider">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              placeholder="Your Full Name"
              required
            />
          </div>

          <div>
            <label className="block text-[#003366] text-sm font-bold mb-1.5 uppercase tracking-wider">Contact Number</label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              placeholder="+1234567890"
              required
            />
          </div>

          <div>
            <label className="block text-[#003366] text-sm font-bold mb-1.5 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              placeholder="name@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-[#003366] text-sm font-bold mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#003366] hover:bg-slate-900 text-white font-bold py-3 rounded transition-colors disabled:opacity-50 mt-4 shadow-sm uppercase tracking-wider"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-[#003366] hover:underline font-bold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
