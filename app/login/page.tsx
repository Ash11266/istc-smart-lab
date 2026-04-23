"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, LogIn, ShieldCheck, Activity, RefreshCw } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/experiments";

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
        router.push(callbackUrl);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Authentication failed. Please check your credentials.");
      }
    } catch {
      setError("Network error. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-xl p-10 rounded-xl shadow-2xl border border-white/50 space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <div className="bg-[#0B5D57] w-16 h-16 rounded-xl flex items-center justify-center text-white mx-auto shadow-lg shadow-[#0B5D57]/20 mb-4">
           <ShieldCheck size={32} />
        </div>
        <h1 className="text-4xl font-black text-[#0B5D57] tracking-tight">
          System Access
        </h1>
        <p className="text-slate-500 font-medium">
          Enter credentials to initialize your session
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="mt-0.5"><Activity size={16} /></div>
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[#0B5D57] text-xs font-black uppercase tracking-widest ml-1">
            <Mail size={14} /> Registered Email
          </label>
          <div className="relative group">
            <input
              type="email"
              placeholder="researcher@lab.istc"
              className="w-full pl-4 pr-4 py-4 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#0B5D57] focus:ring-4 focus:ring-[#0B5D57]/5 outline-none transition-all font-medium text-slate-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[#0B5D57] text-xs font-black uppercase tracking-widest ml-1">
            <Lock size={14} /> Security Token
          </label>
          <input
            type="password"
            placeholder="••••••••••••"
            className="w-full pl-4 pr-4 py-4 rounded-xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#0B5D57] focus:ring-4 focus:ring-[#0B5D57]/5 outline-none transition-all font-medium text-slate-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-orange-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-70"
        >
          {loading ? (
            <>
              <RefreshCw size={24} className="animate-spin" /> 
              Authenticating...
            </>
          ) : (
            <>
              Initialize Session
              <LogIn size={24} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="pt-6 border-t border-slate-100 text-center">
         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
            Research Protocol v4.2.0<br/>
            Authorized Personnel Only
         </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex items-center justify-center h-full min-h-full overflow-hidden p-6">
      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B5D57]/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
      <div className="absolute inset-0 bg-black/5"></div>

      <Suspense fallback={
        <div className="relative z-10 bg-white/50 backdrop-blur-md p-10 rounded-xl flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-[#0B5D57] border-t-transparent rounded-full animate-spin"></div>
           <p className="text-[#0B5D57] font-bold">Secure Connection Established...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
