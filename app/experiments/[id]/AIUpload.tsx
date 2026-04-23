"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function AIUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [reportText, setReportText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select file first");

    setLoading(true);
    setReportText(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ai-report", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();
      setReportText(data.report);

    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!reportText) return;

    // Dynamically import html2pdf to prevent Next.js SSR 'window is not defined' errors
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.getElementById("ai-report-content");
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `AI_Report_${file?.name || "experiment"}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    } as const;

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="bg-white border p-6 mt-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">AI Report</h2>
        {reportText && (
          <button
            onClick={handleDownload}
            style={{ backgroundColor: "#0B5D57", color: "white" }}
            className="px-4 py-2 rounded-xl shadow font-bold transition-transform hover:scale-105 hover:shadow-lg"
          >
            Download from here in PDF form
          </button>
        )}
      </div>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{ backgroundColor: loading ? "#9ca3af" : "#f97316" }}
        className="px-4 py-2 mt-2 rounded-xl text-white font-bold transition-transform shadow hover:scale-105 hover:shadow-lg"
      >
        {loading ? "Generating Comprehensive Report..." : "Generate AI Report"}
      </button>

      {reportText && (
        <div id="ai-report-content" className="mt-6 p-6 bg-blue-50/50 rounded-xl border border-blue-100 prose prose-blue max-w-none">
          <ReactMarkdown>{reportText}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}