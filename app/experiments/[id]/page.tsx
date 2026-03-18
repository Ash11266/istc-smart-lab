import db from "@/lib/db";
import Link from "next/link";
import ExperimentStream from "./ExperimentStream";

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

  return (
    <div className="max-w-6xl mx-auto w-full py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
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
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              {experiment.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Main Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

        {/* Real-time Telemetry Dashboard Widget */}
        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 w-full">
          <ExperimentStream />
        </div>

      </div>
    </div>
  );
}