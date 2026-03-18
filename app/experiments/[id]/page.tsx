import db from "@/lib/db";
import Link from "next/link";

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [rows]: any = await db.query(
    "SELECT * FROM experiments WHERE uuid = ?",
    [id]
  );

  if (!rows || rows.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-8 rounded-3xl border border-rose-200 dark:border-rose-800">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <h2 className="text-2xl font-bold mb-2">Experiment Not Found</h2>
          <p className="text-rose-600/80 dark:text-rose-400/80 mb-6">
            The requested experiment ID <code className="bg-rose-100 dark:bg-rose-900/50 px-2 py-1 rounded mx-1">{id}</code> does not exist or has been removed.
          </p>
          <Link href="/experiments" className="inline-flex items-center justify-center px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition-colors">
            Return to Experiments
          </Link>
        </div>
      </div>
    );
  }

  const experiment = rows[0];
  const dateStr = experiment.created_at ? new Date(experiment.created_at).toLocaleDateString() : "Present";

  return (
    <div className="max-w-4xl mx-auto w-full py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-8">
         <Link href="/experiments" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors mb-4 group">
          <svg className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Directory
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
                ID: {experiment.uuid.substring(0, 8)}
              </span>
              <span className="inline-flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                Active View
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              {experiment.name}
            </h1>
          </div>

          <div className="shrink-0 flex gap-3">
             <Link href="/dashboard" className="px-5 py-2.5 rounded-xl font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Launch Dashboard
             </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
              Experiment Overview
            </h3>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              {experiment.description ? (
                <p>{experiment.description}</p>
              ) : (
                <p className="italic text-slate-400">No detailed description has been provided for this experiment.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              Hardware & Dependencies
            </h3>
             {experiment.components ? (
                <div className="flex flex-wrap gap-3">
                  {experiment.components.split(",").map((comp: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 font-medium">
                      <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                      {comp.trim()}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No specific hardware components listed.</p>
              )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-800/30 p-6 shadow-sm">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-4 uppercase tracking-wider text-sm">
              Metadata
            </h3>
            <ul className="space-y-4">
              <li className="flex flex-col">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Status</span>
                <span className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
                </span>
              </li>
              <li className="flex flex-col">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Created</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {dateStr}
                </span>
              </li>
              <li className="flex flex-col">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Record ID</span>
                <span className="font-mono text-sm text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-black/20 px-2 py-1 rounded mt-1 overflow-x-auto">
                  {experiment.uuid}
                </span>
              </li>
            </ul>
             <div className="mt-8 pt-6 border-t border-indigo-200/50 dark:border-indigo-800/30">
               <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Export Data Log
               </button>
             </div>
          </div>
        </div>

      </div>

    </div>
  );
}