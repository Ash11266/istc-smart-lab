"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/experiments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExperiments(data);
        } else if (Array.isArray(data.data)) {
          setExperiments(data.data);
        } else {
          setExperiments([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setExperiments([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Experiments
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Manage and monitor your database experiments
          </p>
        </div>
        
        <Link 
          href="/experiments/create"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Create Experiment
        </Link>
      </div>

      {loading ? (
        <div className="w-full flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {experiments.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center bg-white dark:bg-slate-900/50 backdrop-blur-sm p-12 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No experiments found</h3>
              <p className="text-slate-500 mb-6 max-w-md">You haven't created any experiments yet. Start by generating a new experiment to begin tracking data.</p>
              <Link 
                href="/experiments/create"
                className="px-6 py-2 rounded-lg font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 transition-colors"
              >
                Create First Experiment
              </Link>
            </div>
          ) : (
            experiments.map((exp, idx) => (
              <Link key={exp.uuid || idx} href={`/experiments/${exp.uuid}`} className="group h-full">
                <div className="h-full flex flex-col bg-white dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:shadow-none hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold font-mono text-xs">
                        {exp.uuid ? exp.uuid.substring(0, 4) : "NEW"}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {exp.name}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                      {exp.description || "No description provided for this experiment entry."}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
                      <span>View Details</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}