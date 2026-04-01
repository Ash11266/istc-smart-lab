import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
const { message, experiment } = await req.json();
const lowerMsg = message.toLowerCase();

let mode = "full";

if (lowerMsg.includes("code")) mode = "code";
else if (lowerMsg.includes("component")) mode = "components";
else if (lowerMsg.includes("explain")) mode = "explanation";
else if (lowerMsg.includes("suggest")) mode = "suggestions";

const prompt = `
You are a Smart Lab AI Assistant.
Mode: ${mode}

Understand the user query and respond accordingly:

1. If user asks for "code":
Return ONLY:
Code:
<code here>

2. If user asks for "components":
Return ONLY:
Components:
- item 1
- item 2

3. If user asks for "explanation":
Return ONLY:
Explanation:
<short explanation>

4. If user asks for "suggestions":
Return ONLY:
Suggestions:
- point 1
- point 2

5. If user asks for "full experiment" or general query:
Return FULL format:

Title:
<short title>

Components:
- item 1
- item 2

Code:
<code>

Explanation:
<short explanation>

Suggestions:
- point 1
- point 2

Rules:
- No * symbols
- Be concise and professional
- Do NOT include unnecessary sections
- Only return what is asked

Experiment Details:
Description: ${experiment?.description || "N/A"}
Components: ${experiment?.components || "N/A"}
Data: ${experiment?.dataValues || "N/A"}

User Question:
${message}
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
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

const text =
  data.candidates?.[0]?.content?.parts?.[0]?.text ||
  "No AI response";

return NextResponse.json({ result: text });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ result: "Error" });
  }
}