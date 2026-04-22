import { NextResponse } from "next/server";

// Bypass self-signed certificate issues in local proxy environment
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const textData = await file.text();
    
    // Limit data length to avoid exceeding context window if the CSV is massive
    const truncatedData = textData.length > 50000 ? textData.slice(0, 50000) + "\n...[TRUNCATED]" : textData;

    const systemPrompt = `
You are a highly intelligent Smart Laboratory AI Data Analyst. 
The user has uploaded a dataset (CSV format) from a hardware experiment.

Your task is to generate a COMPREHENSIVE, detailed 2-3 page laboratory report based on the provided CSV data.

The report MUST include the following sections, nicely formatted in Markdown:
1. **Title**: An appropriate title for the experiment report based on the data columns and inferred context.
2. **Abstract/Summary**: High-level summary of the experiment's findings.
3. **Theoretical Background**: Describe the theoretical concepts related to the variables present in the data (e.g., if distance, talk about distance measurement sensors like ultrasonic/LiDAR; if temperature, talk about thermal dynamics).
4. **Data Connections & Correlation**: Explain how the different columns in the CSV might relate to each other (e.g., time vs sensor readings). 
5. **Detailed Readings Analysis**: Break down the specific values, pointing out averages, minimums, maximums, anomalies, and trends observed in the provided dataset. Provide detailed paragraphs.
6. **Graphical References**: Provide suggestions and theoretical observations on what graphs would look like for this data (e.g., "A line graph plotting X over Time would show...").
7. **Conclusion & Recommendations**: Final verdict on the system's stability, potential hardware issues, and next steps for the experimenter.

Make it look incredibly professional, structured, and long enough to resemble a real 2-3 page university or industry lab report.

CSV Data:
${truncatedData}
`;

    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      }
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
    console.log("=== GEMINI API RESPONSE ===", JSON.stringify(data, null, 2));

    if (data.error) {
      return NextResponse.json({ 
        report: `**Gemini API Error:** ${data.error.message}` 
      });
    }

    let text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Failed to generate AI response. Please check your API key or data.";

    return NextResponse.json({ report: text });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate AI report" }, { status: 500 });
  }
}