import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, experiment, history = [] } = await req.json();

    const lowerMsg = message.toLowerCase();

    let mode = "full";

    if (lowerMsg.includes("code")) mode = "code";
    else if (lowerMsg.includes("component")) mode = "components";
    else if (lowerMsg.includes("explain")) mode = "explanation";
    else if (lowerMsg.includes("suggest")) mode = "suggestions";

    const systemPrompt = `
You are an intelligent Smart Lab AI Assistant.

Mode: ${mode}

IMPORTANT RULES:
- Do NOT repeat previous answers
- Answer ONLY the current question
- Keep response concise and professional
- Avoid unnecessary text
- Suggestions must be max 2 points (1 line each)
- No * symbols

RESPONSE FORMAT:

👉 If mode = code:
Code:
<clean working code>

Explanation:
<short explanation>

Suggestions:
- short improvement
- short improvement

👉 If mode = components:
Components:
- item 1
- item 2
- item 3

👉 If mode = explanation:
Explanation:
<clear explanation>

Suggestions:
- short follow-up
- short follow-up

👉 If mode = suggestions:
Suggestions:
- short idea
- short idea

👉 If mode = full:
Title:
<short title>

Components:
- item 1
- item 2

Code:
<clean code>

Explanation:
<short explanation>

Suggestions:
- short improvement
- short improvement

---

CONTEXT:
Description: ${experiment?.description || "N/A"}
Components: ${experiment?.components || "N/A"}
Data: ${experiment?.dataValues || "N/A"}
`;

    // 🧠 CLEAN MEMORY (only last 3 user messages)
    const cleanHistory = history
      .filter((msg: any) => msg.role === "user")
      .slice(-3);

    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },

      // memory (ONLY user messages → avoids repetition bug)
      ...cleanHistory.map((msg: any) => ({
        role: "user",
        parts: [{ text: msg.text }],
      })),

      // current question
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    let text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No AI response";

    // ✅ EXTRA SAFETY: remove duplicate blocks
    const seen = new Set();
    text = text
      .split("\n")
      .filter((line: string) => {
        if (seen.has(line)) return false;
        seen.add(line);
        return true;
      })
      .join("\n");

    return NextResponse.json({ result: text });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ result: "Error generating AI response" });
  }
}