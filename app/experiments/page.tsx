"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Beaker,
  Search,
  Plus,
  Trash2,
  LayoutDashboard,
  Activity,
  Lock,
  FlaskConical,
  Clock,
  ArrowRight
} from "lucide-react";

export default function ExperimentsPage() {
  const router = useRouter();

  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const res = await fetch("/api/experiments");

        if (!res.ok) {
          throw new Error("Failed to fetch experiments");
        }

        const result = await res.json();

        if (result && Array.isArray(result.data)) {
          setExperiments(result.data);
          setIsAdmin(result.isAdmin || false);
          setIsLoggedIn(result.isLoggedIn || false);
        } else if (Array.isArray(result)) {
          setExperiments(result);
        } else {
          console.warn("Unexpected response:", result);
          setExperiments([]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setExperiments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, []);

  const handleDelete = async (e: React.MouseEvent, uuid: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this experiment?")) return;

    try {
      const res = await fetch(`/api/experiments/${uuid}`, { method: "DELETE" });
      if (res.ok) {
        setExperiments((prev) => prev.filter((exp) => exp.uuid !== uuid));
      } else {
        alert("Failed to delete experiment");
      }
    } catch {
      alert("Error deleting experiment");
    }
  };

  const filteredExperiments = experiments.filter((exp) =>
    exp.name.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: experiments.length,
    private: experiments.filter(e => e.is_private).length,
    public: experiments.filter(e => !e.is_private).length,
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden">

      {/* 🔷 SIDEBAR */}
      <div className="w-80 bg-gradient-to-b from-[#e8f6f3]/90 to-[#d1f2eb]/90 border-r-[6px] border-orange-500 p-6 flex flex-col shadow-xl backdrop-blur-md z-20">

        <div className="flex items-center gap-3 mb-6">
          <FlaskConical className="text-[#0B5D57]" size={28} />
          <h2 className="text-2xl font-bold text-[#0B5D57] tracking-tight">
            Experiments
          </h2>
        </div>

        {/* 🔍 SEARCH */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search laboratory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-teal-200 focus:outline-none focus:ring-2 focus:ring-[#0B5D57] shadow-inner bg-white/80 transition-all"
          />
        </div>

        {/* 🔥 CREATE BUTTON */}
        {isLoggedIn && (
          <Link
            href="/experiments/create"
            className="mb-8 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition transform hover:scale-[1.02] active:scale-95"
          >
            <Plus size={20} /> Create Experiment
          </Link>
        )}

        {/* LIST */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          {filteredExperiments.map((exp, idx) => {
            const isActive = selectedId === exp.uuid;

            return (
              <div
                key={exp.uuid || idx}
                onClick={() => {
                  setSelectedId(exp.uuid);
                  router.push(`/experiments/${exp.uuid}`);
                }}
                className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 shadow-sm flex justify-between items-center border
                  ${isActive
                    ? "bg-[#d1f2eb] border-[#0B5D57] scale-[1.02] shadow-md"
                    : "bg-white/70 border-teal-50 hover:bg-white hover:scale-[1.03] hover:shadow-lg border-l-4 border-l-transparent hover:border-l-[#0B5D57]"
                  }
                `}
              >
                <div className="flex-1 min-w-0">
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

                {isAdmin && (
                  <button
                    onClick={(e) => handleDelete(e, exp.uuid)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all hover:bg-red-50 rounded-xl"
                    title="Delete Experiment"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })}

          {filteredExperiments.length === 0 && !loading && (
            <div className="text-center p-8 bg-white/30 rounded-xl border border-dashed border-teal-200">
              <Beaker className="mx-auto text-teal-300 mb-2" size={32} />
              <p className="text-slate-500 text-sm italic">No experiments found.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}