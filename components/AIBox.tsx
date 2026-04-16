"use client";

import { useState } from "react";

export default function AIBox({
  description,
  components,
  dataValues,
}: any) {
  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState("");

  const handleAI = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description || "No description provided",
          components: components || "Not specified",
          dataValues: dataValues || "Not specified",
        }),
      });

      const data = await res.json();

      console.log("AI RESPONSE:", data);

      setAiText(data.result || "No response from AI");
    } catch (err) {
      console.error("AI ERROR:", err);
      setAiText("Error getting AI response");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white border p-6 flex flex-col h-full shrink-0">
      {/* Title */}
      <h2 className="text-xl font-bold mb-4 text-[#003366]">
      Experiment Insights
      </h2>

      {/* Button */}
{!aiText && (
  <button
    onClick={handleAI}
    disabled={loading}
    className={`flex items-center justify-center gap-2 w-full px-5 py-3 font-semibold text-white transition tracking-wide uppercase text-sm
      ${loading 
        ? "bg-slate-400 cursor-not-allowed" 
        : "bg-[#003366] hover:bg-[#002244]"}
    `}
  >
    {loading ? (
      <>
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"></svg>
        Generating Insights...
      </>
    ) : (
      <>
        <svg className="w-5 h-5" viewBox="0 0 24 24"></svg>
        Generate Insights
      </>
    )}
  </button>
)}


      {/* Output */}
      {aiText && (
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 shadow-sm flex-1 overflow-y-auto">
          <p className="whitespace-pre-line text-slate-800 leading-relaxed max-w-prose">{aiText}</p>
        </div>
      )}
    </div>
  );
}