import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" });
  }

  const text = await file.text();

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  const data = parsed.data as any[];

  if (!data.length) {
    return NextResponse.json({
      summary: "No valid data found in file.",
      anomaly: "N/A",
      suggestion: "Upload proper CSV file",
    });
  }

  const keys = Object.keys(data[0]);

  // ❌ ignore timestamp columns
  const numericKey = keys.find((key) =>
    key.toLowerCase() !== "timestamp" &&
    data.some((row) => !isNaN(parseFloat(row[key])))
  );

  if (!numericKey) {
    return NextResponse.json({
      summary: "No numeric sensor data detected.",
      anomaly: "N/A",
      suggestion: "Ensure CSV contains numeric values",
    });
  }

  const values = data
    .map((row) => parseFloat(row[numericKey]))
    .filter((v) => !isNaN(v));

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);

  const anomalies = values.filter(
    (v) => v > avg * 1.5 || v < avg * 0.5
  );

  // 🔥 SMART LABEL (distance / temperature / etc)
  const label = numericKey.toLowerCase();

  let summary = "";

  if (label.includes("temp")) {
    summary = `The temperature readings remain stable around ${avg.toFixed(
      2
    )}°C with minor variations between ${min.toFixed(
      2
    )}°C and ${max.toFixed(2)}°C.`;
  } else if (label.includes("distance")) {
    summary = `The distance sensor readings are consistent around ${avg.toFixed(
      2
    )} cm, ranging from ${min.toFixed(2)} cm to ${max.toFixed(2)} cm.`;
  } else if (label.includes("humidity")) {
    summary = `Humidity levels are steady with an average of ${avg.toFixed(
      2
    )}%, showing normal environmental conditions.`;
  } else {
    summary = `The "${numericKey}" data shows stable behavior with an average value of ${avg.toFixed(
      2
    )}, ranging between ${min.toFixed(2)} and ${max.toFixed(2)}.`;
  }

  // 🔥 anomaly explanation
  const anomalyText =
    anomalies.length > 0
      ? `${anomalies.length} unusual readings detected outside normal range.`
      : "No abnormal patterns detected.";

  // 🔥 smart suggestion
  let suggestion = "";

  if (anomalies.length > 0) {
    suggestion =
      "Some irregular values detected. Check sensor calibration or environmental disturbances.";
  } else {
    suggestion =
      "System is functioning normally with stable readings.";
  }

  return NextResponse.json({
    summary,
    anomaly: anomalyText,
    suggestion,
  });
}
