"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import ExperimentStream from "./ExperimentStream";

export default function ExperimentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [experiment, setExperiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/experiments/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not Found");
        }
        return res.json();
      })
      .then((data) => {
        setExperiment(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching experiment:", err);
        setExperiment(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto w-full py-24 flex justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#003366] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center text-slate-900">
        <div className="bg-white border-2 border-red-700 p-8 shadow-sm">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <h2 className="text-2xl font-bold mb-2 text-red-700 uppercase tracking-wide">Record Not Found</h2>
          <p className="text-slate-700 mb-6 font-medium">
            The requested experiment ID <code className="bg-slate-100 border border-slate-300 px-2 py-1 mx-1 font-mono text-slate-800">{id}</code> does not exist or has been archived.
          </p>
          <Link href="/experiments" className="inline-flex items-center justify-center px-6 py-3 bg-[#003366] hover:bg-slate-900 text-white font-bold uppercase tracking-wide transition-colors shadow-sm">
            Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full py-8 text-slate-900">

      <div className="mb-6 border-b-2 border-slate-300 pb-4">
        <Link href="/experiments" className="inline-flex items-center text-sm font-bold text-[#003366] hover:underline mb-4 uppercase tracking-wider">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Directory
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center bg-slate-100 border border-slate-300 text-[#003366] px-3 py-1 font-bold font-mono text-sm tracking-widest uppercase">
                ID: {experiment.uuid?.substring(0, 8)}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#003366] tracking-tight">
              {experiment.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">

        {/* Main Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="bg-white border text-left border-slate-300 shadow-sm relative w-full p-8">
            <div className="absolute top-0 left-0 h-1 w-full bg-[#003366]"></div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2 uppercase tracking-wide">
              Experiment Overview
            </h3>
            <div className="prose prose-slate max-w-none text-slate-800 text-base leading-relaxed font-medium">
              {experiment.description ? (
                <p>{experiment.description}</p>
              ) : (
                <p className="italic text-slate-500">No official descriptive text has been recorded for this experiment.</p>
              )}
            </div>
          </div>

          <div className="bg-white border text-left border-slate-300 shadow-sm relative w-full p-8">
            <div className="absolute top-0 left-0 h-1 w-full bg-[#003366]"></div>

            <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2 uppercase tracking-wide">
              Hardware Components
            </h3>
            {experiment.components ? (
              <ul className="list-disc pl-5 mb-6 text-slate-800 font-medium space-y-1">
                {experiment.components.split(",").map((comp: string, i: number) => (
                  <li key={i}>{comp.trim()}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic mb-6">No specific hardware components listed.</p>
            )}

            <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 mt-6 flex items-center gap-2 uppercase tracking-wide">
              Monitored Metrics
            </h3>
            {experiment.dataValues ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {experiment.dataValues.split(",").map((metric: string, i: number) => (
                  <div key={i} className="bg-slate-100 border border-slate-300 px-3 py-1 font-mono text-sm text-[#003366] font-bold uppercase tracking-wider">
                    {metric.trim()}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No specific metrics defined (listening to all).</p>
            )}
          </div>

        </div>

        {/* Real-time Telemetry Monitoring Widget */}
        <div className="bg-white border text-left border-slate-300 shadow-sm relative w-full p-8 mt-4">
          <div className="absolute top-0 left-0 h-1 w-full bg-slate-900"></div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b-2 border-slate-200 uppercase tracking-wide">
            Live Telemetry View
          </h3>
          <ExperimentStream dataValues={experiment.dataValues} />
        </div>

      </div>
    </div>
  );
}