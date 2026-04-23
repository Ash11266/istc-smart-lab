"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  UserPlus, 
  FileUp, 
  RotateCcw, 
  Mail, 
  User, 
  Lock, 
  Info, 
  CheckCircle, 
  AlertCircle,
  RefreshCw
} from "lucide-react";

export default function AdminPanel() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [bulkError, setBulkError] = useState("");
  const [bulkSuccess, setBulkSuccess] = useState("");
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);

  const router = useRouter();

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        setSuccessMessage(`User ${name} created successfully!`);
        setName("");
        setEmail("");
        setPassword("");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create user");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setBulkError("Please select a file first");
      return;
    }
    
    setIsBulkLoading(true);
    setBulkError("");
    setBulkSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/auth/bulk-signup", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setBulkSuccess(data.message || "Bulk import successful!");
        setFile(null);
      } else {
        const data = await res.json();
        setBulkError(data.error || "Failed to import users");
      }
    } catch (err) {
      setBulkError("An unexpected error occurred during bulk import");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetLoading(true);
    setResetError("");
    setResetSuccess("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (res.ok) {
        const data = await res.json();
        setResetSuccess(data.message || "Password reset successfully!");
        setResetEmail("");
      } else {
        const data = await res.json();
        setResetError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setResetError("An unexpected error occurred");
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#f0fbfa]/80 to-white/80 p-8 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Admin Header Block */}
        <div className="bg-[#0B5D57] text-white p-10 rounded-[2.5rem] shadow-2xl border-l-[12px] border-orange-500 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20 shadow-inner">
              <ShieldCheck size={48} className="text-orange-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight uppercase">Admin Console</h1>
              <p className="mt-2 text-teal-100/80 font-bold tracking-widest text-sm uppercase">Manage Personnel & Security Protocols</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Single User Creation */}
          <div className="bg-white/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-xl border border-teal-50 flex flex-col hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-8 border-b border-teal-50 pb-6">
              <UserPlus className="text-[#0B5D57]" size={28} />
              <h2 className="text-2xl font-black text-slate-800">User Provisioning</h2>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-r-xl flex items-center gap-3">
                <AlertCircle size={20} />
                <span className="font-bold">Error:</span> {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-8 rounded-r-xl flex items-center gap-3">
                <CheckCircle size={20} />
                <span className="font-bold">Success:</span> {successMessage}
              </div>
            )}

            <form onSubmit={handleSingleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#0B5D57] text-xs font-black uppercase tracking-widest ml-1">
                   <User size={14} /> Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#0B5D57]/5 focus:border-[#0B5D57] transition-all"
                  placeholder="Researcher Name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#0B5D57] text-xs font-black uppercase tracking-widest ml-1">
                   <Mail size={14} /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#0B5D57]/5 focus:border-[#0B5D57] transition-all"
                  placeholder="name@lab.istc"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#0B5D57] text-xs font-black uppercase tracking-widest ml-1">
                   <Lock size={14} /> Initial Token
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#0B5D57]/5 focus:border-[#0B5D57] transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0B5D57] hover:bg-slate-900 text-white font-black py-5 px-8 rounded-2xl transition-all shadow-xl shadow-[#0B5D57]/10 flex items-center justify-center gap-3 uppercase tracking-widest active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="animate-spin" /> : <UserPlus size={20} />}
                {isLoading ? "Provisioning..." : "Initialize Account"}
              </button>
            </form>
          </div>

          {/* Bulk User Creation */}
          <div className="bg-white/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-xl border border-teal-50 flex flex-col hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-8 border-b border-teal-50 pb-6">
              <FileUp className="text-orange-600" size={28} />
              <h2 className="text-2xl font-black text-slate-800">Bulk Import</h2>
            </div>
            
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl mb-8 flex items-start gap-4">
               <Info className="text-orange-600 mt-1 shrink-0" size={20} />
               <p className="text-sm text-orange-800 font-medium leading-relaxed">
                  Upload <strong className="font-black">.xlsx</strong> or <strong className="font-black">.csv</strong>. Use headers: <code className="bg-orange-200/50 px-1.5 rounded font-black">name</code>, <code className="bg-orange-200/50 px-1.5 rounded font-black">email</code>.<br/>
                  Default Token: <code className="bg-orange-200/50 px-1.5 rounded font-black font-mono">istc@12345</code>
               </p>
            </div>

            {bulkError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-r-xl flex items-center gap-3">
                <AlertCircle size={20} />
                <span className="font-bold">Error:</span> {bulkError}
              </div>
            )}

            {bulkSuccess && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-8 rounded-r-xl flex items-center gap-3">
                <CheckCircle size={20} />
                <span className="font-bold">Success:</span> {bulkSuccess}
              </div>
            )}

            <form onSubmit={handleBulkSubmit} className="space-y-8 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#0B5D57] text-xs font-black uppercase tracking-widest ml-1">
                   <FileUp size={14} /> Laboratory Manifest
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full bg-slate-50 border-2 border-dashed border-teal-200 rounded-2xl px-5 py-8 text-slate-500 text-center cursor-pointer hover:bg-teal-50/50 transition-all file:hidden"
                    required
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <span className="text-sm font-bold text-[#0B5D57]/60">
                        {file ? file.name : "Click or drag to select dataset"}
                     </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBulkLoading || !file}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 px-8 rounded-2xl transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 uppercase tracking-widest active:scale-95 disabled:opacity-50"
              >
                {isBulkLoading ? <RefreshCw className="animate-spin" /> : <FileUp size={20} />}
                {isBulkLoading ? "Processing..." : "Deploy Dataset"}
              </button>
            </form>
          </div>

          {/* Reset User Password */}
          <div className="bg-white/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-xl border border-teal-50 lg:col-span-2 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-4 mb-8 border-b border-teal-50 pb-6">
              <RotateCcw className="text-slate-600" size={28} />
              <h2 className="text-2xl font-black text-slate-800">Emergency Access Recovery</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100 italic">
                  Reset a personnel token to the laboratory default in case of forgotten credentials. Personnel must re-authenticate and update their token immediately via the Profile interface.
                </p>

                {resetError && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl flex items-center gap-3">
                    <AlertCircle size={20} />
                    <span className="font-bold">Error:</span> {resetError}
                  </div>
                )}

                {resetSuccess && (
                  <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-xl flex items-center gap-3">
                    <CheckCircle size={20} />
                    <span className="font-bold">Success:</span> {resetSuccess}
                  </div>
                )}
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[#0B5D57] text-xs font-black uppercase tracking-widest ml-1">
                     <Mail size={14} /> Personnel Email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-500 transition-all"
                    placeholder="name@lab.istc"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isResetLoading}
                  className="bg-slate-800 hover:bg-black text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest active:scale-95 disabled:opacity-50"
                >
                  {isResetLoading ? <RefreshCw className="animate-spin" /> : <RotateCcw size={18} />}
                  {isResetLoading ? "Resetting..." : "Restore Default Token"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
