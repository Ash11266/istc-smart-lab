"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";



export default function ExperimentsPage() {
  const router = useRouter();
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/experiments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExperiments(data);
        } else if (data.data) {
          setExperiments(data.data);
          setIsAdmin(!!data.isAdmin);
          setIsLoggedIn(!!data.isLoggedIn);
        } else {
          setExperiments([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setExperiments([]);
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
        setExperiments(prev => prev.filter(exp => exp.uuid !== uuid));
      } else {
        alert("Failed to delete experiment");
      }
    } catch (err) {
      alert("Error deleting experiment");
    }
  };

  return (
    <div className="flex h-full">

      {/* 🔷 LEFT SIDEBAR */}
      <div className="w-1/4 bg-[#d6eaf8] border-r-4 border-orange-400 p-4 flex flex-col">

        <h2 className="text-xl font-semibold mb-4 text-[#154360]">
          Experiments
        </h2>

        {isLoggedIn && (
          <Link href="/experiments/create" className="mb-4 text-center bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded shadow-sm transition">
            + Create Experiment
          </Link>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">

          {experiments.map((exp, idx) => (
            <div key={exp.uuid || idx} onClick={() => router.push(`/experiments/${exp.uuid}`)}
              className="group p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-sm bg-white hover:bg-blue-50 flex justify-between items-center"
            >
              <p className="font-medium text-[#2c3e50]">{exp.name}</p>
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

        </div>

      </div>

      {/* 🔷 RIGHT SIDE DEFAULT */}
      <div className="flex-1 flex items-center justify-center bg-[#f4f9fd]">

        <h1 className="text-2xl text-gray-500">
          Select an experiment from the left
        </h1>

      </div>

    </div>
  );
}