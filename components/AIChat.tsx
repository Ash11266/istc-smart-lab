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
    <div className="bg-white border p-6 flex flex-col h-full">

      <h2 className="text-xl font-bold mb-4 text-[#003366]">AI Assistant</h2>

      {/* EMPTY STATE */}
      {messages.length === 0 ? (
        <div className="border border-slate-200 p-8 mb-4 bg-slate-50 flex flex-col items-center justify-center flex-1 min-h-[384px]">
          <p className="text-slate-600 mb-6 font-medium">
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
                className="bg-white px-4 py-2 text-sm text-[#003366] hover:bg-[#003366] hover:text-white border border-[#003366] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-96 overflow-y-auto border border-slate-200 p-4 mb-4 bg-slate-50 space-y-4 flex-1 shadow-inner">

          {messages.map((msg, i) => {
            const suggestions = extractSuggestions(msg.text || "");

            return (
              <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>

                {/* USER */}
                {msg.role === "user" && (
                  <div className="inline-block px-4 py-2 bg-[#003366] text-white max-w-[70%] shadow-sm">
                    {msg.text}
                  </div>
                )}

                {/* AI */}
                {msg.role === "ai" && (
                  <div className="inline-block px-4 py-3 bg-white border border-slate-200 shadow-sm text-left whitespace-pre-line max-w-[80%] relative">

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
                        className="absolute top-2 right-2 text-xs bg-slate-50 border border-slate-200 px-2 py-1 hover:bg-slate-200 flex items-center gap-1 transition-colors text-slate-600"
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
                              className="text-sm px-3 py-1 bg-[#003366]/10 text-[#003366] hover:bg-[#003366]/20 transition-colors border border-[#003366]/20"
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
          className="flex-1 border border-slate-300 px-4 py-2 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] transition-all bg-slate-50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this experiment..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button
          onClick={() => sendMessage()}
          className="bg-[#003366] text-white px-6 py-2 flex items-center gap-2 hover:bg-[#002244] transition-colors font-medium tracking-wide uppercase text-sm"
        >
          <Send size={16} />
          Send
        </button>
      </div>

    </div>
  );
}