import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    summary: "Temperature is stable",
    anomaly: "No anomaly detected",
    suggestion: "System working properly",
  });
}