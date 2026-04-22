"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";



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

  return (
    <div className="flex flex-1 min-h-0">

      {/* 🔷 SIDEBAR */}
      <div className="w-72 bg-gradient-to-b from-[#e8f6f3]/80 to-[#d1f2eb]/80 border-r-[6px] border-orange-500 p-4 flex flex-col shadow-md backdrop-blur-sm">

        <h2 className="text-xl font-bold mb-3 text-[#0B5D57]">
          Experiments
        </h2>

        {/* 🔍 SEARCH */}
        <input
          type="text"
          placeholder="Search experiment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B5D57]"
        />

        {/* 🔥 CREATE BUTTON */}
        {isLoggedIn && (
          <Link
            href="/experiments/create"
            className="mb-4 text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-orange-300/50 hover:shadow-orange-400/70 transition transform hover:scale-105"
          >
            + Create Experiment
          </Link>
        )}

        {/* LIST */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredExperiments.map((exp, idx) => {
            const isActive = selectedId === exp.uuid;

            return (
              <div
                key={exp.uuid || idx}
                onClick={() => {
                  setSelectedId(exp.uuid);
                  router.push(`/experiments/${exp.uuid}`);
                }}
                className={`group p-3 rounded-xl cursor-pointer transition-all duration-200 shadow-sm flex justify-between items-center border
                  
                  ${isActive
                    ? "bg-[#d1f2eb] border-l-4 border-[#0B5D57]"
                    : "bg-white border-[#cce7e3] hover:bg-[#d1f2eb] hover:scale-[1.03] hover:shadow-md border-l-4 border-transparent hover:border-[#0B5D57]"
                  }
                `}
              >
                <div>
                  <p className="font-semibold text-[#0B5D57]">
                    {exp.name}
                  </p>
                  {exp.is_private ? (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded mt-1 w-fit block">Private</span>
                  ) : null}
                </div>

                {isAdmin && (
                  <button
                    onClick={(e) => handleDelete(e, exp.uuid)}
                    className="hidden group-hover:block bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })}
          {filteredExperiments.length === 0 && !loading && (
            <div className="text-center text-slate-500 mt-4 italic">
              No experiments found.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}