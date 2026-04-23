

import Link from "next/link";
import ExperimentStream from "./ExperimentStream";
import AIChat from "@/components/AIChat";
import AIUpload from "./AIUpload";
import MLPrediction from "./MLPrediction";
import { cookies } from "next/headers";
import CollapsibleSidebar from "./CollapsibleSidebar";
import { ArrowLeft, Beaker, Info, Activity, Brain, Upload } from "lucide-react";

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const headers: HeadersInit = sessionCookie ? { Cookie: `session=${sessionCookie}` } : {};

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/experiments/${id}`,
    {
      cache: "no-store",
      headers,
    }
  );
  let experiment = null;
  let isForbidden = false;

  if (res.ok) {
    experiment = await res.json();
  } else if (res.status === 403) {
    isForbidden = true;
  }

  // Fetch all experiments for sidebar
  const allRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/experiments`, {
    cache: "no-store",
    headers,
  });
  let allExperiments: any[] = [];
  if (allRes.ok) {
    const data = await allRes.json();
    allExperiments = Array.isArray(data) ? data : data.data || [];
  }

  if (isForbidden) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border-2 border-red-500 p-10 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center text-red-600 mx-auto">
             <Info size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800">
            Access Denied
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Security Protocol: You do not have the required clearance level to view this private experiment.
          </p>
          <Link href="/experiments" className="inline-flex items-center gap-2 bg-[#0B5D57] text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg">
            <ArrowLeft size={18} /> Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-[#0B5D57] border-t-transparent rounded-full animate-spin"></div>
           <p className="text-lg font-bold text-[#0B5D57] animate-pulse">Initializing Lab Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* 🔷 LEFT COLLAPSIBLE SIDEBAR */}
      <CollapsibleSidebar experiments={allExperiments} activeId={id} isLoggedIn={!!sessionCookie} />

      {/* 🔷 RIGHT CONTENT */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#f0fbfa] to-white">
        <div className="max-w-6xl mx-auto py-10 px-8 md:px-12 space-y-8 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0B5D57]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          {/* HEADER */}
          <div className="space-y-6">
            <Link
              href="/experiments"
              className="inline-flex items-center gap-2 text-sm font-black text-[#0B5D57] hover:text-orange-600 transition-colors uppercase tracking-widest"
            >
              <ArrowLeft size={16} /> Directory
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-orange-500 pb-8">
              <div className="space-y-2">
                 <div className="flex items-center gap-3 text-orange-600">
                    <Beaker size={24} />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Research Profile</span>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black text-[#0B5D57] tracking-tight">
                    {experiment.name}
                 </h1>
              </div>
              <div className="flex items-center gap-4">
                 {experiment.is_private && (
                   <span className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-orange-200">Private Access</span>
                 )}
                 <div className="bg-teal-50 text-[#0B5D57] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-teal-100">Live Stream</div>
              </div>
            </div>
          </div>

          {/* INFO */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/70 backdrop-blur-md border border-teal-50 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all group">
              <div className="flex items-center gap-3 mb-6">
                 <div className="bg-teal-100 p-2 rounded-xl text-[#0B5D57] group-hover:bg-[#0B5D57] group-hover:text-white transition-colors">
                    <Info size={20} />
                 </div>
                 <h2 className="text-xl font-black text-slate-800">Overview</h2>
              </div>
              <p className="text-slate-600 leading-relaxed italic border-l-4 border-teal-200 pl-4">
                 {experiment.description || "No description provided for this experimental setup."}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md border border-teal-50 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all group">
              <div className="flex items-center gap-3 mb-6">
                 <div className="bg-orange-100 p-2 rounded-xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <Beaker size={20} />
                 </div>
                 <h2 className="text-xl font-black text-slate-800">Components</h2>
              </div>
              <p className="text-slate-600 leading-relaxed font-mono text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 {experiment.components || "Standard laboratory assembly."}
              </p>
            </div>
          </div>

          {/* LIVE DATA */}
          <div className="bg-white border-2 border-teal-100 p-1 rounded-[2.5rem] shadow-2xl overflow-hidden">
             <div className="bg-[#0B5D57] p-6 rounded-[2.2rem] flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                   <Activity size={24} className="text-orange-400" />
                   <h2 className="text-xl font-black tracking-tight uppercase">Live Telemetry Stream</h2>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                   <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Active Connection</span>
                </div>
             </div>
             <div className="p-8">
                <ExperimentStream dataValues={experiment.dataValues} />
             </div>
          </div>

          {/* AI SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mt-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0B5D57] to-orange-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white border border-teal-50 p-2 rounded-[2rem] shadow-xl">
                 <div className="p-8 space-y-8">
                    <div className="flex items-center gap-3 border-b border-teal-50 pb-6">
                       <Brain size={32} className="text-[#0B5D57]" />
                       <div>
                          <h2 className="text-2xl font-black text-slate-800">Cognitive Lab Assistant</h2>
                          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">AI Synthesis & Inference</p>
                       </div>
                    </div>
                    
                    <AIChat
                      description={experiment.description}
                      components={experiment.components}
                      dataValues={experiment.dataValues}
                    />
                    
                    <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-teal-50">
                       <div className="space-y-4">
                          <div className="flex items-center gap-2 text-[#0B5D57]">
                             <Upload size={20} />
                             <h3 className="text-lg font-black">Data Analysis</h3>
                          </div>
                          <AIUpload />
                       </div>
                       <div className="space-y-4">
                          <div className="flex items-center gap-2 text-orange-600">
                             <Activity size={20} />
                             <h3 className="text-lg font-black">Predictive Models</h3>
                          </div>
                          <MLPrediction />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="h-12"></div>
        </div>
      </div>
    </div>
  );
}