"use client";

import { useState } from "react";

export default function AIUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select file first");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ai-report", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();
      setReport(data);

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
    };
    html2pdf().set(opt as any).from(element).save();
  };

  return (
    <div className="bg-white border p-6 mt-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">AI Data Analysis</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-orange-400 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Generate AI Report"}
      </button>

      {report && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <p><b>Summary:</b> {report.summary}</p>
          <p><b>Anomaly:</b> {report.anomaly}</p>
          <p><b>Suggestion:</b> {report.suggestion}</p>
        </div>
      )}
    </div>
  );
}