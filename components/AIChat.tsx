"use client";

import { useState, useEffect } from "react";
import { Copy, Send } from "lucide-react";

export default function AIChat({
  description,
  components,
  dataValues,
}: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Clean text
  const cleanText = (text: string) => {
    return text.replace(/Suggestions:[\s\S]*/, "").trim();
  };

  // ✅ Typing component (RUNS ONLY ONCE)
  const TypingText = ({ text, onDone }: any) => {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
      let i = 0;

      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));

        if (i >= text.length) {
          clearInterval(interval);
          onDone(); // ✅ mark complete
        }
      }, 10);

      return () => clearInterval(interval);
    }, []);

    return <span>{displayed}</span>;
  };

  const sendMessage = async (customText?: string) => {
    const finalInput = customText || input;
    if (!finalInput.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: finalInput },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: finalInput,
          history: messages
            .filter((msg) => msg.role === "user")
            .slice(-3),
          experiment: {
            description,
            components,
            dataValues,
          },
        }),
      });

      const data = await res.json();

      // ✅ NEW MESSAGE HAS animated: true
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.result || "No response",
          animated: true,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error getting response" },
      ]);
    }

    setLoading(false);
  };

  // ✅ Extract suggestions
  const extractSuggestions = (text: string) => {
    const match = text.match(/Suggestions:\s*([\s\S]*)/);
    if (!match) return [];

    return match[1]
      .split("\n")
      .map((s) => s.replace(/^-/, "").trim())
      .filter(Boolean);
  };

  return (
    <div className="bg-white border p-4 mt-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4">🤖 AI Assistant</h2>

      {/* EMPTY STATE */}
      {messages.length === 0 ? (
        <div className="border p-6 mb-4 bg-slate-50 rounded text-center">
          <p className="text-gray-600 mb-4">
            Ask anything about this experiment
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Generate code",
              "Explain this experiment",
              "List components",
              "Give improvements",
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-96 overflow-y-auto border p-3 mb-4 bg-slate-50 space-y-3 rounded">

          {messages.map((msg, i) => {
            const suggestions = extractSuggestions(msg.text || "");

            return (
              <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>

                {/* USER */}
                {msg.role === "user" && (
                  <div className="inline-block px-3 py-2 rounded bg-[#003366] text-white max-w-[70%]">
                    {msg.text}
                  </div>
                )}

                {/* AI */}
                {msg.role === "ai" && (
                  <div className="inline-block px-4 py-3 rounded bg-gray-100 border shadow-sm text-left whitespace-pre-line max-w-[80%] relative">

                    {/* ✅ ONLY animate once */}
                    {msg.animated ? (
                      <TypingText
                        text={cleanText(msg.text)}
                        onDone={() => {
                          setMessages((prev) =>
                            prev.map((m, idx) =>
                              idx === i ? { ...m, animated: false } : m
                            )
                          );
                        }}
                      />
                    ) : (
                      <span>{cleanText(msg.text)}</span>
                    )}

                    {/* Copy */}
                    {msg.text?.includes("Code:") && (
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(msg.text)
                        }
                        className="absolute top-2 right-2 text-xs bg-white border px-2 py-1 rounded hover:bg-gray-200 flex items-center gap-1"
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                    )}

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold mb-2">Suggestions:</p>

                        <div className="flex flex-wrap gap-2">
                          {suggestions.map((s, idx) => (
                            <button
                              key={idx}
                              onClick={() => sendMessage(s)}
                              className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <p className="text-sm text-gray-500">AI is typing...</p>
          )}

        </div>
      )}

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this experiment..."
        />
        <button
          onClick={() => sendMessage()}
          className="bg-[#003366] text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Send size={16} />
          Send
        </button>
      </div>

    </div>
  );
}