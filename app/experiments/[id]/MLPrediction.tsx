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
      console.log(data);

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
          Selected: <b>{file.name}</b>
        </p>
      )}

      {/* 🚨 FORCE VISIBLE BUTTON */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={handlePredict}
          disabled={loading}
          style={{
            backgroundColor: loading ? "gray" : "green",
            color: "white",
            padding: "10px 16px",
            borderRadius: "6px",
            display: "block",
            width: "200px",
            fontWeight: "bold",
          }}
        >
          {loading ? "Processing..." : "Run ML Prediction"}
        </button>
      </div>

      {/* RESULT */}
      {prediction && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            background: "#e6fffa",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <p><b>Prediction:</b> {prediction.result}</p>
          <p><b>Accuracy:</b> {prediction.accuracy}</p>
        </div>
      )}

    </div>
  );
}