

import Link from "next/link";
import ExperimentStream from "./ExperimentStream";
import AIChat from "@/components/AIChat";
import AIUpload from "./AIUpload";          // ✅ added
import MLPrediction from "./MLPrediction";  // ✅ added
import { cookies } from "next/headers";
import CollapsibleSidebar from "./CollapsibleSidebar";

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const headers: HeadersInit = sessionCookie ? { Cookie: `session=${sessionCookie}` } : {};

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/experiments/${id}`,
    {
      cache: "no-store",
      headers,
    }
  );
  let experiment = null;
  let isForbidden = false;

  if (res.ok) {
    experiment = await res.json();
  } else if (res.status === 403) {
    isForbidden = true;
  }

  // Fetch all experiments for sidebar
  const allRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/experiments`, {
    cache: "no-store",
    headers,
  });
  let allExperiments: any[] = [];
  if (allRes.ok) {
    const data = await allRes.json();
    allExperiments = Array.isArray(data) ? data : data.data || [];
  }  if (isForbidden) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center text-slate-900">
        <div className="bg-white border-2 border-red-700 p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-2 text-red-700">
            Access Denied
          </h2>
          <p className="mb-6">
            You do not have permission to view this private experiment.
          </p>
          <Link href="/experiments" className="bg-red-700 text-white px-6 py-2 rounded-sm hover:bg-red-800 transition-colors">Back</Link>
        </div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading experiment data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      {/* 🔷 LEFT COLLAPSIBLE SIDEBAR */}
      <CollapsibleSidebar experiments={allExperiments} activeId={id} isLoggedIn={!!sessionCookie} />

      {/* 🔷 RIGHT CONTENT */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#f0fbfa]/80 to-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto py-8 px-12">
          {/* HEADER */}
          <div className="mb-6 border-b-2 border-slate-300 pb-4">
            <Link
              href="/experiments"
              className="inline-flex items-center text-sm font-bold text-[#003366] hover:underline mb-4 uppercase tracking-wider"
            >
              ← Back to Directory
            </Link>

            <h1 className="text-4xl font-semibold text-[#154360]">
              {experiment.name}
            </h1>
          </div>

          {/* INFO */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#003366]">Overview</h2>
              <p className="text-slate-700">{experiment.description || "No description provided."}</p>
            </div>

            <div className="bg-white border p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#003366]">Components</h2>
              <p className="text-slate-700">{experiment.components || "None specified."}</p>
            </div>
          </div>

          {/* LIVE DATA */}
          <div className="bg-white border p-6 mt-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-[#003366]">Live Data Streams</h2>
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

          {/* 🔥 AI FILE ANALYSIS */}
          <div className="mt-6">
            <AIUpload />
          </div>

          {/* 🔥 ML PREDICTION */}
          <div className="mt-6">
            <MLPrediction />
          </div>
        </div>
      </div>
    </div>
  );
}