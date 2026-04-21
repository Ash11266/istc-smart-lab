"use client";

import Link from "next/link";
import ExperimentStream from "./ExperimentStream";
import AIChat from "@/components/AIChat";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ScrollToTop from "@/components/ScrollToTop";


export default function ExperimentPage() {
  const params = useParams();
  const id = params.id as string;

  const [experiment, setExperiment] = useState<any>(null);
  const [experiments, setExperiments] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/experiments/${id}`)
      .then((res) => res.json())
      .then((data) => setExperiment(data));

    fetch("/api/experiments")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        setExperiments(list);
      });
  }, [id]);

  if (!experiment) {
    return (
      
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">

      {/* 🔷 SIDEBAR */}
      <div className="w-72 bg-gradient-to-b from-[#e8f6f3] to-[#d1f2eb] border-r-[5px] border-orange-500 p-4 flex flex-col">

        <h2 className="text-xl font-bold mb-3 text-[#0B5D57]">
          Experiments
        </h2>

        {/* 🔥 CREATE BUTTON */}
        <Link
          href="/experiments/create"
          className="mb-4 text-center bg-white-500 hover:bg-white-600 text-orange font-bold py-2 px-4 rounded-lg shadow-md transition"
        >
          + Create Experiment
        </Link>

        {/* SCROLLABLE LIST */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">

          {experiments.map((exp) => (
            <Link
              key={exp.uuid}
              href={`/experiments/${exp.uuid}`}
              className={`block p-3 rounded-xl transition-all border-l-4 ${
                id === exp.uuid
                  ? "bg-[#d1f2eb] border-[#0B5D57] shadow-md"
                  : "bg-white border-transparent hover:bg-[#d1f2eb] hover:border-[#0B5D57]"
              }`}
            >
              <p className="font-semibold text-[#0B5D57]">
                {exp.name}
              </p>
            </Link>
          ))}

        </div>
      </div>

      {/* 🔷 RIGHT CONTENT */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#f0fbfa] to-white">

        <div className="max-w-6xl mx-auto py-8 px-6">

          {/* HEADER */}
          <div className="mb-6 border-b pb-4">
            <Link
              href="/experiments"
              className="text-sm font-bold text-[#0B5D57] hover:underline"
            >
              ← Back
            </Link>

            <h1 className="text-4xl font-bold text-[#0B5D57] mt-2">
              {experiment.name}
            </h1>
          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white p-6 rounded-xl shadow border">
              <h2 className="text-xl font-bold mb-3 text-[#0B5D57]">
                Overview
              </h2>
              <p className="text-gray-700">
                {experiment.description || "No description"}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border">
              <h2 className="text-xl font-bold mb-3 text-[#0B5D57]">
                Components
              </h2>
              <p className="text-gray-700">
                {experiment.components || "None"}
              </p>
            </div>

          </div>

          {/* LIVE DATA */}
          <div className="bg-white p-6 mt-6 rounded-xl shadow border">
            <h2 className="text-xl font-bold mb-3 text-[#0B5D57]">
              Live Data
            </h2>
            <ExperimentStream dataValues={experiment.dataValues} />
          </div>

          {/* AI */}
          <div className="mt-6 mb-10">
            <AIChat
              description={experiment.description}
              components={experiment.components}
              dataValues={experiment.dataValues}
            />
          </div>

        </div>
      </div>

    </div>
  );
}