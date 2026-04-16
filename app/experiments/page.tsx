"use client";

import { useRouter } from "next/navigation";

const experiments = [
  { name: "Alpha Node Sensor", active: true, route: "alpha-node" },
  { name: "Thermal Camera", active: true, route: "thermal-camera" },
  { name: "Battery Test", active: false, route: "battery-test" },
  { name: "Smart Greenhouse", active: true, route: "smart-greenhouse" },
  { name: "ML Edge", active: false, route: "ml-edge" },
  { name: "Distance Measurement", active: true, route: "distance" },
];

export default function ExperimentsPage() {
  const router = useRouter();

  return (
    <div className="flex h-full">

      {/* 🔷 LEFT SIDEBAR */}
      <div className="w-1/4 bg-[#d6eaf8] border-r-4 border-orange-400 p-4 flex flex-col">

        <h2 className="text-xl font-semibold mb-4 text-[#154360]">
          Experiments
        </h2>

        <div className="flex-1 overflow-y-auto space-y-2">

          {experiments.map((exp, index) => (
            <div
              key={index}
              onClick={() => router.push(`/experiments/${exp.route}`)}
              className="p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-sm bg-white hover:bg-blue-50"
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

      {/* 🔷 RIGHT SIDE DEFAULT */}
      <div className="flex-1 flex items-center justify-center bg-[#f4f9fd]">

        <h1 className="text-2xl text-gray-500">
          Select an experiment from the left
        </h1>

      </div>

    </div>
  );
}