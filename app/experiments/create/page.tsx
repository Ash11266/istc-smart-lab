"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateExperiment() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [components, setComponents] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/experiments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, components }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/experiments");
      }
    } catch (error) {
      console.error("Error creating experiment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-8">
        <Link href="/experiments" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors mb-4 group">
          <svg className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Experiments
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create New Experiment
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
          Configure a new laboratory setup for monitoring
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-8">
          
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Experiment Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Temperature Analysis Alpha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full px-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Describe the objective and parameters of this experiment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="block w-full px-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm resize-y"
            />
          </div>

          <div className="space-y-2">
             <label htmlFor="components" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Hardware Components
            </label>
            <input
              id="components"
              type="text"
              placeholder="e.g. Raspberry Pi, DHT11 Sensor, ESP32"
              value={components}
              onChange={(e) => setComponents(e.target.value)}
              className="block w-full px-4 py-3.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
            />
            <p className="text-xs text-slate-500 mt-2">
              Comma-separated list of primary devices used in this setup.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-4">
             <Link 
              href="/experiments"
              className="px-6 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className={`relative flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 overflow-hidden ${
                isSubmitting || !name.trim() 
                  ? "bg-indigo-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? (
                 <>
                   <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   Creating...
                 </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Create Experiment
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}