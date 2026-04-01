import Link from "next/link";
import ExperimentStream from "./ExperimentStream";
import AIBox from "@/components/AIBox";
import AIChat from "@/components/AIChat";
export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ FIX: unwrap params using await
  const { id } = await params;

  // ✅ Fetch data
  const res = await fetch(`http://localhost:3000/api/experiments/${id}`, {
    cache: "no-store",
  });

  let experiment = null;

  if (res.ok) {
    experiment = await res.json();
  }

  // ❌ Not found
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
    <div className="max-w-6xl mx-auto w-full py-8 text-slate-900">

      {/* Header */}
      <div className="mb-6 border-b-2 border-slate-300 pb-4">
        <Link
          href="/experiments"
          className="inline-flex items-center text-sm font-bold text-[#003366] hover:underline mb-4 uppercase tracking-wider"
        >
          Back to Directory
        </Link>

        <h1 className="text-4xl font-extrabold text-[#003366]">
          {experiment.name}
        </h1>
      </div>

      {/* Info */}
      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-white border p-6">
          <h2 className="text-xl font-bold mb-4">Overview</h2>
          <p>{experiment.description || "No description"}</p>
        </div>

        <div className="bg-white border p-6">
          <h2 className="text-xl font-bold mb-4">Components</h2>
          <p>{experiment.components || "None"}</p>
        </div>

      </div>

      {/* Live Data */}
      <div className="bg-white border p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Live Data</h2>
        <ExperimentStream dataValues={experiment.dataValues} />
      </div>

      {/* AI */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-3 text-[#003366]">
     
        </h2>

        <AIBox
          description={experiment.description}
          components={experiment.components}
          dataValues={experiment.dataValues}
        />
      </div>
      {/* 🤖 AI CHAT */}
<div className="mt-6">
  <AIChat
  description={experiment.description}
  components={experiment.components}
  dataValues={experiment.dataValues}
/>
</div>

    </div>
  );
}