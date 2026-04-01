import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const description = body.description || "";
    const components = body.components || "";
    const dataValues = body.dataValues || "";
const prompt = `
You are a professional lab assistant AI.

Give a short and clean explanation.

Format STRICTLY like this:

Overview:
(2-3 lines)

Components:
- item 1
- item 2

Data Measured:
- item 1
- item 2

Importance:
(2-3 lines)

Do NOT use * symbols. Use proper formatting.

Experiment:
${description}

Components:
${components}

Data:
${dataValues}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt, // ✅ IMPORTANT FIX
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("GEMINI RESPONSE:", data);

    // ❌ handle API error properly
    if (data.error) {
      return NextResponse.json({
        result: "AI Error: " + data.error.message,
      });
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No AI response";

    return NextResponse.json({ result: text });

  } catch (error) {
    console.error("AI ERROR:", error);
    return NextResponse.json({ result: "Server error" });
  }
}