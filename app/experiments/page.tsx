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
    fetch("/api/experiments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setExperiments(data);
        } else {
          setExperiments([
            { uuid: "alpha-node", name: "Alpha Node Sensor Diagnostic", active: true },
            { uuid: "thermal-camera", name: "Thermal Camera Calibration", active: true },
            { uuid: "battery-test", name: "Battery Discharge Test", active: false },
            { uuid: "smart-greenhouse", name: "Smart Greenhouse", active: true },
            { uuid: "ml-edge", name: "ML Edge Inference", active: false },
            { uuid: "distance", name: "Distance Measurement", active: true },
          ]);
        }
        setLoading(false);
      })
      .catch(() => {
        setExperiments([
          { uuid: "alpha-node", name: "Alpha Node Sensor Diagnostic", active: true },
          { uuid: "thermal-camera", name: "Thermal Camera Calibration", active: true },
        ]);
        setLoading(false);
      });
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
            className="mb-4 text-center bg-white-500 hover:bg-orange-600 text-orange font-bold py-2 px-4 rounded-lg shadow-lg shadow-orange-300/50 hover:shadow-orange-400/70 transition transform hover:scale-105"
          >
            + Create Experiment
          </Link>
        )}

        {/* LIST */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">

<<<<<<< HEAD
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
                <p className="font-semibold text-[#0B5D57]">
                  {exp.name}
                </p>

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

        </div>
      </div>

      {/* 🔷 RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#f0fbfa]/80 to-white/80 backdrop-blur-sm">

        <div className="text-center">

          <h1 className="text-4xl font-bold text-[#0B5D57] mb-3">
            Welcome 👋
          </h1>

          <p className="text-lg text-gray-500">
            Select an experiment from the left
          </p>
=======
          {experiments.map((exp, idx) => (
            <div key={exp.uuid || idx} onClick={() => router.push(`/experiments/${exp.uuid}`)}
              className="group p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-sm bg-white hover:bg-blue-50 flex justify-between items-center"
            >
              <div className="flex flex-col">
                <p className="font-medium text-[#2c3e50]">{exp.name}</p>
                {exp.is_private ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded mt-1 w-fit">Private</span>
                ) : null}
              </div>
              {isAdmin && (
                <button
                  onClick={(e) => handleDelete(e, exp.uuid)}
                  className="hidden group-hover:block bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition shadow-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
>>>>>>> PageDesign

        </div>

      </div>
    </div>
  );
}