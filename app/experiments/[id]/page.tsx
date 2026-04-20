import Link from "next/link";
import ExperimentStream from "./ExperimentStream";
import AIChat from "@/components/AIChat";

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`http://localhost:3000/api/experiments/${id}`, {
    cache: "no-store",
  });

  let experiment = null;

  if (res.ok) {
    experiment = await res.json();
  }

  // Fetch all experiments for sidebar
  const allRes = await fetch("http://localhost:3000/api/experiments", {
    cache: "no-store",
  });
  let allExperiments: any[] = [];
  if (allRes.ok) {
    const data = await allRes.json();
    allExperiments = Array.isArray(data) ? data : data.data || [];
  }

  if (!experiment) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center text-slate-900">
        <div className="bg-white border-2 border-red-700 p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-2 text-red-700">
            Record Not Found
          </h2>
          <p className="mb-6">
            Experiment ID: <b>{id}</b> not found
          </p>
          <Link href="/experiments">Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">

      {/* 🔷 LEFT SIDEBAR */}
      <div className="w-1/4 bg-[#d6eaf8] border-r-4 border-orange-400 p-4 flex flex-col">

        <h2 className="text-xl font-semibold mb-4 text-[#154360]">
          Experiments
        </h2>

        <div className="flex-1 overflow-y-auto space-y-2">

          {allExperiments.map((exp: any) => (
            <Link
              key={exp.uuid}
              href={`/experiments/${exp.uuid}`}
              className={`p-3 rounded-lg block transition shadow-sm ${
                id === exp.uuid
                  ? "bg-orange-200 border-l-4 border-orange-500"
                  : "bg-white hover:bg-blue-50"
              }`}
            >
              <p className="font-medium text-[#2c3e50]">
                {exp.name}
              </p>
            </Link>
          ))}

        </div>

      </div>

      {/* 🔷 RIGHT CONTENT */}
      <div className="flex-1 overflow-y-auto h-full bg-[#f4f9fd]">
        <div className="max-w-6xl mx-auto w-full py-8 px-6 text-slate-900">

          {/* HEADER */}
        <div className="mb-6 border-b-2 border-slate-300 pb-4">
          <Link
            href="/experiments"
            className="inline-flex items-center text-sm font-bold text-[#003366] hover:underline mb-4 uppercase tracking-wider"
          >
            Back to Directory
          </Link>

          <h1 className="text-4xl font-semibold text-[#154360]">
            {experiment.name}
          </h1>
        </div>

        {/* INFO */}
        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white border p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Overview</h2>
            <p>{experiment.description || "No description"}</p>
          </div>

          <div className="bg-white border p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Components</h2>
            <p>{experiment.components || "None"}</p>
          </div>

        </div>

        {/* LIVE DATA */}
        <div className="bg-white border p-6 mt-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Live Data</h2>
          <ExperimentStream dataValues={experiment.dataValues} />
        </div>

        {/* AI SECTION */}
        <div className="mt-6">
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