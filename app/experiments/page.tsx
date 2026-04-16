"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/experiments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExperiments(data);
        } else if (data.data) {
          setExperiments(data.data);
          setIsAdmin(!!data.isAdmin);
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

  const handleDelete = async (e: React.MouseEvent, uuid: string) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this experiment?")) return;
    
    try {
      const res = await fetch(`/api/experiments/${uuid}`, { method: "DELETE" });
      if (res.ok) {
        setExperiments(prev => prev.filter(exp => exp.uuid !== uuid));
      } else {
        alert("Failed to delete experiment");
      }
    } catch (err) {
      alert("Error deleting experiment");
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-300 pb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#003366] tracking-tight mb-2">
            Experiments Directory
          </h1>
          <p className="text-slate-700 text-lg font-medium">
            Manage and monitor registered laboratory experiments
          </p>
        </div>
        
        <Link 
          href="/experiments/create"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#003366] text-white font-bold uppercase tracking-wide border-2 border-transparent hover:bg-slate-900 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Register Experiment
        </Link>
      </div>

      {loading ? (
        <div className="w-full flex justify-center py-20">
          <div className="animate-spin h-12 w-12 border-4 border-[#003366] border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {experiments.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center bg-slate-50 p-12 border border-slate-300 shadow-sm text-center">
              <div className="w-16 h-16 bg-white border border-slate-300 flex items-center justify-center mb-6 text-slate-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Records Found</h3>
              <p className="text-slate-600 mb-6 max-w-md">There are currently no experiments on record. Please register a new experiment.</p>
              <Link 
                href="/experiments/create"
                className="px-6 py-2 border-2 border-[#003366] text-[#003366] font-bold uppercase tracking-wide hover:bg-slate-100 transition-colors"
              >
                Register First Experiment
              </Link>
            </div>
          ) : (
            experiments.map((exp, idx) => (
              <Link key={exp.uuid || idx} href={`/experiments/${exp.uuid}`} className="group h-full">
                <div className="h-full flex flex-col bg-white border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors relative">
                  
                  {/* Top Color Bar */}
                  <div className="w-full h-1 bg-[#003366]"></div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="px-2 py-1 bg-slate-100 border border-slate-200 text-[#003366] font-bold font-mono text-xs uppercase tracking-widest">
                        ID: {exp.uuid ? exp.uuid.substring(0, 4) : "NEW"}
                      </div>
                      
                      {isAdmin && (
                        <button 
                          onClick={(e) => handleDelete(e, exp.uuid)} 
                          className="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold uppercase rounded border border-red-200 transition-colors z-10 relative"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:underline underline-offset-2 line-clamp-2">
                      {exp.name}
                    </h3>

                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                        Created By: <span className="text-[#003366]">{exp.created_by_name || "System"}</span>
                    </div>

                    <p className="text-slate-700 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                      {exp.description || "No official description recorded."}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between text-[#003366] text-sm font-bold uppercase tracking-wide">
                      <span>Access Details</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
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