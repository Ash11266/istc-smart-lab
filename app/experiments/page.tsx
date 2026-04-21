"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ExperimentsPage() {
  const router = useRouter();

  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/experiments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExperiments(data);
        } else if (data.data) {
          setExperiments(data.data);
          setIsAdmin(!!data.isAdmin);
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
    if (!confirm("Are you sure you want to delete this experiment?")) return;

    try {
      const res = await fetch(`/api/experiments/${uuid}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setExperiments((prev) =>
          prev.filter((exp) => exp.uuid !== uuid)
        );
      } else {
        alert("Failed to delete experiment");
      }
    } catch {
      alert("Error deleting experiment");
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* 🔷 LEFT SIDEBAR */}
      <div className="w-1/4 bg-[#d6eaf8] border-r-4 border-orange-400 p-4">
        <h2 className="text-xl font-semibold mb-4 text-[#154360]">
          Experiments
        </h2>

        <div className="space-y-2">
          {experiments.map((exp, index) => (
            <div
              key={index}
              onClick={() => router.push(`/experiments/${exp.route || exp.uuid}`)}
              className="p-3 rounded-lg cursor-pointer bg-white hover:bg-blue-50"
            >
              <p className="font-medium text-[#2c3e50]">{exp.name}</p>

              <span
                className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                  exp.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {exp.active ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 🔷 RIGHT SIDE */}
      <div className="flex-1 p-6 bg-[#f4f9fd]">

        <h1 className="text-2xl font-bold mb-6 text-[#154360]">
          Experiments Directory
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {experiments.map((exp, idx) => (
              <Link
                key={exp.uuid || idx}
                href={`/experiments/${exp.uuid}`}
              >
                <div className="bg-white border p-4 hover:bg-slate-50 cursor-pointer relative">

                  {/* DELETE BUTTON */}
                  {isAdmin && (
                    <button
                      onClick={(e) => handleDelete(e, exp.uuid)}
                      className="absolute top-2 right-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}

                  <h3 className="font-bold text-lg">{exp.name}</h3>

                  <p className="text-sm text-gray-600 mt-2">
                    {exp.description || "No description"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}