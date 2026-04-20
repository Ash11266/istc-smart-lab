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
        className="mb-4"
      />

      {/* FILE NAME */}
      {file && (
        <p className="text-sm text-gray-600 mb-3">
          Selected: <b>{file.name}</b>
        </p>
      )}

      {/* 🔥 BUTTON FIXED */}
      <div className="mt-4">
        <button
          onClick={handlePredict}
          disabled={loading}
          className={`px-5 py-2 rounded text-white font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : "Run ML Prediction"}
        </button>
      </div>

      {/* RESULT */}
      {prediction && (
        <div className="mt-4 p-4 bg-green-50 rounded border">
          <p><b>Result:</b> {prediction.result}</p>
          <p><b>Accuracy:</b> {prediction.accuracy}</p>
        </div>
      )}
    </div>
  );
}