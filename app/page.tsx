import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full bg-white text-slate-900">
      {/* Hero Section */}
      <section className="w-full bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 flex flex-col items-start text-left">
          
          <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-sm font-bold mb-6 border-l-4 border-amber-500 uppercase tracking-widest">
            ISTC Smart Lab Platform
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#003366] mb-6">
            Smart Experiment Monitoring Platform
          </h1>

          <p className="max-w-3xl text-lg md:text-xl text-slate-700 mb-10 leading-relaxed font-medium">
            Welcome to the ISTC Smart Lab Platform. This portal allows authorized researchers and students to manage and monitor laboratory experiments securely using a centralized, IoT-integrated SQL system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-start w-full">
            <Link href="/experiments" className="w-full sm:w-auto px-8 py-3 bg-[#003366] text-white font-bold text-center border-2 border-[#003366] hover:bg-slate-900 hover:border-slate-900 transition-colors uppercase tracking-wider text-sm shadow-sm">
              View Access Experiments
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#003366] mb-10 pb-4 border-b-2 border-slate-200">
          Platform Capabilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white p-8 border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors">
            <div className="w-12 h-12 bg-slate-100 text-[#003366] flex items-center justify-center mb-6 border border-slate-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Experiment Monitoring
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              Track real-time experiment data collected directly from connected IoT devices. Ensure telemetry meets quality metrics prior to reporting.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors">
            <div className="w-12 h-12 bg-slate-100 text-[#003366] flex items-center justify-center mb-6 border border-slate-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Experiment Management
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              Create, configure, and manage multifaceted experiments seamlessly through an integrated, robust database system.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors">
            <div className="w-12 h-12 bg-slate-100 text-[#003366] flex items-center justify-center mb-6 border border-slate-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Data Integration
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              All critical experiment data is structured in an SQL database and automatically synchronized with the main directory.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
