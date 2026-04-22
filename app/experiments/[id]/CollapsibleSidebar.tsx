"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CollapsibleSidebar({
  experiments,
  activeId,
  isLoggedIn = true, // Default to true or passed from parent
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
    <div className="relative flex shrink-0 h-full self-stretch">
      {/* SIDEBAR */}
      <div 
        className={`${isOpen ? "w-72 p-4" : "w-0 p-0 overflow-hidden"} 
        bg-gradient-to-b from-[#e8f6f3]/80 to-[#d1f2eb]/80 border-r-[6px] border-orange-500 flex flex-col h-full shadow-md backdrop-blur-sm transition-all duration-300 ease-in-out`}
      >
        <div className="w-64 flex flex-col flex-1 min-h-0"> 
          <h2 className="text-xl font-bold mb-3 text-[#0B5D57]">
            Experiments
          </h2>

          <input
            type="text"
            placeholder="Search experiment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B5D57] shadow-inner bg-white/50"
          />

          {/* 🔥 CREATE BUTTON */}
          {isLoggedIn && (
            <button
              onClick={() => router.push("/experiments/create")}
              className="mb-6 w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-orange-300/50 hover:shadow-orange-400/70 transition transform hover:scale-[1.02] active:scale-95"
            >
              + Create Experiment
            </button>
          )}

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 pt-1">
            {filteredExperiments.map((exp, idx) => {
              const isActive = activeId === exp.uuid;

              return (
                <div
                  key={exp.uuid || idx}
                  onClick={() => {
                    // router.push is better instead of Link because Link would require nested elements
                    router.push(`/experiments/${exp.uuid}`);
                  }}
                  className={`group p-3 rounded-xl cursor-pointer transition-all duration-200 shadow-sm flex justify-between items-center border
                    ${isActive
                      ? "bg-[#d1f2eb] border-l-4 border-[#0B5D57]"
                      : "bg-white border-[#cce7e3] hover:bg-[#d1f2eb] hover:scale-[1.03] hover:shadow-md border-l-4 border-transparent hover:border-[#0B5D57]"
                    }
                  `}
                >
                  <div className="w-full">
                    <p className="font-semibold text-[#0B5D57] whitespace-normal">
                      {exp.name}
                    </p>
                    {exp.is_private ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded mt-1 w-fit block">Private</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
            {filteredExperiments.length === 0 && (
              <div className="text-center text-slate-500 mt-4 italic">
                No experiments found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-6 top-4 h-12 bg-orange-500 w-6 flex items-center justify-center text-white rounded-r-md shadow-md hover:bg-orange-600 focus:outline-none transition-colors border-y border-r border-orange-600 z-50"
        title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isOpen ? "◀" : "▶"}
      </button>
    </div>
  );
}
