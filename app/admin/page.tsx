"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        // Reset file input value if needed (using uncontrolled input here so just clear state)
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
    <div className="flex flex-col gap-8">
      <div className="bg-[#003366] text-white p-6 rounded-lg shadow-sm border-l-4 border-amber-500">
        <h1 className="text-3xl font-extrabold tracking-tight">Admin & Director Panel</h1>
        <p className="mt-2 text-slate-300">Manage user accounts and lab accessibility.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Single User Creation */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Single User Provisioning</h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm flex items-center">
              <span className="font-bold mr-2">Error:</span> {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 text-sm flex items-center">
              <span className="font-bold mr-2">Success:</span> {successMessage}
            </div>
          )}

          <form onSubmit={handleSingleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-700 text-sm font-bold mb-2 tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/50 focus:border-[#003366]"
                placeholder="Researcher Name"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-bold mb-2 tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/50 focus:border-[#003366]"
                placeholder="name@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-slate-700 text-sm font-bold mb-2 tracking-wider">Temporary Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003366]/50 focus:border-[#003366]"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#003366] hover:bg-slate-900 text-white font-bold py-3 px-8 rounded transition-colors disabled:opacity-50 mt-4 shadow-sm uppercase tracking-wider"
            >
              {isLoading ? "Provisioning..." : "Create Account"}
            </button>
          </form>
        </div>

        {/* Bulk User Creation */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Bulk User Import (Excel)</h2>
          <p className="text-sm text-slate-600 mb-6 font-medium bg-slate-50 p-4 border border-slate-200 rounded">
            Upload an `.xlsx` or `.csv` file. Ensure it contains exactly two column headers: <strong className="text-[#003366]">name</strong> and <strong className="text-[#003366]">email</strong>.<br/><br/>
            All imported users will be assigned the default password: <code className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono">istc@12345</code>
          </p>

          {bulkError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm flex items-center">
              <span className="font-bold mr-2">Error:</span> {bulkError}
            </div>
          )}

          {bulkSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 text-sm flex items-center">
              <span className="font-bold mr-2">Success:</span> {bulkSuccess}
            </div>
          )}

          <form onSubmit={handleBulkSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-700 text-sm font-bold mb-2 tracking-wider">Select File</label>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#003366] file:text-white hover:file:bg-slate-900"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isBulkLoading || !file}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded transition-colors disabled:opacity-50 mt-4 shadow-sm uppercase tracking-wider"
            >
              {isBulkLoading ? "Importing..." : "Process Import"}
            </button>
          </form>
        </div>

        {/* Reset User Password */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200 lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Reset User Password</h2>
          <p className="text-sm text-slate-600 mb-6 font-medium bg-slate-50 p-4 border border-slate-200 rounded">
            Reset a user's password directly to the lab default (<code className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono">istc@12345</code>). They will be able to change it through their profile after logging in.
          </p>

          {resetError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm flex items-center">
              <span className="font-bold mr-2">Error:</span> {resetError}
            </div>
          )}

          {resetSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 text-sm flex items-center">
              <span className="font-bold mr-2">Success:</span> {resetSuccess}
            </div>
          )}

          <form onSubmit={handleResetSubmit} className="space-y-6 max-w-xl">
            <div>
              <label className="block text-slate-700 text-sm font-bold mb-2 tracking-wider">User's Email</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/50 focus:border-[#003366]"
                placeholder="name@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isResetLoading}
              className="bg-[#003366] hover:bg-slate-900 text-white font-bold py-3 px-8 rounded transition-colors disabled:opacity-50 mt-4 shadow-sm uppercase tracking-wider"
            >
              {isResetLoading ? "Resetting..." : "Reset to Default"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
