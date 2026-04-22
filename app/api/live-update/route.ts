import { NextResponse } from "next/server";

let graphValues = [10, 20, 30, 40, 50];

export async function GET() {
  graphValues.push(Math.floor(Math.random() * 50));

  if (graphValues.length > 10) {
    graphValues.shift();
  }

  return NextResponse.json({
    values: graphValues,
  });
}