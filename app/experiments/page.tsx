"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ExperimentsPage() {
  const router = useRouter();

  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex min-h-screen">

      {/* LEFT SIDEBAR */}
      <div className="w-1/4 bg-[#d6eaf8] border-r-4 border-orange-400 p-4">
        <h2 className="text-xl font-semibold mb-4 text-[#154360]">
          Experiments
        </h2>

        {experiments.map((exp) => (
          <div
            key={exp.uuid}
            onClick={() => router.push(`/experiments/${exp.uuid}`)}
            className="p-3 mb-2 rounded-lg cursor-pointer bg-white hover:bg-blue-50"
          >
            {exp.name}
          </div>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 p-6 bg-[#f4f9fd]">
        <h1 className="text-2xl font-bold mb-6 text-[#154360]">
          Experiments Directory
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {experiments.map((exp) => (
              <Link key={exp.uuid} href={`/experiments/${exp.uuid}`}>
                <div className="bg-white border p-4 hover:bg-slate-50 cursor-pointer">
                  <h3 className="font-bold">{exp.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}