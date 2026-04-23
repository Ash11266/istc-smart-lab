"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Key, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setIsLoading(false);
      return;
    }
    
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        setSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update password");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg border border-teal-100">
      <div className="flex items-center gap-3 mb-8 border-b border-teal-50 pb-4">
        <Lock className="text-[#0B5D57]" size={24} />
        <h2 className="text-2xl font-bold text-slate-800">Change Password</h2>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-r-xl flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
            <AlertCircle size={20} />
            <div>
               <span className="font-bold">Error:</span> {error}
            </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-8 rounded-r-xl flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
          <CheckCircle size={20} />
          <div>
            <span className="font-bold">Success:</span> {success}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-[#0B5D57] text-xs font-bold uppercase tracking-widest ml-1">
             <Key size={14} /> Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B5D57]/20 focus:border-[#0B5D57] transition-all"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[#0B5D57] text-xs font-bold uppercase tracking-widest ml-1">
               <Lock size={14} /> New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B5D57]/20 focus:border-[#0B5D57] transition-all"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[#0B5D57] text-xs font-bold uppercase tracking-widest ml-1">
               <CheckCircle size={14} /> Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B5D57]/20 focus:border-[#0B5D57] transition-all"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#0B5D57] hover:bg-slate-900 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 mt-4 shadow-lg shadow-teal-900/10 uppercase tracking-widest flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <RefreshCw size={20} className="animate-spin" /> Updating...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
}
