import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
      {/* Hero Section */}
      <section className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-4 py-16 md:py-24">
        
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-8 border border-indigo-100 dark:border-indigo-800/50">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
          CSIO Smart Lab Platform
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          <span className="block">Smart Experiment</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
            Monitoring Platform
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
          Welcome to the CSIO Smart Lab Dashboard. This platform allows
          researchers and students to manage and monitor laboratory
          experiments using an IoT and SQL powered system.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            Open Dashboard
          </Link>
          <Link href="/experiments" className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
            View Experiments
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
          Platform Capabilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="group bg-white dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M7,10H9V17H7V10M11,7H13V17H11V7M15,13H17V17H15V13Z" /></svg>
            </div>
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Experiment Monitoring
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Track real-time experiment data collected directly from connected IoT devices and analyze immediate results through the dashboard.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Experiment Management
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Create, configure, and manage multifaceted experiments seamlessly through an integrated, robust database system.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12,3L2,12H5V20H19V12H22L12,3M12,7.7C14.1,7.7 15.8,9.4 15.8,11.5C15.8,14.5 12,18 12,18C12,18 8.2,14.5 8.2,11.5C8.2,9.4 9.9,7.7 12,7.7Z" /></svg>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Data Integration
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              All critical experiment data is structured in an SQL database and automatically synchronized with the dashboard interface.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
