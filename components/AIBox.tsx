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
    <div className="mt-6">
      {/* Title */}
      <h2 className="text-xl font-bold mb-3 text-[#003366]">
        🤖 AI Explanation
      </h2>

      {/* Button */}
      <button
        onClick={handleAI}
        className="px-5 py-2 bg-[#003366] text-white font-semibold rounded hover:bg-slate-900 transition"
      >
        {loading ? "Generating..." : "Explain with AI"}
      </button>

      {/* Output */}
      {aiText && (
        <div className="mt-4 p-4 bg-slate-100 border border-slate-300 rounded shadow-sm">
          <p className="whitespace-pre-line text-slate-800">{aiText}</p>
        </div>
      )}
    </div>
  );
}