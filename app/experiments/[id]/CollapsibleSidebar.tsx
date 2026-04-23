"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FlaskConical, 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Lock,
  Beaker
} from "lucide-react";

export default function CollapsibleSidebar({
  experiments,
  activeId,
  isLoggedIn = true,
}: {
  experiments: { uuid: string; name: string; is_private?: boolean; [key: string]: unknown }[];
  activeId: string;
  isLoggedIn?: boolean;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState("");

  const filteredExperiments = experiments.filter((exp) =>
    exp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative flex shrink-0 h-full self-stretch z-30">
      {/* SIDEBAR */}
      <div 
        className={`${isOpen ? "w-80 p-6" : "w-0 p-0 overflow-hidden"} 
        bg-gradient-to-b from-[#e8f6f3]/90 to-[#d1f2eb]/90 border-r-[6px] border-orange-500 flex flex-col h-full shadow-2xl backdrop-blur-md transition-all duration-500 ease-in-out`}
      >
        <div className="w-64 flex flex-col flex-1 min-h-0"> 
          <div className="flex items-center gap-3 mb-6">
            <FlaskConical className="text-[#0B5D57]" size={28} />
            <h2 className="text-2xl font-black text-[#0B5D57] tracking-tight">
              Experiments
            </h2>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search lab..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-teal-200 focus:outline-none focus:ring-2 focus:ring-[#0B5D57] shadow-inner bg-white/80 transition-all"
            />
          </div>

          {/* 🔥 CREATE BUTTON */}
          {isLoggedIn && (
            <button
              onClick={() => router.push("/experiments/create")}
              className="mb-8 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black py-3 px-4 rounded-xl shadow-lg shadow-orange-500/20 transition transform hover:scale-[1.02] active:scale-95"
            >
              <Plus size={20} /> New Experiment
            </button>
          )}

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 pt-1 custom-scrollbar">
            {filteredExperiments.map((exp, idx) => {
              const isActive = activeId === exp.uuid;

              return (
                <div
                  key={exp.uuid || idx}
                  onClick={() => {
                    router.push(`/experiments/${exp.uuid}`);
                  }}
                  className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 shadow-sm flex flex-col border
                    ${isActive
                      ? "bg-[#d1f2eb] border-[#0B5D57] scale-[1.02] shadow-md"
                      : "bg-white/70 border-teal-50 hover:bg-white hover:scale-[1.03] hover:shadow-lg border-l-4 border-l-transparent hover:border-l-[#0B5D57]"
                    }
                  `}
                >
                  <p className={`font-bold truncate ${isActive ? "text-[#0B5D57]" : "text-slate-700 group-hover:text-[#0B5D57]"}`}>
                    {exp.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {exp.is_private ? (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-tighter text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                        <Lock size={10} /> Private
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-black tracking-tighter text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">Public</span>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredExperiments.length === 0 && (
              <div className="text-center p-8 bg-white/30 rounded-xl border border-dashed border-teal-200">
                <Beaker className="mx-auto text-teal-300 mb-2" size={32} />
                <p className="text-slate-500 text-sm italic">No records found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-8 top-1/2 -translate-y-1/2 h-16 bg-orange-500 w-8 flex items-center justify-center text-white rounded-r-xl shadow-xl hover:bg-orange-600 focus:outline-none transition-all border-y-2 border-r-2 border-orange-600 z-50 group"
        title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isOpen ? <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" /> : <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />}
      </button>
    </div>
  );
}
