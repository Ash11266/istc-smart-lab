"use client";

import { useState } from "react";

export default function MLPrediction() {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!file) {
      alert("Upload CSV file first");
      return;
    }

    setLoading(true);
    setPrediction(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setPrediction(data);

    } catch (err) {
      console.error(err);
      alert("Prediction failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border p-6 mt-6 rounded-lg shadow-sm">

      <h2 className="text-xl font-bold mb-4">ML Prediction (CSV)</h2>

      {/* FILE INPUT */}
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block"
      />

      {/* FILE NAME */}
      {file && (
        <p className="text-sm text-gray-700 mb-3">
          Uploaded File: <b>{file.name}</b>
        </p>
      )}

      {/* ✅ RUN BUTTON */}
      <button
        onClick={handlePredict}
        disabled={loading}
        style={{ backgroundColor: loading ? "#9ca3af" : "#0B5D57" }}
        className="px-6 py-2.5 mt-2 rounded-md font-bold text-white shadow-md transition-transform hover:scale-105 hover:shadow-lg"
      >
        {loading ? "Processing..." : "Run ML"}
      </button>

      {/* RESULT SECTION */}
      {prediction && (
        <div className="mt-5 p-4 bg-green-50 border rounded-lg">

          <h3 className="text-lg font-bold mb-2">
            {prediction.result}
          </h3>

          <p><b>Accuracy:</b> {prediction.accuracy}</p>
          <p><b>Total Rows:</b> {prediction.total_rows}</p>
          <p><b>Anomalies Found:</b> {prediction.anomalies}</p>

          {/* Anomaly Score */}
          {prediction.anomaly_score !== undefined && (
            <p><b>Anomaly Score:</b> {prediction.anomaly_score}</p>
          )}

          {/* Reasons */}
          {prediction.reasons && prediction.reasons.length > 0 && (
            <div className="mt-3">
              <p className="font-semibold">Reasons:</p>
              <ul className="list-disc ml-5">
                {prediction.reasons.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

    </div>
  );
}