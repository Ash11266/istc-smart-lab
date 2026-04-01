"use client";

import { useState } from "react";

export default function AIChat({
  description,
  components,
  dataValues,
}: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          experiment: {
            description,
            components,
            dataValues,
          },
        }),
      });

      const data = await res.json();

      const aiMsg = {
        role: "ai",
        text: data.result || "No response",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error getting response" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white border p-4 mt-6">

      <h2 className="text-xl font-bold mb-4">AI Assistant</h2>

      {/* Chat messages */}
      <div className="h-96 overflow-y-auto border p-3 mb-4 bg-slate-50 space-y-3">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === "user" ? "text-right" : "text-left"}
          >

            {/* USER */}
            {msg.role === "user" && (
              <div className="inline-block px-3 py-2 rounded bg-[#003366] text-white max-w-[70%]">
                {msg.text}
              </div>
            )}

            {/* AI */}
  {msg.role === "ai" && (
  <div className="inline-block px-4 py-3 rounded bg-gray-100 border shadow-sm text-left whitespace-pre-line max-w-[80%]">
    {msg.text
      .replace(/Title:/g, "𝗧𝗶𝘁𝗹𝗲:\n")
      .replace(/Components:/g, "\n𝗖𝗼𝗺𝗽𝗼𝗻𝗲𝗻𝘁𝘀:\n")
      .replace(/Code:/g, "\n𝗖𝗼𝗱𝗲:\n")
      .replace(/Explanation:/g, "\n𝗘𝘅𝗽𝗹𝗮𝗻𝗮𝘁𝗶𝗼𝗻:\n")
      .replace(/Suggestions:/g, "\n𝗦𝘂𝗴𝗴𝗲𝘀𝘁𝗶𝗼𝗻𝘀:\n")}
  </div>
)}

          </div>
        ))}

        {loading && (
          <p className="text-sm text-gray-500">AI is typing...</p>
        )}

      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 border px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this experiment..."
        />
        <button
          onClick={sendMessage}
          className="bg-[#003366] text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>

    </div>
  );
}